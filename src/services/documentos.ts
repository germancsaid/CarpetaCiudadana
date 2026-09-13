import type { Documento } from '@/shared/types/domain'
import { estadoPorVencimiento } from '@/shared/lib/vencimientos'
import { DOCUMENTOS } from '@/mocks/datos'
import { supabase } from './supabase/client'
import { aSnake, mapearFilas } from './mapeo'
import { USAR_MOCKS } from './config'

export interface DocumentosRepo {
  listar(ciudadanoId: string): Promise<Documento[]>
  crear(doc: Omit<Documento, 'id' | 'creadoEn'>): Promise<Documento>
}

/** El estado se deriva de la fecha al leer, nunca se confía en el guardado. */
const conEstadoFresco = (d: Documento): Documento => ({
  ...d,
  estado: estadoPorVencimiento(d.venceEn),
})

const enMemoria: Documento[] = [...DOCUMENTOS]

const repoMock: DocumentosRepo = {
  async listar(ciudadanoId) {
    return enMemoria.filter((d) => d.ciudadanoId === ciudadanoId).map(conEstadoFresco)
  },
  async crear(doc) {
    const nuevo: Documento = { ...doc, id: crypto.randomUUID(), creadoEn: new Date().toISOString() }
    enMemoria.unshift(nuevo)
    return nuevo
  },
}

const repoSupabase: DocumentosRepo = {
  async listar(ciudadanoId) {
    const { data, error } = await supabase
      .from('documentos')
      .select('*')
      .eq('ciudadano_id', ciudadanoId)
      .order('creado_en', { ascending: false })
    if (error) throw error
    return mapearFilas<Documento>(data).map(conEstadoFresco)
  },
  async crear(doc) {
    const { data, error } = await supabase
      .from('documentos')
      .insert(aSnake({ ...doc }))
      .select()
      .single()
    if (error) throw error
    return mapearFilas<Documento>([data])[0]
  },
}

export const documentosRepo: DocumentosRepo = USAR_MOCKS ? repoMock : repoSupabase
