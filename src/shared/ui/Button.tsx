import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variante = 'primario' | 'secundario' | 'fantasma' | 'peligro'
type Tamano = 'sm' | 'md'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante
  tamano?: Tamano
  cargando?: boolean
  iconoIzq?: ReactNode
  children: ReactNode
}

const VARIANTES: Record<Variante, string> = {
  primario: 'bg-accent text-white hover:bg-accent/90',
  secundario: 'bg-card text-ink border border-border hover:bg-page',
  fantasma: 'bg-transparent text-ink-secondary hover:bg-page',
  peligro: 'bg-danger text-white hover:bg-danger/90',
}

const TAMANOS: Record<Tamano, string> = {
  sm: 'min-h-9 px-3 text-sm',
  md: 'min-h-11 px-4 text-sm',
}

export function Button({
  variante = 'primario',
  tamano = 'md',
  cargando = false,
  iconoIzq,
  children,
  className = '',
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled || cargando}
      className={`inline-flex items-center justify-center gap-2 rounded-control font-medium transition active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTES[variante]} ${TAMANOS[tamano]} ${className}`}
    >
      {cargando ? <Spinner /> : iconoIzq}
      {children}
    </button>
  )
}

/** Spinner inline, hereda el color del texto del botón. */
export function Spinner({ className = '' }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Cargando"
      className={`inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
    />
  )
}
