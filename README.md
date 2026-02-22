# SVG Animations con Next.js y Gemini 3.1 Pro

Este es un proyecto de demostración creado para el canal de YouTube **[ImzoDev](https://www.youtube.com/@ImzoDev)**. 

El objetivo principal de este repositorio es demostrar cómo el modelo de inteligencia artificial **Gemini 3.1 Pro** es excelente para generar código complejo, específicamente para la creación de **componentes SVG animados 100% puros**, integrados dentro de una aplicación moderna con React, TypeScript, TailwindCSS y Next.js.

## Características

Todos los componentes de animación fueron generados escribiendo descripciones detalladas (prompts) y utilizando únicamente elementos nativos `<svg>`, `<path>`, `<circle>`, `<filter>`, `<pattern>` y CSS básico, **sin dependencias externas** (como Framer Motion o GSAP).

*   ✅ **StepSequence**: Barra de progreso animada infinita.
*   ✅ **BarChart**: Gráfico de barras fluido con rebote natural.
*   ✅ **StackedLayers**: Capas isométricas 3D que se revelan secuencialmente.
*   ✅ **InfiniteProcessLoop**: Ciclo continuo 3D con luz dinámica atravesando el anillo.
*   ✅ **PelicanBicycle**: Cinemática Inversa (IK) en SVG puro con `requestAnimationFrame`.

## Cómo ejecutar el proyecto

Clona el repositorio e instala las dependencias, luego inicia el servidor de desarrollo:

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver las animaciones en acción!


## Prompts Utilizados

A continuación se encuentran los prompts que se utilizaron para generar los diferentes componentes SVG animados de este proyecto:

### StepSequence
```text
Crea un componente React con TypeScript y TailwindCSS para Next.js (con 'use client') llamado StepSequence.

Visual: Secuencia horizontal de pasos con línea de conexión que se ilumina progresivamente. Nodos circulares 52px con iconos SVG en el centro.

Datos: Array configurable { id, label, iconPath (string SVG path d) }.

Animación secuencial infinita: Usa useState currentStep y setInterval (2000ms). Avanza paso a paso, al completar todos reinicia a 0.

Elementos SVG:
- Fondo cuadriculado con pattern 40x40px
- Línea base gris oscuro (#262626) 4px de ancho, full width entre primer y último nodo
- Línea activa con gradiente linear (sky-500 a fuchsia-500) 6px, strokeLinecap round, con filtro glow
- Filtros SVG: neonGlow (stdDeviation 6), neonLineGlow (stdDeviation 4) usando feGaussianBlur/feMerge

Nodos:
- Círculo 26px radio, fill fondo, stroke neón si activo (#0ea5e9 para primera mitad, #d946ef para segunda)
- Icono 24x24px centrado, path con stroke blanco si activo, gris si inactivo, strokeWidth 2
- Escala 1.1x en el paso actual con CSS transform
- Etiqueta debajo del nodo, 60px abajo, texto blanco con textShadow glow si activo

Layout: 800x250px, padding 100px lateral, stepDistance calculado equidistante.

Todo 100% SVG puro, sin librerías externas.

El fondo debe ser oscuro cuadriculado

Integra esto dentro de la actual aplicacion.
```

### BarChart
```text
Crea un componente de React (para Next.js con 'use client', TypeScript y TailwindCSS) que sea una gráfica de barras construida 100% con SVG puro. 

Requisitos exactos:
1. Visuales: Fondo oscuro con una cuadrícula (usando `<pattern>` SVG). Ejes y barras con efecto de resplandor neón (usando `<filter>` y `feGaussianBlur`). Usa colores neón cíclicos (cyan, fuchsia, lime, yellow, sky).
2. Datos configurables: Acepta un prop `data` tipo `[{label: string, value: number}]`.
3. Animación Secuencial e Infinita: Usa un estado `currentStep` controlado por un `setInterval` para revelar las barras una por una. Al terminar todas las barras, reinicia el ciclo a -1.
4. Efecto de Rebote: No uses @keyframes. Anima las barras pasando un objeto `style` al `<rect>` que modifique `height` y `y` usando `transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1.2)`.
5. Detalles: Muestra el `value` de cada barra flotando encima de ella una vez que aparece, usando también transiciones de opacidad y transform.

El fondo debe ser oscuro cuadriculado

Integra esto dentro de la actual aplicacion.
```

### StackedLayers
```text
Crea un componente React con TypeScript y TailwindCSS para Next.js (con 'use client') llamado StackedLayers.

Visual: Bloques 3D isométricos apilados verticalmente con perspectiva SVG. Cada bloque tiene cara superior, frontal y lateral derecha. Fondo oscuro (#0d1117) con rejilla sutil. Resplandor neón mediante filtros SVG feGaussianBlur/feMerge.

Datos: Array configurable { id, number (ej "01"), label, description, color (hex neón), sideColor (versión oscura) }.

Animación secuencial infinita: Usa useState currentStep y setInterval (1200ms). Revela capas de abajo hacia arriba (índice 0 primero). Al completar todas + 2 pasos extra, reinicia a -1.

Espaciado: 90px entre capas para evitar superposición de textos. Capas: 260px ancho, 30px alto, 40px profundidad 3D.

Info por capa (alterna izquierda/derecha): 
- Número grande 42px en color neón con filtro glow
- Badge rectángulo redondeado 140x22 con label centrado 11px bold
- Descripción 2 líneas usando SVG tspan, 10px, color gris
- 3 puntos decorativos al final
- Línea conectora desde bloque hacia la info con círculo terminal

Todo 100% SVG puro, sin librerías externas.
El fondo debe ser oscuro cuadriculado

Integra esto dentro de la actual aplicacion.
```

### InfiniteProcessLoop
```text
Crea un componente React (use client) con TypeScript y Tailwind llamado InfiniteProcessLoop.

Visual: Un ciclo circular de bloques 3D isométricos dispuestos en un anillo (perspectiva SVG). Cada bloque debe tener profundidad (cara superior, frontal y lateral) con estética neón y filtros de resplandor (feGaussianBlur). Fondo oscuro (#0d1117) con rejilla sutil.

Datos: Array configurable de objetos { id, label, description, color, icon }. Por defecto, usa 4 fases genéricas: "Entrada", "Procesamiento", "Optimización" y "Salida".

Animación de Ciclo: Usa un setInterval para resaltar cada bloque secuencialmente. La animación debe ser un flujo infinito: una línea de energía neón debe recorrer el círculo conectando los bloques, iluminándose intensamente cuando el proceso pasa por cada fase.

Info Dinámica: Al activarse una fase, muestra el texto (Label y Descripción) flotando cerca del bloque con un efecto de "fade-in". Alterna la posición de la info para que no se amontone.

Especificaciones: > - 100% SVG puro, sin librerías externas.

Estilo de líneas conectoras con terminales circulares.

Los bloques deben tener una transición suave de color (de apagado a neón brillante) al ser seleccionados.

El fondo debe ser oscuro cuadriculado

Integra esto dentro de la actual aplicacion.
```
