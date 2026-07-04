# 10 — Accessibility

## Contrast Requirements

Gunimi is dark-first. Dark backgrounds with light text are generally better for contrast than light-on-dark, but the specific values must be verified.

| Token pair | Ratio | WCAG level |
|---|---|---|
| `--g-text` (#F7F8FC) on `--g-bg` (#05060A) | ~19:1 | AAA |
| `--g-text` on `--g-surface` (#0A0E17) | ~17:1 | AAA |
| `--g-muted` (#9AA3B2) on `--g-bg` | ~8.1:1 | AAA |
| `--g-primary-3` (#A998FF) on `--g-bg` | ~7.4:1 | AAA |
| `--g-ai` (#22D3EE) on `--g-bg` | ~9.2:1 | AAA |
| `--g-primary` (#6D5BFF) on `--g-bg` (button text) | — | Use white text on primary bg |
| White (#fff) on `--g-primary` (#6D5BFF) | ~5.2:1 | AA |

**Critical**: Never use `--g-faint` (28% opacity) for any meaningful text. It is decorative only.

---

## Focus States

Every interactive element must have a visible focus ring.

Standard pattern:
```css
focus-visible:ring-2
focus-visible:ring-[#6D5BFF]/50
focus-visible:ring-offset-2
focus-visible:ring-offset-[#05060A]
```

This creates a `3px` total ring (2px + 1px offset) in semi-transparent primary. Visible against all Gunimi backgrounds.

**Rule**: Use `focus-visible`, not `focus`. This shows the ring only on keyboard nav, not on click.

---

## Keyboard Navigation

| Component | Keyboard behavior |
|---|---|
| Nav links | Tab + Enter to activate |
| Buttons | Space or Enter |
| Dropdowns | Arrow keys to navigate items, Escape to close |
| Dialogs | Trap focus inside, Escape to close |
| Tables | Arrow keys for row navigation |
| Command palette | Arrow keys + Enter, Escape to close |
| Cards with `onClick` | Enter or Space to activate (role="button") |

Interactive `OrbitCard` always has `role="button"` and keyboard handler when `onClick` is passed.

---

## ARIA Labels

| Element | Required ARIA |
|---|---|
| Icon-only buttons | `aria-label` |
| AI Core | `aria-hidden="true"` |
| Loading states | `aria-busy="true"` on container |
| Status indicators | `role="status"` |
| Nav | `aria-label="Main navigation"` |
| Dialogs | `role="dialog"`, `aria-modal="true"`, `aria-labelledby` |
| Charts | `role="img"`, `aria-label` describing the data |
| Live AI status | `aria-live="polite"` |

---

## Reduced Motion

All animations must respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  /* Disable transforms, keep opacity fades */
  .gunimi-orbit-rings { animation: none; }
  .gunimi-core-breathe { animation: none; }
}
```

AI Core rings stop rotating. Core dot stops scaling. Page transitions remove `y` transforms (keep opacity). Hover card `whileHover` removes `y: -2`.

---

## Color Independence

No information is conveyed by color alone.

| ❌ Wrong | ✅ Correct |
|---|---|
| Green dot = success | Green dot + "Active" text |
| Red border = error | Red border + error message below input |
| AI cyan = processing | AI cyan + "Processing…" chip text |

Status colors always accompany status text. This serves both accessibility and users who can't see the UI (screen readers, voice control).

---

## Text Sizing

- Minimum body text: `13px` (`--g-small` in the type scale)
- Minimum caption/label: `11px` — only for secondary metadata, never for primary content
- Never use `10px` or below for user-facing text
- `line-height` minimum: `1.4` for any readable paragraph
