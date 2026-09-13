import type { Documento, PasoTramite, Tramite } from '@/shared/types/domain'
import { CATALOGO_TRAMITES } from '@/mocks/datos'

type ItemCatalogo = (typeof CATALOGO_TRAMITES)[number]

/** Requisitos por tipo de trámite. `cubrePorDoc` = nombre de doc del vault que lo satisface. */
const REQUISITOS: Record<string, { nombre: string; fuente: string; cubrePorDoc?: string; montoBs?: number }[]> = {
  licencia_funcionamiento: [
    { nombre: 'NIT vigente', fuente: 'SIN', cubrePorDoc: 'NIT Activo' },
    { nombre: 'Matrícula de Comercio', fuente: 'FUNDEMPRESA', cubrePorDoc: 'Matrícula de Comercio' },
    { nombre: 'Padrón municipal del local', fuente: 'Alcaldía Santa Cruz', cubrePorDoc: 'Padrón Municipal' },
    { nombre: 'Inspección técnica', fuente: 'Alcaldía Santa Cruz' },
    { nombre: 'Pago de tasa', fuente: 'Alcaldía Santa Cruz', montoBs: 200 },
  ],
  registro_fundempresa: [
    { nombre: 'Carnet de Identidad', fuente: 'SEGIP', cubrePorDoc: 'Carnet de Identidad' },
    { nombre: 'NIT vigente', fuente: 'SIN', cubrePorDoc: 'NIT Activo' },
    { nombre: 'Formulario de registro', fuente: 'FUNDEMPRESA' },
    { nombre: 'Pago de arancel', fuente: 'FUNDEMPRESA', montoBs: 150 },
  ],
  habilitacion_sanitaria: [
    { nombre: 'Licencia de funcionamiento', fuente: 'Alcaldía Santa Cruz' },
    { nombre: 'Croquis del establecimiento', fuente: 'Solicitante' },
    { nombre: 'Inspección sanitaria', fuente: 'SEDES' },
    { nombre: 'Pago de tasa', fuente: 'SEDES', montoBs: 100 },
  ],
  permiso_construccion: [
    { nombre: 'Padrón municipal', fuente: 'Alcaldía Santa Cruz', cubrePorDoc: 'Padrón Municipal' },
    { nombre: 'Planos aprobados', fuente: 'Colegio de Arquitectos' },
    { nombre: 'Certificado catastral', fuente: 'Alcaldía Santa Cruz' },
    { nombre: 'Revisión técnica', fuente: 'Alcaldía Santa Cruz' },
    { nombre: 'Pago de tasa', fuente: 'Alcaldía Santa Cruz', montoBs: 500 },
  ],
  certificado_residencia: [
    { nombre: 'Carnet de Identidad', fuente: 'SEGIP', cubrePorDoc: 'Carnet de Identidad' },
    { nombre: 'Padrón municipal', fuente: 'Alcaldía Santa Cruz', cubrePorDoc: 'Padrón Municipal' },
    { nombre: 'Emisión del certificado', fuente: 'Alcaldía Santa Cruz' },
  ],
  nit_nuevo: [
    { nombre: 'Carnet de Identidad', fuente: 'SEGIP', cubrePorDoc: 'Carnet de Identidad' },
    { nombre: 'Factura de servicio del domicilio', fuente: 'Solicitante' },
    { nombre: 'Registro en Oficina Virtual', fuente: 'SIN' },
  ],
}

/**
 * "La IA analiza tu carpeta": arma el quest marcando como completados los pasos
 * que ya cubre un documento vigente del vault. El primero no cubierto queda en progreso.
 */
export function armarQuest(item: ItemCatalogo, vault: Documento[], ciudadanoId: string): Omit<Tramite, 'id' | 'creadoEn' | 'completadoEn'> {
  const requisitos = REQUISITOS[item.tipo] ?? []
  let primeroPendienteAsignado = false
  const pasos: PasoTramite[] = requisitos.map((r, i) => {
    const doc = r.cubrePorDoc ? vault.find((d) => d.nombre === r.cubrePorDoc && d.estado !== 'vencido') : undefined
    let estado: PasoTramite['estado']
    if (doc) estado = 'completado'
    else if (!primeroPendienteAsignado) {
      estado = 'en_progreso'
      primeroPendienteAsignado = true
    } else estado = 'bloqueado'
    return {
      id: '',
      tramiteId: '',
      orden: i + 1,
      nombre: r.nombre,
      fuente: r.fuente,
      nota: doc ? `Cubierto por "${doc.nombre}" de tu carpeta` : r.montoBs ? 'Habilitado al completar pasos anteriores' : 'Pendiente',
      estado,
      completadoEn: doc ? new Date().toISOString() : null,
      documentoId: doc?.id,
      montoBs: r.montoBs,
    }
  })
  return {
    ciudadanoId,
    tipo: item.tipo,
    titulo: item.nombre,
    subtitulo: item.emisor,
    estado: 'en_progreso',
    costoEstimadoBs: item.costoBs,
    tiempoEstimado: `~${item.dias} días hábiles`,
    pasos,
  }
}
