/**
 * Sesión simulada para la demo (ver ADR-0003). No hay autenticación real:
 * el "login" biométrico es una animación y cualquier CI/contraseña entra.
 * sessionStorage: se pierde al cerrar la pestaña, así cada demo arranca por el login.
 */
const CLAVE = 'carpeta-ciudadana:sesion'

export function haySesion(): boolean {
  try { return sessionStorage.getItem(CLAVE) === '1' } catch { return false }
}

export function iniciarSesion(): void {
  try { sessionStorage.setItem(CLAVE, '1') } catch { /* sin storage: la app funciona igual */ }
}

export function cerrarSesion(): void {
  try { sessionStorage.removeItem(CLAVE) } catch { /* nada */ }
}
