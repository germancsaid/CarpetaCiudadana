/**
 * Formateadores estándar Bolivia. Usar SIEMPRE estos, nunca toLocaleString suelto.
 * - Fechas: DD/MM/YYYY
 * - Montos: punto para miles, coma para decimales → "Bs. 12.500,00"
 */

export function formatFecha(iso: string | null | undefined): string {
  if (!iso) return '—'
  const d = new Date(iso)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${dd}/${mm}/${d.getFullYear()}`
}

export function formatFechaHora(iso: string): string {
  const d = new Date(iso)
  const hh = String(d.getHours()).padStart(2, '0')
  const mi = String(d.getMinutes()).padStart(2, '0')
  return `${formatFecha(iso)} ${hh}:${mi}`
}

export function formatBs(monto: number, decimales = 0): string {
  return `Bs. ${formatNumero(monto, decimales)}`
}

export function formatUsd(monto: number): string {
  return `USD ${formatNumero(monto, 0)}`
}

export function formatNumero(n: number, decimales = 0): string {
  return new Intl.NumberFormat('es-BO', {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  }).format(n)
}

/** "8.234.567" + "SC" → "8.234.567 SC" */
export function formatCi(ci: string, departamento: string): string {
  return `${ci} ${departamento}`
}

/** "Carlos Mendoza Vargas" → "CM" */
export function iniciales(nombre: string): string {
  return nombre
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
}
