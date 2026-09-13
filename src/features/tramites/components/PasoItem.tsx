import { Check, Lock, Loader2, ExternalLink } from 'lucide-react'
import type { PasoTramite } from '@/shared/types/domain'
import { formatBs } from '@/shared/lib/format'
import { haceCuanto } from '@/shared/lib/tiempo'
import { Button } from '@/shared/ui'

interface PasoItemProps {
  paso: PasoTramite
  /** Acción principal del paso en progreso (ej. "Firmar ante Notaría"). */
  accion?: { etiqueta: string; onClick: () => void; cargando?: boolean }
  /** Enlace secundario (ej. "Ver estado en DIPROVE →"). */
  enlace?: { etiqueta: string; href: string }
}

const ESTILO = {
  completado: { circulo: 'bg-success text-white', borde: 'border-border', fondo: 'bg-card' },
  en_progreso: { circulo: 'bg-accent text-white', borde: 'border-accent', fondo: 'bg-accent-light/40' },
  bloqueado: { circulo: 'bg-border text-ink-muted', borde: 'border-border', fondo: 'bg-page' },
  pendiente: { circulo: 'bg-border text-ink-muted', borde: 'border-border', fondo: 'bg-page' },
}

export function PasoItem({ paso, accion, enlace }: PasoItemProps) {
  const e = ESTILO[paso.estado]
  const bloqueado = paso.estado === 'bloqueado' || paso.estado === 'pendiente'
  return (
    <li className={`flex gap-4 rounded-card border p-4 transition ${e.borde} ${e.fondo} ${bloqueado ? 'opacity-70' : ''}`}>
      <div className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${e.circulo}`}>
        {paso.estado === 'completado' ? <Check size={16} strokeWidth={3} /> :
         paso.estado === 'en_progreso' ? <Loader2 size={16} className="animate-spin" /> :
         <Lock size={14} />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <div className="font-medium text-ink">
            <span className="mr-1.5 text-ink-muted">{paso.orden}.</span>{paso.nombre}
          </div>
          {paso.montoBs != null && (
            <span className="text-sm font-semibold text-ink">{formatBs(paso.montoBs)}</span>
          )}
        </div>
        <div className="mt-0.5 text-xs text-ink-muted">{paso.fuente}</div>
        <div className="mt-1.5 text-sm text-ink-secondary">{paso.nota}</div>
        {paso.completadoEn && (
          <div className="mt-1 text-xs text-success-text">Completado {haceCuanto(paso.completadoEn)}</div>
        )}
        {(accion || enlace) && paso.estado === 'en_progreso' && (
          <div className="mt-3 flex flex-wrap gap-2">
            {accion && (
              <Button tamano="sm" onClick={accion.onClick} cargando={accion.cargando}>{accion.etiqueta}</Button>
            )}
            {enlace && (
              <a href={enlace.href} target="_blank" rel="noreferrer"
                 className="inline-flex min-h-9 items-center gap-1.5 rounded-control px-3 text-sm font-medium text-accent-text hover:bg-accent-light">
                {enlace.etiqueta} <ExternalLink size={14} />
              </a>
            )}
          </div>
        )}
      </div>
    </li>
  )
}
