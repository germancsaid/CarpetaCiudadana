import { Eye, Send, MoreVertical } from 'lucide-react'
import type { Documento } from '@/shared/types/domain'
import { formatFecha } from '@/shared/lib/format'
import { textoVencimiento } from '@/shared/lib/vencimientos'
import { Badge, Button, Card, Icono } from '@/shared/ui'

export function DocumentoCard({ doc, onVer, onEnviar }: { doc: Documento; onVer: (d: Documento) => void; onEnviar: (d: Documento) => void }) {
  return (
    <Card className="flex flex-col p-5">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-control bg-accent-light text-accent-text">
          <Icono nombre={doc.icono} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate font-semibold text-ink">{doc.nombre}</div>
          <div className="text-xs text-ink-muted">{doc.tipo}</div>
        </div>
        <Badge estado={doc.estado} />
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-secondary">
        <span>Emitido: <strong className="font-medium">{formatFecha(doc.emitidoEn)}</strong></span>
        <span>Vence: <strong className="font-medium">{doc.venceEn ? formatFecha(doc.venceEn) : 'Sin vencimiento'}</strong></span>
        {doc.estado === 'por_vencer' && <span className="text-warning-text">{textoVencimiento(doc.venceEn)}</span>}
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 rounded-control bg-page p-3 text-xs">
        {Object.entries(doc.camposOcr).slice(0, 4).map(([k, v]) => (
          <div key={k} className="min-w-0">
            <dt className="text-ink-muted">{k}</dt>
            <dd className="truncate font-medium text-ink">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 flex items-center gap-2">
        <Button tamano="sm" variante="secundario" iconoIzq={<Eye size={14} />} onClick={() => onVer(doc)}>Ver</Button>
        <Button tamano="sm" variante="secundario" iconoIzq={<Send size={14} />} onClick={() => onEnviar(doc)}>Enviar a un abogado</Button>
        <button aria-label="Más opciones" className="ml-auto flex size-9 items-center justify-center rounded-control text-ink-muted hover:bg-page">
          <MoreVertical size={16} />
        </button>
      </div>
    </Card>
  )
}
