# Brief de Rediseño — CarpetaCiudadana estilo Apple (Demo completa)

> **Para quien lo implemente (IA o dev):** este documento es la única fuente que necesitás. Contiene
> visión de producto, sistema de diseño, flujos pantalla por pantalla y checklist de "qué tiene que
> funcionar de verdad" para una demo en vivo. Leé también `CLAUDE.md` y `docs/` en la raíz del repo —
> las reglas duras de ahí (stack, estructura de carpetas, tokens, nomenclatura) siguen aplicando.
> Este brief no las reemplaza, las extiende con dirección de diseño y flujos nuevos.

## 0. Objetivo

Hoy `CarpetaCiudadana` es funcionalmente correcta pero visualmente genérica. El objetivo es
convertirla en una demo que se sienta **premium, simple y con calidad de producto Apple** —
pensada para impresionar a la Gobernación de Santa Cruz en una demo en vivo, con **todos los
botones funcionando de verdad** (nada de mockups estáticos: cada clic debe llevar a algún lado).

No es un rediseño visual superficial. Es repensar cada pantalla con la misma disciplina que un
equipo de diseño de Apple: menos elementos, más jerarquía, movimiento con propósito, y una
sensación física al tocar cada componente.

---

## 1. Principios de diseño (no negociables)

1. **Claridad sobre densidad.** Si una pantalla tiene más de 3 ideas compitiendo por atención, está
   mal. Un foco por pantalla. El resto es soporte.
2. **El contenido es la interfaz.** Menos chrome, menos bordes, menos líneas divisorias. El espacio
   en blanco separa, no las líneas.
3. **Profundidad con propósito.** Sombras suaves y blur (`backdrop-filter`) para indicar jerarquía
   (modal sobre contenido, tarjeta flotante), nunca como decoración.
4. **Movimiento con intención.** Cada transición explica una relación causal: un documento que se
   sube *vuela* hacia la carpeta; un trámite que avanza *desliza* la barra de progreso, no la
   reemplaza de golpe. Duración 200–350ms, easing `cubic-bezier(0.4, 0, 0.2, 1)`.
5. **Feedback inmediato y físico.** Todo elemento interactivo responde en <100ms al toque: un
   `scale(0.97)` sutil al presionar, un halo de foco visible, nunca un clic "mudo".
6. **Accesibilidad no es opcional.** Contraste AA mínimo, `aria-label` en todo ícono sin texto,
   navegación completa por teclado, tamaños de touch-target ≥44px.
7. **Un solo idioma visual.** Si usamos esquinas redondeadas de 16px en las cards, TODAS las cards
   usan 16px. Cero inconsistencia entre pantallas.

---

## 2. Sistema de diseño

### 2.1 Tipografía

Usar la pila de sistema (se ve nativa en cada SO, cero flash de fuente sin cargar, cero costo de red):

```css
font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display",
  "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
```

Escala tipográfica (inspirada en Apple HIG — generosa, con saltos grandes entre niveles):

| Uso | Tamaño | Peso | Tracking |
|---|---|---|---|
| Hero / título de bienvenida | 40–48px | 700 (bold) | -0.02em |
| Título de sección | 28–32px | 700 | -0.01em |
| Título de card | 17–19px | 600 | normal |
| Cuerpo | 15–16px | 400 | normal |
| Caption / metadata | 12–13px | 500 | 0.01em |

Nada de mayúsculas forzadas salvo micro-etiquetas (eyebrows) de 11–12px con tracking amplio.

### 2.2 Color

Mantener la base teal/navy del proyecto (`src/index.css`) pero con la lógica de "un color domina,
uno acompaña, uno acentúa" — sin usar el azul genérico de siempre:

- **Superficie primaria:** blanco puro `#FFFFFF` (light) / `#000000` o `#0B0B0C` verdadero (dark) —
  Apple no usa grises oscuros como fondo raíz, usa negro real con superficies elevadas en gris.
- **Superficie elevada (cards, sheets):** `#F5F5F7` (light) / `#1C1C1E` (dark) — el gris exacto de
  macOS/iOS.
