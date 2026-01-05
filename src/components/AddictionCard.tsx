import { useEffect, useState } from 'react'
import { useStreak, formatStreakText } from '@/hooks/useStreak'
import { useAddictionStore } from '@/stores/addictionStore'
import { useAuthStore } from '@/stores/authStore'
import type { Addiction } from '@/types'
import { ACHIEVEMENTS } from '@/types'
import { Icon } from '@/components/icons'
import { RefreshCw } from 'lucide-react'

interface AddictionCardProps {
  addiction: Addiction
  onRelapse: () => void
}

export default function AddictionCard({ addiction, onRelapse }: AddictionCardProps) {
  const { days, hours, minutes } = useStreak(addiction)
  const { user } = useAuthStore()
  const { checkAndUnlockAchievements } = useAddictionStore()
  const [showDetails, setShowDetails] = useState(false)

  // Check achievements periodically based on current streak
  useEffect(() => {
    if (user && days > 0) {
      checkAndUnlockAchievements(user.id, addiction.id, days)
    }
  }, [days, user, addiction.id, checkAndUnlockAchievements])

  // Find next achievement milestone
  const nextAchievement = ACHIEVEMENTS.find((a) => a.days > days)
  const progressToNext = nextAchievement
    ? Math.min(100, (days / nextAchievement.days) * 100)
    : 100

  return (
    <div className="bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700/50 overflow-hidden">
      {/* Main Card */}
      <div
        className="p-4 cursor-pointer"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center shadow-inner">
            <Icon name={addiction.icon} className="w-7 h-7 text-slate-300" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-100 truncate">{addiction.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-slate-400">Racha máxima:</span>
              <span className="text-sm font-medium text-violet-400">
                {addiction.max_streak_days} días
              </span>
            </div>
          </div>

          {/* Days Counter */}
          <div className="text-right">
            <div className="text-3xl font-bold text-emerald-400 animate-count-up">
              {days}
            </div>
            <div className="text-xs text-slate-400">
              {days === 1 ? 'día' : 'días'}
            </div>
          </div>
        </div>

        {/* Progress to next achievement */}
        {nextAchievement && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400 flex items-center gap-1">
                Siguiente: <Icon name={nextAchievement.icon} size={14} className="text-slate-300" /> {nextAchievement.name}
              </span>
              <span className="text-slate-500">
                {nextAchievement.days - days} días restantes
              </span>
            </div>
            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${progressToNext}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Expanded Details */}
      {showDetails && (
        <div className="px-4 pb-4 pt-0 border-t border-slate-700/50 animate-fade-in">
          <div className="pt-4 space-y-4">
            {/* Detailed Time */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-900/50 rounded-xl p-3">
                <div className="text-xl font-bold text-slate-100">{days}</div>
                <div className="text-xs text-slate-400">Días</div>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-3">
                <div className="text-xl font-bold text-slate-100">{hours}</div>
                <div className="text-xs text-slate-400">Horas</div>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-3">
                <div className="text-xl font-bold text-slate-100">{minutes}</div>
                <div className="text-xs text-slate-400">Minutos</div>
              </div>
            </div>

            {/* Streak Info */}
            <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl">
              <span className="text-sm text-slate-400">Racha actual</span>
              <span className="text-sm font-medium text-emerald-400">
                {formatStreakText(days)}
              </span>
            </div>

            {/* Relapse Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onRelapse()
              }}
              className="w-full py-3 px-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-medium rounded-xl border border-rose-500/20 transition-colors flex items-center justify-center gap-2"
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
