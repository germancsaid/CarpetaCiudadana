# ADR-0002: Sin Asistente IA en la fase 1

**Fecha:** 2026-09-13 · **Estado:** aceptado

## Contexto

El prompt original incluía una vista `/asistente` con llamadas directas a la API de Anthropic desde el
navegador usando `VITE_ANTHROPIC_API_KEY`. Problemas: (1) la key queda expuesta en el bundle, (2) el
modelo indicado (`claude-sonnet-4-6`) no existe, (3) una demo en vivo que depende de una API externa
puede fallar en el peor momento.

## Decisión

No se implementa el asistente en esta fase. El foco es vault, vínculos, trámites, verificador y
**recaudación** (el diferenciador). La ruta `/asistente` no existe en `routes.ts`.

## Cuándo reabrir

Si se retoma: la key va en una Edge Function de Supabase (nunca en el cliente), modelo `claude-sonnet-5`,
y respuestas con fallback pre-escrito para el pitch. Registrar en un ADR nuevo.
