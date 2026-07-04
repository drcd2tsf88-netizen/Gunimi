# 11 — Design Do's, Don'ts & Future Evolution

## Design Do's

### Colors
- ✅ Use `--g-*` tokens for every color value
- ✅ Use ambient purple shadows (`rgba(109,91,255,...)`)
- ✅ Use `--g-ai` cyan only where AI is active
- ✅ Use status colors with text labels
- ✅ Reference chart palette in order

### Typography
- ✅ Negative letter-spacing on headings
- ✅ Tight line-height (`1.0–1.1`) on display text
- ✅ Mono font for numbers, IDs, dates, technical values
- ✅ Sentence case for all UI copy
- ✅ Short, direct AI copy

### Motion
- ✅ Use `--g-duration-*` tokens
- ✅ Use `--g-ease` as default easing
- ✅ Stagger entrance animations by 60ms
- ✅ Use `focus-visible` for keyboard focus rings
- ✅ Respect `prefers-reduced-motion`

### Materials
- ✅ Top edge sheen on all Dark Titanium cards
- ✅ Hover lighting overlay on interactive cards
- ✅ L0/L1/L2/L3 surface hierarchy
- ✅ `aria-hidden="true"` on AI Core

---

## Design Don'ts

### Colors
- ❌ Hard-code any hex value in a component
- ❌ Use pure `#000000` or `#ffffff` anywhere
- ❌ Use `box-shadow: 0 4px 8px rgba(0,0,0,0.5)`
- ❌ Use cyan (`--g-ai`) for hover states on non-AI elements
- ❌ Use old primary `#7c3aed` (the former OrbitDesk violet)
- ❌ Use more than 3 chart colors in a single chart

### Motion
- ❌ `transition: all` — always specify properties
- ❌ Durations under 80ms (feels broken) or over 1000ms for UI (feels slow)
- ❌ `linear` easing on UI transitions (use `--g-ease`)
- ❌ Multiple simultaneous complex animations on the same element
- ❌ Changing AI Core orbit speeds

### Typography
- ❌ Positive letter-spacing on headings
- ❌ `font-weight: 300` — never lighter than `400`
- ❌ All-caps body text
- ❌ `text-align: justify`
- ❌ Font size below `13px` for interactive or readable content

### Materials
- ❌ `backdrop-filter: blur(40px)` or higher — too heavy, use `12–18px`
- ❌ Glassmorphism without purpose (blur for its own sake)
- ❌ Multiple blur layers stacked (kills performance)
- ❌ Skipping surface levels (placing a L3 element directly on L0)

### General
- ❌ Decoration without purpose
- ❌ Adding new visual patterns without adding to this document first
- ❌ CSS `animation` without first checking if a token exists
- ❌ Emoji in UI (except explicitly user-generated content)
- ❌ Gradients on text that span more than 3 colors

---

## Common Mistakes

### The "more glow" trap
Adding glow to everything dilutes the glow. Glow means: "this element is special". If everything glows, nothing does. Maximum 2–3 glowing elements on any single screen.

### The "dark = more blur" assumption
Heavy blur (`blur-3xl`, `blur-[40px]`) is not premium — it is a lazy substitute for surface hierarchy. Gunimi uses `blur(12px)` maximum, and only on Glass material.

### Treating AI Core as decoration
The AI Core is not a spinner. It is not a loading indicator. It is a semantic statement: "The AI is present here." Do not place it in contexts where the AI is not operating.

### Breaking the spacing grid
Padding of `px-5 py-3` (`20px / 12px`) is not on the grid. It should be `px-4 py-3` (`16px / 12px`) or `px-5 py-4` (`20px / 16px`). Every value must be a multiple of 4.

---

## Future Evolution

### GDL v1.1 (planned)
- Dark Mode variants with explicit CSS variable overrides
- Print stylesheet for reports (export features)
- Responsive token variants (`--g-space-*` at different breakpoints)
- Additional chart types (scatter, heatmap)

### GDL v2.0 (horizon)
- Spatial design tokens for potential 3D/VisionOS contexts
- Dynamic AI Core variants (multiple cores for multi-agent dashboards)
- Real-time lighting system tied to AI workload
- Sound design tokens for notification audio

### What will not change
- Core color palette identity (`--g-primary: #6D5BFF`)
- AI Core ring speeds and structure
- The 10 immutable principles
- The no-black-shadow rule
- The AI cyan usage restriction

The design language is stable. Components evolve. Tokens do not break backward compatibility — they only extend.
