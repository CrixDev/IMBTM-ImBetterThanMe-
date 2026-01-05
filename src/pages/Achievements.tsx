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

  const achievementsByAddiction = addictions.map((addiction) => ({
    addiction,
    achievements: achievements.filter((a) => a.addiction_id === addiction.id),
    possibleAchievements: ACHIEVEMENTS
  }))

  const totalPossible = addictions.length * ACHIEVEMENTS.length
  const totalUnlocked = achievements.length
  const progressPercent = totalPossible > 0 ? (totalUnlocked / totalPossible) * 100 : 0

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-white mb-2">Mis Logros</h1>
        <p className="text-zinc-400">Tu colección de victorias</p>
      </div>

      {/* Overall Progress */}
      <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 animate-fade-in delay-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-zinc-300">Progreso Total</span>
          <span className="text-sm text-zinc-400">
            {totalUnlocked} / {totalPossible} logros
          </span>
        </div>
        <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-700"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Achievements by Addiction */}
      {achievementsByAddiction.length === 0 ? (
        <div className="bg-zinc-900 rounded-xl p-12 border border-zinc-800 text-center animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-zinc-800 flex items-center justify-center">
            <Trophy className="w-8 h-8 text-zinc-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Sin logros aún
          </h3>
          <p className="text-zinc-400 text-sm">
            Agrega un hábito y mantén tu racha para desbloquear logros.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {achievementsByAddiction.map(({ addiction, achievements: addictionAchievements, possibleAchievements }, index) => (
            <div
              key={addiction.id}
              className="animate-fade-in"
              style={{ animationDelay: `${(index + 2) * 100}ms` }}
            >
              {/* Addiction Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                  <Icon name={addiction.icon} className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{addiction.name}</h3>
                  <p className="text-sm text-zinc-400">
                    {addictionAchievements.length} / {possibleAchievements.length} desbloqueados
                  </p>
                </div>
              </div>

              {/* Achievement Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
        <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 animate-fade-in">
          <h4 className="text-sm font-medium text-zinc-300 mb-3">Leyenda</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-white" />
              <span className="text-zinc-400">Desbloqueado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-zinc-700 border border-zinc-600" />
              <span className="text-zinc-400">Bloqueado</span>
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
