/**
 * Modelo de dominio — fuente de verdad para TODA la app.
 * Estos tipos reflejan 1:1 las tablas de Supabase (ver docs/DATA_MODEL.md).
 * Si cambiás algo acá, cambiá la migración y viceversa.
 */

// ── Enums (strings para que sean legibles en DB y UI) ────────────────────

export type EstadoDocumento = 'vigente' | 'por_vencer' | 'vencido' | 'pendiente'
export type EstadoVinculo = 'activo' | 'por_vencer' | 'vencido' | 'revocado'
export type EstadoTramite = 'en_progreso' | 'completado' | 'disponible' | 'cancelado'
export type EstadoPaso = 'completado' | 'en_progreso' | 'bloqueado' | 'pendiente'
export type TipoBien = 'vehiculo' | 'inmueble'
export type EstadoHechoImponible = 'pendiente' | 'liquidado' | 'pagado' | 'anulado'
export type ResultadoVerificacion = 'valido' | 'invalido' | 'vencido'

// ── Entidades ────────────────────────────────────────────────────────────

export interface Ciudadano {
  id: string
  ci: string // "8.234.567"
  ciDepartamento: string // "SC"
  nombreCompleto: string
  telefono?: string // "+591 7X XXX-XXXX"
  creadoEn: string // ISO
}

export interface Documento {
  id: string
  ciudadanoId: string
  nombre: string
  tipo: string // "Identidad Personal", "Municipal — Alcaldía", ...
  icono: string // nombre de icono lucide
  estado: EstadoDocumento
  emitidoEn: string // ISO date
  venceEn: string | null // null = sin vencimiento
  camposOcr: Record<string, string>
  creadoEn: string
}

export interface Emisor {
  id: string
  nombre: string
  certificadoPor: string // "Gobernación Santa Cruz"
  certificado: boolean
  tokensEmitidos: number
}

export interface Vinculo {
  id: string
  tokenId: string // "TOK-2025-00341"
  ciudadanoId: string
  emisorId: string
  tipoDocumento: string
  estado: EstadoVinculo
  creadoEn: string
  venceEn: string
  ultimaVerificacionEn: string | null
  /** Payload firmado (JWT simulado en demo). Nunca se edita desde el cliente. */
  firma: string
}

export interface PasoTramite {
  id: string
  tramiteId: string
  orden: number
  nombre: string
  fuente: string // institución responsable
  nota: string
  estado: EstadoPaso
  completadoEn: string | null
  /** Referencia opcional al documento o vínculo que satisfizo el paso */
  documentoId?: string
  vinculoId?: string
  montoBs?: number
}

export interface Tramite {
  id: string
  ciudadanoId: string
  tipo: string // "traspaso_vehicular", "licencia_funcionamiento", ...
  titulo: string
  subtitulo: string
  estado: EstadoTramite
  costoEstimadoBs: number
  tiempoEstimado: string
  pasos: PasoTramite[]
  /** Si el trámite genera un hecho imponible, se enlaza acá */
  hechoImponibleId?: string
  creadoEn: string
  completadoEn: string | null
}

/**
 * HECHO IMPONIBLE — el diferenciador del proyecto.
 * Se crea automáticamente cuando un trámite de transferencia de bien
 * (vehículo/inmueble) llega al paso de firma. El municipio lo ve en
 * tiempo real y liquida la tarifa. Ver docs/RECAUDACION.md.
 */
export interface HechoImponible {
  id: string
  tramiteId: string
  tipoBien: TipoBien
  descripcionBien: string // "Toyota Corolla 2019 — 2345-SCC"
  vendedorId: string
  compradorId: string
  valorDeclaradoUsd: number
  valorBaseBs: number // valor fiscal (RUAT / catastro)
  baseImponibleBs: number // max(declarado, base)
  alicuota: number // 0.03 = 3 %
  impuestoBs: number
  arancelBs: number
  totalBs: number
  estado: EstadoHechoImponible
  municipio: string
  generadoEn: string
  pagadoEn: string | null
}

export interface Verificacion {
  id: string
  vinculoId: string
  tokenId: string
  ciudadanoCi: string
  tipo: string
  resultado: ResultadoVerificacion
  motivo?: string
  funcionario: string
  institucion: string
  verificadoEn: string
}

export interface Actividad {
  id: string
  ciudadanoId: string
  tipo: 'documento' | 'vinculo' | 'tramite' | 'verificacion' | 'recaudacion'
  descripcion: string
  ocurridoEn: string
}
