import { Outlet } from 'react-router-dom'
import { Sidebar, NavMovil } from './Sidebar'
import { TopBar } from './TopBar'

/** Layout raíz: sidebar fijo + top bar + área de contenido. Las páginas van en <Outlet />. */
export function AppShell() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="flex-1 p-4 pb-20 md:p-8 md:pb-8">
          <div className="mx-auto max-w-[1100px]">
            <Outlet />
          </div>
        </main>
      </div>
      <NavMovil />
    </div>
  )
}
