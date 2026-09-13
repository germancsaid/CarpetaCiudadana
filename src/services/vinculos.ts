import type { Vinculo, Emisor } from '@/shared/types/domain'
import { estadoVinculoPorVencimiento } from '@/shared/lib/vencimientos'
import { VINCULOS, EMISORES } from '@/mocks/datos'
import { cargar, guardar } from '@/mocks/almacen'
import { supabase } from './supabase/client'
import { aSnake, mapearFilas } from './mapeo'
import { USAR_MOCKS } from './config'

export interface VinculosRepo {
  listar(ciudadanoId: string): Promise<Vinculo[]>
  buscarPorToken(tokenId: string): Promise<Vinculo | null>
  crear(v: Omit<Vinculo, 'id' | 'creadoEn'>): Promise<Vinculo>
  marcarVerificado(id: string): Promise<void>
  listarEmisores(): Promise<Emisor[]>
}

const conEstadoFresco = (v: Vinculo): Vinculo =>
  v.estado === 'revocado' ? v : { ...v, estado: estadoVinculoPorVencimiento(v.venceEn) }

const enMemoria = cargar<Vinculo>('vinculos', VINCULOS)

const repoMock: VinculosRepo = {
  async listar(ciudadanoId) {
    return enMemoria.filter((v) => v.ciudadanoId === ciudadanoId).map(conEstadoFresco)
  },
  async buscarPorToken(tokenId) {
    const v = enMemoria.find((x) => x.tokenId === tokenId.trim().toUpperCase())
    return v ? conEstadoFresco(v) : null
  },
  async crear(v) {
    const nuevo: Vinculo = { ...v, id: crypto.randomUUID(), creadoEn: new Date().toISOString() }
    enMemoria.unshift(nuevo)
    guardar('vinculos', enMemoria)
    return nuevo
  },
  async marcarVerificado(id) {
    const v = enMemoria.find((x) => x.id === id)
    if (v) v.ultimaVerificacionEn = new Date().toISOString()
    guardar('vinculos', enMemoria)
  },
  async listarEmisores() {
    return EMISORES
  },
}

const repoSupabase: VinculosRepo = {
  async listar(ciudadanoId) {
    const { data, error } = await supabase
      .from('vinculos')
      .select('*')
      .eq('ciudadano_id', ciudadanoId)
      .order('creado_en', { ascending: false })
    if (error) throw error
    return mapearFilas<Vinculo>(data).map(conEstadoFresco)
  },
  async buscarPorToken(tokenId) {
    const { data, error } = await supabase
      .from('vinculos')
      .select('*')
      .eq('token_id', tokenId.trim().toUpperCase())
      .maybeSingle()
    if (error) throw error
    return data ? conEstadoFresco(mapearFilas<Vinculo>([data])[0]) : null
  },
  async crear(v) {
    const { data, error } = await supabase.from('vinculos').insert(aSnake({ ...v })).select().single()
    if (error) throw error
    return mapearFilas<Vinculo>([data])[0]
  },
  async marcarVerificado(id) {
    const { error } = await supabase
      .from('vinculos')
      .update({ ultima_verificacion_en: new Date().toISOString() })
      .eq('id', id)
    if (error) throw error
  },
  async listarEmisores() {
    const { data, error } = await supabase.from('emisores').select('*').order('nombre')
    if (error) throw error
    return mapearFilas<Emisor>(data)
  },
}

export const vinculosRepo: VinculosRepo = USAR_MOCKS ? repoMock : repoSupabase
