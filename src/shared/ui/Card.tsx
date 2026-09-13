import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
  /** Se eleva al pasar el mouse. Para cards clickeables o que quieran sentirse físicas. */
  elevable?: boolean
}

/** Superficie elevada estándar. Sin borde: la separación la da la sombra y el espacio. */
export function Card({ children, className = '', elevable = false, ...rest }: CardProps) {
  return (
    <div {...rest} className={`rounded-card bg-card shadow-card ${elevable ? 'elevable' : ''} ${className}`}>
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
    <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-3">
      <div>
        <h2 className="text-[17px] font-semibold text-ink">{titulo}</h2>
        {descripcion && <p className="mt-0.5 text-sm text-ink-muted">{descripcion}</p>}
      </div>
      {accion}
    </div>
  )
}
