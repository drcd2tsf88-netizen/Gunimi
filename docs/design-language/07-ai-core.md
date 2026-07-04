# 07 — AI Core

## What It Is

The AI Core is the visual identity of Gunimi. It is not a logo. It is not an illustration. It is the representation of the AI operating underneath the surface.

Every time a user sees the AI Core, they understand: "the system is alive."

---

## Technical Specification

Component: `components/ui/AiCore.tsx`

### Architecture

```
AiCore (container div, width × height = size)
├── Ambient Outer Glow (motion.div, breathing animation)
├── Outer Ring SVG (rotation 88s, counter-clockwise forbidden)
│   ├── Ellipse (rx=44% size, ry=11.8% size)
│   ├── Primary satellite (cx=right edge, r=1.3%)
│   └── Secondary satellite (cx=upper-left, r=0.8%)
├── Mid Ring SVG (rotation 58s, reverse)
│   ├── Ellipse (rx=30.8% size, ry=8.4% size)
│   ├── AI cyan satellite (cx=right edge, r=1.1%)
│   └── Secondary satellite (cx=left edge, r=0.7%)
├── Inner Ring SVG (rotation 36s)
│   ├── Ellipse (rx=19.6% size, ry=5.4% size)
│   └── Primary satellite (cx=right edge, r=1.0%)
├── Particles (10 × motion.div, staggered appearance)
├── Core Halo (motion.div, scale breathing 4.5s)
└── Core Dot (motion.div, scale breathing 3.2s)
```

### Ring Design

Rings are SVG `<ellipse>` elements, not `<circle>`. The ellipse aspect ratio (`rx >> ry`) creates the **orbital plane illusion** — rings appear tilted in 3D space. A circle rotated around its center looks like a spinning disk. An ellipse rotated around its center looks like an orbit.

Outer ring: `rx:ry = 3.73:1` — strongly tilted (~74° from vertical)
Mid ring: `rx:ry = 3.67:1` — similar tilt, slightly tighter
Inner ring: `rx:ry = 3.63:1` — tightest

### Satellites

Each ring carries 1–2 satellite dots. They orbit the ring because they are positioned at specific points on the ellipse and rotate with the SVG container. They do not animate independently.

Satellite size: `1–1.3% of total container size`.

### Core Dot

```css
background: radial-gradient(circle, #C8BBFF 0%, #8B7DFF 42%, #6D5BFF 80%)
box-shadow: three-layer glow at 10%, 5%, and 2% of container size
```

The three-layer glow creates a star-like emission effect. The innermost layer (white-ish `#C8BBFF`) simulates a hot core.

### Particle System

10 particles at fixed percentage positions. Each cycles through `opacity: 0 → 0.55 → 0` and `scale: 0.4 → 1.6 → 0.4`. Duration varies per particle (`4.2s–6.2s`) with independent delays. 3 of 10 use AI cyan (`#22D3EE`), the rest use primary-2 (`#8B7DFF`).

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `number` | `280` | Container size in px |
| `showRings` | `boolean` | `true` | Show orbit rings |
| `showParticles` | `boolean` | `true` | Show particle system |
| `intensity` | `"subtle" \| "medium" \| "strong"` | `"medium"` | Glow/opacity multiplier |
| `className` | `string` | — | Additional CSS classes |

---

## Usage Guide

### Landing Page — Hero
```tsx
<AiCore size={700} showRings showParticles intensity="subtle" />
```
Positioned as background element, `opacity-40`, centered, behind hero text. Large enough to create spatial depth without dominating.

### Loading Screen
```tsx
<AiCore size={220} showRings showParticles intensity="medium" />
```
Centered, with wordmark below. The product's first impression.

### Sidebar Logo Mark
```tsx
<AiCore size={36} showRings={false} showParticles={false} intensity="strong" />
```
Rings disabled at this scale — too small to be legible. Core dot only. Strong intensity because the surface area is tiny.

### Dashboard AI Section Headers
```tsx
<AiCore size={48} showRings={false} showParticles={false} intensity="medium" />
```
Small accent mark preceding AI feature headings.

### Memory Page
```tsx
<AiCore size={120} showRings showParticles={false} intensity="medium" />
```
Rings visible, particles off. Communicates AI awareness without visual noise.

### AI Chat / Command Center
```tsx
<AiCore size={160} showRings showParticles intensity="strong" />
```
Most intense version in the product — this is where the AI is most active.

### Automation Dashboard
```tsx
<AiCore size={100} showRings showParticles={false} intensity="medium" />
```

### Observatory
```tsx
<AiCore size={140} showRings showParticles intensity="subtle" />
```

---

## Rules

1. **Never resize rings independently.** Ring dimensions are percentages of `size`. Don't override them.
2. **Never speed up rotations.** The orbit speeds encode the product's calm intelligence. Faster rings = toy, not OS.
3. **Never use on non-AI contexts.** The AI Core is a semantic element, not a decorative one.
4. **Never change the core gradient.** The `#C8BBFF → #8B7DFF → #6D5BFF` gradient defines the brand.
5. **Always `aria-hidden="true"`.** It is decorative to screen readers.

---

## The AI Core Philosophy

The AI Core must answer: "What does machine cognition look like?"

Not spinning gears. Not a neural network graph. Not a circuit board. An orbit — planets around a star — is the universal metaphor for a system of objects coordinated by a central force. That is Gunimi: relationships, data, and decisions organized around an intelligent core.

The Core never stops moving because the AI never stops processing.
