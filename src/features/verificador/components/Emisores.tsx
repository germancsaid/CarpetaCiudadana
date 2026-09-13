import { BadgeCheck, Building2 } from 'lucide-react'
import type { Emisor } from '@/shared/types/domain'
import { Card } from '@/shared/ui'

export function Emisores({ lista }: { lista: Emisor[] }) {
  return (
    <section>
      <h2 className="mb-3 font-semibold text-ink">Emisores certificados en Santa Cruz</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {lista.map((e) => (
          <Card key={e.id} className="flex items-center gap-3 p-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-control bg-page text-ink-secondary"><Building2 size={18} /></div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-ink">{e.nombre}</div>
              <div className="text-xs text-ink-muted">{e.tokensEmitidos} tokens emitidos · {e.certificadoPor}</div>
            </div>
            {e.certificado && <span className="inline-flex items-center gap-1 text-xs font-medium text-success-text"><BadgeCheck size={14} /> Certificado</span>}
          </Card>
        ))}
      </div>
    </section>
  )
}
