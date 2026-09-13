import type {
  Actividad,
  Ciudadano,
  Documento,
  Emisor,
  Tramite,
  Verificacion,
  Vinculo,
} from '@/shared/types/domain'
import { ID } from './ids'

/**
 * Escenario de demo. Fuente de verdad de los datos del pitch.
 * Las fechas relativas (hace 2 horas, vence en 8 días) se calculan desde HOY
 * para que la demo siempre se vea fresca, sin importar cuándo se corra.
 */

const HOY = new Date()

/** Fecha desplazada N días desde hoy, como ISO. Negativo = pasado. */
export function desdeHoy(dias: number, horas = 0): string {
  const d = new Date(HOY)
  d.setDate(d.getDate() + dias)
  d.setHours(d.getHours() + horas)
  return d.toISOString()
}

function fecha(iso: string): string {
  return new Date(iso).toISOString()
}

// ── Ciudadanos ───────────────────────────────────────────────────────────

export const CARLOS: Ciudadano = {
  id: ID.carlos,
  ci: '8.234.567',
  ciDepartamento: 'SC',
  nombreCompleto: 'Carlos Mendoza Vargas',
  telefono: '+591 76 432-1098',
  creadoEn: fecha('2024-02-03'),
}

export const MARIA: Ciudadano = {
  id: ID.maria,
  ci: '9.871.234',
  ciDepartamento: 'SC',
  nombreCompleto: 'María Torres Gutiérrez',
  telefono: '+591 71 205-7744',
  creadoEn: fecha('2025-06-18'),
}

export const CIUDADANOS = [CARLOS, MARIA]

// ── Emisores certificados ────────────────────────────────────────────────

export const EMISORES: Emisor[] = [
  {
    id: ID.emisorConsorcio,
    nombre: 'Consorcio Abogados del Oriente',
    certificadoPor: 'Gobernación Santa Cruz',
    certificado: true,
    tokensEmitidos: 45,
  },
  {
    id: ID.emisorNotaria14,
    nombre: 'Notaría Pública N°14 — Dr. Fernando Suárez',
    certificadoPor: 'Alcaldía Santa Cruz',
    certificado: true,
    tokensEmitidos: 23,
  },
  {
    id: ID.emisorColegio,
    nombre: 'Colegio de Abogados de Santa Cruz',
    certificadoPor: 'Ministerio de Justicia',
    certificado: true,
    tokensEmitidos: 87,
  },
  {
    id: ID.emisorMorales,
    nombre: 'Estudio Jurídico Morales & Asociados',
    certificadoPor: 'Gobernación Santa Cruz',
    certificado: true,
    tokensEmitidos: 12,
  },
]

// ── Los 7 documentos del vault ───────────────────────────────────────────

