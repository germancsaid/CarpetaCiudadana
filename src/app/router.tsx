import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ROUTES } from './routes'
import { AppShell } from '@/shared/layout/AppShell'
import { Placeholder } from '@/shared/ui'
import { TramitesPage } from '@/features/tramites'
import { RecaudacionPage } from '@/features/recaudacion'
import { VaultPage } from '@/features/vault'
import { VinculosPage } from '@/features/vinculos'

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
      { path: ROUTES.vault, element: <VaultPage /> },
      { path: ROUTES.vinculos, element: <VinculosPage /> },
      { path: ROUTES.tramites, element: <TramitesPage /> },
      { path: ROUTES.vehiculo, element: <Placeholder title="Caso: Vehículo" /> },
      { path: ROUTES.verificador, element: <Placeholder title="Panel Verificador" /> },
      { path: ROUTES.recaudacion, element: <RecaudacionPage /> },
    ],
  },
])
