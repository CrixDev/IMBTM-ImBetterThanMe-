import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useAddictionStore } from '@/stores/addictionStore'
import AchievementBadge from '@/components/AchievementBadge'
import { ACHIEVEMENTS } from '@/types'
import { Icon } from '@/components/icons'
import { Trophy } from 'lucide-react'

export default function Achievements() {
  const { user } = useAuthStore()
  const { achievements, addictions, fetchAchievements, fetchAddictions } = useAddictionStore()

  useEffect(() => {
    if (user) {
      fetchAchievements(user.id)
      fetchAddictions(user.id)
    }
  }, [user, fetchAchievements, fetchAddictions])

  // Group achievements by addiction
  const achievementsByAddiction = addictions.map((addiction) => ({
    addiction,
    achievements: achievements.filter((a) => a.addiction_id === addiction.id),
    possibleAchievements: ACHIEVEMENTS
  }))

  // Calculate total progress
  const totalPossible = addictions.length * ACHIEVEMENTS.length
  const totalUnlocked = achievements.length
  const progressPercent = totalPossible > 0 ? (totalUnlocked / totalPossible) * 100 : 0

  return (
    <div className="space-y-6 pb-4">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-slate-100">Mis Logros</h1>
        <p className="text-slate-400 mt-1">Tu colección de victorias</p>
      </div>

      {/* Overall Progress */}
      <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-5 border border-slate-700/50 animate-fade-in delay-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-300">Progreso Total</span>
          <span className="text-sm text-slate-400">
            {totalUnlocked} / {totalPossible} logros
          </span>
        </div>
        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-violet-500 to-amber-500 rounded-full transition-all duration-700"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Achievements by Addiction */}
      {achievementsByAddiction.length === 0 ? (
        <div className="bg-slate-800/30 backdrop-blur rounded-2xl p-8 border border-dashed border-slate-600/50 text-center animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-700/50 flex items-center justify-center">
            <Trophy className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-200 mb-2">
            Sin logros aún
          </h3>
          <p className="text-slate-400 text-sm">
            Agrega un hábito y mantén tu racha para desbloquear logros.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {achievementsByAddiction.map(({ addiction, achievements: addictionAchievements, possibleAchievements }, index) => (
            <div
              key={addiction.id}
              className="animate-fade-in"
              style={{ animationDelay: `${(index + 2) * 100}ms` }}
            >
              {/* Addiction Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                  <Icon name={addiction.icon} className="w-5 h-5 text-slate-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100">{addiction.name}</h3>
                  <p className="text-sm text-slate-400">
                    {addictionAchievements.length} / {possibleAchievements.length} desbloqueados
                  </p>
                </div>
              </div>

              {/* Achievement Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {possibleAchievements.map((achievementDef) => {
                  const unlocked = addictionAchievements.find(
                    (a) => a.achievement_type === achievementDef.type
                  )
                  return (
                    <AchievementBadge
                      key={achievementDef.type}
                      definition={achievementDef}
                      unlocked={!!unlocked}
                      unlockedAt={unlocked?.unlocked_at}
                      currentStreak={calculateCurrentStreak(addiction)}
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Legend */}
      {achievementsByAddiction.length > 0 && (
        <div className="bg-slate-800/30 rounded-2xl p-4 border border-slate-700/50 animate-fade-in">
          <h4 className="text-sm font-medium text-slate-300 mb-3">Leyenda</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-slate-400">Desbloqueado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-600" />
              <span className="text-slate-400">Bloqueado</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function calculateCurrentStreak(addiction: { start_date: string; last_relapse: string | null }): number {
  const startDate = addiction.last_relapse || addiction.start_date
  const now = new Date()
  const start = new Date(startDate)
  const diffTime = now.getTime() - start.getTime()
  return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)))
}