export const DOCUMENTOS: Documento[] = [
  {
    id: 'd1111111-1111-4111-8111-111111111111',
    ciudadanoId: ID.carlos,
    nombre: 'Carnet de Identidad',
    tipo: 'Identidad Personal',
    icono: 'user-circle',
    estado: 'vigente',
    emitidoEn: fecha('2020-03-15'),
    venceEn: fecha('2028-03-15'),
    camposOcr: {
      CI: '8.234.567',
      Nombre: 'Carlos Mendoza Vargas',
      Nacimiento: '12/08/1988',
      Expedido: 'Santa Cruz',
    },
    creadoEn: fecha('2024-02-03'),
  },
  {
    id: 'd2222222-2222-4222-8222-222222222222',
    ciudadanoId: ID.carlos,
    nombre: 'Certificado de Nacimiento',
    tipo: 'Estado Civil',
    icono: 'file-text',
    estado: 'vigente',
    emitidoEn: fecha('1989-01-10'),
    venceEn: null,
    camposOcr: {
      Nombre: 'Carlos Mendoza Vargas',
      Padre: 'Jorge Mendoza',
      Madre: 'Carmen Vargas',
      Lugar: 'Santa Cruz de la Sierra',
    },
    creadoEn: fecha('2024-02-03'),
  },
  {
    id: 'd3333333-3333-4333-8333-333333333333',
    ciudadanoId: ID.carlos,
    nombre: 'NIT Activo',
    tipo: 'Tributario — SIN',
    icono: 'building',
    estado: 'vigente',
    emitidoEn: fecha('2015-06-20'),
    venceEn: null,
    camposOcr: {
      NIT: '4123456789',
      'Razón Social': 'Carlos Mendoza Vargas',
      Actividad: 'Comercio al por menor',
      Estado: 'Activo',
    },
    creadoEn: fecha('2024-02-03'),
  },
  {
    id: 'd4444444-4444-4444-8444-444444444444',
    ciudadanoId: ID.carlos,
    nombre: 'RUAT — Vehículo 2026',
    tipo: 'Municipal — Alcaldía',
    icono: 'car',
    estado: 'vigente',
    emitidoEn: desdeHoy(-250),
    venceEn: desdeHoy(110),
    camposOcr: {
      Placa: '2345-SCC',
      Marca: 'Toyota',
      Modelo: 'Corolla',
      Año: '2019',
      Propietario: 'Carlos Mendoza',
      'Valor fiscal': 'Bs. 78.000',
    },
    creadoEn: desdeHoy(-250),
  },
  {
    id: 'd5555555-5555-4555-8555-555555555555',
    ciudadanoId: ID.carlos,
    nombre: 'Matrícula de Comercio',
    tipo: 'FUNDEMPRESA',
    icono: 'briefcase',
    estado: 'por_vencer',
    emitidoEn: fecha('2022-03-12'),
    venceEn: desdeHoy(25),
    camposOcr: {
      Matrícula: 'SC-00045821',
      Empresa: 'Comercial Mendoza SRL',
      Capital: 'Bs. 50.000',
      Estado: 'Activa',
    },
    creadoEn: fecha('2022-03-12'),
  },
  {
    id: 'd6666666-6666-4666-8666-666666666666',
    ciudadanoId: ID.carlos,
    nombre: 'Licencia de Conducir',
    tipo: 'SEGIP — Tránsito',
    icono: 'id-card',
    estado: 'vigente',
    emitidoEn: fecha('2021-07-10'),
    venceEn: fecha('2027-07-10'),
    camposOcr: {
      Categoría: 'B',
      Restricciones: 'Ninguna',
      Sangre: 'O+',
      Órganos: 'Sí',
    },
    creadoEn: fecha('2024-02-03'),
  },
  {
    id: 'd7777777-7777-4777-8777-777777777777',
    ciudadanoId: ID.carlos,
    nombre: 'Padrón Municipal',
    tipo: 'Alcaldía Santa Cruz',
    icono: 'map-pin',
    estado: 'vigente',
    emitidoEn: fecha('2024-02-03'),
    venceEn: fecha('2027-02-03'),
    camposOcr: {
      Inmueble: 'Av. Busch 450',
      Zona: 'Plan 3000',
      Padrón: 'SCZ-00234567',
      Propietario: 'Carlos Mendoza',
    },
    creadoEn: fecha('2024-02-03'),
  },
]

// ── Los 4 vínculos tokenizados ───────────────────────────────────────────

export const VINCULOS: Vinculo[] = [
  {
    id: 'e1111111-1111-4111-8111-111111111111',
    tokenId: 'TOK-2026-00341',
    ciudadanoId: ID.carlos,
    emisorId: ID.emisorConsorcio,
    tipoDocumento: 'Contrato de Compraventa — Toyota Corolla 2019',
    estado: 'activo',
    creadoEn: desdeHoy(-3),
    venceEn: desdeHoy(90),
    ultimaVerificacionEn: desdeHoy(0, -2),
    firma: 'demo.sig.00341',
  },
  {
    id: 'e2222222-2222-4222-8222-222222222222',
    tokenId: 'TOK-2026-00298',
    ciudadanoId: ID.carlos,
    emisorId: ID.emisorNotaria14,
    tipoDocumento: 'Poder Notarial Especial — Venta Vehículo',
    estado: 'activo',
    creadoEn: desdeHoy(-8),
    venceEn: desdeHoy(85),
    ultimaVerificacionEn: desdeHoy(-1),
    firma: 'demo.sig.00298',
  },
  {
    id: 'e3333333-3333-4333-8333-333333333333',
    tokenId: 'TOK-2026-00412',
    ciudadanoId: ID.carlos,
    emisorId: ID.emisorColegio,
    tipoDocumento: 'Certificado de Libre Gravamen — Placa 2345-SCC',
    estado: 'por_vencer',
    creadoEn: desdeHoy(-22),
    venceEn: desdeHoy(8),
    ultimaVerificacionEn: desdeHoy(-3),
    firma: 'demo.sig.00412',
  },
  {
    id: 'e4444444-4444-4444-8444-444444444444',
    tokenId: 'TOK-2026-00189',
    ciudadanoId: ID.carlos,
    emisorId: ID.emisorMorales,
    tipoDocumento: 'Due Diligence Vehicular — Historial completo',
    estado: 'vencido',
    creadoEn: desdeHoy(-120),
    venceEn: desdeHoy(-30),
    ultimaVerificacionEn: desdeHoy(-45),
    firma: 'demo.sig.00189',
  },
]

// ── Trámites ─────────────────────────────────────────────────────────────

