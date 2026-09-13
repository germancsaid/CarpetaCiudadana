import type { Tramite, PasoTramite } from '@/shared/types/domain'
import { TRAMITE_TRASPASO, TRAMITES_COMPLETADOS } from '@/mocks/datos'
import { cargar, guardar } from '@/mocks/almacen'
import { supabase } from './supabase/client'
import { aSnake, mapearFilas } from './mapeo'
import { USAR_MOCKS } from './config'

export interface TramitesRepo {
  listar(ciudadanoId: string): Promise<Tramite[]>
  obtener(id: string): Promise<Tramite | null>
  crear(t: Omit<Tramite, 'id' | 'creadoEn' | 'completadoEn'>): Promise<Tramite>
  /** Marca el paso completado y desbloquea el siguiente. Si era el último, completa el trámite. */
  completarPaso(pasoId: string): Promise<void>
  actualizarPaso(pasoId: string, cambios: Partial<Pick<PasoTramite, 'nota' | 'montoBs' | 'estado'>>): Promise<void>
  vincularHechoImponible(tramiteId: string, hechoId: string): Promise<void>
  /** Realtime sobre pasos: el ciudadano ve en vivo cuando el municipio marca el pago. */
  suscribir(alCambiar: () => void): () => void
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

// ── Mock ─────────────────────────────────────────────────────────────────

const enMemoria = cargar<Tramite>('tramites', [TRAMITE_TRASPASO, ...TRAMITES_COMPLETADOS])
const oyentes = new Set<() => void>()
const notificar = () => {
  guardar('tramites', enMemoria)
  oyentes.forEach((fn) => fn())
}

function buscarPaso(pasoId: string): { t: Tramite; paso: PasoTramite } | null {
  for (const t of enMemoria) {
    const paso = t.pasos.find((p) => p.id === pasoId)
    if (paso) return { t, paso }
  }
  return null
}

const repoMock: TramitesRepo = {
  async listar(ciudadanoId) {
    return structuredClone(enMemoria.filter((t) => t.ciudadanoId === ciudadanoId))
  },
  async obtener(id) {
    const t = enMemoria.find((x) => x.id === id)
    return t ? structuredClone(t) : null
  },
  async crear(t) {
    const nuevo: Tramite = {
      ...t,
      id: crypto.randomUUID(),
      creadoEn: new Date().toISOString(),
      completadoEn: null,
    }
    nuevo.pasos = nuevo.pasos.map((p) => ({ ...p, id: p.id || crypto.randomUUID(), tramiteId: nuevo.id }))
    enMemoria.unshift(nuevo)
    notificar()
    return structuredClone(nuevo)
  },
  async completarPaso(pasoId) {
    const r = buscarPaso(pasoId)
    if (!r) return
    const { t, paso } = r
    paso.estado = 'completado'
    paso.completadoEn = new Date().toISOString()
    const siguiente = t.pasos.find((p) => p.orden === paso.orden + 1)
    if (siguiente && siguiente.estado === 'bloqueado') siguiente.estado = 'en_progreso'
    if (t.pasos.every((p) => p.estado === 'completado')) {
      t.estado = 'completado'
      t.completadoEn = new Date().toISOString()
    }
    notificar()
  },
  async actualizarPaso(pasoId, cambios) {
    const r = buscarPaso(pasoId)
    if (r) Object.assign(r.paso, cambios)
    notificar()
  },
  async vincularHechoImponible(tramiteId, hechoId) {
    const t = enMemoria.find((x) => x.id === tramiteId)
    if (t) t.hechoImponibleId = hechoId
    notificar()
  },
  suscribir(alCambiar) {
    oyentes.add(alCambiar)
    return () => oyentes.delete(alCambiar)
  },
}

// ── Supabase ─────────────────────────────────────────────────────────────

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
  async crear(t) {
    const { pasos, ...cabecera } = t
    const { data, error } = await supabase.from('tramites').insert(aSnake(cabecera)).select().single()
    if (error) throw error
    if (pasos.length) {
      const filas = pasos.map(({ id: _id, ...p }) => aSnake({ ...p, tramiteId: data.id }))
      const { error: e2 } = await supabase.from('pasos_tramite').insert(filas)
      if (e2) throw e2
    }
    return (await repoSupabase.obtener(data.id))!
  },
  async completarPaso(pasoId) {
    const { data: paso, error } = await supabase
      .from('pasos_tramite')
      .update({ estado: 'completado', completado_en: new Date().toISOString() })
      .eq('id', pasoId)
      .select()
      .single()
    if (error) throw error
    await supabase
      .from('pasos_tramite')
      .update({ estado: 'en_progreso' })
      .eq('tramite_id', paso.tramite_id)
      .eq('orden', paso.orden + 1)
      .eq('estado', 'bloqueado')
    const { count } = await supabase
      .from('pasos_tramite')
      .select('id', { count: 'exact', head: true })
      .eq('tramite_id', paso.tramite_id)
      .neq('estado', 'completado')
    if (count === 0) {
      await supabase
        .from('tramites')
        .update({ estado: 'completado', completado_en: new Date().toISOString() })
        .eq('id', paso.tramite_id)
    }
  },
  async actualizarPaso(pasoId, cambios) {
    const { error } = await supabase.from('pasos_tramite').update(aSnake({ ...cambios })).eq('id', pasoId)
    if (error) throw error
  },
  async vincularHechoImponible(tramiteId, hechoId) {
    const { error } = await supabase
      .from('tramites')
      .update({ hecho_imponible_id: hechoId })
      .eq('id', tramiteId)
    if (error) throw error
  },
  suscribir(alCambiar) {
    const canal = supabase
      .channel('pasos_tramite_cambios')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pasos_tramite' }, alCambiar)
      .subscribe()
    return () => {
      void supabase.removeChannel(canal)
    }
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
