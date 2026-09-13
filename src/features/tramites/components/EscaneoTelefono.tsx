import { FileText } from 'lucide-react'

/**
 * Mini-mockup de un celular escaneando un documento — el "ejemplo en vivo"
 * de qué vería la persona al escanear el QR. Puramente visual/simulado:
 * marco del teléfono + documento + línea de escaneo animada.
 */
export function EscaneoTelefono() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex h-40 w-24 flex-col items-center rounded-[22px] border-4 border-ink bg-card p-1.5 shadow-card">
        <div className="mb-1 h-1 w-6 rounded-full bg-ink/70" aria-hidden />
        <div className="relative flex flex-1 w-full items-center justify-center overflow-hidden rounded-[14px] bg-page">
          <FileText size={30} className="text-ink-muted" strokeWidth={1.25} />
          <div className="absolute inset-x-2 h-0.5 rounded-full bg-accent shadow-[0_0_10px_var(--color-accent)] animate-escaneo" />
          <div className="absolute inset-2 rounded-md border border-accent/40" aria-hidden />
        </div>
      </div>
      <div className="text-[11px] font-medium text-ink-muted">Escaneando documento…</div>
    </div>
  )
}
