import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icono: LucideIcon
  titulo: string
  descripcion: string
  accion?: ReactNode
}

/** Estado vacío estándar: ilustración en línea, texto corto, un solo CTA. */
export function EmptyState({ icono: Icono, titulo, descripcion, accion }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-card bg-card p-12 text-center shadow-card animate-aparecer">
      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-accent-light text-accent-text">
        <Icono size={28} strokeWidth={1.75} />
      </div>
      <h3 className="text-[17px] font-semibold text-ink">{titulo}</h3>
      <p className="mt-1 max-w-sm text-sm text-ink-muted">{descripcion}</p>
      {accion && <div className="mt-5">{accion}</div>}
    </div>
  )
}
