import type { Documento } from '@/shared/types/domain'
import { Icono } from '@/shared/ui'

/**
 * "Imagen de prueba" del documento — no es un archivo subido real, es una
 * representación visual generada a partir de los camposOcr, con el look de
 * un documento oficial boliviano (franja, sello, tipografía monoespaciada
 * para los datos). Sirve para que la demo se vea con contenido real al
 * abrir "Ver documento", sin depender de imágenes externas.
 */

const FRANJA: Record<string, string> = {
  'Identidad Personal': 'bg-gradient-to-r from-[#0071e3] to-[#2997ff]',
  'Estado Civil': 'bg-gradient-to-r from-ink-secondary to-ink',
  'Tributario — SIN': 'bg-gradient-to-r from-warning to-[#e08600]',
  'Municipal — Alcaldía': 'bg-gradient-to-r from-success to-[#1d7a37]',
}

function franjaPara(tipo: string): string {
  return FRANJA[tipo] ?? 'bg-gradient-to-r from-accent to-accent-text'
}

export function DocumentoPreview({ doc }: { doc: Documento }) {
  const campos = Object.entries(doc.camposOcr)

  return (
    <div className="overflow-hidden rounded-card border border-border shadow-card">
      <div className={`relative flex items-center gap-3 px-5 py-4 text-white ${franjaPara(doc.tipo)}`}>
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur">
          <Icono nombre={doc.icono} size={22} />
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold tracking-tight">{doc.nombre}</div>
          <div className="text-xs text-white/80">{doc.tipo} · Estado Plurinacional de Bolivia</div>
        </div>
        <div className="ml-auto hidden shrink-0 rounded-full border border-white/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide sm:block">
          Documento verificado
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-3 bg-card-2 px-5 py-5 sm:grid-cols-2">
        {campos.map(([k, v]) => (
          <div key={k} className="min-w-0">
            <div className="text-[10px] font-medium uppercase tracking-wide text-ink-muted">{k}</div>
            <div className="truncate font-mono text-sm font-medium text-ink">{v}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-border bg-card px-5 py-2.5 text-[10px] text-ink-muted">
        <span>Documento ID {doc.id.slice(0, 8).toUpperCase()}</span>
        <span>Extraído por OCR al subir · CarpetaCiudadana</span>
      </div>
    </div>
  )
}
