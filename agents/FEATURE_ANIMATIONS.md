# Feature: Animaciones y Transiciones

## Archivos principales
- `public/js/animations.js`
- `public/css/styles.css` (clases de animación)

## Principios
- Duración: 400ms–700ms
- Easing: `cubic-bezier(0.25, 0.46, 0.45, 0.94)` (ease-out suave)
- Stagger entre elementos de una lista: 100ms entre cada uno
- Respetar `prefers-reduced-motion` siempre
- Las animaciones de scroll se disparan una sola vez por elemento
- Nada parpadeante, nada que moleste — sensación de producto premium

---

## 1. Animaciones de entrada del Hero (ya están, mantener)

```css
/* Mantener tal cual están en el HTML original */
.hero-logo-wrap { animation: fadeUp .9s .1s  forwards; opacity: 0; }
.hero-divider   { animation: fadeUp .9s .35s forwards; opacity: 0; }
.hero-sub       { animation: fadeUp .9s .5s  forwards; opacity: 0; }
.hero-tagline   { animation: fadeUp .9s .65s forwards; opacity: 0; }
.hero-btns      { animation: fadeUp .9s .8s  forwards; opacity: 0; }
.scroll-line    { animation: fadeUp .9s 1.1s forwards; opacity: 0; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

---

## 2. Clases CSS para animaciones de scroll

Agregar al final de `styles.css`:

```css
/* ─── Animaciones de scroll ─────────────────────────────── */

/* Estado inicial (invisible antes de entrar al viewport) */
[data-animate="fade-up"] {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

[data-animate="fade-in"] {
  opacity: 0;
  transition: opacity 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

[data-animate="scale-in"] {
  opacity: 0;
  transform: scale(0.96);
  transition: opacity 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* Estado visible (agregado por IntersectionObserver) */
[data-animate].is-visible {
  opacity: 1;
  transform: none;
}

/* Stagger delays */
[data-delay="0"]   { transition-delay: 0ms; }
[data-delay="100"] { transition-delay: 100ms; }
[data-delay="200"] { transition-delay: 200ms; }
[data-delay="300"] { transition-delay: 300ms; }
[data-delay="400"] { transition-delay: 400ms; }
[data-delay="500"] { transition-delay: 500ms; }

/* Accesibilidad: desactivar animaciones si el usuario lo prefiere */
@media (prefers-reduced-motion: reduce) {
  [data-animate],
  [data-animate].is-visible {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
    animation: none !important;
  }
}
```

---

## 3. `animations.js` — Intersection Observer

```javascript
/**
 * animations.js
 * Intersection Observer para animaciones de scroll.
 * Expone window.initScrollAnimations() para re-llamar
 * cuando se agregan elementos al DOM dinámicamente.
 */

function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // solo se anima una vez
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  // Observar todos los elementos con data-animate
  // que todavía no tienen la clase is-visible
  document.querySelectorAll('[data-animate]:not(.is-visible)')
    .forEach(el => observer.observe(el));
}

// Inicializar al cargar el DOM
document.addEventListener('DOMContentLoaded', initScrollAnimations);

// Exponer globalmente para re-llamar cuando se crean cards dinámicas
window.initScrollAnimations = initScrollAnimations;
```

---

## 4. Atributos `data-animate` en el HTML

### Sección Destinos
```html
<!-- Título de sección -->
<div class="section-top" data-animate="fade-up">...</div>

<!-- Grid: cada card con stagger -->
<div class="destino-card" data-animate="fade-up" data-delay="0">
<div class="destino-card" data-animate="fade-up" data-delay="100">
<div class="destino-card" data-animate="fade-up" data-delay="200">
<div class="destino-card" data-animate="fade-up" data-delay="300">
<div class="destino-card" data-animate="fade-up" data-delay="400">
<div class="destino-card" data-animate="fade-up" data-delay="500">
```

Nota: los atributos de stagger se asignan en `destinations.js`
cuando se renderizan las cards dinámicamente.

### Sección Planificador
```html
<div class="section-top" data-animate="fade-up">
<div class="form-card" data-animate="fade-up" data-delay="100">
```

### Cards del itinerario generado
Los atributos se asignan en `planner.js` al crear cada card:
```javascript
card.setAttribute('data-animate', 'fade-up');
card.setAttribute('data-delay', String(index * 100));
```
Después de insertar las cards en el DOM, llamar:
```javascript
window.initScrollAnimations();
```

### Sección Cotización
```html
<div class="section-top" data-animate="fade-up">
<div class="form-grid" data-animate="fade-up" data-delay="100">
```

---

## 5. Hover transitions (CSS puro)

Agregar en `styles.css`:

```css
/* ─── Hover transitions ──────────────────────────────────── */

/* Cards de destinos: elevación al hover */
.destino-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.destino-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(28, 35, 64, 0.16);
}

/* Botones primarios */
.btn-primary,
.gen-btn,
.cotiz-btn {
  transition: background 0.25s ease,
              transform 0.2s ease,
              box-shadow 0.25s ease;
}

.btn-primary:hover,
.gen-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(176, 146, 85, 0.35);
}

/* Chips */
.chip {
  transition: background 0.2s ease,
              border-color 0.2s ease,
              color 0.2s ease;
}

/* Links del navbar — underline animado */
.nav-links a {
  position: relative;
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--gold);
  transition: width 0.3s ease;
}

.nav-links a:hover::after {
  width: 100%;
}

/* Botón flotante WhatsApp */
.chat-toggle {
  transition: background 0.2s ease,
              transform 0.2s ease,
              box-shadow 0.2s ease;
}

.chat-toggle:hover {
  transform: scale(1.08);
  box-shadow: 0 6px 24px rgba(37, 211, 102, 0.5);
}
```

---

## 6. Scroll behavior del navbar

Agregar en `main.js`:

```javascript
function initNavScroll() {
  window.addEventListener('scroll', () => {
    document.querySelector('nav')
      .classList.toggle('nav-scrolled', window.scrollY > 60);
  }, { passive: true });
}
```

CSS en `styles.css`:
```css
nav {
  transition: box-shadow 0.3s ease, background 0.3s ease;
}

nav.nav-scrolled {
  box-shadow: 0 4px 24px rgba(28, 35, 64, 0.1);
  background: rgba(255, 255, 255, 0.99);
}
```

---

## Acceptance criteria

- [ ] Todos los elementos con `data-animate` se animan al entrar al viewport
- [ ] Cada elemento se anima solo una vez (observer.unobserve)
- [ ] Las cards del itinerario reciben animación después de ser creadas en el DOM
- [ ] `prefers-reduced-motion: reduce` desactiva todas las animaciones
- [ ] El nav cambia de apariencia al hacer scroll más de 60px
- [ ] Los hover states tienen transición suave en cards, botones y nav links
- [ ] No hay flash ni salto visible en el primer render de la página
- [ ] `window.initScrollAnimations` es accesible globalmente
