import type { Verificacion } from '@/shared/types/domain'
import { VERIFICACIONES } from '@/mocks/datos'
import { cargar, guardar } from '@/mocks/almacen'
import { supabase } from './supabase/client'
import { aSnake, mapearFilas } from './mapeo'
import { USAR_MOCKS } from './config'

export interface VerificacionesRepo {
  listar(limite?: number): Promise<Verificacion[]>
  registrar(v: Omit<Verificacion, 'id' | 'verificadoEn'>): Promise<Verificacion>
  suscribir(alCambiar: () => void): () => void
}

const enMemoria = cargar<Verificacion>('verificaciones', VERIFICACIONES)
const oyentes = new Set<() => void>()

const repoMock: VerificacionesRepo = {
  async listar(limite = 20) {
    return enMemoria.slice(0, limite)
  },
  async registrar(v) {
    const nueva: Verificacion = { ...v, id: crypto.randomUUID(), verificadoEn: new Date().toISOString() }
    enMemoria.unshift(nueva)
    guardar('verificaciones', enMemoria)
    oyentes.forEach((fn) => fn())
    return nueva
  },
  suscribir(alCambiar) {
    oyentes.add(alCambiar)
    return () => oyentes.delete(alCambiar)
  },
}

const repoSupabase: VerificacionesRepo = {
  async listar(limite = 20) {
    const { data, error } = await supabase
      .from('verificaciones')
      .select('*')
      .order('verificado_en', { ascending: false })
      .limit(limite)
    if (error) throw error
    return mapearFilas<Verificacion>(data)
  },
  async registrar(v) {
    const { data, error } = await supabase
      .from('verificaciones')
      .insert(aSnake({ ...v }))
      .select()
      .single()
    if (error) throw error
    return mapearFilas<Verificacion>([data])[0]
  },
  suscribir(alCambiar) {
    const canal = supabase
      .channel('verificaciones_cambios')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'verificaciones' }, alCambiar)
      .subscribe()
    return () => {
      void supabase.removeChannel(canal)
    }
  },
}

export const verificacionesRepo: VerificacionesRepo = USAR_MOCKS ? repoMock : repoSupabase
