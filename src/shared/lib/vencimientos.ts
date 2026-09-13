import type { EstadoDocumento, EstadoVinculo } from '@/shared/types/domain'

/** Un documento/vínculo está "por vencer" si le quedan 30 días o menos. */
export const DIAS_POR_VENCER = 30

export function diasHasta(fechaIso: string | null): number | null {
  if (!fechaIso) return null
  const ms = new Date(fechaIso).getTime() - Date.now()
  return Math.ceil(ms / 86_400_000)
}

/** Deriva el estado a partir de la fecha. No persistir el resultado: recalcular al leer. */
export function estadoPorVencimiento(venceEn: string | null): EstadoDocumento {
  const dias = diasHasta(venceEn)
  if (dias === null) return 'vigente'
  if (dias < 0) return 'vencido'
  if (dias <= DIAS_POR_VENCER) return 'por_vencer'
  return 'vigente'
}

export function estadoVinculoPorVencimiento(venceEn: string): EstadoVinculo {
  const dias = diasHasta(venceEn)!
  if (dias < 0) return 'vencido'
  if (dias <= DIAS_POR_VENCER) return 'por_vencer'
  return 'activo'
}

/** "Vence en 8 días" · "Vencido hace 45 días" · "Sin vencimiento" */
export function textoVencimiento(venceEn: string | null): string {
  const dias = diasHasta(venceEn)
  if (dias === null) return 'Sin vencimiento'
  if (dias < 0) return `Vencido hace ${Math.abs(dias)} días`
  if (dias === 0) return 'Vence hoy'
  if (dias === 1) return 'Vence mañana'
  return `Vence en ${dias} días`
}
