import { useState } from 'react'
import { Link2, Plus, Info, ShieldCheck } from 'lucide-react'
import { Button, EmptyState, SkeletonCard } from '@/shared/ui'
import { useVinculos } from './hooks/useVinculos'
import { VinculoCard } from './components/VinculoCard'
import { AgregarVinculoModal } from './components/AgregarVinculoModal'

export function VinculosPage() {
  const { datos, cargando, error, recargar } = useVinculos()
  const [agregando, setAgregando] = useState(false)
  const vinculos = datos?.vinculos ?? []

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="max-w-xl text-sm text-ink-secondary" title="Links firmados digitalmente por emisores certificados. El documento vive en la fuente — vos solo tenés el vínculo.">
          <Info size={14} className="mr-1 inline text-ink-muted" />
          Links firmados digitalmente por emisores certificados. El documento vive en la fuente — vos solo tenés el vínculo.
        </p>
        <Button iconoIzq={<Plus size={16} />} onClick={() => setAgregando(true)}>Agregar vínculo</Button>
      </div>

      <div className="flex items-start gap-3 rounded-card border border-accent/20 bg-accent-light p-4 text-sm text-accent-text">
        <ShieldCheck size={18} className="mt-0.5 shrink-0" />
        Los vínculos tokenizados son generados por organizaciones certificadas por la Alcaldía o la Gobernación. No podés falsificarlos ni alterarlos.
      </div>

      {error && <div className="rounded-card bg-danger-light p-4 text-sm text-danger-text">{error}</div>}

      {cargando ? (
        <div className="space-y-4"><SkeletonCard /><SkeletonCard /></div>
      ) : vinculos.length === 0 ? (
        <EmptyState icono={Link2} titulo="No tenés vínculos" descripcion="Pedile a tu abogado o notaría que genere uno y agregalo acá con su token."
                    accion={<Button iconoIzq={<Plus size={16} />} onClick={() => setAgregando(true)}>Agregar vínculo</Button>} />
      ) : (
        <div className="space-y-4">
          {vinculos.map((v) => <VinculoCard key={v.id} vinculo={v} emisor={datos?.emisorDe(v.emisorId)} onVerificado={recargar} />)}
        </div>
      )}

      <AgregarVinculoModal abierto={agregando} emisores={datos?.emisores ?? []} onCerrar={() => setAgregando(false)} onAgregado={recargar} />
    </div>
  )
}
