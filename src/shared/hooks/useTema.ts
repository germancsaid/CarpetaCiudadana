import { useCallback, useEffect, useState } from 'react'

export type Tema = 'light' | 'dark' | 'system'
const CLAVE = 'carpeta-ciudadana:tema'

function leer(): Tema {
  try {
    const t = localStorage.getItem(CLAVE)
    if (t === 'light' || t === 'dark') return t
  } catch { /* sin storage */ }
  return 'system'
}

function aplicar(t: Tema) {
  const raiz = document.documentElement
  if (t === 'system') delete raiz.dataset.theme
  else raiz.dataset.theme = t
}

/** Tema claro/oscuro. Por defecto sigue al sistema; el toggle manual persiste en localStorage. */
export function useTema() {
  const [tema, setTema] = useState<Tema>(leer)

  useEffect(() => { aplicar(tema) }, [tema])

  const cambiar = useCallback((t: Tema) => {
    setTema(t)
    try {
      if (t === 'system') localStorage.removeItem(CLAVE)
      else localStorage.setItem(CLAVE, t)
    } catch { /* sin storage */ }
  }, [])

  const esOscuro = tema === 'dark' || (tema === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  return { tema, esOscuro, cambiar, alternar: () => cambiar(esOscuro ? 'light' : 'dark') }
}
