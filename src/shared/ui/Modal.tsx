import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  abierto: boolean
  titulo: string
  descripcion?: string
  onCerrar: () => void
  children: ReactNode
  pie?: ReactNode
  /** 'md' formulario · 'lg' previsualización · 'full' pantalla completa (visor de documento) */
  tamano?: 'md' | 'lg' | 'full'
}

const ANCHO = { md: 'sm:max-w-lg', lg: 'sm:max-w-3xl', full: 'sm:max-w-5xl sm:h-[92vh]' }

/**
 * Sheet modal: entra desde abajo en mobile (como iOS), desde el centro con fade+scale en desktop.
 * Blur del contenido de fondo. Cierra con overlay, X o Escape.
 */
export function Modal({ abierto, titulo, descripcion, onCerrar, children, pie, tamano = 'md' }: ModalProps) {
  useEffect(() => {
    if (!abierto) return
    const alPresionar = (e: KeyboardEvent) => e.key === 'Escape' && onCerrar()
    document.addEventListener('keydown', alPresionar)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', alPresionar)
      document.body.style.overflow = ''
    }
  }, [abierto, onCerrar])

  if (!abierto) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xl animate-fundir sm:items-center sm:p-6"
      onClick={onCerrar}
      role="presentation"
    >
      <div
        className={`flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-sheet bg-card shadow-sheet animate-subir sm:rounded-sheet sm:animate-aparecer ${ANCHO[tamano]}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
      >
        <div className="mx-auto mt-2 h-1.5 w-10 shrink-0 rounded-full bg-border sm:hidden" aria-hidden />
        <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-3">
          <div className="min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-ink">{titulo}</h2>
            {descripcion && <p className="mt-1 text-sm text-ink-muted">{descripcion}</p>}
          </div>
          <button
            onClick={onCerrar}
            aria-label="Cerrar"
            className="presionable flex size-9 shrink-0 items-center justify-center rounded-full bg-card-2 text-ink-secondary hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-3">{children}</div>
        {pie && <div className="flex flex-wrap justify-end gap-2 px-6 pt-3 pb-6">{pie}</div>}
      </div>
    </div>
  )
}
