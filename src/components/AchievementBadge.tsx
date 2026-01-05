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
      className={`relative p-4 rounded-2xl border transition-all ${
        unlocked
          ? `bg-gradient-to-br ${definition.color} border-transparent shadow-lg`
          : 'bg-slate-800/50 border-slate-700/50'
      }`}
    >
      {/* Icon */}
      <div
        className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center ${
          unlocked
            ? 'bg-white/20 backdrop-blur'
            : 'bg-slate-700/50'
        } ${unlocked ? 'animate-badge-unlock' : ''}`}
      >
        <Icon 
          name={definition.icon} 
          className={unlocked ? 'text-white' : 'text-slate-500'} 
          size={24}
        />
      </div>

      {/* Name */}
      <h4
        className={`mt-3 text-sm font-semibold text-center ${
          unlocked ? 'text-white' : 'text-slate-400'
        }`}
      >
        {definition.name}
      </h4>

      {/* Description */}
      <p
        className={`mt-1 text-xs text-center ${
          unlocked ? 'text-white/80' : 'text-slate-500'
        }`}
      >
        {definition.description}
      </p>

      {/* Unlocked date or Progress */}
      {unlocked ? (
        unlockedAt && (
          <p className="mt-2 text-xs text-center text-white/60">
            {new Date(unlockedAt).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </p>
        )
      ) : (
        <div className="mt-3">
          <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-slate-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-center text-slate-500">
            {currentStreak} / {definition.days} días
          </p>
        </div>
      )}

      {/* Lock Icon for locked badges */}
      {!unlocked && (
        <div className="absolute top-2 right-2">
          <Lock className="w-4 h-4 text-slate-500" />
        </div>
      )}
    </div>
  )
}
