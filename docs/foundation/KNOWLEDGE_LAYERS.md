# Gunimi Knowledge Layers

Version: 1.0
Status: Constitutional
Established: July 2026

---

## Purpose

This document defines how Gunimi understands business reality over time.

A system that only stores facts is a database. A system that only runs AI is a
chatbot. Gunimi is neither. Gunimi builds a living, evolving understanding of a
business — one that deepens with every interaction, every event, and every
decision made within the platform.

That understanding is structured as four distinct layers. Each layer builds on
the one below it. Each layer has its own properties, its own rules, and its own
role in the intelligence architecture.

---

## The Four Layers

```
Reality     ← what exists in the world, independently of Gunimi
   ↓
History     ← what Gunimi has observed and recorded
   ↓
Memory      ← what AI has interpreted as meaningful
   ↓
Wisdom      ← what patterns have emerged across time and entities
```

These layers are not interchangeable. Promoting knowledge from one layer to the
next is a deliberate, rule-governed process. Confusing layers — treating Memory
as History, or presenting Wisdom as a fact — is an integrity failure.

---

## Layer 1: Reality

> What exists in the world, entirely independently of Gunimi.

Reality is the ground truth. Business relationships, conversations, decisions,
and events exist in the world whether or not Gunimi captures them. Gunimi is
always an incomplete model of reality — this is expected and acknowledged.

**Properties of Reality:**
- Exists independently of any software system
- Always richer than what can be captured
- Is the ultimate source of all legitimate knowledge in Gunimi
- Cannot be invented — only observed

**Gunimi's relationship to Reality:**
Gunimi does not create Reality. Gunimi captures, models, and helps users
understand Reality. Every piece of data in Gunimi is either a direct record
of Reality, an interpretation of Reality, or a pattern derived from Reality.

If a piece of information in Gunimi cannot be traced to observed Reality,
it should not exist.

---

## Layer 2: History

> What Gunimi has observed and recorded as objective fact.

History is the record layer. It consists of Events — immutable records of things
that happened in business reality. History is what allows Gunimi to answer:
*"What happened?"*

**Properties of History:**
- Objective — records what was observed, not what was meant or interpreted
- Immutable — Events are never modified; errors are corrected with new Events
- Cumulative — History only grows; the past cannot be erased, only recontextualized
- The foundation for all AI reasoning — nothing above this layer may be trusted
  without traceable History beneath it

**The History boundary:**
An event that happened in Reality but was never recorded in Gunimi is invisible
to the system. This is a deliberate design limitation. Gunimi acknowledges it
by making historical capture as frictionless as possible — not by pretending to
know what was never recorded.

**What constitutes History:**
- Meetings and calls (recorded or logged)
- Emails and messages (captured via integration or manual entry)
- Deals opened, progressed, won, lost
- Documents signed or shared
- People introduced, joined, or departed
- Decisions made and recorded

**What is not History:**
- AI interpretation of events (that is Memory)
- Drafts, intentions, or plans (those are future-oriented)
- System events (UI clicks, login timestamps — these are logs, not business history)

---

## Layer 3: Memory

> What AI has interpreted as meaningful, derived from History.

Memory is the intelligence layer. Not everything in History is equally important.
A single email thread discussing contract terms may be more significant than
forty routine status updates. Memory is Gunimi's AI making that determination —
extracting signal from noise, and preserving what matters.

**Properties of Memory:**
- Selective — not all History becomes Memory; volume does not equal importance
- Interpretive — Memory represents AI's understanding, not objective fact
- Confidence-weighted — every Memory carries a confidence level
- Decaying — Memory that is not reinforced loses confidence over time
- Traceable — every Memory must point to the History that produced it

**The Memory boundary:**
Not all History becomes Memory. The transition from History to Memory is
AI-mediated and governed by:
- Relevance to active business relationships and opportunities
- Significance relative to other Events in the same context
- Recency and reinforcement by subsequent Events
- Confidence threshold — AI only creates Memory when evidence meets minimum confidence

**What constitutes Memory:**
- "This contact is the primary decision-maker for technology purchases"
- "This company has historically delayed payment by 30–45 days after invoice"
- "This deal stalled previously when pricing was introduced; re-engage on value first"
- "This person responds well to concise, data-led communication"

