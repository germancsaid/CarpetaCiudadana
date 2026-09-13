# Convenciones

## Idioma

- UI: español boliviano con voseo ("Subí tu documento", "Verificá ahora").
- Código: identificadores en español (`documento`, `vinculo`, `tramite`), sin tildes ni ñ en identificadores.
- Comentarios y commits: español.

## Nombres de archivos

| Cosa | Convención | Ejemplo |
|---|---|---|
| Componente React | PascalCase.tsx | `DocumentoCard.tsx` |
| Página de feature | `<Nombre>Page.tsx` | `VaultPage.tsx` |
| Hook | `use<Nombre>.ts` | `useDocumentos.ts` |
| Repositorio | `<entidad>.ts` en services | `services/vinculos.ts` |
| Helpers | camelCase.ts | `format.ts` |
| Tipos | en `shared/types/domain.ts` | — |

Un componente por archivo. Export nombrado (no default) salvo `App.tsx`.

## Componentes

- Función declarada: `export function DocumentoCard(props: DocumentoCardProps)`.
- Props tipadas con `interface` justo arriba del componente.
- Sin `React.FC`.
- Handlers: `onVerificar`, `onCerrar` (prop) → `handleVerificar` (implementación).
- Estados asíncronos siempre con los tres: `loading`, `error`, `data`. Mostrar `Skeleton` / mensaje / contenido.

## Estilos — Tailwind con tokens

Los colores viven en `src/index.css` como `@theme`. Usar:

| Uso | Clase |
|---|---|
| Fondo sidebar | `bg-sidebar` |
| Fondo página | `bg-page` |
| Tarjeta | `bg-card border border-border rounded-card shadow-sm` |
| Botón primario | `bg-accent text-white rounded-control hover:bg-accent/90 min-h-11` |
| Texto | `text-ink` / `text-ink-secondary` / `text-ink-muted` |
| Estado vigente | `bg-success-light text-success-text` |
| Estado por vencer | `bg-warning-light text-warning-text` |
| Estado vencido | `bg-danger-light text-danger-text` |

Nunca `#1a5cff` inline. Nunca `style={{}}` salvo para valores dinámicos (ancho de progress bar).
Botones e inputs: altura mínima 44px (`min-h-11`) por touch.

## Formato de datos

- Fechas: `formatFecha()` → `15/03/2028`. Nunca `toLocaleDateString` suelto.
- Montos: `formatBs()` → `Bs. 12.500`. `formatUsd()` → `USD 12.500`.
- CI: `8.234.567 SC`. Placa: `2345-SCC`. Teléfono: `+591 7X XXX-XXXX`.
- Token ID: `TOK-YYYY-NNNNN`.

## Estados (strings, no enums TS)

`vigente | por_vencer | vencido | pendiente` etc. Definidos en `domain.ts`. La UI mapea a etiqueta con un objeto `ETIQUETAS_ESTADO`, no con `if` sueltos.

## Simulaciones de la demo

Todo lo que "verifica", "escanea" o "analiza" debe mostrar un estado de carga real de 1.5–2 s antes del resultado. Centralizar en `shared/lib/simular.ts` → `await esperar(2000)`.

## Commits

Conventional Commits en español:

```
feat(vault): tarjeta de documento con campos OCR
fix(vinculos): estado vencido no mostraba fecha
docs: ADR sobre estado global
chore: actualizar dependencias
```

Scope = nombre de la feature o capa (`vault`, `tramites`, `shared`, `services`, `db`).
