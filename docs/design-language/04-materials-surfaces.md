# 04 — Materials, Surfaces & Backgrounds

## The Material System

Gunimi has one primary material: **Dark Titanium**. Everything else is a variation.

### Dark Titanium (Default)
The standard card/panel material. Deep matte surface, titanium-thin border, ambient purple shadow.

```css
background:   var(--g-surface);            /* #0A0E17 */
border:       1px solid var(--g-border);   /* rgba(255,255,255,0.055) */
border-radius:var(--g-radius-2xl);         /* 22px */
box-shadow:   var(--g-shadow-md);
```

### Dark Glass
Used for overlays, command palette, and floating elements. Slight blur, reduced opacity.

```css
background:   rgba(10, 14, 23, 0.88);
border:       1px solid var(--g-border);
backdrop-filter: blur(12px);
box-shadow:   var(--g-shadow-lg);
```

### Dark Matte
Used for sidebar, page-level backgrounds, areas that must feel grounded not elevated.

```css
background:   var(--g-bg);      /* #05060A — no transparency */
border:       none;
```

### AI Surface
Used for cards or panels that are actively processing AI. Has AI-active lighting.

```css
background:   var(--g-surface);
border:       1px solid var(--g-border-ai);   /* cyan border */
box-shadow:   var(--g-shadow-md), var(--g-glow-ai);
background-image: var(--g-light-ai-active);
```

### Overlay
Used for modal backdrops. Blocks perception of content below.

```css
background: var(--g-overlay);   /* rgba(5,6,10,0.82) */
backdrop-filter: blur(4px);
```

### Floating Layer
Used for tooltips, dropdown menus, popovers. Highest elevation.

```css
background:   var(--g-surface-3);
border:       1px solid var(--g-border-hover);
box-shadow:   var(--g-shadow-xl);
border-radius:var(--g-radius-lg);
```

---

## Background System

The background is layered. Each layer adds depth without adding weight.

### L0 — Deep Space
The raw page canvas. `#05060A`. The darkest possible value that still reads as dark navy (not pure black). Pure black creates a "dead" surface. This has life.

### L1 — Nebula
Two ambient radial gradients applied to `html` with `background-attachment: fixed`. They simulate depth and light scatter:
- Top-left: `rgba(109,91,255,0.07)` — primary nebula
- Bottom-right: `rgba(34,211,238,0.04)` — AI nebula (very faint)

### L2 — Noise
A subtle SVG grain texture animated slowly on `body::after`. Opacity `0.018` — visible only when looking for it. Creates material depth at the pixel level.

### L3 — Ambient Light
AI Core radial gradients, card glows, and hover lighting. These appear contextually and move with user interaction.

### Combinations

| Context | Layers |
|---|---|
| Normal page view | L0 + L1 + L2 |
| AI Core visible | L0 + L1 + L2 + L3 |
| Modal open | L0 + Overlay + L2 |
| Loading screen | L0 + L1 + L2 + AI Core |

---

## Border System

Borders in Gunimi are disciplined. They exist to define edges, not decorate.

### Usage Rules

1. **Default card border** — `var(--g-border)` = `rgba(255,255,255,0.055)`. So subtle it feels like a material edge.
2. **On hover** — upgrade to `var(--g-border-hover)` = `rgba(255,255,255,0.10)`.
3. **On active/selected** — `var(--g-border-active)` = `rgba(109,91,255,0.20)`. The border earns visibility by carrying meaning.
4. **On focus** — `var(--g-border-focus)` = `rgba(109,91,255,0.35)`. Bright enough to be an accessibility signal.
5. **AI active** — `var(--g-border-ai)` = `rgba(34,211,238,0.15)`.

### Top Edge Sheen

Every Dark Titanium card has a 1px top edge sheen:
```css
/* Applied as a pseudo-element or a dedicated div */
background: linear-gradient(to right, transparent, rgba(255,255,255,0.07), transparent);
height: 1px;
```
This simulates the angle-of-incidence light catch on a physical surface.

### When NOT to add borders

- Between a card and its container
- As separators between list items (use spacing instead)
- On icon buttons in the topbar
- On sidebar section labels
