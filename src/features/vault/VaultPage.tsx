import { useEffect, useState } from 'react'
import { FolderOpen, Upload } from 'lucide-react'
import type { Documento, EstadoDocumento, Emisor } from '@/shared/types/domain'
import { vinculosRepo } from '@/services/vinculos'
import { Button, EmptyState, SkeletonCard } from '@/shared/ui'
import { useDocumentos } from './hooks/useDocumentos'
import { DocumentoCard } from './components/DocumentoCard'
import { SubirDocumentoModal } from './components/SubirDocumentoModal'
import { VerDocumentoModal } from './components/VerDocumentoModal'
import { EnviarAbogadoModal } from './components/EnviarAbogadoModal'

type Filtro = 'todos' | EstadoDocumento

const FILTROS: { id: Filtro; etiqueta: string }[] = [
  { id: 'todos', etiqueta: 'Todos' },
  { id: 'vigente', etiqueta: 'Vigentes' },
  { id: 'por_vencer', etiqueta: 'Por vencer' },
  { id: 'vencido', etiqueta: 'Vencidos' },
]

export function VaultPage() {
  const { datos, cargando, error, recargar } = useDocumentos()
  const [filtro, setFiltro] = useState<Filtro>('todos')
  const [subiendo, setSubiendo] = useState(false)
  const [viendo, setViendo] = useState<Documento | null>(null)
  const [enviando, setEnviando] = useState<Documento | null>(null)
  const [emisores, setEmisores] = useState<Emisor[]>([])
  const docs = datos ?? []
  const visibles = filtro === 'todos' ? docs : docs.filter((d) => d.estado === filtro)

  useEffect(() => {
    vinculosRepo.listarEmisores().then(setEmisores)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-accent-light px-3 py-1 text-sm font-medium text-accent-text">{docs.length} documentos</span>
          <div className="flex gap-1 rounded-control bg-card p-1 shadow-sm">
            {FILTROS.map((f) => (
              <button key={f.id} onClick={() => setFiltro(f.id)}
                      className={`min-h-9 rounded-control px-3 text-sm font-medium transition ${filtro === f.id ? 'bg-accent text-white' : 'text-ink-secondary hover:bg-page'}`}>
                {f.etiqueta}
              </button>
            ))}
          </div>
        </div>
        <Button iconoIzq={<Upload size={16} />} onClick={() => setSubiendo(true)}>Subir documento</Button>
      </div>

      {error && <div className="rounded-card bg-danger-light p-4 text-sm text-danger-text">{error}</div>}

      {cargando ? (
        <div className="grid gap-4 md:grid-cols-2"><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>
      ) : docs.length === 0 ? (
        <EmptyState icono={FolderOpen} titulo="No tenés documentos aún" descripcion="Subí tu primer documento y el OCR extrae los datos por vos."
                    accion={<Button iconoIzq={<Upload size={16} />} onClick={() => setSubiendo(true)}>Subir documento</Button>} />
      ) : visibles.length === 0 ? (
        <EmptyState icono={FolderOpen} titulo="Nada en este filtro" descripcion="No tenés documentos con ese estado." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {visibles.map((d) => <DocumentoCard key={d.id} doc={d} onVer={setViendo} onEnviar={setEnviando} />)}
        </div>
      )}

      <SubirDocumentoModal abierto={subiendo} onCerrar={() => setSubiendo(false)} onGuardado={recargar} />
      <VerDocumentoModal doc={viendo} onCerrar={() => setViendo(null)} />
      <EnviarAbogadoModal doc={enviando} emisores={emisores} onCerrar={() => setEnviando(null)} />
    </div>
  )
}
