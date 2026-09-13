import { Fragment, useState } from 'react'
import { Clock, Coins, Landmark } from 'lucide-react'
import type { Tramite } from '@/shared/types/domain'
import { progreso, tramitesRepo } from '@/services/tramites'
import { firmarAnteNotaria, pagarArancel, recibirCertificadoDiprove, ORDEN_PASO } from '@/services/traspaso'
import { documentosRepo } from '@/services/documentos'
import { CIUDADANO_ACTUAL } from '@/services/ciudadanos'
import { CARLOS, MARIA, VEHICULO } from '@/mocks/datos'
import { esperar, DEMORA } from '@/shared/lib/simular'
import { formatBs } from '@/shared/lib/format'
import { Card, ProgressSegments } from '@/shared/ui'
import { PasoItem } from './PasoItem'
import { ValidacionQr } from './ValidacionQr'
import { EsperaContraparte } from './EsperaContraparte'
import { FirmaDigital } from './FirmaDigital'
import { PagoQrFlotante } from './PagoQrFlotante'
import { EstadoPartes } from './EstadoPartes'
import { FaceIdFinal } from './FaceIdFinal'

interface QuestActivoProps {
  tramite: Tramite
  onCambio: () => void
}

/** Fuente corta para el mensaje de "esperando validación de <fuente>". */
function fuenteCorta(fuente: string): string {
  if (fuente.includes('Abogados')) return 'el Consorcio de Abogados'
  if (fuente.includes('Notaría')) return 'la Notaría'
  return fuente
}

