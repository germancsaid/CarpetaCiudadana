import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  abierto: boolean
  titulo: string
  descripcion?: string
  onCerrar: () => void
  children: ReactNode
  pie?: ReactNode
}

/** Overlay oscuro + card centrada. Cierra con click en overlay, botón X o Escape. */
export function Modal({ abierto, titulo, descripcion, onCerrar, children, pie }: ModalProps) {
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
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
      onClick={onCerrar}
      role="presentation"
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-card bg-card shadow-lg"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border p-5">
          <div>
            <h2 className="text-lg font-semibold text-ink">{titulo}</h2>
            {descripcion && <p className="mt-1 text-sm text-ink-muted">{descripcion}</p>}
          </div>
          <button
            onClick={onCerrar}
            aria-label="Cerrar"
            className="rounded-control p-1 text-ink-muted transition hover:bg-page hover:text-ink"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-5">{children}</div>
        {pie && <div className="flex justify-end gap-2 border-t border-border p-5">{pie}</div>}
      </div>
    </div>
  )
}
