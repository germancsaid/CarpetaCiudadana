import { UserRound } from 'lucide-react'
import type { Documento } from '@/shared/types/domain'
import { Icono, QrCode } from '@/shared/ui'

/**
 * "Imagen de prueba" del documento — no es un archivo subido real, es una
 * recreación visual fiel al documento oficial boliviano correspondiente
 * (colores, símbolos y disposición investigados: cédula SEGIP tricolor con
 * wiphala, NIT del SIN, plaqueta RUAT municipal, etc.), armada en CSS/SVG
 * para no depender de imágenes externas. Sirve para que la demo se vea con
 * contenido real al abrir "Ver documento".
 */

type Estilo = 'nacional' | 'transito' | 'tributario' | 'municipal' | 'empresarial' | 'civil'

const ESTILO_POR_TIPO: Record<string, Estilo> = {
  'Identidad Personal': 'nacional',
  'SEGIP — Tránsito': 'transito',
  'Tributario — SIN': 'tributario',
  'Municipal — Alcaldía': 'municipal',
  'Alcaldía Santa Cruz': 'municipal',
  FUNDEMPRESA: 'empresarial',
  'Estado Civil': 'civil',
}

const FRANJA: Record<Estilo, string> = {
  // Tricolor de la bandera boliviana, como el fondo guilloché de la cédula real.
  nacional: 'bg-gradient-to-r from-[#d52b1e] via-[#f9e300] to-[#007934]',
  transito: 'bg-gradient-to-r from-[#0071e3] to-[#004a94]',
  tributario: 'bg-gradient-to-r from-[#00a4a6] to-[#00696b]',
  municipal: 'bg-gradient-to-r from-[#1d7a37] to-[#0f4d21]',
  empresarial: 'bg-gradient-to-r from-[#1d1d1f] to-[#3b3f4a]',
  civil: 'bg-gradient-to-r from-ink-secondary to-ink',
}

const ENTIDAD: Record<Estilo, string> = {
  nacional: 'Estado Plurinacional de Bolivia · SEGIP',
  transito: 'SEGIP — Organismo Operativo de Tránsito',
  tributario: 'Servicio de Impuestos Nacionales',
  municipal: 'Gobierno Autónomo Municipal de Santa Cruz de la Sierra',
  empresarial: 'FUNDEMPRESA — Registro de Comercio',
  civil: 'Servicio de Registro Cívico',
}

export function DocumentoPreview({ doc }: { doc: Documento }) {
  const estilo = ESTILO_POR_TIPO[doc.tipo] ?? 'civil'
  const campos = Object.entries(doc.camposOcr)
  const conFoto = estilo === 'nacional' || estilo === 'transito'

  return (
    <div className="overflow-hidden rounded-card border border-border shadow-card">
      <div className={`relative overflow-hidden px-5 py-4 text-white ${FRANJA[estilo]}`}>
        {estilo === 'nacional' && (
          <div className="absolute inset-y-0 left-0 flex w-2 flex-col" aria-hidden>
            <span className="flex-1 bg-[#d52b1e]" />
            <span className="flex-1 bg-[#f9e300]" />
            <span className="flex-1 bg-[#007934]" />
          </div>
        )}
        <div className="flex items-center gap-3 pl-1">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur">
            <Icono nombre={doc.icono} size={22} />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold tracking-tight">{doc.nombre}</div>
            <div className="text-xs text-white/80">{ENTIDAD[estilo]}</div>
          </div>
          <div className="ml-auto hidden shrink-0 rounded-full border border-white/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide sm:block">
            Documento verificado
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 bg-card-2 px-5 py-5 sm:flex-row">
        {conFoto && (
          <div className="flex size-20 shrink-0 items-center justify-center self-start rounded-md border border-border bg-white text-ink-muted shadow-sm">
            <UserRound size={36} strokeWidth={1.25} />
          </div>
        )}
        <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-3">
          {campos.map(([k, v]) => (
            <div key={k} className="min-w-0">
              <div className="text-[10px] font-medium tracking-wide text-ink-muted uppercase">{k}</div>
              <div className={`truncate font-mono text-sm font-medium ${estilo === 'nacional' && k === 'CI' ? 'text-[#d52b1e]' : 'text-ink'}`}>{v}</div>
            </div>
          ))}
        </div>
        <div className="hidden shrink-0 self-center sm:block">
          <QrCode valor={`CARPETACIUDADANA|DOC:${doc.id}|${doc.nombre}`} tamano={72} etiqueta="Verificación" />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border bg-card px-5 py-2.5 text-[10px] text-ink-muted">
        <span>Documento ID {doc.id.slice(0, 8).toUpperCase()}</span>
        <span>Extraído por OCR al subir · CarpetaCiudadana</span>
      </div>
    </div>
  )
}
