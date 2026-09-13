import type { InputHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react'

const BASE =
  'w-full min-h-12 rounded-control bg-card-2 px-4 text-[15px] text-ink placeholder:text-ink-muted transition focus:bg-card focus:ring-2 focus:ring-accent/40 focus:outline-none'

interface CampoProps {
  etiqueta: string
  error?: string
  requerido?: boolean
  children: ReactNode
}

/** Envoltorio con etiqueta y mensaje de error en español. */
export function Campo({ etiqueta, error, requerido, children }: CampoProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-ink-secondary">
        {etiqueta}
        {requerido && <span className="text-danger"> *</span>}
      </span>
      {children}
      {error && <span className="mt-1.5 block text-xs font-medium text-danger">{error}</span>}
    </label>
  )
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export function Input({ error, className = '', ...rest }: InputProps) {
  return (
    <input
      {...rest}
      aria-invalid={error || undefined}
      className={`${BASE} ${error ? 'ring-2 ring-danger/50' : ''} ${className}`}
    />
  )
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean
  opciones: { valor: string; etiqueta: string }[]
  placeholder?: string
}

export function Select({ error, opciones, placeholder, className = '', ...rest }: SelectProps) {
  return (
    <select
      {...rest}
      aria-invalid={error || undefined}
      className={`${BASE} ${error ? 'ring-2 ring-danger/50' : ''} ${className}`}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {opciones.map((o) => (
        <option key={o.valor} value={o.valor}>
          {o.etiqueta}
        </option>
      ))}
    </select>
  )
}
