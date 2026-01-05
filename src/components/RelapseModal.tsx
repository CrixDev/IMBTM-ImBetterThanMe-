import { useState } from 'react'
import { useAddictionStore } from '@/stores/addictionStore'
import { useStreak } from '@/hooks/useStreak'
import type { Addiction } from '@/types'
import { Icon } from '@/components/icons'
import { X, AlertTriangle, Loader2 } from 'lucide-react'

interface RelapseModalProps {
  addiction: Addiction
  onClose: () => void
}

export default function RelapseModal({ addiction, onClose }: RelapseModalProps) {
  const { recordRelapse } = useAddictionStore()
  const { days } = useStreak(addiction)
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const handleSubmit = async () => {
    if (!confirmed) {
      setConfirmed(true)
      return
    }

    setIsSubmitting(true)
    await recordRelapse(addiction.id, notes || undefined)
    setIsSubmitting(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 md:p-12">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-zinc-900 rounded-xl border border-zinc-800 shadow-lg animate-scale-in m-6">
        <div className="p-6 md:p-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
              {confirmed ? 'Confirmar Recaída' : 'Registrar Recaída'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!confirmed ? (
            <div className="space-y-6">
              {/* Current Streak Warning */}
              <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-zinc-700 border border-zinc-600 flex items-center justify-center flex-shrink-0">
                    <Icon name={addiction.icon} className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{addiction.name}</p>
                    <p className="text-sm text-zinc-400 mt-0.5">
                      Racha actual: <span className="text-white font-semibold">{days} días</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-zinc-300 mb-2">
                  Notas (opcional)
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors resize-none"
                  placeholder="¿Qué provocó la recaída? Esto te ayudará a identificar patrones."
                />
              </div>

              {/* Action Button */}
              <button
                onClick={handleSubmit}
                className="w-full py-3 px-4 bg-red-950 hover:bg-red-900 text-red-400 font-semibold rounded-lg border border-red-900 transition-colors"
              >
                Continuar
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Confirmation Message */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-950 border border-red-900 flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>
                <p className="text-white text-lg mb-2">
                  ¿Estás seguro de registrar esta recaída?
                </p>
                <p className="text-sm text-zinc-400">
                  Tu racha de <span className="text-white font-semibold">{days} días</span> se reiniciará.
                </p>
                {days > addiction.max_streak_days && (
                  <p className="text-sm text-white mt-2 bg-zinc-800 border border-zinc-700 rounded-lg p-3">
                    ¡Esta es tu mejor racha hasta ahora! Se guardará como récord.
                  </p>
                )}
              </div>

              {/* Motivational Message */}
              <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-center">
                <p className="text-sm text-zinc-300">
                  Recuerda: caer no es fracasar, quedarse en el suelo sí lo es.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmed(false)}
                  className="flex-1 py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 bg-red-950 hover:bg-red-900 text-red-400 font-semibold rounded-lg border border-red-900 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    'Confirmar'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
