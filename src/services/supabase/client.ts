import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  throw new Error(
    'Faltan VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Copiá .env.example a .env.local',
  )
}

/**
 * Única instancia del cliente. Las features NO importan esto directamente:
 * usan un repositorio en src/services/<entidad>.ts (ver docs/ARCHITECTURE.md).
 */
export const supabase = createClient(url, anonKey)
