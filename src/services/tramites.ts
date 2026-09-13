import type { Tramite, PasoTramite } from '@/shared/types/domain'
import { TRAMITE_TRASPASO, TRAMITES_COMPLETADOS } from '@/mocks/datos'
import { supabase } from './supabase/client'
import { mapearFilas } from './mapeo'
import { USAR_MOCKS } from './config'

export interface TramitesRepo {
  listar(ciudadanoId: string): Promise<Tramite[]>
  obtener(id: string): Promise<Tramite | null>
  completarPaso(pasoId: string): Promise<void>
  /** Desbloquea el siguiente paso y devuelve el trámite actualizado. */
  avanzar(tramiteId: string): Promise<Tramite | null>
}

/** % completado según pasos. Único lugar donde se calcula el progreso. */
export function progreso(t: Tramite): number {
  if (t.pasos.length === 0) return t.estado === 'completado' ? 100 : 0
  const hechos = t.pasos.filter((p) => p.estado === 'completado').length
  return Math.round((hechos / t.pasos.length) * 100)
}

export function pasoActual(t: Tramite): PasoTramite | undefined {
  return t.pasos.find((p) => p.estado === 'en_progreso') ?? t.pasos.find((p) => p.estado === 'bloqueado')
}

const enMemoria: Tramite[] = [
  structuredClone(TRAMITE_TRASPASO),
  ...structuredClone(TRAMITES_COMPLETADOS),
]

const repoMock: TramitesRepo = {
  async listar(ciudadanoId) {
    return enMemoria.filter((t) => t.ciudadanoId === ciudadanoId)
  },
  async obtener(id) {
    return enMemoria.find((t) => t.id === id) ?? null
  },
  async completarPaso(pasoId) {
    for (const t of enMemoria) {
      const paso = t.pasos.find((p) => p.id === pasoId)
      if (!paso) continue
      paso.estado = 'completado'
      paso.completadoEn = new Date().toISOString()
      const siguiente = t.pasos.find((p) => p.orden === paso.orden + 1)
      if (siguiente && siguiente.estado === 'bloqueado') siguiente.estado = 'en_progreso'
      if (t.pasos.every((p) => p.estado === 'completado')) {
        t.estado = 'completado'
        t.completadoEn = new Date().toISOString()
      }
      return
    }
  },
  async avanzar(tramiteId) {
    const t = enMemoria.find((x) => x.id === tramiteId)
    if (!t) return null
    const actual = t.pasos.find((p) => p.estado === 'en_progreso')
    if (actual) await repoMock.completarPaso(actual.id)
    return t
  },
}

const repoSupabase: TramitesRepo = {
  async listar(ciudadanoId) {
    const { data, error } = await supabase
      .from('tramites')
      .select('*, pasos_tramite(*)')
      .eq('ciudadano_id', ciudadanoId)
      .order('creado_en', { ascending: false })
    if (error) throw error
    return (data ?? []).map(armarTramite)
  },
  async obtener(id) {
    const { data, error } = await supabase
      .from('tramites')
      .select('*, pasos_tramite(*)')
      .eq('id', id)
      .maybeSingle()
    if (error) throw error
    return data ? armarTramite(data) : null
  },
  async completarPaso(pasoId) {
    const { data: paso, error } = await supabase
      .from('pasos_tramite')
      .update({ estado: 'completado', completado_en: new Date().toISOString() })
      .eq('id', pasoId)
      .select()
      .single()
    if (error) throw error
    // Desbloquear el siguiente paso del mismo trámite.
    await supabase
      .from('pasos_tramite')
      .update({ estado: 'en_progreso' })
      .eq('tramite_id', paso.tramite_id)
      .eq('orden', paso.orden + 1)
      .eq('estado', 'bloqueado')
  },
  async avanzar(tramiteId) {
    const t = await repoSupabase.obtener(tramiteId)
    const actual = t?.pasos.find((p) => p.estado === 'en_progreso')
    if (actual) await repoSupabase.completarPaso(actual.id)
    return repoSupabase.obtener(tramiteId)
  },
}

type FilaTramite = Record<string, unknown> & { pasos_tramite?: Record<string, unknown>[] }

function armarTramite(fila: FilaTramite): Tramite {
  const { pasos_tramite = [], ...resto } = fila
  const tramite = mapearFilas<Tramite>([resto])[0]
  tramite.pasos = mapearFilas<PasoTramite>(pasos_tramite).sort((a, b) => a.orden - b.orden)
  return tramite
}

export const tramitesRepo: TramitesRepo = USAR_MOCKS ? repoMock : repoSupabase
