# CarpetaCiudadana — guía para Claude Code

Billetera ciudadana digital para Bolivia (Santa Cruz). Demo/pitch para gobernación.
Objetivo de negocio: centralizar documentos del ciudadano **y** que el municipio se entere
automáticamente de cada transferencia de bienes (vehículos, inmuebles) para liquidar tarifas.

**Todo el texto de UI en español boliviano (voseo: "subí", "verificá").** Código y comentarios en español.

## Antes de tocar código, leé

1. `docs/ARCHITECTURE.md` — capas, dónde va cada cosa, reglas de dependencia.
2. `docs/CONVENTIONS.md` — nombres, estilos, tokens de diseño, formato de fechas/montos.
3. `docs/SPEC.md` — qué debe hacer cada vista (fuente de verdad funcional).
4. `docs/DATA_MODEL.md` — entidades y tablas.
5. `docs/RECAUDACION.md` — el módulo diferenciador.
6. `docs/WORKFLOW.md` — cómo trabajamos en equipo con git.

## Stack (no agregar dependencias sin ADR en `docs/adr/`)

Vite 8 · React 19 · TypeScript 6 · Tailwind 4 (tokens en `src/index.css`) ·
react-router-dom 7 · lucide-react · Supabase (Postgres + Realtime). Sin backend propio.
**No hay Asistente IA en esta fase** (decisión del equipo, ver ADR-0002).

## Comandos

```bash
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build — debe pasar antes de cada PR
npm run lint     # oxlint
```

## Estructura

```
src/
  app/          router.tsx, routes.ts — solo wiring
  features/     una carpeta por vista. Cada una exporta su Page desde index.ts
  shared/       ui/ (componentes puros), layout/, hooks/, lib/, types/domain.ts
  services/     acceso a datos: supabase/client.ts + un repositorio por entidad
  mocks/        datos de demo (Carlos Mendoza, Toyota Corolla, tokens TOK-2025-*)
supabase/migrations/   SQL versionado. Reflejar en domain.ts
docs/           documentación viva del proyecto
```

## Reglas duras

- **Features no se importan entre sí.** Comparten vía `shared/` o `services/`.
- **Nada de hex en componentes.** Usar tokens Tailwind (`bg-accent`, `text-ink-muted`…).
- **Nada de `supabase` directo en features.** Pasar por `services/<entidad>.ts`.
- **Fechas `DD/MM/YYYY`, montos `Bs. 12.500`**: usar `shared/lib/format.ts`.
- **Tipos en `shared/types/domain.ts`** son la verdad. Cambiar tipo ⇒ cambiar migración.
- **Rutas desde `app/routes.ts`**, nunca strings sueltos.
- `npm run build` verde antes de pushear. Commits en español, formato Conventional Commits.
- Los datos del ciudadano demo (Carlos Mendoza, CI 8.234.567 SC) viven en `src/mocks/`; no inventar otros.

## Cómo agregar una feature nueva

Usá el comando `/feature <nombre>` (definido en `.claude/commands/feature.md`).
