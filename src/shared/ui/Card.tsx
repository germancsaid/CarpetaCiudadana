import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

/** Contenedor blanco estándar. Toda superficie de contenido usa esto. */
export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`rounded-card border border-border bg-card shadow-sm ${className}`}>
      {children}
    </div>
  )
}

interface CardHeaderProps {
  titulo: string
  descripcion?: string
  accion?: ReactNode
}

export function CardHeader({ titulo, descripcion, accion }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border p-5">
      <div>
        <h2 className="font-semibold text-ink">{titulo}</h2>
        {descripcion && <p className="mt-0.5 text-sm text-ink-muted">{descripcion}</p>}
      </div>
      {accion}
    </div>
  )
}
