Crear o continuar la feature `$ARGUMENTS` siguiendo la arquitectura del proyecto.

Pasos obligatorios:

1. Leé `docs/SPEC.md` y ubicá la sección de esta feature. Esa es la especificación; no inventes comportamiento.
2. Leé `docs/ARCHITECTURE.md` y `docs/CONVENTIONS.md`.
3. Revisá qué existe ya en `src/shared/ui`, `src/services` y `src/mocks`. Reutilizá antes de crear.
4. Si necesitás un componente genérico que no existe (Badge, Modal, etc.), crealo en `src/shared/ui` y avisá al usuario que es compartido.
5. Si necesitás un repositorio que no existe, crealo en `src/services/<entidad>.ts` con implementación mock y supabase, y datos en `src/mocks/`.
6. Estructura de la feature:
   - `src/features/$ARGUMENTS/index.ts` exportando la Page
   - `src/features/$ARGUMENTS/<Nombre>Page.tsx`
   - `components/` y `hooks/` propios
7. Registrá la Page en `src/app/router.tsx` reemplazando el `<Placeholder />`.
8. Estados loading / error / vacío. Simulaciones con espera de 1.5–2 s.
9. Corré `npm run build`. Tiene que pasar.
10. Resumí qué creaste en shared/services (si algo) para que el equipo lo sepa.

Reglas: sin hex inline, sin imports entre features, sin `supabase` directo en componentes, fechas con `formatFecha`, montos con `formatBs`.
