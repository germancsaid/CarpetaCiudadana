import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ROUTES } from './routes'
import { AppShell } from '@/shared/layout/AppShell'
import { Placeholder } from '@/shared/ui/Placeholder'

/**
 * Cada feature exporta su página desde src/features/<nombre>/index.ts.
 * Mientras una feature no exista, se monta <Placeholder /> para que
 * la navegación completa funcione desde el día uno.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to={ROUTES.inicio} replace /> },
      { path: ROUTES.inicio, element: <Placeholder title="Inicio" /> },
      { path: ROUTES.vault, element: <Placeholder title="Mi Carpeta" /> },
      { path: ROUTES.vinculos, element: <Placeholder title="Vínculos Tokenizados" /> },
      { path: ROUTES.tramites, element: <Placeholder title="Mis Trámites" /> },
      { path: ROUTES.vehiculo, element: <Placeholder title="Caso: Vehículo" /> },
      { path: ROUTES.verificador, element: <Placeholder title="Panel Verificador" /> },
      { path: ROUTES.recaudacion, element: <Placeholder title="Recaudación Municipal" /> },
    ],
  },
])
