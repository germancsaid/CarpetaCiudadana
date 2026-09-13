import {
  Home,
  FolderOpen,
  Link2,
  ClipboardList,
  Car,
  Landmark,
  Coins,
  type LucideIcon,
} from 'lucide-react'
import { ROUTES } from '@/app/routes'

export interface ItemNav {
  to: string
  label: string
  titulo: string
  icon: LucideIcon
}

/** Única definición de la navegación: sidebar, barra móvil y título del top bar salen de acá. */
export const NAV: ItemNav[] = [
  { to: ROUTES.inicio, label: 'Inicio', titulo: 'Inicio', icon: Home },
  { to: ROUTES.vault, label: 'Mi Carpeta', titulo: 'Mi Carpeta', icon: FolderOpen },
  { to: ROUTES.vinculos, label: 'Vínculos', titulo: 'Vínculos Tokenizados', icon: Link2 },
  { to: ROUTES.tramites, label: 'Trámites', titulo: 'Mis Trámites', icon: ClipboardList },
  { to: ROUTES.vehiculo, label: 'Caso: Vehículo', titulo: 'Caso de uso: Vehículo', icon: Car },
  { to: ROUTES.verificador, label: 'Verificador', titulo: 'Panel Verificador', icon: Landmark },
  { to: ROUTES.recaudacion, label: 'Recaudación', titulo: 'Recaudación Municipal', icon: Coins },
]
