# 01 — Philosophy, Brand Identity & Visual Principles

## Core Philosophy

Gunimi is not another SaaS dashboard. It is an **AI Business Operating System**. The interface must feel like one.

The central question behind every visual decision:

> **"Does this make the AI feel like it is always operating underneath the surface?"**

If the answer is no, the design is wrong.

---

## Brand Identity

### What Gunimi is

- A living intelligent system, not a form
- An operating system for business, not a to-do list
- A command layer between human intent and autonomous execution
- Premium enterprise software that happens to be beautiful

### What Gunimi is not

- A CRM with a dark mode
- A Notion clone with AI features
- A startup dashboard with violet gradients
- Anything that looks like it was made in 2018–2023 SaaS era

### Brand feel references

| Reference | What we borrow |
|---|---|
| **Apple** | Material precision, restraint, purposeful reduction |
| **Linear** | Information density, dark elegance, developer respect |
| **Nothing OS** | Dark titanium aesthetic, glyph iconography, confident space |
| **VisionOS** | Spatial depth, layering, translucency discipline |
| **Interstellar** | Gravity, science, awe, the scale of intelligence |

We do **not** borrow: cyberpunk neon, gaming RGB, glassmorphism overload, or geometric decoration for its own sake.

---

## The Living Interface Philosophy

Every element in Gunimi must appear **alive**. Not animated — alive. These are different.

- **Animated** = motion triggered by user action
- **Alive** = continuous, ambient, slow existence that never stops

The AI Core breathes at 4.5s intervals even when nothing is happening. The background nebula exists whether or not the user is looking. The interface feels inhabited.

The speed rule: **nothing fast, nothing jerky**. Even hover states feel like they have weight. The slowest acceptable motion is always preferred over the fastest.

---

## 10 Immutable Principles

These cannot be violated. They override preference, trend, and deadline pressure.

### 1. Motion should be felt, not noticed
If a user notices an animation, it is too fast, too large, or decorative. Every transition should feel inevitable.

### 2. AI glows
The AI accent (`--g-ai`, cyan) only appears where AI is genuinely operating. If there is no AI, there is no cyan. This color is a signal, not a decoration.

### 3. Interfaces breathe
Idle is not static. Loading is not a spinner. Thinking is not a progress bar. Everything has a resting pulse.

### 4. Nothing flashes
No rapid opacity changes. No abrupt appearances. `display: none → visible` does not exist — everything fades or slides.

### 5. Shadows have color
Every shadow is ambient purple: `rgba(109,91,255,...)`. Black shadows are forbidden. The interface is illuminated from within.

### 6. Borders are whispers
Borders exist to define edges, not to decorate. Default border opacity is 5.5%. Only active states earn a visible border.

### 7. Reduce before adding
Before adding a visual element, ask if something existing can be modified instead. Every new element increases cognitive load.

### 8. Premium over trendy
Glassmorphism, grain texture, and depth work because they age well, not because they are currently fashionable. The test is: does this still look premium in 2030?

### 9. Density is not clutter
Dense information is a feature, not a bug. Linear, Apple Notes, and Nothing all prove that more information with better hierarchy is better than less information with big whitespace.

### 10. Everything has one source of truth
No color, duration, radius, or spacing value is hardcoded in a component. Every value references a design token. If a token does not exist, create it here first.
