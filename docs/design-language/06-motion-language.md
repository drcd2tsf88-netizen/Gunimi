# 06 — Motion Language

## Philosophy

Motion in Gunimi is not decoration. It communicates. Every animation should answer: what is happening, and why?

The aesthetic rule: **slow and deliberate always beats fast and flashy**. The wrong direction to err is "too fast". Fast animations feel cheap. Slow, weighted transitions feel expensive.

---

## Duration Tokens

| Token | Value | Usage |
|---|---|---|
| `--g-duration-instant` | `80ms` | Micro-feedback (icon color swap) |
| `--g-duration-xs` | `120ms` | Tooltip appear/hide |
| `--g-duration-sm` | `200ms` | Border/color transitions on hover |
| `--g-duration-md` | `300ms` | Standard transitions (cards, buttons) |
| `--g-duration-lg` | `450ms` | Panel open/close, sidebar slide |
| `--g-duration-xl` | `650ms` | Page entrances, modal appear |
| `--g-duration-2xl` | `950ms` | Hero animations, first-load entrances |

### AI-Specific Durations

AI motion is always slower than UI motion. It has geological patience.

| Token | Value | Usage |
|---|---|---|
| `--g-duration-ai-pulse` | `3200ms` | AI indicator pulse |
| `--g-duration-ai-breathe` | `4500ms` | AI Core ambient breath |
| `--g-duration-ai-orbit-fast` | `36000ms` | AI Core inner ring |
| `--g-duration-ai-orbit-mid` | `58000ms` | AI Core middle ring |
| `--g-duration-ai-orbit-slow` | `88000ms` | AI Core outer ring |
| `--g-duration-ai-particle` | `4800ms` | Particle drift |

---

## Easing Tokens

| Token | Curve | When to use |
|---|---|---|
| `--g-ease` | `cubic-bezier(0.16, 1, 0.3, 1)` | **Default.** Fast start, slow graceful end. |
| `--g-ease-out` | `cubic-bezier(0.0, 0.0, 0.2, 1)` | Elements leaving the screen |
| `--g-ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Elements entering at speed |
| `--g-ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Bouncy entrances (use rarely) |
| `--g-ease-smooth` | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | Continuous animations |
| `--g-ease-linear` | `linear` | Continuous rotations (AI Core) |

---

## Animation Reference

### Hover States

| Element | Duration | Properties | Easing |
|---|---|---|---|
| Card | `300ms` | `border-color`, `box-shadow`, `background-image` | `--g-ease` |
| Button | `200ms` | `background`, `box-shadow`, `scale(1.01)` | `--g-ease` |
| Nav item | `220ms` | `background`, `color` | `--g-ease` |
| Icon | `200ms` | `color`, `opacity` | `--g-ease` |
| Table row | `150ms` | `background` | `--g-ease` |
| Input | `220ms` | `border-color`, `box-shadow` | `--g-ease` |

### Click/Active

| Element | Duration | Properties |
|---|---|---|
| Button | `80ms` | `scale(0.97)` |
| Card (interactive) | `120ms` | `scale(0.99)`, `y(+1px)` |
| Icon button | `80ms` | `scale(0.92)` |

### Enter Transitions (page content)

```
Initial: opacity 0, y 10px
Final:   opacity 1, y 0
Duration: 650ms
Easing:  --g-ease
Delay:   staggered by 60ms per element
```

### Dialog/Modal

```
Backdrop: fade in 200ms, blur 4px
Panel:    scale(0.95) opacity(0) → scale(1) opacity(1), 280ms, --g-ease
```

### Sidebar (mobile)

```
Panel: translateX(-260px) → translateX(0), spring damping:26 stiffness:220
```

### Page Transitions

```
Exit:   opacity(1) y(0) → opacity(0) y(-8px), 220ms
Enter:  opacity(0) y(8px) → opacity(1) y(0), 220ms
Easing: --g-ease
```

---

## AI Motion

The AI Core is always running. Its motion is continuous, not triggered.

### AI Core Rings
- Outer: `88s linear infinite` — the deliberateness of orbital mechanics
- Mid: `58s linear infinite reverse` — counter-rotation creates depth perception
- Inner: `36s linear infinite` — faster, tighter orbit
- Never change these speeds. They encode the product's identity.

### AI Core Breathing
- Scale `0.78 → 1.22 → 0.78`, duration `4.5s`, ease `easeInOut`
- Opacity `0.28 → 0.58 → 0.28` synchronized
- This is the "heartbeat" of the product

### AI Particles
- Each particle: `opacity(0) → 0.55 → 0`, `scale(0.4) → 1.6 → 0.4`
- Duration varies: `4.2s to 6.2s` (randomized per particle)
- Delays staggered so particles drift independently

---

## Microinteractions

### Button Loading State
Replace text with spinner + text. Spinner is a `rotating border` not a `border-t-only` trick. Duration: `1s linear infinite`.

### Form Validation
Input border: `var(--g-border)` → `var(--g-danger)` or `var(--g-success)`, `200ms`.

### Toast/Notification
Enter: slide in from top-right + fade, `300ms, --g-ease`.
Exit: fade + slight upward, `200ms, --g-ease-out`.

### Dropdown
Open: `scale(0.96, 0.95) opacity(0)` → `scale(1) opacity(1)`, `180ms, --g-ease`.
Close: reverse, `150ms`.

### Table Row Selection
Background: `transparent` → `rgba(109,91,255,0.06)`, `150ms`.

---

## Rules

1. **Always use a token.** Never write `transition: all 0.3s ease` — use `var(--g-transition-base)`.
2. **Prefer specific properties.** `transition: background 200ms, border-color 200ms` over `transition: all 200ms`.
3. **No instant jumps.** `display: none / block` transitions are handled via `opacity` + `pointer-events`.
4. **Reduce motion.** Always respect `prefers-reduced-motion` — remove transforms, keep opacity fades.
5. **AI motion is separate.** UI hover = `200-300ms`. AI ambient = `3000–88000ms`. They operate on different timescales.
