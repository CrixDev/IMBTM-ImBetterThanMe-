import { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useAddictionStore } from '@/stores/addictionStore'
import AddictionCard from '@/components/AddictionCard'
import AddAddictionModal from '@/components/AddAddictionModal'
import RelapseModal from '@/components/RelapseModal'
import AchievementToast from '@/components/AchievementToast'
import type { Addiction } from '@/types'
import { Plus, Target, Loader2 } from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuthStore()
  const { addictions, isLoading, fetchAddictions, fetchAchievements, newAchievement, clearNewAchievement } = useAddictionStore()
  const [showAddModal, setShowAddModal] = useState(false)
  const [relapseAddiction, setRelapseAddiction] = useState<Addiction | null>(null)

  useEffect(() => {
    if (user) {
      fetchAddictions(user.id)
      fetchAchievements(user.id)
    }
  }, [user, fetchAddictions, fetchAchievements])

  const handleRelapse = (addiction: Addiction) => {
    setRelapseAddiction(addiction)
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Welcome Section */}
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-white mb-3">
          Hola{user?.email ? `, ${user.email.split('@')[0]}` : ''}
        </h1>
        <p className="text-zinc-400">Sigue adelante, cada día cuenta.</p>
      </div>

      {/* Stats Summary */}
      {addictions.length > 0 && (
        <div className="grid grid-cols-2 gap-6 animate-fade-in delay-100">
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
            <div className="text-4xl font-bold text-white mb-1">
              {addictions.length}
            </div>
            <div className="text-sm text-zinc-400">
              {addictions.length === 1 ? 'Hábito activo' : 'Hábitos activos'}
            </div>
          </div>
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
            <div className="text-4xl font-bold text-white mb-1">
              {addictions.reduce((acc, a) => acc + a.max_streak_days, 0)}
            </div>
            <div className="text-sm text-zinc-400">Días acumulados</div>
          </div>
        </div>
      )}

      {/* Addictions List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Mis Hábitos</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="p-2.5 bg-white hover:bg-zinc-200 text-black rounded-lg transition-colors"
            title="Agregar hábito"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 text-zinc-400 animate-spin" />
          </div>
        ) : addictions.length === 0 ? (
          <div className="bg-zinc-900 rounded-xl p-12 border border-zinc-800 text-center animate-fade-in">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-zinc-800 flex items-center justify-center">
              <Target className="w-8 h-8 text-zinc-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Comienza tu camino
            </h3>
            <p className="text-zinc-400 text-sm mb-6">
              Agrega tu primer hábito para empezar a rastrear tu progreso.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-zinc-200 text-black font-semibold rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Agregar hábito
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {addictions.map((addiction, index) => (
              <div
                key={addiction.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <AddictionCard
                  addiction={addiction}
                  onRelapse={() => handleRelapse(addiction)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddAddictionModal onClose={() => setShowAddModal(false)} />
      )}

      {relapseAddiction && (
        <RelapseModal
          addiction={relapseAddiction}
          onClose={() => setRelapseAddiction(null)}
        />
      )}

      {/* Achievement Toast */}
      {newAchievement && (
        <AchievementToast
          achievement={newAchievement}
          onClose={clearNewAchievement}
        />
      )}

      {/* Floating Add Button */}
      {addictions.length > 0 && (
        <button
          onClick={() => setShowAddModal(true)}
          className="fixed bottom-28 md:bottom-32 right-6 md:right-12 w-16 h-16 bg-white hover:bg-zinc-200 text-black rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 z-40"
          title="Agregar nuevo hábito"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}
    </div>
  )
}
