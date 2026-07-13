# Homepage Copy Bible
**Version 1.2 — Final. Approved for implementation.**

Every word on the homepage, in order. Nothing ships until this document is the source. No exceptions.

---

## Voice Constraints — Absolute

**Banned words. Zero exceptions.**

| Banned | Why |
|---|---|
| revolutionary, transform, transformative | unverifiable superlatives |
| supercharge, cutting-edge, next-generation | meaningless startup language |
| powerful, game-changing | says nothing |
| seamlessly, effortlessly | claims products never deliver |
| AI CRM | wrong category |
| 99.9% uptime SLA | unverified claim |
| SOC 2 Type II | uncertified |
| ISO 27001 | uncertified |
| GDPR compliant / GDPR fully compliant | unverified |
| zero-knowledge AI | technically inaccurate |
| Observatory | wrong product name |

**The register is: calm. specific. true. measured.**

Test for every sentence:
- Does this sound like a press release? Rewrite it.
- Could this appear on a competitor's homepage? Rewrite it.
- Can this be verified as true today? If not, remove it.

---

## Section 0 — Navbar

```
[Gunimi mark]                          [Join Open Alpha]
```

No feature navigation links. One CTA only.

---

## Section 1 — Hero

**Badge** (small chip, green pulse dot):
```
Open Alpha — Now Available
```

**Headline** (two lines, each its own line):
```
Work doesn't need more software.
Work needs understanding.
```

**Product sentence** (below headline, slightly smaller weight):
```
Gunimi doesn't replace your work.
It removes the work that shouldn't exist.
```

**Descriptor** (one line, muted, centered):
```
The AI Business Operating System.
```

**CTAs:**
- Primary: `Create your workspace`
- Secondary: `Sign in`

**Three data principles** (below CTAs, small, no icons):
```
Your data stays in your workspace.
We never train AI on your workspace data.
Your workspace is private by default.
```

---

## Section 2 — Why Now

**Eyebrow:**
```
The moment that changed everything
```

**Opening line:**
```
Software has always known what happened.
It never knew what it meant.
```

**Three evolution lines** (appear in sequence):
```
CRM systems learned to store relationships.
Project tools learned to store work.
Email learned to store communication.
```

**Pivot:**
```
None of them learned to understand it.
```

**The technology shift:**
```
For fifty years, software was limited to storage.

It could record that a deal went quiet.
It couldn't know the deal was at risk.

It could log that a follow-up wasn't sent.
It couldn't detect the relationship was cooling.

It could mark a task overdue.
It couldn't surface the urgency before it was too late.

AI changes what software can understand.

That's what makes Gunimi possible today.
```

**Closing:**
```
This is not a better CRM.
This is the first time software has been able
to understand a business.
```

---

## Section 3 — The Missing Layer

**Eyebrow:**
```
The architecture
```

**Headline:**
```
Between what happened
and what it means,
there was nothing.
```

**Body:**
```
Every tool in your business knows what was stored.
None of them know what it means.

A deal goes quiet for three weeks.
Your CRM records the silence.
Nobody asks why.

A customer hasn't been contacted in two months.
Your email archives the last message.
Nobody connects the risk.

A proposal is overdue and the close date is next Friday.
Your task tool marks it red.
Nobody surfaces the urgency before it's too late.
```

**Pivot:**
```
Gunimi builds the layer that was always missing.

Between what happened — and what you need to know.
```

---

## Section 4 — The Proof Moment

**Eyebrow:**
```
Signal Intelligence
```

**Headline:**
```
This is what
understanding looks like.
```

**Signal card** — rendered exactly as it appears in the product. Same border, background, typography, severity indicator as the real signal card component in `/dashboard`:

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  ⚠  Deal going stale                           ATTENTION  │
│                                                            │
│  Acme Corp — Enterprise contract                           │
│                                                            │
│  WHY THIS APPEARED                                         │
│  No customer communication for 21 days.                    │
│                                                            │
│  EVIDENCE                                                  │
│  Last email: June 18 · No reply received                   │
│  Last task: Proposal sent · Completed June 14              │
│  Calendar: No meeting scheduled                            │
│                                                            │
│  SUGGESTED ACTION                                          │
│  Reach out before close date. The proposal follow-up       │
│  is the last open thread — start there.                    │
│                                                            │
│  CONFIDENCE                                                │
│  High — based on 4 activity signals                        │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Label beneath card** (small, muted):
```
Example signal — this is the actual format Gunimi produces
```

**Three lines** (generous spacing between each):
```
This is not a notification.

This is not a reminder.

This is understanding — with evidence, reason, and a path forward.
```

**Architecture statement:**
```
Gunimi produces signals like this automatically.
Across Deals, Contacts, Companies, and Tasks.
Twenty-five signal types. Archived permanently.
Delivered every morning on Today.
```

---

## Section 4B — The Difference

*No eyebrow. No headline. No CTA. Six lines. White space does the work.*

```
Most software waits.
Gunimi notices.

Most software records.
Gunimi understands.

Most software records the past.
Gunimi prepares you for what matters next.
```

---

## Section 5 — Today Intelligence

**Eyebrow:**
```
Today Intelligence
```

**Headline:**
```
Every morning, Gunimi tells you
what needs your attention.
Before you ask.
```

