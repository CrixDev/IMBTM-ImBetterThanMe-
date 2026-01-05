import { useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useAddictionStore } from '@/stores/addictionStore'
import { ADDICTION_ICONS } from '@/types'
import { Icon } from '@/components/icons'
import { X, Plus, Loader2 } from 'lucide-react'

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 md:p-12">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-zinc-900 rounded-xl border border-zinc-800 shadow-lg animate-scale-in max-h-[90vh] overflow-y-auto m-6">
        <div className="p-6 md:p-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Nuevo Hábito</h2>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Icon Selection */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-3">
                Icono
              </label>
              <div className="grid grid-cols-6 gap-2">
                {ADDICTION_ICONS.map((item) => (
                  <button
                    key={item.icon}
                    type="button"
                    onClick={() => setIcon(item.icon)}
                    className={`p-3 rounded-lg transition-all flex items-center justify-center ${
                      icon === item.icon
                        ? 'bg-white text-black'
                        : 'bg-zinc-800 hover:bg-zinc-700 border border-zinc-700'
                    }`}
                    title={item.label}
                  >
                    <Icon name={item.icon} className="w-6 h-6" />
                  </button>
                ))}
              </div>
            </div>

            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">
                Nombre del hábito
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors"
                placeholder="Ej: Dejar de fumar"
                autoFocus
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!name.trim() || isSubmitting}
              className="w-full py-3 px-4 bg-white hover:bg-zinc-200 text-black font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
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
