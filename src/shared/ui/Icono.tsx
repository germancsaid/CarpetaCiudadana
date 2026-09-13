import {
  UserCircle, FileText, Building, Car, Briefcase, IdCard, MapPin, Store,
  HeartPulse, HardHat, Home, FileBadge, FileSignature, File, type LucideIcon,
} from 'lucide-react'

/** Mapa nombre (guardado en DB) → componente. Agregar acá si un doc/trámite usa un icono nuevo. */
const ICONOS: Record<string, LucideIcon> = {
  'user-circle': UserCircle,
  'file-text': FileText,
  building: Building,
  car: Car,
  briefcase: Briefcase,
  'id-card': IdCard,
  'map-pin': MapPin,
  store: Store,
  'heart-pulse': HeartPulse,
  'hard-hat': HardHat,
  home: Home,
  'file-badge': FileBadge,
  'file-signature': FileSignature,
}

interface IconoProps {
  nombre: string
  size?: number
  className?: string
}

export function Icono({ nombre, size = 20, className }: IconoProps) {
  const C = ICONOS[nombre] ?? File
  return <C size={size} className={className} />
}
