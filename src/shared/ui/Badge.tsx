import { Check } from 'lucide-react'
import type { EstadoDocumento, EstadoVinculo, EstadoPaso } from '@/shared/types/domain'

export type EstadoBadge = EstadoDocumento | EstadoVinculo | EstadoPaso | 'verificado'

interface Config {
  etiqueta: string
  clases: string
  punto: string
}

/** Mapa único estado → presentación. No escribir ifs de estado en las features. */
export const CONFIG_ESTADO: Record<EstadoBadge, Config> = {
  vigente: { etiqueta: 'Vigente', clases: 'bg-success-light text-success-text', punto: 'bg-success' },
  activo: { etiqueta: 'Activo', clases: 'bg-success-light text-success-text', punto: 'bg-success' },
  completado: { etiqueta: 'Completado', clases: 'bg-success-light text-success-text', punto: 'bg-success' },
  verificado: { etiqueta: 'Verificado', clases: 'bg-success-light text-success-text', punto: 'bg-success' },
  por_vencer: { etiqueta: 'Por vencer', clases: 'bg-warning-light text-warning-text', punto: 'bg-warning' },
  en_progreso: { etiqueta: 'En progreso', clases: 'bg-accent-light text-accent-text', punto: 'bg-accent' },
  vencido: { etiqueta: 'Vencido', clases: 'bg-danger-light text-danger-text', punto: 'bg-danger' },
  revocado: { etiqueta: 'Revocado', clases: 'bg-danger-light text-danger-text', punto: 'bg-danger' },
  pendiente: { etiqueta: 'Pendiente', clases: 'bg-gray-100 text-gray-600', punto: 'bg-gray-400' },
  bloqueado: { etiqueta: 'Bloqueado', clases: 'bg-gray-100 text-gray-600', punto: 'bg-gray-400' },
}

export function Badge({ estado }: { estado: EstadoBadge }) {
  const { etiqueta, clases, punto } = CONFIG_ESTADO[estado]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${clases}`}
    >
      {estado === 'verificado' ? (
        <Check size={12} strokeWidth={3} />
      ) : (
        <span className={`size-1.5 rounded-full ${punto}`} />
      )}
      {etiqueta}
    </span>
  )
}
