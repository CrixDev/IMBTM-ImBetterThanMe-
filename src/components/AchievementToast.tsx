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
    <div className="fixed top-4 left-4 right-4 z-50 flex justify-center pointer-events-none">
      <div
        className={`bg-gradient-to-r ${definition.color} rounded-2xl p-4 shadow-2xl pointer-events-auto animate-fade-in max-w-sm w-full`}
        onClick={onClose}
      >
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center animate-badge-unlock">
            <Icon name={definition.icon} className="text-white" size={28} />
          </div>

          {/* Content */}
          <div className="flex-1">
            <p className="text-xs font-medium text-white/80 uppercase tracking-wider">
              ¡Logro Desbloqueado!
            </p>
            <h3 className="text-lg font-bold text-white mt-0.5">
              {definition.name}
            </h3>
            <p className="text-sm text-white/80">{definition.description}</p>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-1 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Confetti effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `pulse-glow ${0.5 + Math.random()}s ease-out infinite`,
                animationDelay: `${Math.random() * 0.5}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
