import { useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useAddictionStore } from '@/stores/addictionStore'
import { ADDICTION_ICONS } from '@/types'
import { Icon } from '@/components/icons'
import { X, Plus } from 'lucide-react'

interface AddAddictionModalProps {
  onClose: () => void
}

export default function AddAddictionModal({ onClose }: AddAddictionModalProps) {
  const { user } = useAuthStore()
  const { createAddiction } = useAddictionStore()
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('target')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim() || !user) return

    setIsSubmitting(true)

    await createAddiction({
      user_id: user.id,
      name: name.trim(),
      icon,
      start_date: new Date().toISOString(),
      last_relapse: null,
      is_active: true
    })

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
      <div className="relative w-full max-w-lg bg-slate-800 rounded-t-3xl sm:rounded-3xl border border-slate-700/50 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
        {/* Handle */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="w-10 h-1 bg-slate-600 rounded-full" />
        </div>

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-100">Nuevo Hábito</h2>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Icon Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Icono
              </label>
              <div className="grid grid-cols-6 gap-2">
                {ADDICTION_ICONS.map((item) => (
                  <button
                    key={item.icon}
                    type="button"
                    onClick={() => setIcon(item.icon)}
                    className={`p-3 rounded-xl transition-all flex items-center justify-center ${
                      icon === item.icon
                        ? 'bg-emerald-500/20 ring-2 ring-emerald-500'
                        : 'bg-slate-700/50 hover:bg-slate-700'
                    }`}
                    title={item.label}
                  >
                    <Icon name={item.icon} className="w-6 h-6 text-slate-300" />
                  </button>
                ))}
              </div>
            </div>

            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                Nombre del hábito
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                placeholder="Ej: Dejar de fumar"
                autoFocus
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!name.trim() || isSubmitting}
              className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Agregar hábito
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
