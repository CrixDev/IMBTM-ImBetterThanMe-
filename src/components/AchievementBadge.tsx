import type { AchievementDefinition } from '@/types'
import { Icon } from '@/components/icons'
import { Lock } from 'lucide-react'

interface AchievementBadgeProps {
  definition: AchievementDefinition
  unlocked: boolean
  unlockedAt?: string
  currentStreak: number
}

export default function AchievementBadge({
  definition,
  unlocked,
  unlockedAt,
  currentStreak
}: AchievementBadgeProps) {
  const progress = Math.min(100, (currentStreak / definition.days) * 100)

  return (
    <div
      className={`relative p-4 rounded-xl border transition-all ${
        unlocked
          ? 'bg-white text-black border-white'
          : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800'
      }`}
    >
      {/* Icon */}
      <div
        className={`w-12 h-12 mx-auto rounded-lg flex items-center justify-center mb-3 ${
          unlocked
            ? 'bg-black/10'
            : 'bg-zinc-800 border border-zinc-700'
        }`}
      >
        <Icon 
          name={definition.icon} 
          className={unlocked ? 'text-black' : 'text-zinc-500'} 
          size={24}
        />
      </div>

      {/* Name */}
      <h4
        className={`text-sm font-semibold text-center mb-1 ${
          unlocked ? 'text-black' : 'text-white'
        }`}
      >
        {definition.name}
      </h4>

      {/* Description */}
      <p
        className={`text-xs text-center ${
          unlocked ? 'text-black/60' : 'text-zinc-400'
        }`}
      >
        {definition.description}
      </p>

      {/* Unlocked date or Progress */}
      {unlocked ? (
        unlockedAt && (
          <p className="mt-2 text-xs text-center text-black/50">
            {new Date(unlockedAt).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </p>
        )
      ) : (
        <div className="mt-3">
          <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-zinc-600 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-center text-zinc-500">
            {currentStreak} / {definition.days} días
          </p>
        </div>
      )}

      {/* Lock Icon for locked badges */}
      {!unlocked && (
        <div className="absolute top-2 right-2">
          <Lock className="w-4 h-4 text-zinc-600" />
        </div>
      )}
    </div>
  )
}
