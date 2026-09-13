import { useAsync } from '@/shared/hooks/useAsync'
import { useSuscripcion } from '@/shared/hooks/useSuscripcion'
import { tramitesRepo, pasoActual } from '@/services/tramites'
import { CIUDADANO_ACTUAL } from '@/services/ciudadanos'
import { SkeletonCard } from '@/shared/ui'
import { AntesDespues } from './components/AntesDespues'
import { Partes } from './components/Partes'
import { Timeline } from './components/Timeline'
import { InfoVehiculo } from './components/InfoVehiculo'
import { FlujoToken } from './components/FlujoToken'

export function VehiculoPage() {
  const { datos, cargando, recargar } = useAsync(async () =>
    (await tramitesRepo.listar(CIUDADANO_ACTUAL.id)).find((t) => t.tipo === 'traspaso_vehicular') ?? null)
  useSuscripcion(tramitesRepo.suscribir, recargar)
  const actual = datos ? pasoActual(datos) : undefined
  const estadoCompradora = datos?.estado === 'completado' ? 'Traspaso completado — ya es la titular' : actual ? `Vinculada al trámite — esperando paso ${actual.orden}` : 'Vinculada al trámite'

  return (
    <div className="space-y-8">
      <p className="text-sm text-ink-muted">El proceso completo digitalizado — sin colas, sin papel perdido.</p>
      <AntesDespues />
      <section><h2 className="mb-3 font-semibold text-ink">Las partes</h2><Partes estadoCompradora={estadoCompradora} /></section>
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section>
          <h2 className="mb-3 font-semibold text-ink">Estado del trámite en vivo</h2>
          {cargando ? <SkeletonCard /> : datos ? <Timeline pasos={datos.pasos} /> : <p className="text-sm text-ink-muted">No hay un traspaso en curso.</p>}
        </section>
        <section><h2 className="mb-3 font-semibold text-ink">El vehículo</h2><InfoVehiculo /></section>
      </div>
      <FlujoToken />
    </div>
  )
}
