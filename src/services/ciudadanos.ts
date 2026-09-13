import type { Ciudadano, Actividad } from '@/shared/types/domain'
import { CARLOS, CIUDADANOS, ACTIVIDADES } from '@/mocks/datos'
import { supabase } from './supabase/client'
import { mapearFilas } from './mapeo'
import { USAR_MOCKS } from './config'

/** Ciudadano de la sesión. Sin login en fase 1: siempre Carlos (ver ADR-0002). */
export const CIUDADANO_ACTUAL = CARLOS
export const MUNICIPIO = 'Santa Cruz de la Sierra'

export interface CiudadanosRepo {
  obtener(id: string): Promise<Ciudadano | null>
  actividades(ciudadanoId: string, limite?: number): Promise<Actividad[]>
}

const repoMock: CiudadanosRepo = {
  async obtener(id) {
    return CIUDADANOS.find((c) => c.id === id) ?? null
  },
  async actividades(ciudadanoId, limite = 5) {
    return ACTIVIDADES.filter((a) => a.ciudadanoId === ciudadanoId).slice(0, limite)
  },
}

const repoSupabase: CiudadanosRepo = {
  async obtener(id) {
    const { data, error } = await supabase.from('ciudadanos').select('*').eq('id', id).maybeSingle()
    if (error) throw error
    return data ? mapearFilas<Ciudadano>([data])[0] : null
  },
  async actividades(ciudadanoId, limite = 5) {
    const { data, error } = await supabase
      .from('actividades')
      .select('*')
      .eq('ciudadano_id', ciudadanoId)
      .order('ocurrido_en', { ascending: false })
      .limit(limite)
    if (error) throw error
    return mapearFilas<Actividad>(data)
  },
}

export const ciudadanosRepo: CiudadanosRepo = USAR_MOCKS ? repoMock : repoSupabase
