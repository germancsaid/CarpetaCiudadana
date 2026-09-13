# Especificación funcional

Fuente de verdad de **qué** hace cada vista. Adaptada del prompt original con las decisiones del equipo:
sin Asistente IA por ahora (ADR-0002), persistencia en Supabase (ADR-0001), y módulo de Recaudación agregado.

Ciudadano demo: **Carlos Mendoza Vargas**, CI 8.234.567 SC, Santa Cruz de la Sierra.
Datos exactos en `src/mocks/`. No inventar otros.

---

## Layout global

- Sidebar fijo 260px `bg-sidebar`. Logo "CarpetaCiudadana" + "Bolivia Digital". Card de perfil con iniciales, nombre y CI.
- Nav: Inicio · Mi Carpeta · Vínculos · Trámites · Caso: Vehículo · Verificador · Recaudación.
- Activo: `bg-accent` blanco. Inactivo: gris-400, hover blanco. Pie: "Prometeo © 2026".
- Top bar: título + breadcrumb + buscador + campana con badge rojo (2 notificaciones).
- Contenido: padding 32px, max-width 1100px.
- Mobile: sidebar → barra inferior; grids a 1 columna; botones min 44px.

## 1. Inicio `/inicio`

- Hero oscuro: "Buenos días, Carlos" / "Tu identidad digital está protegida" / 3 pills (4 docs vigentes · 1 trámite activo · 1 token por vencer).
- Grid 2×2: Documentos en vault **7** · Trámites completados **2** · Tokens activos **3** · Días promedio ahorrados **12**.
- Card trámite activo: "Traspaso Vehicular — Toyota Corolla 2019", barra 60% (animada desde 0), "3 de 6 pasos", botón "Continuar trámite →".
- Actividad reciente (5 filas): token verificado (2h) · doc subido RUAT (ayer) · trámite iniciado (3 días) · token generado (3 días) · CI actualizado (1 semana).

## 2. Mi Carpeta `/vault`

- Header: "Mi Carpeta" + badge "7 documentos" + botón "Subir documento".
- Tabs: Todos · Vigentes · Por vencer · Vencidos.
- Grid 2 col. Card: icono + nombre + badge estado / "Emitido · Vence" / bloque OCR gris / acciones Ver · Compartir · ⋯.
- 7 documentos: CI, Cert. Nacimiento, NIT, RUAT 2025, Matrícula Comercio (**por vencer** 12/03/2026), Licencia Conducir, Padrón Municipal. Campos OCR en mocks.
- Modal subir: drop zone → spinner 1.5 s → "OCR en proceso..." 1 s → 4 campos simulados → "Guardar en vault".
- Empty state: "No tenés documentos aún — subí tu primer documento".

## 3. Vínculos Tokenizados `/tokens`

- Tooltip: "Links firmados digitalmente por emisores certificados. El documento vive en la fuente — vos solo tenés el vínculo."
- Banner azul: generados por organizaciones certificadas por Alcaldía o Gobernación; no se pueden falsificar.
- 4 tokens: TOK-2025-00341 Contrato Compraventa (activo) · TOK-2025-00298 Poder Notarial (activo) · TOK-2025-00412 Libre Gravamen (**por vencer**, "Vence en 8 días") · TOK-2025-00189 Due Diligence (**vencido**).
- "Verificar": spinner 2 s → ✓ "Verificado — válido al DD/MM/YYYY HH:MM" o ✗ "Token inválido — vencido el …". Registra en tabla `verificaciones`.
- Modal "Agregar vínculo": emisor, tipo (select), token ID/URL, vencimiento, certificante (select). Validación con mensajes en español. Submit → 2 s → agrega.
- Empty state: "No tenés vínculos — pedile a tu abogado que genere uno".

## 4. Trámites `/tramites`