- **Acento primario:** el teal existente del proyecto — usarlo para acciones primarias, focus rings,
  y nada más (no como color decorativo de fondo en todos lados).
- **Éxito / verificado:** verde sistema `#34C759`. **Alerta:** ámbar `#FF9F0A`. **Error:** rojo
  `#FF3B30`. Son los colores semánticos de iOS — la gente ya los reconoce sin pensar.
- **Modo oscuro real**, no solo invertido: revisar cada pantalla en dark, no asumir que funciona solo.

### 2.3 Espaciado y geometría

- Grid de espaciado en múltiplos de 4px (4, 8, 12, 16, 24, 32, 48, 64).
- Radio de esquina: 12px en botones e inputs, 16–20px en cards, 28px+ en sheets/modales grandes
  (así se ve un modal de iOS, con curvatura mucho más pronunciada que la de un botón).
- Sombra de card en reposo: `0 1px 2px rgba(0,0,0,.04), 0 8px 24px rgba(0,0,0,.06)`. Al hover/focus,
  elevar levemente (`translateY(-2px)`) y aumentar la sombra — nunca solo cambiar el borde.

### 2.4 Componentes clave a definir una sola vez y reusar

- **Botón primario:** pill o radio 12px, texto 16/600, alto 48px mínimo, transición de escala al
  presionar.
- **Sheet modal:** entra desde abajo en mobile (como un modal de iOS), desde el centro con fade+scale
  en desktop. Blur de fondo (`backdrop-filter: blur(20px)`) sobre el contenido detrás.
- **Barra de progreso segmentada:** ya existe el patrón (pasos del trámite) — refinar con animación
  de "llenado" fluida en vez de salto instantáneo.
- **Toast / confirmación:** aparece arriba, centrado, con ícono + texto, se retira solo a los 3s —
  patrón idéntico al de macOS al copiar algo.
- **Empty state:** ilustración simple en línea (no fotos de stock), texto corto, un solo CTA.

---

## 3. El sistema completo de la demo (de punta a punta)

La demo tiene que poder correrse de corrido, sin cortes, mostrando un flujo humano real. Estos son
los momentos, en orden:

### 3.1 Login / Bienvenida

Hoy no existe una pantalla de entrada — la app arranca directo en `/inicio`. Agregar:

- Pantalla `/` con fondo a pantalla completa (gradiente sutil teal→navy oscuro, o una foto
  desenfocada de Santa Cruz de noche), logo centrado, y un solo botón: **"Ingresar con mi Carpeta
  Ciudadana"**.
- Al tocar, simular reconocimiento biométrico: un ícono de huella o Face ID estilizado que hace una
  animación de "escaneo" (~1.2s) y luego transiciona con fade a `/inicio`. Es 100% simulado (no hay
  biometría real), pero *se siente* como iniciar sesión en un iPhone.
- Alternativa de acceso: "Ingresar con CI y contraseña" como link secundario chico, por si alguien
  quiere mostrar ese camino — lleva a un form simple, también simulado (cualquier valor entra).
- Guardar en `sessionStorage` que el usuario "inició sesión" para no repetir la pantalla al navegar
  — y agregar un botón de logout real en el perfil del sidebar que vuelve a `/`.

### 3.2 Primer vistazo — Inicio

Ya está especificado en `docs/SPEC.md` §1. Mejorarlo con:

- El hero "Buenos días, Carlos" debe calcular el saludo según la hora real (`Buenos días` /
  `Buenas tardes` / `Buenas noches`) — un detalle que Apple sí cuida y que nadie más hace.
  (Sin diagnóstico de nada real, es puro saludo por hora del sistema.)
- Las 3 pills de stats y el grid 2×2 deben animar sus números desde 0 hasta el valor final al
  cargar la vista (count-up de ~600ms), no aparecer estáticos.
- Card de trámite activo: el botón "Continuar trámite →" debe llevar de verdad a `/tramites` con el
  trámite correcto ya expandido, no a un `#`.

### 3.3 Mi Carpeta — con documentos de ejemplo reales

