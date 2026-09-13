import type { InputHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react'

const BASE =
  'w-full min-h-11 rounded-control border bg-card px-3 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-accent/30'

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
      <span className="mb-1.5 block text-sm font-medium text-ink-secondary">
        {etiqueta}
        {requerido && <span className="text-danger"> *</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
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
      className={`${BASE} ${error ? 'border-danger' : 'border-border'} ${className}`}
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
      className={`${BASE} ${error ? 'border-danger' : 'border-border'} ${className}`}
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
