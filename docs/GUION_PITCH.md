# Guion del pitch — CarpetaCiudadana

Duración objetivo: **8 minutos** de demo + preguntas. Dos pantallas, una historia.

## Preparación (15 min antes)

| Qué | Cómo | Por qué |
|---|---|---|
| Dos dispositivos con la URL abierta | Laptop A = ciudadano (`/inicio`) · Laptop B o tablet = municipio (`/recaudacion`) | Es el momento clave: dos actores, una verdad |
| Reiniciar la demo | Pie del sidebar → "Reiniciar demo" → confirmar | Fechas frescas ("hace 2 horas", "vence en 8 días"), sin liquidaciones previas |
| Probar la red | Abrir `/recaudacion` en B, y en A avanzar el paso 4. Si en B no se mueve nada, hay problema de red | El realtime es lo primero que muere con wifi malo |
| Plan B listo | Laptop A con `npm run dev:mocks` corriendo en `localhost:5174` **antes** de empezar | Si cae la red, se cambia de pestaña y se sigue (sin la pantalla B) |
| Video de respaldo | Grabar una vez el momento de la fila apareciendo en B | Si falla todo, se muestra el video |
| Zoom del navegador | 110–125 % en ambas pantallas | Que se lea desde 3 metros |
| Cerrar todo lo demás | Notificaciones del sistema, otras pestañas, Slack | Nada que distraiga sobre la pantalla proyectada |

## Estructura

### 0. El problema (1 min, sin pantalla)

> "Hoy, para vender un auto en Santa Cruz, una persona visita entre 4 y 7 oficinas, en 15 a 30 días.
> Y el municipio se entera de la venta sólo si el ciudadano va a declararla. Muchas veces no va."

Dos problemas en uno: burocracia para el ciudadano, evasión para el municipio. La solución resuelve los dos con la misma pieza.

### 1. La carpeta (1,5 min — pantalla A)

`/inicio` → `/vault`

- "Carlos ya tiene sus 7 documentos acá. No los subió el Estado: los subió él, con OCR."
- Mostrar un documento → campos extraídos. Filtrar "Por vencer" → Matrícula de Comercio.
- **No** subir un documento en vivo (son 3 s de espera que no aportan). Sólo si preguntan.

### 2. Los vínculos tokenizados (1,5 min — pantalla A)

`/tokens`

- "Esto es lo distinto. El contrato de compraventa no está en la carpeta de Carlos. Está en el estudio de abogados que lo hizo. Carlos tiene un **vínculo firmado** que apunta a él."
- Click **Verificar** en el Contrato → 2 s → "Verificado — documento válido".
- Señalar el token vencido (Due Diligence): "Y si venció, el sistema lo sabe. No se puede falsificar una fecha."

Pregunta que van a hacer: *"¿Cómo sé que el token no es falso?"* → "El emisor firma con su clave privada. La Alcaldía tiene la pública. Sólo emisores certificados por Gobernación pueden emitir. Hoy la firma es simulada; en producción es criptográfica."

### 3. El trámite (2 min — pantalla A)

`/tramites`

- "Traspaso vehicular. 6 pasos. Los primeros 3 se completaron **solos**: el sistema encontró el RUAT en la carpeta y los tokens del abogado."
- Paso 4: "Estamos esperando a DIPROVE." → **Simular llegada del certificado** → 2 s → paso 4 ✅, paso 5 se desbloquea.
- "Ahora Carlos y María firman ante notaría, digitalmente."

### 4. El momento (1 min — las dos pantallas)

- Pedir a la audiencia que mire la **pantalla B** (municipio, vacía: "0 hechos imponibles").
- En A: **Firmar digitalmente** → 2 s.
- **En B aparece la fila sola, resaltada: Bs. 3.060.** Silencio de 3 segundos. Dejar que lo vean.
- "El municipio no tuvo que pedir nada. No hubo formulario. La venta se firmó y la liquidación existe. Impuesto del 3 % sobre la base imponible, más el arancel."
- En B: **Ver detalle** → mostrar el desglose: "La base es el mayor entre lo declarado y el valor fiscal del RUAT. Declarar menos no baja el impuesto."

### 5. El cierre del ciclo (1 min — las dos pantallas)

- En B: **Marcar como pagado**.
- En A, sin tocar nada: el paso 6 pasa a completado, trámite al 100 %.
- "Dos a cuatro días. Cero visitas. Y el municipio recaudó."

### 6. El verificador (opcional, si sobra tiempo — pantalla B)

`/funcionario` → Token `TOK-2026-00341`, CI `8.234.567` → Verificar → válido. Probar con `TOK-2026-00189` → vencido.
"Cualquier funcionario, en cualquier ventanilla, verifica en 2 segundos sin llamar a nadie."

## Preguntas probables

| Pregunta | Respuesta corta |
|---|---|
| ¿Los porcentajes son los reales? | Son parámetros. El 3 % es la referencia del IMT; cada municipio carga los suyos. |
| ¿Y los inmuebles? | Mismo mecanismo, distinta base (catastro en vez de RUAT). Está modelado, falta la vista. |
| ¿Quién certifica a los emisores? | Gobernación o Alcaldía, mediante registro. Sin certificación, el token no verifica. |
| ¿Qué pasa con los que no tienen celular? | El funcionario opera la carpeta por ellos en ventanilla. La verificación es la misma. |
| ¿Cuánto cuesta? | (Preparar la respuesta con el equipo comercial.) |
| ¿Se integra con RUAT / SEGIP / DIPROVE? | Hoy simulado. Cada integración es un conector; el modelo de datos ya los contempla. |

## Si algo falla

| Síntoma | Acción |
|---|---|
| En B no aparece la fila | Refrescar B (F5). La fila está en la base; sólo falló el push. Seguir. |
| A se queda cargando | Cambiar a la pestaña `localhost:5174` (modo offline). Contar el momento con el video. |
| Se hizo click de más | "Reiniciar demo" al pie del sidebar. 3 segundos. |
| Se cortó todo | Video de respaldo + capturas. Volver al discurso del problema. |
