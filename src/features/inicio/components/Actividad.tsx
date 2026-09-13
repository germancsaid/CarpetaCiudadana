import { FileText, Link2, ClipboardList, ShieldCheck, Coins, type LucideIcon } from 'lucide-react'
import type { Actividad as Act } from '@/shared/types/domain'
import { haceCuanto } from '@/shared/lib/tiempo'
import { Card, CardHeader } from '@/shared/ui'

const ICONO: Record<Act['tipo'], { I: LucideIcon; clases: string }> = {
  documento: { I: FileText, clases: 'bg-accent-light text-accent-text' },
  vinculo: { I: Link2, clases: 'bg-success-light text-success-text' },
  tramite: { I: ClipboardList, clases: 'bg-warning-light text-warning-text' },
  verificacion: { I: ShieldCheck, clases: 'bg-success-light text-success-text' },
  recaudacion: { I: Coins, clases: 'bg-purple-100 text-purple-700' },
}

export function Actividad({ lista }: { lista: Act[] }) {
  return (
    <Card>
      <CardHeader titulo="Actividad reciente" />
      <ul>
        {lista.map((a) => {
          const { I, clases } = ICONO[a.tipo]
          return (
            <li key={a.id} className="flex items-center gap-3 border-b border-border px-5 py-3 last:border-0">
              <div className={`flex size-8 shrink-0 items-center justify-center rounded-full ${clases}`}><I size={15} /></div>
              <div className="min-w-0 flex-1 truncate text-sm text-ink">{a.descripcion}</div>
              <div className="shrink-0 text-xs text-ink-muted">{haceCuanto(a.ocurridoEn)}</div>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
