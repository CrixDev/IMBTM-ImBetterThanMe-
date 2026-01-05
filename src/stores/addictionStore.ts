import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { Addiction, Relapse, Achievement, AchievementType } from '@/types'
import { ACHIEVEMENTS } from '@/types'

interface AddictionState {
  addictions: Addiction[]
  relapses: Relapse[]
  achievements: Achievement[]
  isLoading: boolean
  newAchievement: Achievement | null
  setAddictions: (addictions: Addiction[]) => void
  setRelapses: (relapses: Relapse[]) => void
  setAchievements: (achievements: Achievement[]) => void
  setLoading: (loading: boolean) => void
  clearNewAchievement: () => void
  fetchAddictions: (userId: string) => Promise<void>
  fetchAchievements: (userId: string) => Promise<void>
  createAddiction: (addiction: Omit<Addiction, 'id' | 'created_at' | 'max_streak_days'>) => Promise<void>
  updateAddiction: (id: string, updates: Partial<Addiction>) => Promise<void>
  deleteAddiction: (id: string) => Promise<void>
  recordRelapse: (addictionId: string, notes?: string) => Promise<void>
  checkAndUnlockAchievements: (userId: string, addictionId: string, currentStreak: number) => Promise<void>
}

export const useAddictionStore = create<AddictionState>((set, get) => ({
  addictions: [],
  relapses: [],
  achievements: [],
  isLoading: false,
  newAchievement: null,
  setAddictions: (addictions) => set({ addictions }),
  setRelapses: (relapses) => set({ relapses }),
  setAchievements: (achievements) => set({ achievements }),
  setLoading: (isLoading) => set({ isLoading }),
  clearNewAchievement: () => set({ newAchievement: null }),

  fetchAddictions: async (userId) => {
    set({ isLoading: true })
    
    const { data, error } = await supabase
      .from('addictions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    
    if (!error && data) {
      set({ addictions: data as Addiction[] })
    }
    
    set({ isLoading: false })
  },

  fetchAchievements: async (userId) => {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false })
    
    if (!error && data) {
      set({ achievements: data as Achievement[] })
    }
  },

  createAddiction: async (addiction) => {
    const { data, error } = await supabase
      .from('addictions')
      .insert([{
        ...addiction,
        max_streak_days: 0
      }])
      .select()
      .single()
    
    if (!error && data) {
      const currentAddictions = get().addictions
      set({ addictions: [data as Addiction, ...currentAddictions] })
    }
  },

  updateAddiction: async (id, updates) => {
    const { error } = await supabase
      .from('addictions')
      .update(updates)
      .eq('id', id)
    
    if (!error) {
      const currentAddictions = get().addictions
      set({
        addictions: currentAddictions.map((a) =>
          a.id === id ? { ...a, ...updates } : a
        )
      })
    }
  },

  deleteAddiction: async (id) => {
    const { error } = await supabase
      .from('addictions')
      .update({ is_active: false })
      .eq('id', id)
    
    if (!error) {
      const currentAddictions = get().addictions
      set({ addictions: currentAddictions.filter((a) => a.id !== id) })
    }
  },

  recordRelapse: async (addictionId, notes) => {
    const now = new Date().toISOString()
    const addiction = get().addictions.find((a) => a.id === addictionId)
    
    if (!addiction) return

    // Calculate current streak before relapse
    const startDate = addiction.last_relapse || addiction.start_date
    const currentStreak = Math.floor(
      (Date.now() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
    )

    // Update max streak if current is higher
    const newMaxStreak = Math.max(currentStreak, addiction.max_streak_days)

    // Insert relapse record
    await supabase.from('relapses').insert([{
      addiction_id: addictionId,
      relapse_date: now,
      notes: notes || null
    }])

    // Update addiction with new relapse date and max streak
    await supabase
      .from('addictions')
      .update({
        last_relapse: now,
        max_streak_days: newMaxStreak
      })
      .eq('id', addictionId)

    // Update local state
    const currentAddictions = get().addictions
    set({
      addictions: currentAddictions.map((a) =>
        a.id === addictionId
          ? { ...a, last_relapse: now, max_streak_days: newMaxStreak }
          : a
      )
    })

    // Check achievements based on max streak
    if (addiction.user_id) {
      await get().checkAndUnlockAchievements(addiction.user_id, addictionId, newMaxStreak)
    }
  },

  checkAndUnlockAchievements: async (userId, addictionId, currentStreak) => {
    const existingAchievements = get().achievements.filter(
      (a) => a.addiction_id === addictionId
    )

    for (const achievementDef of ACHIEVEMENTS) {
      if (currentStreak >= achievementDef.days) {
        const alreadyUnlocked = existingAchievements.some(
          (a) => a.achievement_type === achievementDef.type
        )

        if (!alreadyUnlocked) {
          const { data, error } = await supabase
            .from('achievements')
            .insert([{
              user_id: userId,
              addiction_id: addictionId,
              achievement_type: achievementDef.type as AchievementType,
              streak_days: currentStreak
            }])
            .select()
            .single()

          if (!error && data) {
            const newAchievement = data as Achievement
            set({
              achievements: [newAchievement, ...get().achievements],
              newAchievement
            })
          }
        }
      }
    }
  }
}))

