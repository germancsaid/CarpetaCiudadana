import { Scale, KeyRound, Wallet, Landmark, Coins, CheckCircle2, ArrowRight } from 'lucide-react'
import { Card } from '@/shared/ui'

const NODOS = [
  { icono: Scale, titulo: 'Abogado genera', sub: 'Emisor certificado' },
  { icono: KeyRound, titulo: 'Token firmado', sub: 'Irrepudiable' },
  { icono: Wallet, titulo: 'Carpeta del vendedor', sub: 'Sólo el vínculo' },
  { icono: Landmark, titulo: 'Verificado por Alcaldía', sub: 'En tiempo real' },
  { icono: Coins, titulo: 'Hecho imponible', sub: 'Liquidación automática' },
  { icono: CheckCircle2, titulo: 'Traspaso aprobado', sub: 'Sin colas' },
]

export function FlujoToken() {
  return (
    <Card className="p-5">
      <h3 className="mb-4 font-semibold text-ink">Cadena de tokenización</h3>
      <ol className="flex flex-col gap-3 md:flex-row md:items-stretch">
        {NODOS.map(({ icono: Icono, titulo, sub }, i) => (
          <li key={titulo} className="flex flex-1 items-center gap-3 md:flex-col md:text-center">
            <div className="flex flex-1 items-center gap-3 rounded-card border border-border bg-page p-3 md:w-full md:flex-col md:justify-center">
              <div className={`flex size-9 shrink-0 items-center justify-center rounded-full ${i === NODOS.length - 1 ? 'bg-success text-white' : i === 4 ? 'bg-warning text-white' : 'bg-accent-light text-accent-text'}`}><Icono size={18} /></div>
              <div><div className="text-sm font-medium text-ink">{titulo}</div><div className="text-xs text-ink-muted">{sub}</div></div>
            </div>
            {i < NODOS.length - 1 && <ArrowRight size={16} className="shrink-0 rotate-90 text-ink-muted md:rotate-0" />}
          </li>
        ))}
      </ol>
    </Card>
  )
}
