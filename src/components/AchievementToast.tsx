import { useEffect } from 'react'
import type { Achievement } from '@/types'
import { ACHIEVEMENTS } from '@/types'
import { Icon } from '@/components/icons'
import { X } from 'lucide-react'

interface AchievementToastProps {
  achievement: Achievement
  onClose: () => void
}

export default function AchievementToast({ achievement, onClose }: AchievementToastProps) {
  const definition = ACHIEVEMENTS.find((a) => a.type === achievement.achievement_type)

  useEffect(() => {
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  if (!definition) return null

  return (
    <div className="fixed top-6 left-6 right-6 md:top-12 md:left-12 md:right-12 z-50 flex justify-center pointer-events-none">
      <div
        className="bg-white text-black rounded-xl p-6 shadow-lg pointer-events-auto animate-scale-in max-w-sm w-full border border-zinc-800"
        onClick={onClose}
      >
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className="w-14 h-14 rounded-lg bg-black/10 flex items-center justify-center flex-shrink-0">
            <Icon name={definition.icon} className="text-black" size={28} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-black/60 uppercase tracking-wider">
              ¡Logro Desbloqueado!
            </p>
            <h3 className="text-lg font-bold text-black mt-0.5">
              {definition.name}
            </h3>
            <p className="text-sm text-black/70">{definition.description}</p>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-1 text-black/60 hover:text-black transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
