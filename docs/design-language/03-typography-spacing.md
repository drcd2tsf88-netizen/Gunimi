# 03 — Typography & Spacing

## Typography

Gunimi uses **Inter** throughout. No decorative fonts. No display serif. Inter at the right size and weight is more premium than any font pairing.

### Type Scale

| Name | Size | Weight | Letter Spacing | Usage |
|---|---|---|---|---|
| Hero XXL | `96px` | `700` | `-0.06em` | Landing page hero only |
| Hero XL | `72px` | `600` | `-0.05em` | Section heroes |
| Hero | `56px` | `600` | `-0.04em` | Feature headlines |
| H1 | `40px` | `600` | `-0.03em` | Page titles |
| H2 | `30px` | `600` | `-0.025em` | Section titles |
| H3 | `22px` | `600` | `-0.02em` | Subsection titles |
| Title | `17px` | `600` | `-0.015em` | Card titles, widget titles |
| Subtitle | `15px` | `500` | `-0.01em` | Card subtitles, descriptions |
| Body Large | `16px` | `400` | `0` | Primary body copy |
| Body | `14px` | `400` | `0` | Default body |
| Small | `13px` | `400` | `0` | Secondary text |
| Caption | `11px` | `500` | `0.04em` | Labels, timestamps, badges |
| Numbers | `28px` | `700` | `-0.04em` | KPI values, metrics |
| KPI | `48px` | `700` | `-0.05em` | Hero metrics |
| Mono | `13px` | `400` | `0` | Code, IDs, technical values |

### Typography Rules

1. **Tight tracking on large sizes** — headings feel premium when letter-spacing is negative. Never use positive tracking on headings.
2. **Weight carries hierarchy** — do not use size alone to create hierarchy. H3 at `600` weight reads differently than H3 at `400`.
3. **Leading varies by purpose** — body text: `1.6`, headings: `1.0–1.1`, UI labels: `1.0`.
4. **Mono for data** — any value that could be a number, ID, code, or date uses mono font.
5. **Uppercase only for micro-labels** — section group labels in the sidebar, status chips. Max `0.16em` tracking.
6. **Never justify** — only left-align or center. Justified text breaks on dark backgrounds.

### Text Color Assignment

| Context | Token |
|---|---|
| Page title, main heading | `--g-text` |
| Paragraph, description | `--g-text-2` |
| Label, caption | `--g-muted` |
| Placeholder, ghost | `--g-faint` |
| Disabled | `--g-disabled` |
| Primary action text | `white` |
| Accent label (badge, tag) | `--g-primary-3` |
| AI indicator | `--g-ai` or `--g-ai-2` |

---

## Spacing System

Every spacing value is a multiple of `4px`. Nothing outside this scale is permitted.

| Token | Value | Common usage |
|---|---|---|
| `--g-space-1` | `4px` | Icon padding, tight gaps |
| `--g-space-2` | `8px` | Small gaps, badge padding |
| `--g-space-3` | `12px` | Input padding y, compact spacing |
| `--g-space-4` | `16px` | Input padding x, row padding |
| `--g-space-5` | `20px` | Card inner padding (small) |
| `--g-space-6` | `24px` | Card padding (standard) |
| `--g-space-8` | `32px` | Section inner gap |
| `--g-space-10` | `40px` | Section padding |
| `--g-space-12` | `48px` | Between sections |
| `--g-space-16` | `64px` | Page section padding |
| `--g-space-20` | `80px` | Large vertical rhythm |
| `--g-space-24` | `96px` | Hero spacing |
| `--g-space-32` | `128px` | Maximum section separation |

### Grid

Dashboard layout: `248px` sidebar + `1fr` main content. No fixed max-width on the main column — content determines density.

Section max-width: `max-w-7xl` (`80rem`, 1280px). Content max-width inside sections: `max-w-5xl` (`64rem`, 1024px). Text column max-width: `max-w-3xl` (`48rem`, 768px).

### Component Padding Rules

| Component | Padding |
|---|---|
| Page section | `px-6 py-8` (`24px / 32px`) |
| Card | `p-5` or `p-6` (`20px` / `24px`) |
| Input | `px-4 py-2.5` (`16px / 10px`) |
| Button | `px-4 py-2.5` (standard), `px-7 py-3.5` (large CTA) |
| Badge | `px-2.5 py-1` |
| Sidebar item | `px-3 py-2.5` |
| Table cell | `px-4 py-3` |
