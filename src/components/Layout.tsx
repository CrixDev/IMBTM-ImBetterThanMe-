import { Outlet, NavLink } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { Home, Sparkles, LogOut } from 'lucide-react'
import { Logo } from '@/components/Logo'

export default function Layout() {
  const { signOut } = useAuthStore()

  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-zinc-800">
        <div className="max-w-2xl mx-auto px-6 md:px-12 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white p-1.5 flex items-center justify-center">
              <Logo variant="isotipo" className="w-full h-full" />
            </div>
            <span className="font-bold text-white">IMBTM</span>
          </div>
          
          <button
            onClick={signOut}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors"
            title="Cerrar sesión"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-6 md:px-12 py-8 md:py-10">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 bg-black/95 backdrop-blur-sm border-t border-zinc-800">
        <div className="max-w-2xl mx-auto px-6 md:px-12 h-20 md:h-24 flex items-center justify-center gap-6">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-8 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-white bg-zinc-900'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`
            }
          >
            <Home className="w-5 h-5" />
            <span className="text-xs font-medium">Inicio</span>
          </NavLink>

          <NavLink
            to="/achievements"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-8 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-white bg-zinc-900'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`
            }
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-xs font-medium">Logros</span>
          </NavLink>
        </div>
      </nav>
    </div>
  )
}
