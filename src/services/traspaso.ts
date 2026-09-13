import type { HechoImponible, Tramite } from '@/shared/types/domain'
import { construirHechoImponible } from '@/shared/lib/tributos'
import { formatBs } from '@/shared/lib/format'
import { VEHICULO } from '@/mocks/datos'
import { ID } from '@/mocks/ids'
import { tramitesRepo } from './tramites'
import { hechosImponiblesRepo } from './hechosImponibles'
import { MUNICIPIO } from './ciudadanos'

/**
 * Orquestación del caso de uso "traspaso vehicular". Ver docs/RECAUDACION.md.
 * Vive en services porque cruza dos entidades (trámite + hecho imponible).
 * Las features llaman esto, no combinan repos a mano.
 */

export const ORDEN_PASO = {
  ruat: 1,
  libreGravamen: 2,
  contrato: 3,
  antecedentes: 4,
  firmaNotaria: 5,
  pagoArancel: 6,
} as const

/** Paso 4: simula la llegada del certificado de DIPROVE. */
export async function recibirCertificadoDiprove(t: Tramite): Promise<void> {
  const paso = t.pasos.find((p) => p.orden === ORDEN_PASO.antecedentes)
  if (!paso || paso.estado !== 'en_progreso') return
  await tramitesRepo.actualizarPaso(paso.id, { nota: 'Certificado recibido — sin antecedentes' })
  await tramitesRepo.completarPaso(paso.id)
}

/**
 * Paso 5: firma ante notaría. ESTE es el momento en que el municipio se entera:
 * se genera el hecho imponible y el paso 6 pasa a mostrar el monto liquidado real.
 */
export async function firmarAnteNotaria(t: Tramite): Promise<HechoImponible> {
  const pasoFirma = t.pasos.find((p) => p.orden === ORDEN_PASO.firmaNotaria)
  const pasoPago = t.pasos.find((p) => p.orden === ORDEN_PASO.pagoArancel)
  if (!pasoFirma || !pasoPago) throw new Error('El trámite no tiene los pasos esperados')

  const hecho = await hechosImponiblesRepo.crear(
    construirHechoImponible({
      tramiteId: t.id,
      tipoBien: 'vehiculo',
      descripcionBien: `${VEHICULO.marca} ${VEHICULO.modelo} ${VEHICULO.anio} — ${VEHICULO.placa}`,
      vendedorId: t.ciudadanoId,
      compradorId: ID.maria,
      valorDeclaradoUsd: VEHICULO.precioUsd,
      valorBaseBs: VEHICULO.valorFiscalBs,
      municipio: MUNICIPIO,
    }),
  )

  await tramitesRepo.vincularHechoImponible(t.id, hecho.id)
  await tramitesRepo.actualizarPaso(pasoPago.id, {
    montoBs: hecho.totalBs,
    nota: `Liquidado por la Alcaldía: impuesto ${formatBs(hecho.impuestoBs)} + arancel ${formatBs(hecho.arancelBs)}`,
  })
  await tramitesRepo.actualizarPaso(pasoFirma.id, { nota: 'Firmado digitalmente — Notaría N°14' })
  await tramitesRepo.completarPaso(pasoFirma.id)
  return hecho
}

/** Paso 6: el ciudadano paga desde la app. Cierra el trámite y marca el hecho como pagado. */
export async function pagarArancel(t: Tramite): Promise<void> {
  const paso = t.pasos.find((p) => p.orden === ORDEN_PASO.pagoArancel)
  if (!paso) return
  if (t.hechoImponibleId) await hechosImponiblesRepo.marcarPagado(t.hechoImponibleId)
  await tramitesRepo.actualizarPaso(paso.id, { nota: 'Pagado desde CarpetaCiudadana' })
  await tramitesRepo.completarPaso(paso.id)
}

/** Lado municipio: marcar pagado cierra también el paso 6 del ciudadano (para la demo de dos pantallas). */
export async function confirmarPagoDesdeMunicipio(hecho: HechoImponible): Promise<void> {
  await hechosImponiblesRepo.marcarPagado(hecho.id)
  const t = await tramitesRepo.obtener(hecho.tramiteId)
  const paso = t?.pasos.find((p) => p.orden === ORDEN_PASO.pagoArancel)
  if (paso && paso.estado !== 'completado') {
    await tramitesRepo.actualizarPaso(paso.id, { nota: 'Pago confirmado por la Alcaldía' })
    await tramitesRepo.completarPaso(paso.id)
  }
}
