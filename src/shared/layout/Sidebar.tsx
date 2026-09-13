import { NavLink } from 'react-router-dom'
import { CIUDADANO_ACTUAL } from '@/services/ciudadanos'
import { formatCi, iniciales } from '@/shared/lib/format'
import { NAV } from './nav'
import { ReiniciarDemo } from './ReiniciarDemo'

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 flex-col overflow-y-auto bg-sidebar p-5 text-white md:flex">
      <div className="mb-6 px-1">
        <div className="text-lg font-bold tracking-tight">CarpetaCiudadana</div>
        <div className="text-xs text-gray-400">Bolivia Digital</div>
      </div>

      <div className="mb-6 flex items-center gap-3 rounded-lg bg-white/5 p-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold">
          {iniciales(CIUDADANO_ACTUAL.nombreCompleto)}
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">{CIUDADANO_ACTUAL.nombreCompleto.split(' ').slice(0, 2).join(' ')}</div>
          <div className="text-xs text-gray-400">
            CI {formatCi(CIUDADANO_ACTUAL.ci, CIUDADANO_ACTUAL.ciDepartamento)}
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm transition ${
                isActive ? 'bg-accent text-white' : 'text-gray-400 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="flex flex-col px-1 text-xs text-gray-600">
        <span>Prometeo © 2026</span>
        <ReiniciarDemo />
      </div>
    </aside>
  )
}

/** Barra inferior para mobile (< md). Muestra los 5 ítems principales. */
export function NavMovil() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-card md:hidden">
      {NAV.slice(0, 5).map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[10px] ${
              isActive ? 'text-accent' : 'text-ink-muted'
            }`
          }
        >
          <Icon size={20} />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
