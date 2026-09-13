import { useEffect, useRef, useState } from 'react'
import { Landmark, Coins, Radio } from 'lucide-react'
import type { HechoImponible } from '@/shared/types/domain'
import { EmptyState, SkeletonCard } from '@/shared/ui'
import { useHechosImponibles } from './hooks/useHechosImponibles'
import { Kpis } from './components/Kpis'
import { TablaHechos } from './components/TablaHechos'
import { DetalleHecho } from './components/DetalleHecho'

export function RecaudacionPage() {
  const { datos, cargando, error, recargar } = useHechosImponibles()
  const [detalle, setDetalle] = useState<HechoImponible | null>(null)
  const [reciente, setReciente] = useState<string | null>(null)
  const idsPrevios = useRef<Set<string> | null>(null)
  const hechos = datos ?? []

  // Resalta durante unos segundos la fila que acaba de aparecer por realtime.
  useEffect(() => {
    if (!datos) return
    if (idsPrevios.current) {
      const nuevo = datos.find((h) => !idsPrevios.current!.has(h.id))
      if (nuevo) {
        setReciente(nuevo.id)
        const t = setTimeout(() => setReciente(null), 6000)
        return () => clearTimeout(t)
      }
    }
    idsPrevios.current = new Set(datos.map((h) => h.id))
  }, [datos])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-ink-muted">Transferencias de vehículos e inmuebles notificadas automáticamente por CarpetaCiudadana.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success-light px-3 py-1 text-xs font-medium text-success-text">
            <Radio size={12} className="animate-pulse" /> En vivo
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sidebar px-3 py-1 text-xs font-medium text-white">
            <Landmark size={12} /> Alcaldía Municipal Santa Cruz de la Sierra
          </span>
        </div>
      </div>

      {error && <div className="rounded-card bg-danger-light p-4 text-sm text-danger-text">{error}</div>}

      {cargando && !datos ? (
        <><SkeletonCard /><SkeletonCard /></>
      ) : (
        <>
          <Kpis hechos={hechos} />
          {hechos.length === 0 ? (
            <EmptyState icono={Coins} titulo="Sin transferencias registradas todavía"
                        descripcion="Cuando un ciudadano firme un traspaso ante notaría, la liquidación aparece acá al instante." />
          ) : (
            <TablaHechos hechos={hechos} onVerDetalle={setDetalle} reciente={reciente} />
          )}
        </>
      )}

      <DetalleHecho hecho={detalle} onCerrar={() => setDetalle(null)} onCambio={recargar} />
    </div>
  )
}
