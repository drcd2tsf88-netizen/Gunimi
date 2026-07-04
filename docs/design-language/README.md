# Gunimi Design Language (GDL) v1.0

> **The single source of truth for every visual decision made in Gunimi.**

---

## What this is

GDL v1.0 is the visual operating system for Gunimi. It defines how every pixel, motion, color, and interaction behaves. It is not a component library. It is the DNA that every component is built from.

When you make a UI decision and it is not documented here, you are introducing design debt. If you cannot find the answer here, add it here first, then build.

---

## Index

| File | Contents |
|---|---|
| [01-philosophy.md](01-philosophy.md) | Core philosophy, brand identity, 10 immutable principles |
| [02-color-system.md](02-color-system.md) | Complete color token reference, palettes, usage rules |
| [03-typography-spacing.md](03-typography-spacing.md) | Type scale, spacing system, layout grid |
| [04-materials-surfaces.md](04-materials-surfaces.md) | Materials, surface levels, background system, borders |
| [05-shadows-lighting.md](05-shadows-lighting.md) | Shadow scale, glow system, lighting tokens |
| [06-motion-language.md](06-motion-language.md) | Duration tokens, easings, animation rules, microinteractions |
| [07-ai-core.md](07-ai-core.md) | AI Core component spec — the brand's visual identity mark |
| [08-components.md](08-components.md) | Buttons, inputs, cards, icons, charts, tables, dialogs |
| [09-ai-language.md](09-ai-language.md) | AI-specific states: thinking, streaming, memory, automation |
| [10-accessibility.md](10-accessibility.md) | Contrast ratios, focus states, keyboard nav, ARIA |
| [11-dos-donts.md](11-dos-donts.md) | Anti-patterns, common mistakes, future evolution |

---

## Token map

All tokens live in `styles/orbit-theme.css` under the `--g-*` namespace.

```
--g-bg            Foundation layer 0 — page canvas
--g-surface       Foundation layer 1 — panels, cards
--g-surface-2     Foundation layer 2 — elevated cards
--g-surface-3     Foundation layer 3 — tooltips, floating
--g-primary       Brand primary — indigo-violet
--g-ai            AI accent — cyan (use sparingly)
--g-text          Primary text
--g-muted         Tertiary text / labels
--g-border        Default border (almost invisible)
--g-shadow-*      Shadow scale (xs → xl)
--g-glow-*        Glow scale (xs → xl + ai)
--g-radius-*      Radius scale (xs → pill)
--g-space-*       Spacing scale (4 → 128)
--g-duration-*    Duration tokens
--g-ease-*        Easing functions
```

---

## Living reference

The interactive version of this specification is at `/design-system`. It shows every token, every component, and every interaction live in the browser. Use that to verify implementation, use these docs to understand intent.

---

## Versioning

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026-07 | Initial language — Living Interface system |

Breaking changes to this spec require a version bump and a migration note.
