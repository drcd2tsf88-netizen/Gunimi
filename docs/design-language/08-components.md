# 08 — Component Specifications

## OrbitButton

### Variants

| Variant | Use case | Fill |
|---|---|---|
| `primary` | Main CTA, destructive confirm | Solid `#6D5BFF` + glow |
| `secondary` | Secondary actions | Dark Titanium Glass |
| `ghost` | Tertiary, inline | Transparent until hover |
| `danger` | Delete, irreversible | Soft red tint |

### States

- **Loading**: inline spinner + text, `disabled` attribute
- **Disabled**: `opacity-45`, `cursor-not-allowed`
- **Focus**: `ring-2` in `--g-primary/50`, `ring-offset-2` in `--g-bg`
- **Active/pressed**: `scale(0.97–0.98)`

### Size Rules

- Standard: `h-10` (`40px`), `text-sm` (`14px`)
- Large CTA (landing): `py-3.5`, `px-7`, `text-[14px]`
- Icon-only: `h-9 w-9`, no text

---

## OrbitCard

### Variants

| Variant | Background | Border | Shadow |
|---|---|---|---|
| Standard | `--g-surface` | `--g-border` | `--g-shadow-md` |
| Floating | `--g-surface-2` | `--g-border-hover` | `--g-shadow-lg` + `translateY(-2px)` |
| Interactive | `--g-surface` | `--g-border` → `--g-border-hover` on hover | `--g-shadow-lg` on hover |
| Glass | `rgba(10,14,23,0.88)` | `--g-border` | `--g-shadow-md` + `blur(12px)` |
| AI | `--g-surface` | `--g-border-ai` | `--g-shadow-md` + `--g-glow-ai` |

### Required card elements

1. Top edge sheen (1px gradient line)
2. Hover lighting overlay (radial gradient, opacity 0 → 100)
3. Content wrapper `relative z-10`

---

## OrbitInput

| State | Border | Shadow |
|---|---|---|
| Default | `--g-border` | `--g-shadow-xs` |
| Hover | `--g-border-hover` | — |
| Focus | `--g-border-focus` | `0 0 0 3px rgba(109,91,255,0.12)` |
| Error | `rgba(239,68,68,0.35)` | `0 0 0 3px rgba(239,68,68,0.10)` |
| Disabled | `--g-border` | none, `opacity-45` |

### Related inputs
- `OrbitTextarea`: same as OrbitInput, `resize-none`, `min-h-24`
- Search: same + left-padding for icon slot (`pl-10`)
- Select: same + right-padding for chevron icon

---

## Icons

### System

Lucide Icons. No other icon library.

### Stroke Width

| Context | Stroke width |
|---|---|
| Navigation | `1.75` |
| Cards / content | `1.75` |
| Large hero icons | `1.5` |
| Status indicators | `2.0` |

### Sizes

| Context | Size |
|---|---|
| Navigation items | `14px` |
| Inline icons | `16px` |
| Card header icons | `18–20px` |
| Empty state icons | `32–40px` |
| Hero icons | `48–64px` |

### Icon Hover

Navigation icons change color (`--g-muted/50` → `--g-muted/80`), `200ms` transition. Never scale or move icons on hover.

---

## Charts

### Guiding principles

1. Minimal grid — use `rgba(255,255,255,0.04)` grid lines or none
2. Soft animated entrance — values count up, lines draw in
3. Gradient fills — area charts use `--g-chart-1` → transparent
4. Glowing lines — primary line has `filter: drop-shadow(0 0 4px var(--g-chart-1))`
5. No border on the chart container — let it breathe within its card

### Color assignment order

Always use chart palette in sequence: 1, 2, 3, 4... Never skip for aesthetic reasons.

---

## Tables

| State | Background |
|---|---|
| Default row | transparent |
| Hover row | `rgba(109,91,255,0.04)` |
| Selected row | `rgba(109,91,255,0.08)` + left border `--g-border-active` |
| Loading | skeleton rows with pulse |
| Empty | `OrbitEmptyState` component |

Table header: `text-[10.5px]` uppercase, `tracking-[0.10em]`, `--g-muted`.

---

## Dialogs

```
Backdrop: --g-overlay, blur(4px), fade 200ms
Panel:    Dark Titanium, --g-radius-3xl (28px), --g-shadow-xl
Enter:    scale(0.95) opacity(0) → scale(1) opacity(1), 280ms --g-ease
Exit:     reverse, 200ms
```

Dialog max width: `max-w-md` (standard), `max-w-2xl` (complex), `max-w-4xl` (data-heavy).

---

## Command Palette

The command palette is the product's power user interface.

```
Trigger:  ⌘K or search bar click
Panel:    Dark Glass, blur(18px), --g-radius-2xl, --g-shadow-xl
Width:    max-w-2xl, centered
Height:   dynamic, max-h-[70vh]
Input:    full-width, no border-bottom, font-size 16px
Items:    .orbit-command-item class, 12px border-radius
Shortcut: shown right-aligned, --g-surface-3 background
```

---

## Empty States

Empty states must never be boring. They are product moments.

### Structure

1. AI Core (small, `size=80`, rings off, particles off)
2. Icon (if relevant, `32px`, `--g-muted/40`)
3. Title: `text-[15px] font-semibold --g-text`
4. Description: `text-[13px] --g-muted`, max 2 lines
5. CTA button (optional)

### Rule

Empty states use the AI Core to maintain the visual identity even in absence. The AI is always present, even when there's nothing to show.

---

## Loading States

**No traditional spinners in Gunimi.** The loading language is:

1. **Skeleton screens**: for page-level loads — `OrbitSkeleton` with pulse
2. **AI Core**: for auth/initialization — `OrbitLoader`
3. **Progress line**: for streaming AI responses — thin line scanning
4. **Opacity pulse**: for refreshing data — container at `opacity-70` while loading
5. **Button loader**: inline spinner within button, not replacing it