**What is not Memory:**
- A raw Event record (that is History)
- An AI-invented relationship not supported by Events (that violates Law II)
- A user's personal opinion entered as a note (that is History — a note Event)
- A Signal (Signals are action-oriented patterns; Memory is knowledge-oriented context)

**The AI Trust Rule:**
AI creates Memory. AI does not verify it independently. Memory is always presented
with its confidence level and provenance. High-impact Memory (affecting a deal,
a relationship, or a business decision) should be confirmed by a human before it
is used to drive automated action.

---

## Layer 4: Wisdom

> Generalized patterns learned from multiple instances of History and Memory,
> applicable across entities and time periods.

Wisdom is the highest layer of intelligence. It is not about one person or one
company. It is about how *this type of situation* tends to unfold — in this
Workspace, with this team, in this market context.

Wisdom is Gunimi's most powerful and most dangerous layer. It is the most powerful
because it allows the platform to reason about situations it has never seen before,
by analogy to situations it has seen many times. It is the most dangerous because
patterns can be misleading — a pattern observed in twelve cases may not hold on
the thirteenth.

**Properties of Wisdom:**
- Generalized — applies across entities, not to one specific case
- Earned — requires sufficient evidence before being formed (minimum case threshold)
- Updatable — new evidence can refine or invalidate established Wisdom
- Never hardcoded — Wisdom must be derived from real History, not authored by engineers

**The Wisdom boundary:**
Wisdom requires pattern across multiple instances. A single case can produce Memory.
Multiple similar cases, over time, with consistent patterns, can produce Wisdom.

Gunimi does not generate Wisdom on day one of a new Workspace. The platform
acknowledges that a new Workspace has History and may develop Memory, but Wisdom
requires accumulation over time.

**What constitutes Wisdom:**
- "SMB customers in this sector require structured onboarding; those without it
  churn within 60 days at a rate of 4×"
- "Deals with more than three stakeholders take 40% longer to close in this Workspace;
  multi-threading from the beginning reduces this"
- "Warm introductions from existing customers produce 60% higher close rates than
  cold outbound in this pipeline"

**What is not Wisdom:**
- A specific fact about a specific entity (that is Memory)
- A rule authored by a product engineer (that is a hardcoded assumption)
- A pattern observed in only one or two cases (that is an interesting hypothesis,
  not Wisdom)

---

## Movements Between Layers

Knowledge moves upward through the stack. It cannot move down.

| Transition | Governed by | Requirement |
|---|---|---|
| Reality → History | Human or integration | Deliberate capture of an observed event |
| History → Memory | AI | Minimum confidence threshold + traceable provenance |
| Memory → Wisdom | AI, over time | Pattern across multiple entities and time periods |

**Why knowledge cannot move down:**

Memory is interpretation. If Memory contradicts History, History is correct —
because History is what was observed, and Memory is what was inferred. The
inference is updated; the historical record is not.

Similarly, Wisdom does not rewrite Memory. Wisdom is a generalization. When
a generalization turns out to be wrong for a specific case, the case-specific
Memory takes precedence, and the Wisdom may be updated to reflect the exception.

---

## The AI Principle

> AI never creates Reality. AI only observes, interprets, and learns from it.

This is perhaps the most important principle in the Knowledge Layers architecture.

AI may move knowledge up the stack — from History to Memory, from Memory to Wisdom.
AI may not invent knowledge at any layer. An AI-invented Memory that was not derived
from History is not Memory. An AI-invented Wisdom that was not derived from real
patterns is not Wisdom. Both must be rejected.

This principle is the foundation of user trust. Gunimi is trustworthy because
every piece of intelligence can be traced to real events that really happened.
The moment that traceability breaks — the moment AI begins inventing rather than
interpreting — the platform becomes unreliable.

---

## Layer Summary

| Layer | Question answered | AI role | Immutable? | Decays? |
|---|---|---|---|---|
| Reality | What exists? | Observes | N/A | N/A |
| History | What happened? | Records | Yes | No |
| Memory | What matters? | Interprets | No | Yes |
| Wisdom | What patterns hold? | Generalizes | No | Yes |

---

*Understanding this stack is the prerequisite for designing any AI feature
in Gunimi. A feature that does not know which layer it operates at is a
feature that will eventually corrupt the layers it touches.*
