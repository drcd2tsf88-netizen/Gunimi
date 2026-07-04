# 09 — AI Language System

## What "AI Language" Means

Every AI state in Gunimi has a visual and textual language. Users should never wonder "is the AI doing something?" The answer is always visually present.

---

## AI States

### Thinking

Gunimi AI is considering a response.

**Visual**: AI Core with `intensity="strong"`, rings visible, cyan border on the card, slow pulse on the input area.
**Copy style**: active present tense — "Analyzing workspace data…", not "Loading" or "Please wait"
**Animation**: progress line scanning, `opacity-70` on surrounding content

### Streaming

AI is generating text, token by token.

**Visual**: text appears with a subtle cursor (1px `--g-ai` blinking line after the last character)
**Copy style**: prose starts appearing immediately. Never show a full loading state then dump all text.
**Animation**: `opacity: 0.6 → 1` as each word appears, `200ms`

### Memory Access

AI is retrieving workspace memory.

**Visual**: AI Core small (`size=40`) in the card header, `intensity="medium"`, pulsing
**Indicator dot**: `--g-ai` with `--g-glow-ai`, `animate-pulse`
**Copy**: "Recalling context…", "Memory accessed"

### Automation Running

A workflow is executing.

**Visual**: timeline steps have animated left-border in `--g-primary`, each step activates in sequence
**Status chip**: `--g-ai` background at `opacity-10`, `--g-ai` border, cyan text
**Copy**: "Executing…", "Step 3 of 6 complete", "Workflow running"

### AI Success

Action completed, result available.

**Visual**: brief `--g-glow-sm` flash on the card border (fades 1.5s), then static
**Status chip**: `--g-success` fill, checkmark icon
**Copy**: "Analysis complete", "3 insights generated", "Automation finished"

### AI Warning

Result available but with caveats.

**Visual**: `--g-warning` border on the response card
**Status chip**: amber
**Copy**: "Low confidence — verify manually", "Limited data available"

---

## AI Badge / Status Chip

A reusable pill used throughout AI features:

```
variant: "thinking" | "streaming" | "active" | "done" | "error"

thinking: --g-ai-soft bg, --g-border-ai border, --g-ai text, pulse dot
active:   --g-primary-subtle bg, --g-border-active border, --g-primary-3 text
done:     --g-success-soft bg, --g-success border, --g-success text
error:    --g-danger-soft bg, --g-danger border, --g-danger text
```

---

## AI Copy Voice

AI-generated content and AI status messages follow a specific voice:

- **Direct**: "3 deals need attention" not "We found 3 deals that may need your attention"
- **Present tense**: "Analyzing" not "Analysis in progress"
- **Specific**: "Revenue down 12% this week" not "Revenue metric changed"
- **Action-oriented**: "Schedule a follow-up with Acme" not "Consider a follow-up"
- **No filler**: never "Please wait while we…", "We're working on…", "Almost done…"

---

## AI vs Non-AI Visual Distinction

| Element | Non-AI UI | AI-active UI |
|---|---|---|
| Borders | `--g-border` (white/5.5%) | `--g-border-ai` (cyan/15%) |
| Glows | `--g-glow-*` (violet) | `--g-glow-ai` (cyan) |
| Status dot | `--g-success` green | `--g-ai` cyan |
| Loading | Skeleton / opacity pulse | AI Core + scanning line |
| Card surface | `--g-surface` | `--g-surface` + `--g-light-ai-active` |
| Typography accent | `--g-primary-3` | `--g-ai-2` |

The difference must always be legible. A user scanning the screen should instantly know what the AI is doing.
