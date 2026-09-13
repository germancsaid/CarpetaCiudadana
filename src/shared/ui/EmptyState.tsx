import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icono: LucideIcon
  titulo: string
  descripcion: string
  accion?: ReactNode
}

/** Estado vacío estándar. Toda lista debe tener uno (ver SPEC). */
export function EmptyState({ icono: Icono, titulo, descripcion, accion }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-card border border-dashed border-border bg-card p-10 text-center">
      <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-page text-ink-muted">
        <Icono size={22} />
      </div>
      <h3 className="font-semibold text-ink">{titulo}</h3>
      <p className="mt-1 max-w-sm text-sm text-ink-muted">{descripcion}</p>
      {accion && <div className="mt-4">{accion}</div>}
    </div>
  )
}
