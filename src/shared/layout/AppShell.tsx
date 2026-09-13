import { NavLink, Outlet } from 'react-router-dom'
import {
  Home,
  FolderOpen,
  Link2,
  ClipboardList,
  Car,
  Landmark,
  Coins,
} from 'lucide-react'
import { ROUTES } from '@/app/routes'

const NAV = [
  { to: ROUTES.inicio, label: 'Inicio', icon: Home },
  { to: ROUTES.vault, label: 'Mi Carpeta', icon: FolderOpen },
  { to: ROUTES.vinculos, label: 'Vínculos', icon: Link2 },
  { to: ROUTES.tramites, label: 'Trámites', icon: ClipboardList },
  { to: ROUTES.vehiculo, label: 'Caso: Vehículo', icon: Car },
  { to: ROUTES.verificador, label: 'Verificador', icon: Landmark },
  { to: ROUTES.recaudacion, label: 'Recaudación', icon: Coins },
]

/** Layout raíz: sidebar fijo + área de contenido. Las páginas van en <Outlet />. */
export function AppShell() {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-[260px] shrink-0 flex-col bg-sidebar p-5 text-white md:flex">
        <div className="mb-8">
          <div className="text-lg font-bold">CarpetaCiudadana</div>
          <div className="text-xs text-gray-400">Bolivia Digital</div>
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
        <div className="text-xs text-gray-600">Prometeo © 2026</div>
      </aside>
      <main className="flex-1 p-8">
        <div className="mx-auto max-w-[1100px]">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
