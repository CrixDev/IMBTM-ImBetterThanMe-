import { Outlet, NavLink } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { Sprout, Home, Sparkles, LogOut } from 'lucide-react'

export default function Layout() {
  const { signOut } = useAuthStore()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50">
        <div className="max-w-lg mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-slate-100">IMBTM</span>
          </div>
          
          <button
            onClick={signOut}
            className="p-2 text-slate-400 hover:text-slate-200 transition-colors"
            title="Cerrar sesión"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50 safe-area-inset-bottom">
        <div className="max-w-lg mx-auto px-4 h-16 flex items-center justify-around">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all ${
                isActive
                  ? 'text-emerald-400 bg-emerald-500/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Inicio</span>
          </NavLink>

          <NavLink
            to="/achievements"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all ${
                isActive
                  ? 'text-emerald-400 bg-emerald-500/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <Sparkles className="w-6 h-6" />
            <span className="text-xs font-medium">Logros</span>
          </NavLink>
        </div>
      </nav>
    </div>
  )
}
