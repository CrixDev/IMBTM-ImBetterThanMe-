import { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useAddictionStore } from '@/stores/addictionStore'
import AddictionCard from '@/components/AddictionCard'
import AddAddictionModal from '@/components/AddAddictionModal'
import RelapseModal from '@/components/RelapseModal'
import AchievementToast from '@/components/AchievementToast'
import type { Addiction } from '@/types'
import { Plus, Target } from 'lucide-react'

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
    <div className="space-y-6 pb-4">
      {/* Welcome Section */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-slate-100">
          Hola{user?.email ? `, ${user.email.split('@')[0]}` : ''}
        </h1>
        <p className="text-slate-400 mt-1">Sigue adelante, cada día cuenta.</p>
      </div>

      {/* Stats Summary */}
      {addictions.length > 0 && (
        <div className="grid grid-cols-2 gap-3 animate-fade-in delay-100">
          <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-4 border border-slate-700/50">
            <div className="text-3xl font-bold text-emerald-400">
              {addictions.length}
            </div>
            <div className="text-sm text-slate-400 mt-1">
              {addictions.length === 1 ? 'Hábito activo' : 'Hábitos activos'}
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-4 border border-slate-700/50">
            <div className="text-3xl font-bold text-violet-400">
              {addictions.reduce((acc, a) => acc + a.max_streak_days, 0)}
            </div>
            <div className="text-sm text-slate-400 mt-1">Días acumulados</div>
          </div>
        </div>
      )}

      {/* Addictions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-200">Mis Hábitos</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-xl transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : addictions.length === 0 ? (
          <div className="bg-slate-800/30 backdrop-blur rounded-2xl p-8 border border-dashed border-slate-600/50 text-center animate-fade-in">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-700/50 flex items-center justify-center">
              <Target className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-200 mb-2">
              Comienza tu camino
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              Agrega tu primer hábito para empezar a rastrear tu progreso.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/30 transition-all"
            >
              <Plus className="w-5 h-5" />
              Agregar hábito
            </button>
          </div>
        ) : (
          <div className="space-y-3">
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
          className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-full shadow-lg shadow-emerald-500/40 flex items-center justify-center transition-all hover:scale-110 z-40"
          title="Agregar nuevo hábito"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}
    </div>
  )
}