export const TRAMITE_TRASPASO: Tramite = {
  id: ID.tramiteTraspaso,
  ciudadanoId: ID.carlos,
  tipo: 'traspaso_vehicular',
  titulo: 'Traspaso Vehicular',
  subtitulo: 'Toyota Corolla 2019 — Placa 2345-SCC',
  estado: 'en_progreso',
  costoEstimadoBs: 850,
  tiempoEstimado: '2–3 días hábiles restantes',
  creadoEn: desdeHoy(-3),
  completadoEn: null,
  pasos: [
    {
      id: 'f1111111-1111-4111-8111-111111111111',
      tramiteId: ID.tramiteTraspaso,
      orden: 1,
      nombre: 'RUAT Municipal vigente',
      fuente: 'Alcaldía Santa Cruz',
      nota: 'Verificado automáticamente desde tu carpeta',
      estado: 'completado',
      completadoEn: desdeHoy(-3),
      documentoId: 'd4444444-4444-4444-8444-444444444444',
    },
    {
      id: 'f2222222-2222-4222-8222-222222222222',
      tramiteId: ID.tramiteTraspaso,
      orden: 2,
      nombre: 'Certificado de Libre Gravamen',
      fuente: 'Vínculo tokenizado — Colegio de Abogados',
      nota: 'Token TOK-2026-00412 verificado',
      estado: 'completado',
      completadoEn: desdeHoy(-3),
      vinculoId: 'e3333333-3333-4333-8333-333333333333',
    },
    {
      id: 'f3333333-3333-4333-8333-333333333333',
      tramiteId: ID.tramiteTraspaso,
      orden: 3,
      nombre: 'Contrato de Compraventa firmado',
      fuente: 'Consorcio Abogados del Oriente',
      nota: 'Token TOK-2026-00341 — ambas partes firmaron',
      estado: 'completado',
      completadoEn: desdeHoy(-2),
      vinculoId: 'e1111111-1111-4111-8111-111111111111',
    },
    {
      id: 'f4444444-4444-4444-8444-444444444444',
      tramiteId: ID.tramiteTraspaso,
      orden: 4,
      nombre: 'Certificado de Antecedentes del vendedor',
      fuente: 'DIPROVE — Policía Boliviana',
      nota: 'Solicitud #34521 enviada hace 6 horas — plazo 24 horas hábiles',
      estado: 'en_progreso',
      completadoEn: null,
    },
    {
      id: 'f5555555-5555-4555-8555-555555555555',
      tramiteId: ID.tramiteTraspaso,
      orden: 5,
      nombre: 'Firma digital ante Notaría',
      fuente: 'Notaría certificada por Alcaldía',
      nota: 'Disponible cuando el paso 4 esté completo',
      estado: 'bloqueado',
      completadoEn: null,
    },
    {
      id: 'f6666666-6666-4666-8666-666666666666',
      tramiteId: ID.tramiteTraspaso,
      orden: 6,
      nombre: 'Pago de arancel de traspaso',
      fuente: 'Alcaldía Santa Cruz',
      nota: 'El monto se liquida automáticamente al firmar ante notaría',
      estado: 'bloqueado',
      completadoEn: null,
      montoBs: 450,
    },
  ],
}

export const TRAMITES_COMPLETADOS: Tramite[] = [
  {
    id: ID.tramiteLicencia,
    ciudadanoId: ID.carlos,
    tipo: 'licencia_funcionamiento',
    titulo: 'Licencia de Funcionamiento',
    subtitulo: 'Comercial Mendoza SRL',
    estado: 'completado',
    costoEstimadoBs: 200,
    tiempoEstimado: '15 días hábiles',
    creadoEn: desdeHoy(-380),
    completadoEn: desdeHoy(-363),
    pasos: [],
  },
  {
    id: ID.tramiteNit,
    ciudadanoId: ID.carlos,
    tipo: 'renovacion_nit',
    titulo: 'Renovación NIT',
    subtitulo: 'Servicio de Impuestos Nacionales',
    estado: 'completado',
    costoEstimadoBs: 0,
    tiempoEstimado: '5 días hábiles',
    creadoEn: desdeHoy(-455),
    completadoEn: desdeHoy(-450),
    pasos: [],
  },
]