**Problema actual:** el modal de "subir documento" es un mock sin archivo real detrás. Para que la
demo se sienta completa, agregar documentos de ejemplo reales al repo:

- Crear `src/mocks/sample-docs/` con 3–4 PDFs/imagenes de ejemplo genéricas y no sensibles
  (generar con datos ficticios, nunca datos reales de una persona): un carnet de identidad de
  muestra, un RUAT de muestra, un contrato de muestra. Pueden ser PDFs simples generados con texto
  placeholder — lo importante es que **existan como archivo real** para poder abrirlos, previsualizarlos
  y "enviarlos" durante la demo.
- El flujo de subida debe aceptar arrastrar-y-soltar un archivo real (drag & drop con feedback
  visual: el drop-zone se ilumina y crece levemente al arrastrar algo encima) y también aceptar que
  el usuario elija uno de los "documentos de ejemplo" con un botón "Usar documento de ejemplo" para
  no depender de que el presentador tenga un archivo a mano en el momento.
- Cada documento en la carpeta debe tener una acción real de **"Ver documento"** que abre una
  previsualización a pantalla completa (sheet modal con blur de fondo) del PDF/imagen real.

### 3.4 Nuevo flujo: enviar un documento a un abogado

Esta es la pieza que falta y que conecta todo el sistema (hoy los "vínculos tokenizados" solo se
consumen, nunca se generan desde la carpeta del ciudadano). Agregar:

- En cada card de documento en Mi Carpeta, una acción **"Enviar a un abogado"** (ícono de compartir,
  estilo share sheet de iOS).
- Al tocar, abre un sheet modal tipo AirDrop: lista de "abogados/notarías sugeridos" (mock, 3–4
  nombres con su colegio/matrícula, tomados de los emisores certificados que ya están en
  `docs/SPEC.md` §6 — Consorcio Abogados del Oriente, Notaría N°14, etc.), con buscador arriba.
- Al elegir uno, animación de envío (el documento "vuela" hacia el nombre elegido, ~500ms) y
  aparece un estado de progreso: **Enviado → Visto por el abogado → Token generado**. Cada estado
  tarda unos segundos (simulado con `setTimeout`), con un pequeño indicador tipo "escribiendo..."
  entre paso y paso para que se sienta vivo.
- Cuando llega a "Token generado", el nuevo vínculo tokenizado aparece automáticamente en
  `/tokens` (mismo store/estado compartido) con un halo o animación de "recién llegado" la primera
  vez que se visita esa pantalla.
- Esto le da al pitch una historia completa: *"Carlos sube su documento → se lo manda a su abogado
  desde la app → en minutos tiene un vínculo tokenizado listo para usar en el trámite"* — hoy ese
  puente no existe visualmente.

### 3.5 Trámites — que el botón "Iniciar trámite" funcione de verdad

Ya está especificado el modal ("¿Querés que analicemos tu carpeta...") en `docs/SPEC.md` §4. Confirmar
en la implementación que:

- El botón "Iniciar trámite" de cualquiera de las 6 cards de "Disponibles" dispara el modal, y al
  confirmar, **crea de verdad** una nueva entrada en el estado de trámites (no es decorativo),
  marca como completados los pasos que ya cubre el vault (comparando contra los documentos que el
  usuario realmente tiene cargados en Mi Carpeta), y navega a la vista de ese trámite con su
  timeline ya armado.
- El trámite de vehículo (el que ya está armado como demo principal) debe poder **avanzar de
  verdad** al tocar cada paso disponible: completar el paso 4 (DIPROVE) con un botón "Simular
  respuesta DIPROVE" que lo marca ✅ tras 2s, habilitando el paso 5.
- Al completar el paso 5 (firma), disparar el cálculo real de `calcularHechoImponible` (ya
  especificado en `docs/RECAUDACION.md`) y reflejarlo en el paso 6 y en `/recaudacion` en tiempo
  real — este es el clímax del pitch, tiene que andar sin fallar.

### 3.6 Verificador y Recaudación

