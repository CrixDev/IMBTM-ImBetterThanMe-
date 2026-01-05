import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  isLoading: boolean
  isInitialized: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setInitialized: (initialized: boolean) => void
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      isInitialized: false,
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
      setInitialized: (isInitialized) => set({ isInitialized }),

      signUp: async (email, password) => {
        set({ isLoading: true })
        const { data, error } = await supabase.auth.signUp({
          email,
          password
        })
        
        if (data.user) {
          set({ user: data.user })
        }
        
        set({ isLoading: false })
        return { error: error as Error | null }
      },

      signIn: async (email, password) => {
        set({ isLoading: true })
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        
        if (data.user) {
          set({ user: data.user })
        }
        
        set({ isLoading: false })
        return { error: error as Error | null }
      },

      signOut: async () => {
        set({ isLoading: true })
        await supabase.auth.signOut()
        set({ user: null, isLoading: false })
      },

      initialize: async () => {
        const { data } = await supabase.auth.getSession()
        
        if (data.session?.user) {
          set({ user: data.session.user })
        }
        
        set({ isInitialized: true })

        // Listen for auth changes
        supabase.auth.onAuthStateChange((_event, session) => {
          set({ user: session?.user ?? null })
        })
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user })
    }
  )
)