export function QuestActivo({ tramite, onCambio }: QuestActivoProps) {
  const [ocupado, setOcupado] = useState<number | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)
  const [contraparteOk, setContraparteOk] = useState<Record<string, boolean>>({})
  const [pagoConfirmado, setPagoConfirmado] = useState<Record<string, boolean>>({})
  const pct = progreso(tramite)
  const hechos = tramite.pasos.filter((p) => p.estado === 'completado').length
  const esTraspaso = tramite.tipo === 'traspaso_vehicular'

  async function ejecutar(orden: number, fn: () => Promise<unknown>, demora: number) {
    setOcupado(orden)
    setAviso(null)
    try {
      await esperar(demora)
      await fn()
      onCambio()
    } finally {
      setOcupado(null)
    }
  }

  /** Genera el archivo de compraventa firmado, con sello notarial digital, y lo guarda en la carpeta del vendedor. */
  async function generarContratoFirmado() {
    await documentosRepo.crear({
      ciudadanoId: CIUDADANO_ACTUAL.id,
      nombre: 'Contrato de Compraventa — Firmado',
      tipo: 'Notarial',
      icono: 'file-signature',
      estado: 'vigente',
      emitidoEn: new Date().toISOString(),
      venceEn: null,
      camposOcr: {
        Vendedor: CARLOS.nombreCompleto,
        Compradora: MARIA.nombreCompleto,
        Bien: `${VEHICULO.marca} ${VEHICULO.modelo} ${VEHICULO.anio} — ${VEHICULO.placa}`,
        Precio: `USD ${VEHICULO.precioUsd.toLocaleString('es-BO')}`,
      },
    })
  }

  const accionesTraspaso = (orden: number) => {
    if (!esTraspaso) return {}
    if (orden === ORDEN_PASO.antecedentes)
      return {
        accion: { etiqueta: 'Simular llegada del certificado', cargando: ocupado === orden,
          onClick: () => ejecutar(orden, () => recibirCertificadoDiprove(tramite), DEMORA.verificacion) },
        enlace: { etiqueta: 'Ver estado en DIPROVE', href: 'https://www.diprove.gob.bo' },
      }
    // Libre Gravamen, Contrato, Firma ante Notaría y Pago del arancel se
    // resuelven con los paneles de abajo (espera de contraparte, firma o
    // QR) en vez de un botón simple — no devuelven `accion`.
    return {}
  }

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-border p-5">
        <div className="text-xs font-medium tracking-wide text-accent-text uppercase">Trámite activo</div>
        <h2 className="mt-1 text-xl font-semibold text-ink">{tramite.titulo}</h2>
        <p className="text-sm text-ink-muted">{tramite.subtitulo}</p>

        <div className="mt-4 flex items-baseline justify-between text-sm">
          <span className="font-medium text-ink">{hechos} de {tramite.pasos.length} pasos completados</span>
          <span className="font-semibold text-ink">{pct}%</span>
        </div>
        <ProgressSegments segmentos={tramite.pasos.map((p) => ({ estado: p.estado }))} />

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-ink-secondary">
          <span className="inline-flex items-center gap-1.5"><Clock size={15} className="text-ink-muted" />{tramite.tiempoEstimado}</span>
          <span className="inline-flex items-center gap-1.5"><Coins size={15} className="text-ink-muted" />{formatBs(tramite.costoEstimadoBs)} total estimado</span>
        </div>
      </div>

      {esTraspaso && <EstadoPartes tramite={tramite} />}

      {aviso && (
        <div className="flex items-start gap-3 border-b border-border bg-success-light px-5 py-3 text-sm text-success-text">
          <Landmark size={16} className="mt-0.5 shrink-0" />{aviso}
        </div>
      )}

      <ol className="space-y-3 p-5">
        {tramite.pasos.map((p) => {
          const enProgreso = p.estado === 'en_progreso'
          const necesitaContraparte = esTraspaso && enProgreso && (p.orden === ORDEN_PASO.libreGravamen || p.orden === ORDEN_PASO.contrato)
          const contraparteLista = !necesitaContraparte || contraparteOk[p.id]

          return (
            <Fragment key={p.id}>
              <PasoItem paso={p} {...accionesTraspaso(p.orden)} />

              {esTraspaso && enProgreso && necesitaContraparte && !contraparteLista && (
                <li className="list-none pl-12">
                  <EsperaContraparte fuente={fuenteCorta(p.fuente)} onOk={() => setContraparteOk((s) => ({ ...s, [p.id]: true }))} />
                </li>
              )}

              {esTraspaso && enProgreso && contraparteLista && (p.orden === ORDEN_PASO.libreGravamen || p.orden === ORDEN_PASO.contrato) && (
                <li className="list-none pl-12">
                  <ValidacionQr
                    valor={`CARPETACIUDADANA|TRAMITE|${tramite.id}|PASO:${p.id}`}
                    etiqueta={p.orden === ORDEN_PASO.libreGravamen ? 'Escaneá para verificar el vínculo tokenizado' : 'Escaneá para confirmar la firma del contrato'}
                    onValidado={() => ejecutar(p.orden, () => tramitesRepo.completarPaso(p.id), 0)}
                  />
                </li>
              )}

              {esTraspaso && enProgreso && p.orden === ORDEN_PASO.firmaNotaria && (
                <li className="list-none pl-12">
                  <FirmaDigital
                    onConfirmada={() => ejecutar(p.orden, async () => {
                      const h = await firmarAnteNotaria(tramite)
                      await generarContratoFirmado()
                      setAviso(`La Alcaldía liquidó el arancel de traspaso: ${formatBs(h.totalBs)}. Ya aparece en el panel de Recaudación, y el contrato firmado quedó en Mi Carpeta.`)
                    }, 0)}
                  />
                </li>
              )}

              {esTraspaso && enProgreso && p.orden === ORDEN_PASO.pagoArancel && !pagoConfirmado[p.id] && (
                <li className="list-none pl-12">
                  <PagoQrFlotante
                    valor={`CARPETACIUDADANA|TRAMITE|${tramite.id}|PASO:${p.id}|TOTAL_BS:${p.montoBs ?? tramite.costoEstimadoBs}`}
                    montoBs={p.montoBs ?? tramite.costoEstimadoBs}
                    onPagoRecibido={() => setPagoConfirmado((s) => ({ ...s, [p.id]: true }))}
                  />
                </li>
              )}

              {esTraspaso && enProgreso && p.orden === ORDEN_PASO.pagoArancel && pagoConfirmado[p.id] && (
                <li className="list-none pl-12">
                  <FaceIdFinal onEnviado={() => ejecutar(p.orden, () => pagarArancel(tramite), 0)} />
                </li>
              )}
            </Fragment>
          )
        })}
      </ol>
    </Card>
  )
}
