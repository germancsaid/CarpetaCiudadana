import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variante = 'primario' | 'secundario' | 'fantasma' | 'peligro' | 'sutil'
type Tamano = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante
  tamano?: Tamano
  cargando?: boolean
  iconoIzq?: ReactNode
  /** Pulso suave mientras carga, en vez de spinner (patrón Apple). */
  pulso?: boolean
  children: ReactNode
}

const VARIANTES: Record<Variante, string> = {
  primario: 'bg-accent text-white hover:brightness-110 shadow-sm',
  secundario: 'bg-card text-ink shadow-card hover:bg-card-2',
  sutil: 'bg-accent-light text-accent-text hover:brightness-95 dark:hover:brightness-125',
  fantasma: 'bg-transparent text-ink-secondary hover:bg-card-2',
  peligro: 'bg-danger text-white hover:brightness-110',
}

const TAMANOS: Record<Tamano, string> = {
  sm: 'min-h-9 px-3.5 text-[13px]',
  md: 'min-h-11 px-4 text-[15px]',
  lg: 'min-h-12 px-6 text-base',
}

export function Button({
  variante = 'primario',
  tamano = 'md',
  cargando = false,
  pulso = false,
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
      aria-busy={cargando || undefined}
      className={`presionable inline-flex items-center justify-center gap-2 rounded-control font-semibold disabled:cursor-not-allowed disabled:opacity-50 ${cargando && pulso ? 'animate-latir' : ''} ${VARIANTES[variante]} ${TAMANOS[tamano]} ${className}`}
    >
      {cargando && !pulso ? <Spinner /> : iconoIzq}
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
