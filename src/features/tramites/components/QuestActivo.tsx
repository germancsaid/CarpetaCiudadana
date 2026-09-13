import { useState } from 'react'
import { Clock, Coins, Landmark } from 'lucide-react'
import type { Tramite } from '@/shared/types/domain'
import { progreso } from '@/services/tramites'
import { firmarAnteNotaria, pagarArancel, recibirCertificadoDiprove, ORDEN_PASO } from '@/services/traspaso'
import { esperar, DEMORA } from '@/shared/lib/simular'
import { formatBs } from '@/shared/lib/format'
import { Card, ProgressSegments } from '@/shared/ui'
import { PasoItem } from './PasoItem'

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
    if (orden === ORDEN_PASO.firmaNotaria)
      return {
        accion: { etiqueta: 'Firmar digitalmente', cargando: ocupado === orden,
          onClick: () => ejecutar(orden, async () => {
            const h = await firmarAnteNotaria(tramite)
            setAviso(`La Alcaldía liquidó el arancel de traspaso: ${formatBs(h.totalBs)}. Ya aparece en el panel de Recaudación.`)
          }, DEMORA.verificacion) },
      }
    if (orden === ORDEN_PASO.pagoArancel)
      return {
        accion: { etiqueta: 'Pagar ahora', cargando: ocupado === orden,
          onClick: () => ejecutar(orden, () => pagarArancel(tramite), DEMORA.verificacion) },
      }
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

      {aviso && (
        <div className="flex items-start gap-3 border-b border-border bg-success-light px-5 py-3 text-sm text-success-text">
          <Landmark size={16} className="mt-0.5 shrink-0" />{aviso}
        </div>
      )}

      <ol className="space-y-3 p-5">
        {tramite.pasos.map((p) => (
          <PasoItem key={p.id} paso={p} {...accionesTraspaso(p.orden)} />
        ))}
      </ol>
    </Card>
  )
}
