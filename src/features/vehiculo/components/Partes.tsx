import { Check } from 'lucide-react'
import { CARLOS, MARIA } from '@/mocks/datos'
import { iniciales, formatCi } from '@/shared/lib/format'
import { Card } from '@/shared/ui'
import type { Ciudadano } from '@/shared/types/domain'

function Parte({ rol, persona, estado, docs, tokens }: { rol: string; persona: Ciudadano; estado?: string; docs: string[]; tokens?: string[] }) {
  const Lista = ({ titulo, items }: { titulo: string; items: string[] }) => (
    <div>
      <div className="mb-1 text-xs text-ink-muted">{titulo}</div>
      <ul className="flex flex-wrap gap-1.5">
        {items.map((i) => <li key={i} className="inline-flex items-center gap-1 rounded-full bg-success-light px-2.5 py-1 text-xs font-medium text-success-text"><Check size={12} strokeWidth={3} />{i}</li>)}
      </ul>
    </div>
  )
  return (
    <Card className="p-5">
      <div className="text-xs font-semibold tracking-wide text-ink-muted uppercase">{rol}</div>
      <div className="mt-2 flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">{iniciales(persona.nombreCompleto)}</div>
        <div>
          <div className="font-semibold text-ink">{persona.nombreCompleto}</div>
          <div className="text-xs text-ink-muted">CI {formatCi(persona.ci, persona.ciDepartamento)}</div>
        </div>
      </div>
      {estado && <div className="mt-3 rounded-control bg-accent-light px-3 py-2 text-xs text-accent-text">{estado}</div>}
      <div className="mt-4 space-y-3">
        <Lista titulo="Documentos disponibles en su carpeta" items={docs} />
        {tokens && <Lista titulo="Vínculos tokenizados" items={tokens} />}
      </div>
    </Card>
  )
}

export function Partes({ estadoCompradora }: { estadoCompradora: string }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Parte rol="Vendedor" persona={CARLOS} docs={['RUAT', 'Carnet de Identidad', 'Licencia de conducir']} tokens={['Libre gravamen', 'Contrato de compraventa']} />
      <Parte rol="Compradora" persona={MARIA} estado={estadoCompradora} docs={['Carnet de Identidad', 'NIT']} />
    </div>
  )
}