Mantener el diseño funcional ya especificado (`docs/SPEC.md` §6 y §7), aplicando el sistema visual
nuevo: cards elevadas, colores semánticos consistentes (verde=válido, rojo=inválido, ámbar=pendiente),
y las animaciones de carga (spinner de 2s) reemplazadas por un patrón más Apple: un pulso suave en
el botón + skeleton loader en el resultado, no un spinner circular genérico.

---

## 4. Ideas adicionales (pensar como equipo de producto de Apple)

Elementos que elevan la demo más allá de lo pedido — implementar los que el tiempo permita, en este
orden de impacto:

1. **Pastilla flotante de trámite activo** (estilo Dynamic Island): mientras el trámite de Carlos
   está en curso, una pequeña pastilla persistente aparece en la esquina superior con el % de avance,
   visible en cualquier pantalla de la app — tocarla lleva directo al trámite.
2. **Búsqueda tipo Spotlight** (`Cmd/Ctrl + K`): un overlay centrado con blur de fondo para buscar
   documentos, trámites o tokens sin salir de donde estás.
3. **"Vinculado en vivo"**: cuando dos pestañas del navegador simulan a Carlos y a la Alcaldía
   (el momento clave de `docs/RECAUDACION.md`), mostrar un pequeño indicador de presencia — "María
   está viendo este trámite ahora" — usando el realtime de Supabase que el proyecto ya tiene.
4. **Modo claro/oscuro con transición suave**, siguiendo la preferencia del sistema por defecto
   (`prefers-color-scheme`) con toggle manual en el perfil.
5. **Micro-confirmaciones hápticas visuales**: cuando un documento se verifica o un trámite avanza,
   un pequeño ícono de check dibuja su trazo con una animación SVG (`stroke-dashoffset`), no aparece
   de golpe.

---

## 5. Qué NO hacer

- No agregar dependencias nuevas sin un ADR en `docs/adr/` (regla existente del proyecto).
- No sacar el modo mocks (`VITE_USE_MOCKS=true`) — la demo tiene que poder correr sin conexión a
  Supabase real.
- No usar datos reales de personas para los documentos de ejemplo — todo ficticio.
- No romper las reglas duras de `CLAUDE.md` (imports entre features, tokens Tailwind en vez de hex,
  fechas/montos con `shared/lib/format.ts`, rutas desde `app/routes.ts`).
- No dejar ningún botón visible que no haga nada al tocarlo — si una función no llega a
  implementarse a tiempo, ocultarla o marcarla claramente como "Próximamente", nunca dejarla muerta.

---

## 6. Checklist de entrega para la demo

- [ ] Pantalla de login/bienvenida funcional, con transición a `/inicio`
- [ ] Logout real desde el perfil
- [ ] Saludo dinámico según hora del día
- [ ] Documentos de ejemplo reales en `src/mocks/sample-docs/`, previsualizables
- [ ] Subida de documento por drag&drop o por "usar documento de ejemplo"
- [ ] Flujo completo "enviar documento a un abogado" → genera token real en `/tokens`
- [ ] "Iniciar trámite" crea el trámite de verdad y navega a su timeline
- [ ] Cada paso del trámite de vehículo se puede avanzar en vivo durante la demo
- [ ] Al completar el paso 5, el hecho imponible aparece en `/recaudacion` en tiempo real
- [ ] Modo claro/oscuro probado en todas las pantallas
- [ ] Revisión de accesibilidad básica (contraste, foco visible, `aria-label` en íconos)
- [ ] Ningún botón "muerto" en toda la app

---

## 7. Cómo usar este documento

Pegá este archivo completo (o el link dentro del repo) a tu asistente de código y pedile que lo
implemente siguiendo también las reglas de `CLAUDE.md` y los docs existentes en `docs/`. Sugerencia
de mensaje inicial:

> "Implementá el brief de `docs/BRIEF_DISENO_APPLE_DEMO.md` completo, respetando las reglas de
> `CLAUDE.md`. Empezá por el sistema de diseño (sección 2), después el login (3.1), y andá avisando
> qué vas completando del checklist de la sección 6."
