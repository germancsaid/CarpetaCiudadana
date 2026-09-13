import { FolderOpen, CheckCircle2, Link2, Clock } from 'lucide-react'
import { Card } from '@/shared/ui'

interface Props { documentos: number; completados: number; tokensActivos: number; diasAhorrados: number }

export function Stats({ documentos, completados, tokensActivos, diasAhorrados }: Props) {
  const items = [
    { etiqueta: 'Documentos en tu carpeta', valor: documentos, icono: FolderOpen, color: 'bg-success-light text-success-text' },
    { etiqueta: 'Trámites completados', valor: completados, icono: CheckCircle2, color: 'bg-accent-light text-accent-text' },
    { etiqueta: 'Tokens activos', valor: tokensActivos, icono: Link2, color: 'bg-warning-light text-warning-text' },
    { etiqueta: 'Días promedio ahorrados', valor: diasAhorrados, icono: Clock, color: 'bg-purple-100 text-purple-700' },
  ]
  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map(({ etiqueta, valor, icono: Icono, color }) => (
        <Card key={etiqueta} className="p-5">
          <div className={`mb-3 flex size-9 items-center justify-center rounded-control ${color}`}><Icono size={18} /></div>
          <div className="text-3xl font-semibold text-ink">{valor}</div>
          <div className="text-sm text-ink-muted">{etiqueta}</div>
        </Card>
      ))}
    </div>
  )
}
