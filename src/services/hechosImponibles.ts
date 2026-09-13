import type { HechoImponible } from '@/shared/types/domain'
import { supabase } from './supabase/client'
import { aSnake, mapearFilas } from './mapeo'
import { USAR_MOCKS } from './config'

/**
 * Repositorio del módulo de recaudación. Ver docs/RECAUDACION.md.
 * `suscribir` es lo que hace posible el momento clave del pitch:
 * el municipio ve aparecer la fila sin refrescar.
 */
export interface HechosImponiblesRepo {
  listar(municipio: string): Promise<HechoImponible[]>
  crear(h: Omit<HechoImponible, 'id'>): Promise<HechoImponible>
  marcarPagado(id: string): Promise<void>
  suscribir(alCambiar: () => void): () => void
}

const enMemoria: HechoImponible[] = []

const repoMock: HechosImponiblesRepo = {
  async listar(municipio) {
    return enMemoria.filter((h) => h.municipio === municipio)
  },
  async crear(h) {
    const nuevo: HechoImponible = { ...h, id: crypto.randomUUID() }
    enMemoria.unshift(nuevo)
    oyentes.forEach((fn) => fn())
    return nuevo
  },
  async marcarPagado(id) {
    const h = enMemoria.find((x) => x.id === id)
    if (h) {
      h.estado = 'pagado'
      h.pagadoEn = new Date().toISOString()
    }
    oyentes.forEach((fn) => fn())
  },
  suscribir(alCambiar) {
    oyentes.add(alCambiar)
    return () => oyentes.delete(alCambiar)
  },
}

const oyentes = new Set<() => void>()

const repoSupabase: HechosImponiblesRepo = {
  async listar(municipio) {
    const { data, error } = await supabase
      .from('hechos_imponibles')
      .select('*')
      .eq('municipio', municipio)
      .order('generado_en', { ascending: false })
    if (error) throw error
    return mapearFilas<HechoImponible>(data)
  },
  async crear(h) {
    const { data, error } = await supabase
      .from('hechos_imponibles')
      .insert(aSnake({ ...h }))
      .select()
      .single()
    if (error) throw error
    return mapearFilas<HechoImponible>([data])[0]
  },
  async marcarPagado(id) {
    const { error } = await supabase
      .from('hechos_imponibles')
      .update({ estado: 'pagado', pagado_en: new Date().toISOString() })
      .eq('id', id)
    if (error) throw error
  },
  suscribir(alCambiar) {
    const canal = supabase
      .channel('hechos_imponibles_cambios')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'hechos_imponibles' }, alCambiar)
      .subscribe()
    return () => {
      void supabase.removeChannel(canal)
    }
  },
}

export const hechosImponiblesRepo: HechosImponiblesRepo = USAR_MOCKS ? repoMock : repoSupabase
