import type { HechoImponible, TipoBien } from '@/shared/types/domain'

/**
 * Cálculo del hecho imponible por transferencia de bienes.
 * Ver docs/RECAUDACION.md — los valores son de demo, parametrizables por municipio.
 * Función PURA: no toca red ni estado. Testeable.
 */

export const TIPO_CAMBIO_BS = 6.96

interface ParametrosTributarios {
  alicuota: number
  arancelBs: number
}

export const PARAMETROS: Record<TipoBien, ParametrosTributarios> = {
  vehiculo: { alicuota: 0.03, arancelBs: 450 },
  inmueble: { alicuota: 0.03, arancelBs: 800 },
}

export interface EntradaCalculo {
  tipoBien: TipoBien
  /** Precio pactado entre las partes, en dólares */
  valorDeclaradoUsd: number
  /** Valor fiscal del bien (RUAT para vehículos, catastro para inmuebles), en bolivianos */
  valorBaseBs: number
}

export interface ResultadoCalculo {
  baseImponibleBs: number
  alicuota: number
  impuestoBs: number
  arancelBs: number
  totalBs: number
}

/**
 * La base imponible es el MAYOR entre el valor declarado y el valor fiscal.
 * Así se evita la subdeclaración: declarar menos no baja el impuesto por debajo del valor fiscal.
 */
export function calcularTributo({
  tipoBien,
  valorDeclaradoUsd,
  valorBaseBs,
}: EntradaCalculo): ResultadoCalculo {
  const { alicuota, arancelBs } = PARAMETROS[tipoBien]
  const declaradoBs = valorDeclaradoUsd * TIPO_CAMBIO_BS
  const baseImponibleBs = redondear(Math.max(declaradoBs, valorBaseBs))
  const impuestoBs = redondear(baseImponibleBs * alicuota)
  return {
    baseImponibleBs,
    alicuota,
    impuestoBs,
    arancelBs,
    totalBs: redondear(impuestoBs + arancelBs),
  }
}

export interface EntradaHechoImponible extends EntradaCalculo {
  tramiteId: string
  descripcionBien: string
  vendedorId: string
  compradorId: string
  municipio: string
}

/** Arma el hecho imponible completo, listo para persistir. */
export function construirHechoImponible(
  entrada: EntradaHechoImponible,
): Omit<HechoImponible, 'id'> {
  const calculo = calcularTributo(entrada)
  return {
    tramiteId: entrada.tramiteId,
    tipoBien: entrada.tipoBien,
    descripcionBien: entrada.descripcionBien,
    vendedorId: entrada.vendedorId,
    compradorId: entrada.compradorId,
    valorDeclaradoUsd: entrada.valorDeclaradoUsd,
    valorBaseBs: entrada.valorBaseBs,
    ...calculo,
    estado: 'liquidado',
    municipio: entrada.municipio,
    generadoEn: new Date().toISOString(),
    pagadoEn: null,
  }
}

function redondear(n: number): number {
  return Math.round(n * 100) / 100
}
