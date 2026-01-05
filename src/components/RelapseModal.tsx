import { useState } from 'react'
import { useAddictionStore } from '@/stores/addictionStore'
import { useStreak } from '@/hooks/useStreak'
import type { Addiction } from '@/types'
import { Icon } from '@/components/icons'
import { X, AlertTriangle } from 'lucide-react'

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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-slate-800 rounded-t-3xl sm:rounded-3xl border border-slate-700/50 shadow-2xl animate-fade-in">
        {/* Handle */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="w-10 h-1 bg-slate-600 rounded-full" />
        </div>

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-100">
              {confirmed ? 'Confirmar Recaída' : 'Registrar Recaída'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!confirmed ? (
            <div className="space-y-6">
              {/* Current Streak Warning */}
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-700/50 flex items-center justify-center">
                    <Icon name={addiction.icon} className="w-5 h-5 text-slate-300" />
                  </div>
                  <div>
                    <p className="font-medium text-amber-400">{addiction.name}</p>
                    <p className="text-sm text-slate-400">
                      Racha actual: <span className="text-emerald-400 font-semibold">{days} días</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-slate-300 mb-2">
                  Notas (opcional)
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors resize-none"
                  placeholder="¿Qué provocó la recaída? Esto te ayudará a identificar patrones."
                />
              </div>

              {/* Action Button */}
              <button
                onClick={handleSubmit}
                className="w-full py-3 px-4 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 font-semibold rounded-xl border border-rose-500/30 transition-colors"
              >
                Continuar
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Confirmation Message */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-rose-400" />
                </div>
                <p className="text-slate-300">
                  ¿Estás seguro de registrar esta recaída?
                </p>
                <p className="text-sm text-slate-400 mt-2">
                  Tu racha de <span className="text-emerald-400 font-semibold">{days} días</span> se reiniciará.
                </p>
                {days > addiction.max_streak_days && (
                  <p className="text-sm text-violet-400 mt-2">
                    ¡Esta es tu mejor racha hasta ahora! Se guardará como récord.
                  </p>
                )}
              </div>

              {/* Motivational Message */}
              <div className="bg-slate-700/30 rounded-xl p-4 text-center">
                <p className="text-sm text-slate-300">
                  Recuerda: caer no es fracasar, quedarse en el suelo sí lo es.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmed(false)}
                  className="flex-1 py-3 px-4 bg-slate-700/50 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
