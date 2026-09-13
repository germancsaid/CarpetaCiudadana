import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { USAR_MOCKS } from '../config'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * Cliente único. En modo mocks no se necesitan credenciales: se devuelve un proxy
 * que falla con un mensaje claro sólo si alguien lo usa por error.
 * Las features NO importan esto: van por un repositorio de src/services.
 */
function crear(): SupabaseClient {
  if (url && anonKey) return createClient(url, anonKey)

  if (USAR_MOCKS) {
    return new Proxy({} as SupabaseClient, {
      get() {
        throw new Error(
          'Se intentó usar Supabase con VITE_USE_MOCKS=true. Revisá el repositorio que lo llamó.',
        )
      },
    })
  }

  throw new Error(
    'Faltan VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Copiá .env.example a .env.local, ' +
      'o poné VITE_USE_MOCKS=true para trabajar sin base de datos.',
  )
}

export const supabase = crear()
