import { Link, useLocation } from 'react-router-dom'
import { NAV } from './nav'

/**
 * Tira de navegación estilo "roadmap" — cada sección de la app como una
 * parada conectada por una línea, la actual resaltada y pulsando. Reemplaza
 * el breadcrumb plano por algo más dinámico/visual (pedido: "que se vea
 * como un roadmap o progreso"), inspirado en la nav sticky y minimal de
 * apple.com/la.
 */
export function RoadmapNav() {
  const { pathname } = useLocation()
  const indiceActual = NAV.findIndex((n) => n.to === pathname)

  return (
    <nav aria-label="Progreso en la app" className="scrollbar-none -mx-4 flex items-center gap-0 overflow-x-auto px-4 md:mx-0 md:px-0">
      {NAV.map((item, i) => {
        const activo = i === indiceActual
        const pasado = indiceActual >= 0 && i < indiceActual
        return (
          <div key={item.to} className="flex shrink-0 items-center">
            <Link
              to={item.to}
              className={`group flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium whitespace-nowrap transition ${
                activo ? 'bg-accent text-white shadow-sm' : pasado ? 'text-accent-text hover:bg-accent-light' : 'text-ink-muted hover:bg-card-2 hover:text-ink'
              }`}
            >
              <span
                className={`flex size-1.5 shrink-0 rounded-full transition ${
                  activo ? 'animate-latir bg-white' : pasado ? 'bg-accent' : 'bg-border'
                }`}
                aria-hidden
              />
              {item.label}
            </Link>
            {i < NAV.length - 1 && (
              <span className={`h-px w-4 shrink-0 transition md:w-6 ${pasado ? 'bg-accent' : 'bg-border'}`} aria-hidden />
            )}
          </div>
        )
      })}
    </nav>
  )
}
