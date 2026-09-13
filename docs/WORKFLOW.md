# Flujo de trabajo en equipo

## Setup (5 minutos)

```bash
git clone https://github.com/germancsaid/CarpetaCiudadana.git
cd CarpetaCiudadana
npm install
cp .env.example .env.local     # ya trae las credenciales del proyecto Supabase del equipo
npm run dev
```

## Base de datos (Supabase)

Proyecto: **carpeta-ciudadana** (`jqpjowojidbowsapmtgu`, sa-east-1). Esquema en `supabase/migrations/`,
datos de demo en `supabase/seed.sql`. Ya está aplicado y cargado.

**Resetear la demo al estado inicial** (antes de un ensayo, o si alguien rompió datos): correr
`supabase/seed.sql` completo en el SQL Editor del dashboard. Es idempotente y usa fechas relativas
a `now()`, así que la demo siempre se ve fresca ("hace 2 horas", "vence en 8 días").

Si cambiás el esquema: nueva migración numerada en `supabase/migrations/`, actualizar
`src/shared/types/domain.ts` y `docs/DATA_MODEL.md` en el mismo commit.

## Reparto por feature (trabajo en paralelo sin conflictos)

Cada persona toma **una carpeta de `src/features/`**. Como las features no se importan entre sí,
dos personas pueden trabajar a la vez sin pisarse. Lo único compartido es `shared/` y `services/`:
si necesitás tocar eso, avisá en el chat del equipo antes.

| Feature | Dependencias en shared/services que necesita |
|---|---|
| `inicio` | `Card`, `ProgressBar`, repos de todo (solo lectura) |
| `vault` | `Badge`, `Modal`, `services/documentos` |
| `vinculos` | `Badge`, `Modal`, `services/vinculos`, `services/verificaciones` |
| `tramites` | `ProgressBar`, `Modal`, `services/tramites`, `lib/tributos` |
| `vehiculo` | `services/tramites` (lectura) |
| `verificador` | `services/vinculos`, `services/verificaciones` + realtime |
| `recaudacion` | `services/hechosImponibles` + realtime |

**Orden sugerido:** primero `shared/ui` + `mocks` + `services` (1 persona, 1 día), después las features en paralelo.

## Ramas

```
main                     ← siempre desplegable. Protegida: solo por PR.
feat/<feature>-<qué>     ← ej. feat/vault-modal-subir
fix/<feature>-<qué>
docs/<qué>
```

1. `git checkout main && git pull`
2. `git checkout -b feat/vault-grid`
3. Trabajar. Commits chicos, Conventional Commits en español.
4. `npm run build` verde.
5. `git push -u origin feat/vault-grid` → abrir PR en GitHub.
6. Un compañero revisa (o `/code-review` con Claude). Merge con **squash**.
7. Borrar la rama.

## Trabajando con Claude Code

- Claude lee `CLAUDE.md` automáticamente. Ahí están las reglas duras.
- Para arrancar una feature: `/feature vault` — crea el esqueleto siguiendo la arquitectura.
- Para revisar antes de PR: `/code-review`.
- Si Claude propone agregar una dependencia o cambiar la estructura, **pedile un ADR** en `docs/adr/`.
- Si cambiás `domain.ts`, pedile que actualice la migración y `DATA_MODEL.md` en el mismo commit.

## Definición de "terminado" para una feature

- [ ] Cumple su sección en `docs/SPEC.md`.
- [ ] Funciona con `VITE_USE_MOCKS=true` **y** con Supabase.
- [ ] Estados loading / error / vacío implementados.
- [ ] Responsive (probar a 375px).
- [ ] Sin hex hardcodeados, sin imports cruzados entre features.
- [ ] `npm run build` verde.
