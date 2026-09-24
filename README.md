# AHAVA Corporativo v3 — Premium Light

Cuarta versión del sitio AHAVA. Toma todo lo bueno del v2 (que te gustó) y le
añade **super powers sutiles pero poderosos** que se sienten premium sin
sobre-diseñar.

🌐 **Sitio en vivo:** https://aguitech.github.io/ahava-v3/

📦 **Otras versiones (siguen activas):**
- [aguitech/ahava](https://github.com/aguitech/ahava) — Réplica fiel del original
- [aguitech/ahava-redesign](https://github.com/aguitech/ahava-redesign) — Editorial cinematográfico
- [aguitech/ahava-v2](https://github.com/aguitech/ahava-v2) — Premium balance

## Super powers añadidos

### 🎯 Magnetic Buttons
Los CTAs principales (`Contactar`, `Conoce Nuestros Servicios`, `Agendar Demo`,
etc.) siguen sutilmente al mouse cuando te acercas. Se siente vivo sin ser
agresivo. Solo se activa dentro del radio del botón, no en todo el viewport.

### 📊 Scroll Progress Bar
Una línea gradient cyan→blue en la parte superior que muestra tu progreso de
scroll en tiempo real. Da contexto sin distraer.

### ✨ Hero Particles (lightweight canvas)
60 partículas con líneas conectoras que se repelen del cursor. Sin Three.js
pesado (~3KB total), 60fps estables. Se pausa cuando la pestaña no es visible.

### 🎨 SVG Icons (reemplazo de emojis)
Todos los íconos de servicios, contacto y strip ahora son SVG inline con
`stroke-linecap="round"`. Renderizan perfectamente en cualquier tamaño y se
pueden animar con CSS. Toque premium instantáneo.

### 🌊 Marquee Infinito de Clientes
Los 8 logos de clientes ahora se desplazan horizontalmente en un loop infinito
con mask gradient en los bordes. Hover pausa el scroll. Movimiento constante
sin distraer.

### 💎 Gradient Border Animado (foto nosotros)
La foto de nosotros tiene un borde gradient cyan→blue→cyan que se anima con
`@keyframes gradient-pan`. Premium sin ser ruidoso.

### ✨ Form con validación visual premium
- Indicador `✓` aparece en el label cuando el campo es válido
- Border verde cyan + fondo `#f0fbfd` cuando válido
- Border rojo + fondo `#fef2f2` cuando inválido
- Spinner en el botón durante el "envío" simulado (900ms)
- Validación en blur + re-validación con debounce de 400ms al escribir

### 🔥 Mejoras de polish
- Reveal animations con stagger automático (cards aparecen escalonadas)
- Number badge "01/06" → "06/06" en cada service card
- Service icon container se anima con rotate -8° en hover
- Counter de stats con easing cubic
- Hover lift -10px en service cards (más dramático)
- Parallax sutil en foto nosotros (4% del scroll)
- Form focus con tint de fondo `#fafeff`

## Stack

- **HTML5 + CSS3 + Vanilla JS** — cero build, cero npm
- **Tipografía:** Inter (UI) + Dancing Script (display manuscrito)
- **Canvas 2D API** — partículas lightweight (sin Three.js)
- **IntersectionObserver** — reveals + counters
- **Deploy:** GitHub Pages

## Estructura

```
ahava-v3/
├── docs/
│   ├── index.html              # 8 secciones + SVG icons inline
│   └── assets/
│       ├── styles.css          # 34KB — design system completo
│       ├── app.js              # Magnetic + scroll progress + form premium
│       ├── particles.js        # Canvas hero particles (3KB)
│       ├── img/                # 6 fotos + logo
│       ├── clientes/           # 8 logos
│       ├── iconos/             # 5 iconos (ventajas)
│       └── videos/             # Hero video
└── README.md
```

## Performance

- **Preload crítico:** `assets/img/estrategia.jpg` (poster del hero) + `styles.css`
- **Lazy loading:** imágenes no-críticas con `loading="lazy"`
- **Defer scripts:** particles + app con `defer` para no bloquear render
- **Visibility API:** pausa de partículas cuando tab inactivo
- **RAF optimizations:** scroll handlers con `requestAnimationFrame` + flags

## Verificación

| Asset | Tamaño | Status |
|---|---|---|
| `index.html` | 27KB | ✓ 200 |
| `styles.css` | 34KB | ✓ 200 |
| `app.js` | 11KB | ✓ 200 |
| `particles.js` | 3KB | ✓ 200 |
| Hero video | 45MB | ✓ 200 |

## Deploy

GitHub Pages: rama `main` → carpeta `docs/`.

## Créditos

Diseño y desarrollo por **AGUITECH** · Ingeniería + Diseño + Sistemas
