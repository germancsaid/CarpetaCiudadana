import { Check, Lock, Loader2 } from 'lucide-react'
import type { PasoTramite } from '@/shared/types/domain'
import { formatBs } from '@/shared/lib/format'
import { haceCuanto } from '@/shared/lib/tiempo'
import { Card } from '@/shared/ui'

const PUNTO = {
  completado: 'bg-success text-white',
  en_progreso: 'bg-accent text-white ring-4 ring-accent/20',
  bloqueado: 'bg-border text-ink-muted',
  pendiente: 'bg-border text-ink-muted',
}

export function Timeline({ pasos }: { pasos: PasoTramite[] }) {
  return (
    <ol className="relative ml-4 border-l-2 border-border">
      {pasos.map((p) => (
        <li key={p.id} className="relative mb-6 pl-8 last:mb-0">
          <span className={`absolute -left-[15px] top-1 flex size-7 items-center justify-center rounded-full ${PUNTO[p.estado]}`}>
            {p.estado === 'completado' ? <Check size={14} strokeWidth={3} /> : p.estado === 'en_progreso' ? <Loader2 size={14} className="animate-spin" /> : <Lock size={12} />}
          </span>
          <Card className={`p-4 ${p.estado === 'en_progreso' ? 'border-accent' : ''} ${p.estado === 'bloqueado' ? 'opacity-70' : ''}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="font-medium text-ink">{p.nombre}</div>
              {p.montoBs != null && <span className="text-sm font-semibold">{formatBs(p.montoBs)}</span>}
            </div>
            <div className="text-xs text-ink-muted">{p.fuente}</div>
            <div className="mt-1 text-sm text-ink-secondary">{p.nota}</div>
            {p.completadoEn && <div className="mt-1 text-xs text-success-text">Completado {haceCuanto(p.completadoEn)}</div>}
          </Card>
        </li>
      ))}
    </ol>
  )
}
