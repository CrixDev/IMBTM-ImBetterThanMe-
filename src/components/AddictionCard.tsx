import { useEffect, useState } from 'react'
import { useStreak, formatStreakText } from '@/hooks/useStreak'
import { useAddictionStore } from '@/stores/addictionStore'
import { useAuthStore } from '@/stores/authStore'
import type { Addiction } from '@/types'
import { ACHIEVEMENTS } from '@/types'
import { Icon } from '@/components/icons'
import { RefreshCw, ChevronDown, ChevronUp } from 'lucide-react'

interface AddictionCardProps {
  addiction: Addiction
  onRelapse: () => void
}

export default function AddictionCard({ addiction, onRelapse }: AddictionCardProps) {
  const { days, hours, minutes } = useStreak(addiction)
  const { user } = useAuthStore()
  const { checkAndUnlockAchievements } = useAddictionStore()
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    if (user && days > 0) {
      checkAndUnlockAchievements(user.id, addiction.id, days)
    }
  }, [days, user, addiction.id, checkAndUnlockAchievements])

  const nextAchievement = ACHIEVEMENTS.find((a) => a.days > days)
  const progressToNext = nextAchievement
    ? Math.min(100, (days / nextAchievement.days) * 100)
    : 100

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden hover:bg-zinc-800/50 transition-colors">
      {/* Main Card */}
      <div
        className="p-6 md:p-8 cursor-pointer"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className="w-14 h-14 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0">
            <Icon name={addiction.icon} className="w-7 h-7 text-white" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-lg truncate">{addiction.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-zinc-400">Racha máxima:</span>
              <span className="text-sm font-medium text-white">
                {addiction.max_streak_days} días
              </span>
            </div>
          </div>

          {/* Days Counter */}
          <div className="text-right flex-shrink-0">
            <div className="text-4xl font-bold text-white">
              {days}
            </div>
            <div className="text-xs text-zinc-400 mt-1">
              {days === 1 ? 'día' : 'días'}
            </div>
          </div>

          {/* Expand Icon */}
          <div className="flex-shrink-0">
            {showDetails ? (
              <ChevronUp className="w-5 h-5 text-zinc-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-zinc-400" />
            )}
          </div>
        </div>

        {/* Progress to next achievement */}
        {nextAchievement && (
          <div className="mt-8">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-zinc-400 flex items-center gap-1.5">
                Siguiente: <Icon name={nextAchievement.icon} size={14} className="text-zinc-300" /> {nextAchievement.name}
              </span>
              <span className="text-zinc-500">
                {nextAchievement.days - days} días restantes
              </span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${progressToNext}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Expanded Details */}
      {showDetails && (
        <div className="px-6 md:px-8 pb-6 md:pb-8 pt-0 border-t border-zinc-800 animate-fade-in">
          <div className="pt-6 md:pt-8 space-y-6">
            {/* Detailed Time */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-black rounded-lg p-4 border border-zinc-800 text-center">
                <div className="text-2xl font-bold text-white">{days}</div>
                <div className="text-xs text-zinc-400 mt-1">Días</div>
              </div>
              <div className="bg-black rounded-lg p-4 border border-zinc-800 text-center">
                <div className="text-2xl font-bold text-white">{hours}</div>
                <div className="text-xs text-zinc-400 mt-1">Horas</div>
              </div>
              <div className="bg-black rounded-lg p-4 border border-zinc-800 text-center">
                <div className="text-2xl font-bold text-white">{minutes}</div>
                <div className="text-xs text-zinc-400 mt-1">Minutos</div>
              </div>
            </div>

            {/* Streak Info */}
            <div className="flex items-center justify-between p-4 bg-black rounded-lg border border-zinc-800">
              <span className="text-sm text-zinc-400">Racha actual</span>
              <span className="text-sm font-medium text-white">
                {formatStreakText(days)}
              </span>
            </div>

            {/* Relapse Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onRelapse()
              }}
              className="w-full py-3 px-4 bg-red-950 hover:bg-red-900 text-red-400 font-medium rounded-lg border border-red-900 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Registrar recaída
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
