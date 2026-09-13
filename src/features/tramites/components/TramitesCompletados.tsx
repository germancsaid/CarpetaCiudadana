import { useState } from 'react'
import { ChevronDown, CheckCircle2 } from 'lucide-react'
import type { Tramite } from '@/shared/types/domain'
import { formatFecha } from '@/shared/lib/format'
import { Card } from '@/shared/ui'

export function TramitesCompletados({ lista }: { lista: Tramite[] }) {
  const [abierto, setAbierto] = useState(false)
  return (
    <Card>
      <button onClick={() => setAbierto((a) => !a)}
              className="flex w-full items-center justify-between p-5 text-left">
        <span className="font-semibold text-ink">Completados <span className="ml-1 text-ink-muted">({lista.length})</span></span>
        <ChevronDown size={18} className={`text-ink-muted transition ${abierto ? 'rotate-180' : ''}`} />
      </button>
      {abierto && (
        <ul className="border-t border-border">
          {lista.map((t) => (
            <li key={t.id} className="flex items-center gap-3 border-b border-border px-5 py-3 last:border-0">
              <CheckCircle2 size={18} className="shrink-0 text-success" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-ink">{t.titulo} — {t.subtitulo}</div>
              </div>
              <div className="text-xs text-ink-muted">Completado {formatFecha(t.completadoEn)}</div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
