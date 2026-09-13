import { Fragment, useState } from 'react'
import { Clock, Coins, Landmark } from 'lucide-react'
import type { Tramite } from '@/shared/types/domain'
import { progreso, tramitesRepo } from '@/services/tramites'
import { firmarAnteNotaria, pagarArancel, recibirCertificadoDiprove, ORDEN_PASO } from '@/services/traspaso'
import { esperar, DEMORA } from '@/shared/lib/simular'
import { formatBs } from '@/shared/lib/format'
import { Card, ProgressSegments } from '@/shared/ui'
import { PasoItem } from './PasoItem'
import { ValidacionQr } from './ValidacionQr'

interface QuestActivoProps {
  tramite: Tramite
  onCambio: () => void
}

export function QuestActivo({ tramite, onCambio }: QuestActivoProps) {
  const [ocupado, setOcupado] = useState<number | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)
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

  const accionesTraspaso = (orden: number) => {
    if (!esTraspaso) return {}
    if (orden === ORDEN_PASO.antecedentes)
      return {
        accion: { etiqueta: 'Simular llegada del certificado', cargando: ocupado === orden,
          onClick: () => ejecutar(orden, () => recibirCertificadoDiprove(tramite), DEMORA.verificacion) },
        enlace: { etiqueta: 'Ver estado en DIPROVE', href: 'https://www.diprove.gob.bo' },
      }
    // Libre Gravamen, Contrato, Firma ante Notaría y Pago del arancel usan el
    // flujo con QR + check (ver ValidacionQr más abajo) en vez de un botón
    // simple — no devuelven `accion` para que PasoItem no dibuje uno.
    return {}
  }

  /** Config del paso que, si está en progreso, se resuelve con QR + check en vez de un botón. */
  function pasoConQr(p: Tramite['pasos'][number]): { etiqueta: string; onValidado: () => Promise<void> } | null {
    if (!esTraspaso) return null
    if (p.orden === ORDEN_PASO.libreGravamen)
      return { etiqueta: 'Escaneá para verificar el vínculo tokenizado', onValidado: () => ejecutar(p.orden, () => tramitesRepo.completarPaso(p.id), 0) }
    if (p.orden === ORDEN_PASO.contrato)
      return { etiqueta: 'Escaneá para confirmar la firma del contrato', onValidado: () => ejecutar(p.orden, () => tramitesRepo.completarPaso(p.id), 0) }
    if (p.orden === ORDEN_PASO.firmaNotaria)
      return {
        etiqueta: 'Escaneá para firmar digitalmente ante Notaría',
        onValidado: () => ejecutar(p.orden, async () => {
          const h = await firmarAnteNotaria(tramite)
          setAviso(`La Alcaldía liquidó el arancel de traspaso: ${formatBs(h.totalBs)}. Ya aparece en el panel de Recaudación.`)
        }, 0),
      }
    if (p.orden === ORDEN_PASO.pagoArancel)
      return { etiqueta: 'Escaneá para pagar el arancel', onValidado: () => ejecutar(p.orden, () => pagarArancel(tramite), 0) }
    return null
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

      {aviso && (
        <div className="flex items-start gap-3 border-b border-border bg-success-light px-5 py-3 text-sm text-success-text">
          <Landmark size={16} className="mt-0.5 shrink-0" />{aviso}
        </div>
      )}

      <ol className="space-y-3 p-5">
        {tramite.pasos.map((p) => {
          const qr = p.estado === 'en_progreso' ? pasoConQr(p) : null
          return (
            <Fragment key={p.id}>
              <PasoItem paso={p} {...accionesTraspaso(p.orden)} />
              {qr && (
                <li className="list-none pl-12">
                  <ValidacionQr
                    valor={`CARPETACIUDADANA|TRAMITE|${tramite.id}|PASO:${p.id}|TOTAL_BS:${p.montoBs ?? tramite.costoEstimadoBs}`}
                    montoBs={p.montoBs}
                    etiqueta={qr.etiqueta}
                    onValidado={qr.onValidado}
                  />
                </li>
              )}
            </Fragment>
          )
        })}
      </ol>
    </Card>
  )
}
