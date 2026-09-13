import { X, Check } from 'lucide-react'
import { Card } from '@/shared/ui'

const ANTES = ['4 a 7 visitas a oficinas diferentes', '15–30 días hábiles', 'Documentos físicos que se pierden', 'Sin visibilidad del estado', 'El municipio se entera si el ciudadano declara']
const DESPUES = ['Todo desde el celular', '2–4 días hábiles', 'Documentos tokenizados e irrepudiables', 'Progreso visible en tiempo real', 'El municipio recauda automáticamente al firmar']

export function AntesDespues() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="border-danger/20 bg-danger-light p-5">
        <div className="mb-3 text-xs font-semibold tracking-wide text-danger-text uppercase">Antes</div>
        <ul className="space-y-2 text-sm text-ink-secondary">
          {ANTES.map((t) => <li key={t} className="flex items-start gap-2"><X size={16} className="mt-0.5 shrink-0 text-danger" />{t}</li>)}
        </ul>
      </Card>
      <Card className="border-success/20 bg-success-light p-5">
        <div className="mb-3 text-xs font-semibold tracking-wide text-success-text uppercase">Después, con CarpetaCiudadana</div>
        <ul className="space-y-2 text-sm text-ink-secondary">
          {DESPUES.map((t) => <li key={t} className="flex items-start gap-2"><Check size={16} className="mt-0.5 shrink-0 text-success" />{t}</li>)}
        </ul>
      </Card>
    </div>
  )
}