**Intro:**
```
Today begins where yesterday ended.

Not a dashboard.
Not a report.
Not a task list you already know.

A prioritized morning briefing — built from every signal
in your workspace, organized by urgency,
written in plain language.

You open Today.
You know what to do.
That is the entire experience.
```

**Three pillars:**

`Focus`
What needs action today. Ordered by signal severity and time sensitivity.

`Attention`
Relationships and deals that are drifting. Early signals — before they become problems.

`Work`
Your task queue, cleared of noise. Overdue items surfaced in context, not in isolation.

**Closing:**
```
Every morning is different.
Because every morning, your business is different.
```

---

## Section 6 — The Workspaces

**Eyebrow:**
```
Workspace Engine
```

**Headline:**
```
Every relationship
has its own operating context.
```

**After headline** (immediately below, distinct typographic treatment):
```
Nothing exists in isolation.
```

**Intro:**
```
Not a record.
Not a profile.
Not a card in a database.

A Workspace is the complete operating context
for a relationship — everything connected to it,
in one place, with intelligence built in.
```

**Deal Workspace card:**
Label: `Deal Workspace · Live`
Headline: "The complete context of an opportunity."
Body: "Stage, close date, contacts involved, tasks due, notes written, emails exchanged, and signals — visible together. Nothing requires hunting across tools."

**Contact Workspace card:**
Label: `Contact Workspace · Live`
Headline: "The full intelligence layer of a relationship."
Body: "Contact profile, linked deals, task list, email history, notes, and relationship health — in one context. When someone goes quiet, you see it before it becomes a problem."

**Company Workspace card:**
Label: `Company Workspace · Live`
Headline: "The operating context for a business relationship."
Body: "Company profile, all contacts, associated deals, activity log, notes, and emails. The entire relationship visible in one place."

**Closing:**
```
Three workspace types.
One engine underneath.
The same intelligence across all three.
```

---

## Section 7 — Email Intelligence

**Eyebrow:**
```
Email Intelligence
```

**Headline:**
```
Your inbox is part
of your business context.
```

**Body:**
```
Connect Gmail. That is the entire setup.

Every thread links to the relevant contact.
Every contact connects to the relevant deal.
Every deal is informed by what was written, promised, and agreed.

You don't move between your email and your workspace.
Your email is inside your workspace.
```

**Three capabilities:**

`Thread sync`
Your Gmail conversations appear inside the relevant Contact and Deal Workspace automatically.

`Relationship context`
When you open a contact, you see the complete email history — without leaving Gunimi.

`Signal link`
A relationship gone quiet in email surfaces as a signal on Today.

---

## Section 8 — Business Memory

**Eyebrow:**
```
Coming Next
```

**Headline:**
```
Memory that outlives
a single conversation.
```

**Body:**
```
Today, Gunimi understands your business through signals.

Next, Gunimi will remember it.

Not activity logs.
Not conversation history.

Business memory — the patterns that repeat,
the relationships that matter,
the commitments made and kept over years of work.

The blueprint is complete.
The foundation already exists.
Memory is the next layer.
```

---

## Section 9 — Open Alpha

**Eyebrow:**
```
Open Alpha
```

**Headline:**
```
Open Alpha is now available.
```

**First line:**
```
This is the current public stage of Gunimi.
```

**Body:**
```
This is not a demo.
This is the product.

Create a workspace.
Connect your contacts.
Build your deal pipeline.
Connect your Gmail.
Watch Today build itself from your business — automatically.
```

**Available now:**
- Deal Workspace
- Contact Workspace
- Company Workspace
- Task Management
- Today Intelligence — Signal-powered
- Signal Engine — 25 signal types
- Gmail Integration
- Google Calendar Integration
- Command Center
- Automation Engine
- AI Assistant
- Analytics
- Notes

**Coming next:**
- Business Memory
- Interactive Living Demo

**Access line:**
```
[ACCESS MODEL TBD — confirm before shipping]
```

Do not write any access claim until the access model is definitively decided. The wrong claim here (open vs. waitlist vs. approval) creates support burden and erodes trust on day one.

**Primary CTA:** `Create your workspace`
**Secondary:** `Sign in`

---

## Section 10 — Final CTA

*No eyebrow. No subheadline. The same words that opened the page.*

```
Work doesn't need more software.
Work needs understanding.
```

**Primary CTA:** `Create your workspace`
**Secondary:** `Sign in`

---

## Section 11 — Footer

**Brand:**
Gunimi
The AI Business Operating System.

**Product:**
Roadmap · Changelog · Status

**Company:**
About · Contact

**Legal:**
Privacy · Terms · AI Transparency

**Bottom:**
© 2026 Gunimi. All rights reserved.

**Must not appear in footer:**
Certification badges. SLA statistics. Social proof. Feature lists. Any claim that cannot be verified today.

---

## Reading Order Verification

Read every line in sequence. Each section must answer the question left open by the previous.

```
Hero          → "Why didn't someone build this before?"
Why Now       → "What exactly is the gap?"
Missing Layer → "Does it actually work?"
Proof Moment  → "What does this look like in practice?"
The Difference→ [Category is established — no question needed]
Today         → "Where does my actual work live?"
Workspaces    → "What about my email?"
Email         → "Is this going to keep getting smarter?"
Memory        → "Can I get access now?"
Open Alpha    → [Ready to act]
Final CTA     → [Act]
```

If any section fails to answer its question — the section is not finished yet.
