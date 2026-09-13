import { CheckCircle2, Clock } from 'lucide-react'
import type { Tramite } from '@/shared/types/domain'
import { CARLOS, MARIA } from '@/mocks/datos'
import { iniciales } from '@/shared/lib/format'

/** Estado compacto de ambas partes del traspaso — para ver también el lado comprador, no sólo el propio. */
export function EstadoPartes({ tramite }: { tramite: Tramite }) {
  const actual = tramite.pasos.find((p) => p.estado === 'en_progreso')
  const completado = tramite.estado === 'completado'

  const Fila = ({ nombre, rol, estado, ok }: { nombre: string; rol: string; estado: string; ok: boolean }) => (
    <div className="flex flex-1 items-center gap-3 rounded-control bg-page p-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-white">{iniciales(nombre)}</div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-ink">{nombre}</div>
        <div className="text-xs text-ink-muted">{rol}</div>
      </div>
      <div className={`flex shrink-0 items-center gap-1 text-xs font-medium ${ok ? 'text-success-text' : 'text-accent-text'}`}>
        {ok ? <CheckCircle2 size={14} /> : <Clock size={14} />} {estado}
      </div>
    </div>
  )

  return (
    <div className="flex flex-col gap-2 border-b border-border bg-card-2 p-5 sm:flex-row">
      <Fila nombre={CARLOS.nombreCompleto} rol="Vendedor — vos" estado={completado ? 'Completó su parte' : 'En trámite'} ok={completado} />
      <Fila
        nombre={MARIA.nombreCompleto}
        rol="Compradora"
        estado={completado ? 'Confirmó la compra' : actual ? `Esperando el paso ${actual.orden}` : 'Al día'}
        ok={completado}
      />
    </div>
  )
}
