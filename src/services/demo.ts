import { supabase } from './supabase/client'
import { USAR_MOCKS } from './config'
import { limpiar } from '@/mocks/almacen'

/**
 * Reinicia la demo al estado inicial (Carlos con 7 docs, traspaso al 50%, etc.).
 * Supabase: llama a la función reset_demo() (migración 0002).
 * Mocks: se limpia el localStorage y se recarga (vuelven los datos de src/mocks).
 */
export async function reiniciarDemo(): Promise<void> {
  if (USAR_MOCKS) {
    limpiar()
    window.location.reload()
    return
  }
  const { error } = await supabase.rpc('reset_demo')
  if (error) throw error
}

export const MODO_DEMO = USAR_MOCKS ? 'offline (mocks)' : 'Supabase'
