import { Landmark } from 'lucide-react'
import { SkeletonCard } from '@/shared/ui'
import { useVerificaciones } from './hooks/useVerificaciones'
import { FormVerificar } from './components/FormVerificar'
import { TablaVerificaciones } from './components/TablaVerificaciones'
import { Emisores } from './components/Emisores'

export function VerificadorPage() {
  const { datos, cargando, error, recargar } = useVerificaciones()
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-muted">Verificación de documentos tokenizados en tiempo real.</p>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-sidebar px-3 py-1 text-xs font-medium text-white">
          <Landmark size={12} /> Alcaldía Municipal Santa Cruz de la Sierra
        </span>
      </div>
      {error && <div className="rounded-card bg-danger-light p-4 text-sm text-danger-text">{error}</div>}
      <FormVerificar emisores={datos?.emisores ?? []} onRegistrado={recargar} />
      {cargando && !datos ? <SkeletonCard /> : datos && (
        <>
          <TablaVerificaciones lista={datos.verificaciones} />
          <Emisores lista={datos.emisores} />
        </>
      )}
    </div>
  )
}
