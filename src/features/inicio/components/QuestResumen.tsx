import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Tramite } from '@/shared/types/domain'
import { progreso } from '@/services/tramites'
import { ROUTES } from '@/app/routes'
import { Card, ProgressBar } from '@/shared/ui'

export function QuestResumen({ tramite }: { tramite: Tramite }) {
  const hechos = tramite.pasos.filter((p) => p.estado === 'completado').length
  return (
    <Card className="p-5">
      <div className="text-xs font-medium tracking-wide text-accent-text uppercase">Trámite activo</div>
      <div className="mt-1 text-lg font-semibold text-ink">{tramite.titulo} — {tramite.subtitulo.split(' — ')[0]}</div>
      <ProgressBar valor={progreso(tramite)} className="mt-4" />
      <div className="mt-2 flex items-center justify-between text-sm">
        <span className="text-ink-secondary">{hechos} de {tramite.pasos.length} pasos completados</span>
        <Link to={ROUTES.tramites} className="inline-flex min-h-11 items-center gap-1.5 rounded-control bg-accent px-4 text-sm font-medium text-white transition hover:bg-accent/90">
          Continuar trámite <ArrowRight size={16} />
        </Link>
      </div>
    </Card>
  )
}
