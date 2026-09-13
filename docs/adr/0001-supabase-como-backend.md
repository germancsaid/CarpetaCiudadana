# ADR-0001: Supabase como backend en lugar de localStorage

**Fecha:** 2026-09-13 · **Estado:** aceptado

## Contexto

El prompt original pedía toda la persistencia en `localStorage`. El objetivo real es un pitch a
gobernación donde el momento clave es: el ciudadano completa un paso y **el funcionario lo ve
en otra pantalla, en tiempo real**. Con `localStorage` ambos actores viven en el mismo navegador
y ese momento no existe.

## Decisión

Supabase (Postgres + Realtime) como única persistencia. Sin backend propio.
Cada repositorio en `services/` tiene implementación mock y supabase, elegida por `VITE_USE_MOCKS`.

## Consecuencias

- (+) Demo de dos actores creíble. Datos compartidos entre dispositivos.
- (+) El front se desarrolla contra mocks sin esperar la DB.
- (−) Dependencia de red durante el pitch → mitigado por el modo mocks como fallback.
- (−) RLS deshabilitado en demo; hay que activarlo antes de cualquier URL pública.