- Tabs: En progreso (1) · Completados (2) · Disponibles.
- Quest activo "Traspaso Vehicular — Toyota Corolla 2019 — 2345-SCC": 60%, "2–3 días hábiles", "Bs. 850 estimado". Barra segmentada (teal hecho / azul activo / gris bloqueado).
- 6 pasos: (1✅) RUAT vigente — Alcaldía · (2✅) Libre Gravamen — token 00412 · (3✅) Contrato firmado — token 00341 · (4🔄) Antecedentes DIPROVE — "Solicitud #34521 hace 6 h", botón "Ver estado en DIPROVE →" · (5🔒) Firma digital Notaría · (6🔒) Pago arancel Bs. 450 — Alcaldía.
- **Al completar paso 5 se genera el Hecho Imponible** (ver RECAUDACION.md). El paso 6 muestra el monto liquidado real.
- Completados (colapsable): Licencia Funcionamiento 15/09/2025 · Renovación NIT 20/06/2025.
- Disponibles (6 cards): Licencia Funcionamiento ~15 d Bs. 200 · FUNDEMPRESA ~7 d Bs. 150 · Hab. Sanitaria SEDES ~20 d Bs. 100 · Permiso Construcción ~30 d Bs. 500 · Cert. Residencia ~3 d Gratis · NIT Nuevo ~5 d Gratis.
- "Iniciar trámite" → modal "¿Querés que analicemos tu carpeta y armemos el trámite automáticamente?" → 2 s → crea quest con pasos, marcando como completados los que ya cubre el vault.
- Empty state: "No tenés trámites activos — explorá los disponibles".

## 5. Caso Vehículo `/vehiculo`

- Header + subtítulo "El proceso completo digitalizado — sin colas, sin papel perdido".
- Antes (rojo claro): 4–7 visitas · 15–30 días · papel que se pierde · sin visibilidad. Después (teal claro): desde el celular · 2–4 días · tokens irrepudiables · progreso en tiempo real · **municipio recauda automáticamente**.
- Partes: Vendedor Carlos Mendoza (RUAT ✅ CI ✅ Licencia ✅ / tokens Libre gravamen ✅ Contrato ✅) · Compradora María Torres ("Vinculada — esperando paso 4", CI ✅ NIT ✅).
- Timeline vertical con los 6 pasos, estado vivo (mismo dato que Trámites).
- Card vehículo: placeholder foto · Toyota Corolla 2019 · 2345-SCC · Blanco perla · VIN 1HGCM82633A004352 · 87.450 km · USD 12.500.
- Diagrama de flujo: Abogado genera → Token firmado → Carpeta vendedor → Verificado por Alcaldía → **Hecho imponible liquidado** → ✅ Traspaso aprobado.

## 6. Verificador `/funcionario`

- Header "Panel Verificador — Funcionario Público" + badge "Alcaldía Municipal Santa Cruz de la Sierra".
- Form: Token ID · CI · Tipo (select) · botón "Verificar ahora" full width.
- 2 s → card verde (VÁLIDO: token, ciudadano, emisor, certificado por, tipo, válido hasta, última verificación, botón "Registrar verificación") o roja (INVÁLIDO: motivo, recomendación).
- Tabla verificaciones recientes (Fecha · Token · Ciudadano · Tipo · Resultado · Funcionario), 5 filas, **actualizada en tiempo real** vía Supabase. Botón "Exportar CSV".
- Emisores certificados: Consorcio Abogados del Oriente 45 · Notaría N°14 23 · Colegio de Abogados 87 · Estudio Morales 12.

## 7. Recaudación `/recaudacion` — NUEVO

Vista del municipio. Detalle completo en `docs/RECAUDACION.md`.

- Header "Recaudación Municipal — Transferencias de bienes" + badge Alcaldía.
- KPIs: Hechos imponibles del mes · Bs. liquidados · Bs. cobrados · Pendientes de pago.
- Tabla de hechos imponibles en tiempo real: Fecha · Bien · Vendedor → Comprador · Base imponible · Impuesto · Arancel · Total · Estado · acción "Ver detalle".
- Detalle: desglose del cálculo + botón "Marcar como pagado" (simula pasarela) → actualiza paso 6 del trámite del ciudadano en vivo.

## Global

- Notificaciones: "⚠️ Cert. Libre Gravamen vence en 8 días — Renovar" · "⚠️ Matrícula de Comercio vence en 4 meses". Dismiss con X.
- Búsqueda: documentos y tokens por nombre, dropdown inline.
- Skeleton loaders en carga inicial; spinner en acciones; UI optimista.
- Modales: overlay oscuro, cierre por overlay o X.
- Toda verificación/OCR/análisis muestra carga antes del resultado, nunca instantáneo.
