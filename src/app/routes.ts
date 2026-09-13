/**
 * Rutas canónicas de la app. Importar desde acá, nunca strings sueltos.
 * Agregar una ruta = agregar acá + registrar en router.tsx + item en Sidebar.
 */
export const ROUTES = {
  inicio: '/inicio',
  vault: '/vault',
  vinculos: '/tokens',
  tramites: '/tramites',
  vehiculo: '/vehiculo',
  verificador: '/funcionario',
  recaudacion: '/recaudacion',
} as const

export type RouteKey = keyof typeof ROUTES
