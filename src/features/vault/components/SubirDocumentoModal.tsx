import { useRef, useState, type DragEvent } from 'react'
import { UploadCloud, ScanLine, FileCheck2 } from 'lucide-react'
import type { Documento } from '@/shared/types/domain'
import { documentosRepo } from '@/services/documentos'
import { CIUDADANO_ACTUAL } from '@/services/ciudadanos'
import { esperar, DEMORA, ocrSimulado } from '@/shared/lib/simular'
import { Button, Campo, Input, Modal, Spinner } from '@/shared/ui'

type Fase = 'esperando' | 'subiendo' | 'ocr' | 'preview'

interface Props {
  abierto: boolean
  onCerrar: () => void
  onGuardado: (d: Documento) => void
}

const MAX_MB = 10
const FORMATOS = ['application/pdf', 'image/jpeg', 'image/png']

export function SubirDocumentoModal({ abierto, onCerrar, onGuardado }: Props) {
  const [fase, setFase] = useState<Fase>('esperando')
  const [archivo, setArchivo] = useState<string>('')
  const [campos, setCampos] = useState<Record<string, string>>({})
  const [nombre, setNombre] = useState('')
  const [errorNombre, setErrorNombre] = useState<string | undefined>()
  const [errorArchivo, setErrorArchivo] = useState<string | undefined>()
  const [guardando, setGuardando] = useState(false)
  const [arrastrando, setArrastrando] = useState(false)
  const input = useRef<HTMLInputElement>(null)

  function reiniciar() {
    setFase('esperando'); setArchivo(''); setCampos({}); setNombre('')
    setErrorNombre(undefined); setErrorArchivo(undefined); setArrastrando(false)
  }
  function cerrar() { reiniciar(); onCerrar() }

  async function procesar(f: File) {
    if (!FORMATOS.includes(f.type)) return setErrorArchivo('Formato no permitido. Subí un PDF, JPG o PNG.')
    if (f.size > MAX_MB * 1024 * 1024) return setErrorArchivo(`El archivo supera los ${MAX_MB} MB.`)
    setErrorArchivo(undefined)
    setArchivo(f.name)
    setFase('subiendo')
    await esperar(DEMORA.subida)
    setFase('ocr')
    await esperar(DEMORA.ocr)
    const extraido = ocrSimulado()
    setCampos(extraido)
    setNombre(extraido.Documento ?? f.name.replace(/\.[^.]+$/, ''))
    setFase('preview')
  }

  function alSoltar(e: DragEvent) {
    e.preventDefault(); setArrastrando(false)
    const f = e.dataTransfer.files[0]
    if (f) void procesar(f)
  }

  async function guardar() {
    if (nombre.trim().length < 3) return setErrorNombre('Poné un nombre de al menos 3 caracteres.')
    setGuardando(true)
    try {
      const { Documento: _omitido, ...ocr } = campos
      const hoy = new Date().toISOString()
      const doc = await documentosRepo.crear({
        ciudadanoId: CIUDADANO_ACTUAL.id, nombre: nombre.trim(), tipo: 'Subido por el ciudadano',
        icono: 'file-text', estado: 'vigente', emitidoEn: hoy, venceEn: null, camposOcr: ocr,
      })
      onGuardado(doc); cerrar()
    } finally { setGuardando(false) }
  }

  return (
    <Modal abierto={abierto} onCerrar={cerrar} titulo="Subir documento" descripcion="PDF, JPG, PNG — máx. 10 MB"
           pie={fase === 'preview' ? (
             <>
               <Button variante="secundario" onClick={reiniciar}>Subir otro</Button>
               <Button onClick={guardar} cargando={guardando}>Guardar en mi carpeta</Button>
             </>
           ) : undefined}>
      {fase === 'esperando' && (
        <>
          <div onDragOver={(e) => { e.preventDefault(); setArrastrando(true) }} onDragLeave={() => setArrastrando(false)} onDrop={alSoltar}
               onClick={() => input.current?.click()} role="button" tabIndex={0}
               className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-card border-2 border-dashed p-10 text-center transition ${arrastrando ? 'border-accent bg-accent-light' : 'border-border bg-page hover:border-accent/50'}`}>
            <UploadCloud size={32} className="text-accent" />
            <div className="font-medium text-ink">Arrastrá tu documento acá o hacé click para subir</div>
            <div className="text-xs text-ink-muted">PDF, JPG, PNG — máx. 10 MB</div>
          </div>
          <input ref={input} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
                 onChange={(e) => { const f = e.target.files?.[0]; if (f) void procesar(f) }} />
          {errorArchivo && <p className="mt-2 text-sm text-danger">{errorArchivo}</p>}
        </>
      )}

      {(fase === 'subiendo' || fase === 'ocr') && (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          {fase === 'subiendo' ? <Spinner className="size-8 text-accent" /> : (
            <div className="relative flex size-20 items-center justify-center overflow-hidden rounded-card border border-border bg-page">
              <ScanLine size={36} className="text-ink-muted" />
              <div className="absolute inset-x-0 h-0.5 animate-[escaneo_1s_ease-in-out_infinite] bg-accent shadow-[0_0_8px_var(--color-accent)]" />
            </div>
          )}
          <div className="text-sm font-medium text-ink">{fase === 'subiendo' ? 'Subiendo…' : 'OCR en proceso…'}</div>
          <div className="text-xs text-ink-muted">{archivo}</div>
          <style>{`@keyframes escaneo { 0% { top: 0 } 50% { top: calc(100% - 2px) } 100% { top: 0 } }`}</style>
        </div>
      )}

      {fase === 'preview' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 rounded-card bg-success-light p-3 text-sm text-success-text">
            <FileCheck2 size={16} /> OCR completado — revisá los campos antes de guardar
          </div>
          <Campo etiqueta="Nombre del documento" requerido error={errorNombre}>
            <Input value={nombre} onChange={(e) => setNombre(e.target.value)} error={!!errorNombre} />
          </Campo>
          <dl className="divide-y divide-border rounded-card border border-border">
            {Object.entries(campos).filter(([k]) => k !== 'Documento').map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 px-4 py-2.5 text-sm">
                <dt className="text-ink-muted">{k}</dt><dd className="font-medium text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </Modal>
  )
}
