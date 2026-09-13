import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { ROUTES } from './routes'
import { haySesion } from '@/services/sesion'
import { AppShell } from '@/shared/layout/AppShell'
import { LoginPage } from '@/features/login'
import { TramitesPage } from '@/features/tramites'
import { RecaudacionPage } from '@/features/recaudacion'
import { VaultPage } from '@/features/vault'
import { VinculosPage } from '@/features/vinculos'
import { VerificadorPage } from '@/features/verificador'
import { VehiculoPage } from '@/features/vehiculo'
import { InicioPage } from '@/features/inicio'

/** Sin sesión → login. La sesión es simulada (ver services/sesion.ts). */
function RequiereSesion() {
  return haySesion() ? <Outlet /> : <Navigate to={ROUTES.login} replace />
}

/**
 * Cada feature exporta su página desde src/features/<nombre>/index.ts.
 * Agregar una ruta = ROUTES en routes.ts + entrada acá + ítem en shared/layout/nav.ts.
 */
export const router = createBrowserRouter([
  { path: ROUTES.login, element: <LoginPage /> },
  {
    element: <RequiereSesion />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: ROUTES.inicio, element: <InicioPage /> },
          { path: ROUTES.vault, element: <VaultPage /> },
          { path: ROUTES.vinculos, element: <VinculosPage /> },
          { path: ROUTES.tramites, element: <TramitesPage /> },
          { path: ROUTES.vehiculo, element: <VehiculoPage /> },
          { path: ROUTES.verificador, element: <VerificadorPage /> },
          { path: ROUTES.recaudacion, element: <RecaudacionPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to={ROUTES.inicio} replace /> },
])