/** Catálogo de trámites disponibles para iniciar. */
export const CATALOGO_TRAMITES = [
  { tipo: 'licencia_funcionamiento', nombre: 'Licencia de Funcionamiento', emisor: 'Municipal', dias: 15, costoBs: 200, icono: 'store' },
  { tipo: 'registro_fundempresa', nombre: 'Registro FUNDEMPRESA', emisor: 'Nacional', dias: 7, costoBs: 150, icono: 'briefcase' },
  { tipo: 'habilitacion_sanitaria', nombre: 'Habilitación Sanitaria', emisor: 'SEDES', dias: 20, costoBs: 100, icono: 'heart-pulse' },
  { tipo: 'permiso_construccion', nombre: 'Permiso de Construcción', emisor: 'Municipal', dias: 30, costoBs: 500, icono: 'hard-hat' },
  { tipo: 'certificado_residencia', nombre: 'Certificado de Residencia', emisor: 'Municipal', dias: 3, costoBs: 0, icono: 'home' },
  { tipo: 'nit_nuevo', nombre: 'NIT Nuevo', emisor: 'SIN', dias: 5, costoBs: 0, icono: 'file-badge' },
] as const

// ── Vehículo del caso de uso ─────────────────────────────────────────────

export const VEHICULO = {
  marca: 'Toyota',
  modelo: 'Corolla',
  anio: 2019,
  placa: '2345-SCC',
  color: 'Blanco perla',
  vin: '1HGCM82633A004352',
  km: 87_450,
  precioUsd: 12_500,
  valorFiscalBs: 78_000,
} as const

// ── Verificaciones recientes (panel funcionario) ─────────────────────────

export const VERIFICACIONES: Verificacion[] = [
  { id: 'g1111111-1111-4111-8111-111111111111', vinculoId: 'e1111111-1111-4111-8111-111111111111', tokenId: 'TOK-2026-00341', ciudadanoCi: '8.234.567', tipo: 'Traspaso vehicular', resultado: 'valido', funcionario: 'L. Ribera', institucion: 'Alcaldía Santa Cruz', verificadoEn: desdeHoy(0, -2) },
  { id: 'g2222222-2222-4222-8222-222222222222', vinculoId: 'e2222222-2222-4222-8222-222222222222', tokenId: 'TOK-2026-00298', ciudadanoCi: '8.234.567', tipo: 'Poder notarial', resultado: 'valido', funcionario: 'L. Ribera', institucion: 'Alcaldía Santa Cruz', verificadoEn: desdeHoy(-1) },
  { id: 'g3333333-3333-4333-8333-333333333333', vinculoId: 'e4444444-4444-4444-8444-444444444444', tokenId: 'TOK-2026-00189', ciudadanoCi: '8.234.567', tipo: 'Otro', resultado: 'vencido', motivo: 'Token vencido', funcionario: 'M. Áñez', institucion: 'Alcaldía Santa Cruz', verificadoEn: desdeHoy(-2) },
  { id: 'g4444444-4444-4444-8444-444444444444', vinculoId: null as unknown as string, tokenId: 'TOK-2026-00777', ciudadanoCi: '7.112.908', tipo: 'Contrato', resultado: 'invalido', motivo: 'Token inexistente', funcionario: 'M. Áñez', institucion: 'Alcaldía Santa Cruz', verificadoEn: desdeHoy(-3) },
  { id: 'g5555555-5555-4555-8555-555555555555', vinculoId: 'e3333333-3333-4333-8333-333333333333', tokenId: 'TOK-2026-00412', ciudadanoCi: '8.234.567', tipo: 'Traspaso vehicular', resultado: 'valido', funcionario: 'J. Paz', institucion: 'Alcaldía Santa Cruz', verificadoEn: desdeHoy(-3) },
]

// ── Actividad reciente (inicio) ──────────────────────────────────────────

export const ACTIVIDADES: Actividad[] = [
  { id: 'h1111111-1111-4111-8111-111111111111', ciudadanoId: ID.carlos, tipo: 'verificacion', descripcion: 'Token verificado — Cert. Libre Gravamen', ocurridoEn: desdeHoy(0, -2) },
  { id: 'h2222222-2222-4222-8222-222222222222', ciudadanoId: ID.carlos, tipo: 'documento', descripcion: 'Documento subido — RUAT 2026', ocurridoEn: desdeHoy(-1) },
  { id: 'h3333333-3333-4333-8333-333333333333', ciudadanoId: ID.carlos, tipo: 'tramite', descripcion: 'Trámite iniciado — Traspaso Vehicular', ocurridoEn: desdeHoy(-3) },
  { id: 'h4444444-4444-4444-8444-444444444444', ciudadanoId: ID.carlos, tipo: 'vinculo', descripcion: 'Token generado — Contrato Compraventa', ocurridoEn: desdeHoy(-3) },
  { id: 'h5555555-5555-4555-8555-555555555555', ciudadanoId: ID.carlos, tipo: 'documento', descripcion: 'Documento actualizado — Carnet de Identidad', ocurridoEn: desdeHoy(-7) },
]
