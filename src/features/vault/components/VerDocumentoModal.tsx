import type { Documento } from '@/shared/types/domain'
import { formatFecha } from '@/shared/lib/format'
import { Badge, Modal } from '@/shared/ui'
import { DocumentoPreview } from './DocumentoPreview'

export function VerDocumentoModal({ doc, onCerrar }: { doc: Documento | null; onCerrar: () => void }) {
  if (!doc) return null
  return (
    <Modal abierto onCerrar={onCerrar} titulo={doc.nombre} descripcion={doc.tipo} tamano="lg">
      <DocumentoPreview doc={doc} />
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-ink-secondary">Emitido {formatFecha(doc.emitidoEn)} · Vence {doc.venceEn ? formatFecha(doc.venceEn) : 'nunca'}</span>
        <Badge estado={doc.estado} />
      </div>
      <dl className="mt-4 divide-y divide-border rounded-card border border-border">
        {Object.entries(doc.camposOcr).map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 px-4 py-2.5 text-sm">
            <dt className="text-ink-muted">{k}</dt>
            <dd className="text-right font-medium text-ink">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-xs text-ink-muted">Campos extraídos automáticamente por OCR al subir el documento.</p>
    </Modal>
  )
}
