# Gunimi Workspace Grammar

**Version:** 1.0
**Status:** Foundational — permanent
**Authority:** Gunimi Product Bible v1.0

> *Note: `docs/WORKSPACE_CONTRACT.md` does not currently exist. When it is created, this Grammar must be reviewed against it. The Grammar is authored from the Product Bible, Workspace Principles, Deal Workspace Blueprint, and Contact Workspace Blueprint as primary sources.*

---

> *"Consistent components are the beginning of consistency. Consistent thinking is consistency itself."*

---

## Preface

The Workspace Principles define what every Workspace contains.

The Workspace Grammar defines how every Workspace thinks.

These are not the same thing.

A Workspace built from the correct components — the correct header, the correct tabs, the correct sections — can still feel completely wrong if the sections speak in the wrong voice. A Decision section that describes instead of deciding. A Story that predicts instead of recounting. A Situation that recommends instead of observing.

The user does not see grammar violations in the components. They feel them in the experience. They arrive in a Workspace expecting a clear next action and find a description. They arrive expecting history and find the present restated. They arrive expecting depth and find duplication. They cannot name what went wrong. They only know the Workspace did not help them.

This document names it.

The Grammar is the contract between every Workspace and the users who rely on them. When every Workspace speaks the same language — when Situation always means the present state, when Decision always means the recommended action, when Story always means the path that was taken — users stop thinking about the software and start thinking about their business.

That is the goal.

---

## Chapter 1 — Why Grammar Exists

### The illusion of consistency

Two Workspaces can share every component, every color, every structural element — and still feel entirely different to the user. The difference is not visual. It is cognitive.

If one Workspace's Decision section says: "Follow up on this deal — no activity in 14 days" and another Workspace's Decision section says: "This relationship has been inactive for 14 days, last contacted via email, two tasks are pending, the deal closes in 21 days" — the user has received a recommendation in the first and a Situation dump in the second.

Both sections occupy the same position in the same structural layout. Both use the same components. But they speak different languages. The user came to the Decision section expecting to be told what to do. In the second Workspace, they must read, synthesize, and decide for themselves. The structural promise was made and broken.

This is the problem Grammar solves.

### Why structural rules alone are insufficient

Structure says: every Workspace has a Decision section.

Grammar says: the Decision section recommends. It does not describe, analyze, or list. It chooses.

Structure is enforced by layout. Grammar is enforced by meaning. Both are necessary. Neither is sufficient without the other.

A design system enforces structure — the same components in the same positions. A grammar enforces meaning — the same kind of thinking in the same positions. Gunimi requires both because users build mental models from meaning, not from structure.

### What consistent grammar produces

When every Workspace speaks the same language:

- A user who has learned one Workspace understands all Workspaces without re-learning.
- A user who trusts the Situation section in one Workspace trusts it in all Workspaces.
- A user who relies on the Decision section in one Workspace relies on it in all Workspaces.
- The product becomes predictable in the best sense: not boring, but reliable.

Reliability is the foundation of trust. Trust is the foundation of adoption. Grammar is the foundation of reliability.

### The cost of grammar violations

Grammar violations are invisible until they accumulate. A single Decision section that over-describes is a minor friction. Across ten Workspaces, the friction becomes a pattern. The user begins to distrust the Decision section — not because any single instance failed, but because the section no longer reliably means what the user expects it to mean.

Once a user stops trusting a section, they begin doing the system's work themselves — reading everything, synthesizing across sections, deciding without the system's help. At that point, Gunimi has become a better-organized CRM. The Grammar violations have erased the product's core value proposition.

### Grammar is permanent

The Grammar does not change with technology. It does not change with design trends. It does not change when new Workspace types are created.

When Gunimi builds a Company Workspace, a Meeting Workspace, a Project Workspace — the Grammar applies. The content of each section will differ. The language each section speaks will not.

---

## Chapter 2 — The Five Questions

Every Workspace answers exactly five questions. Each question belongs to exactly one section. No section answers more than one question. No two sections answer the same question.

These five questions are the complete cognitive grammar of a Workspace.

---

### Question 1 — Situation

**The question:** *"What is happening?"*

The Situation describes the present state of the business context. It observes reality and reports it.

The Situation is the system's eyes. It looks at what is true right now — not what might happen, not what should happen, not what happened before. It reports only what is observable and currently true.

**Grammar rules:**

**1.1 — Describe. Never prescribe.**
Situation describes the current state. It does not recommend any action. "The deal has had no activity in 14 days" is Situation. "Follow up on the deal" is Decision.

**1.2 — Observe. Never judge.**
Situation reports observable facts. It does not evaluate whether those facts are good or bad, whether the user made the right choices, or whether the situation could have been avoided. "The relationship has been quiet for 18 days" is Situation. "The relationship has been neglected" introduces judgment where only observation belongs.

**1.3 — Present tense. Always.**
Situation lives in the now. It speaks in present tense because it describes what is currently true. "No activity this week" is Situation. "There was no activity last month" belongs in Story.

**1.4 — Specific, not general.**
Situation names facts. "No activity in 14 days" is specific. "This relationship needs work" is a judgment that belongs nowhere. "The deal closes in 4 days" is specific. "This deal is urgent" is an interpretation — and interpretation is the user's role.

**1.5 — Suppress what Decision already addresses.**
When the Decision section has already claimed the most urgent signal as the basis for its recommendation, the Situation section does not repeat that signal. The Situation surfaces secondary observations only. If the primary signal (deal is stale) has driven the Decision recommendation, Situation shows only what Decision has not addressed.

**1.6 — Silence is acceptable. Never fabricated.**
When there are no meaningful signals — when the business context is healthy, active, and on track — Situation may be empty or show a calm healthy state. It does not manufacture signals to fill the space. An honest empty Situation is more valuable than an invented one.

---

### Question 2 — Decision

**The question:** *"What should happen next?"*

The Decision recommends. It does not describe, analyze, list, or qualify. It chooses.

The Decision is the system's voice — the moment where everything the system has observed about this business context is collapsed into a single clear recommendation. The user may accept it or reject it. But the system has a view, and it states that view directly.

**Grammar rules:**

**2.1 — Choose. Never list.**
Decision gives one recommendation. Not two. Not a ranked list of three. If there are multiple things that could be done, the system evaluates them in priority order and recommends the most important one. The user did not open this Workspace to manage a to-do list. They came to know what to do next.

**2.2 — Imperative voice. Always.**
Decision speaks in direct, action-oriented language. "Schedule a meeting with Maria" not "It might be beneficial to schedule a meeting." "Update the close date" not "Consider updating the close date." Confidence is quiet. Confidence does not hedge.

**2.3 — Explain the why. One sentence. Evidence only.**
Every recommendation is accompanied by exactly one sentence explaining why. That sentence is grounded in observable evidence from the business context — never in a general rule, never in AI reasoning, never in a heuristic. "No response to the proposal in 11 days and the close date is next Friday" is evidence. "This appears to be a high-priority situation" is not evidence — it is an opinion with no source.

**2.4 — Never redescribe the Situation.**
Decision begins with the recommended action, not with a summary of the current state. The Situation has already provided that summary. Repeating it in Decision forces the user to read the same information twice before getting to the recommendation.

**2.5 — Never contain Preparation items.**
If the Decision section begins listing what the user should know before taking the action — the last meeting date, the open contract version, the contact's phone number — it has absorbed Preparation. Decision answers "what to do." Preparation answers "what to bring."

**2.6 — Healthy state is not silence.**
When no action is required — when the business context is healthy, tasks are current, no signals are urgent — the Decision section shows an explicit healthy state. It says: "Everything is on track. No action required." or an equivalent calm statement. This is not a failure state. It is an honest state. The absence of an urgent recommendation is itself a valuable signal. A Decision section that disappears when everything is healthy trains users to fear the absence of content.

**2.7 — The system never decides for the user.**
Decision recommends. The user approves or ignores. A recommendation that is followed because the user chose to follow it is respected. A recommendation that executes automatically is a boundary violation. Decision is the voice that speaks; the human hand is what acts.

---

### Question 3 — Preparation

**The question:** *"What do I already have?"*

The Preparation surfaces the context the user needs before acting on the Decision recommendation. It assembles. It does not analyze, recommend, or introduce new information that changes the user's direction.

The Preparation is the briefing folder. An exceptional executive assistant who has already recommended a course of action then assembles everything the executive will need to execute that action. They do not offer a second opinion. They prepare.

**Grammar rules:**

**3.1 — Conditioned on the Decision action. Always.**
Preparation items exist to support the current recommended action. If the Decision recommends "follow up on the stale deal," Preparation surfaces the last interaction summary, the open proposal, and the contact's preferred channel. If the Decision recommends "update the close date," Preparation surfaces the current close date, the last stage change, and the reason the deal is at this stage. Preparation content adapts to Decision content. A Preparation section that is identical regardless of what the Decision recommends has violated this rule.

**3.2 — Assemble. Never analyze.**
Preparation presents facts ready for use. "Last meeting: 3 weeks ago, outcome: sent proposal, awaiting response" is assembly. "This suggests the prospect is losing interest and the relationship may be cooling" is analysis. Analysis belongs in the Situation layer. Preparation trusts the user to draw their own conclusions from assembled facts.

**3.3 — Never introduce new recommendations.**
A Preparation item that says "you might also want to call their manager" has introduced a second Decision. Preparation does not have opinions about what should happen next. It prepares for what the Decision has already said should happen next.

**3.4 — Never duplicate Context.**
If a piece of information is present in the Context section, Preparation does not repeat it. Preparation surfaces what the user needs immediately, for the immediate action. Context provides the deeper web of connections. These are different scopes. Information should not appear in both.

**3.5 — Empty when nothing is needed.**
Preparation does not manufacture items to appear thorough. When the Decision action does not require specific preparation — when the relationship is healthy and no action has been recommended — Preparation is not rendered. An absent Preparation section is honest. A Preparation section filled with generic items that are always present regardless of context is noise.

---

### Question 4 — Story

**The question:** *"How did we get here?"*

The Story explains the evolution of the business context from its origin to the present. It narrates what happened. It does not evaluate whether what happened was good, predict what might happen, or recommend what should happen.

The Story is memory made legible. It exists so that a new team member, an owner returning after time away, or a user preparing for an important meeting can understand the arc of a relationship or opportunity — without reading every note, every email, and every task comment.

**Grammar rules:**

**4.1 — Chronological. Without exception.**
Story begins at the origin and moves forward. The oldest event is first. The most recent event is last. Reverse-chronological ordering — the feed model — is an anti-pattern that turns Story into log. Users understand a narrative by following it forward. A story told backwards is a mystery, not a brief.

**4.2 — Milestones, not log entries.**
Story synthesizes. Primary events — first meeting, proposal sent, deal won, relationship changed — are shown individually because they carry weight. Secondary events — notes added, tasks created, minor updates — are grouped into milestones that indicate a period of activity without itemizing every action. The goal is a readable arc, not a complete record.

**4.3 — Human language. No system events.**
Every event in a Story is expressed in the language a business owner would use to describe it. "First meeting with Maria Chen" not "ACTIVITY_CREATED: type=MEETING". "Proposal sent" not "EMAIL_SENT: subject=Q3 Proposal v2.pdf." System language in the Story breaks the narrative and forces the user to translate before reading.

**4.4 — Explain path. Never evaluate present.**
Story explains how things became what they are. It does not evaluate whether the current state is good or bad, and it does not revisit the Situation. "Three meetings held over four weeks, culminating in a proposal" explains a path. "Relationship appears to have stalled since the proposal" evaluates the present — that is Situation's job.

**4.5 — Never predict.**
Story is history. It ends where the present begins. It does not contain forward-looking language: not "this relationship may need attention," not "based on this trajectory, close is likely," not "next steps could include." The moment Story speaks about what might happen, it has violated its own grammar and entered Decision territory.

**4.6 — Story always begins at the origin.**
The first event in every Story is the moment the business context came into existence — the deal was created, the relationship began, the first signal was received. This synthetic origin event anchors the narrative. A Story that begins mid-way through the relationship, at an arbitrary date, is not a Story. It is a filtered log.

---

### Question 5 — Context

**The question:** *"What else is connected?"*

The Context reveals the relationships, connections, and related business objects that give the current context depth. It expands understanding. It does not duplicate what other sections have already shown, and it does not make recommendations.

The Context is the map of connections. It answers not "what is happening" or "what should I do" but "who and what else is part of this picture."

**Grammar rules:**

**5.1 — Reveal connections. Never duplicate.**
Context shows what is related to the current business context that has not already been covered by Preparation. If Preparation surfaced the active deal because it is relevant to the recommended action, Context does not list that deal again. Context goes broader, not deeper — it shows the web of relationships, not the details of what has already been featured.

**5.2 — Structured by relationship type, not by data type.**
Context sections are organized by what they represent in business terms — "Company," "Active Opportunities," "Related People," "Ongoing Work" — not by database category ("Notes," "Tasks," "Emails," "Activities"). The user thinks in business relationships, not in data types. A section titled "Notes" asks the user to switch into database mode. A section titled "Recent conversations" keeps them in business mode.

**5.3 — Every entry navigates somewhere.**
Every item in Context is a link to another Workspace or a navigable entity. Context items are not display-only. If a company is shown in Context, it links to the Company Workspace. If a deal is shown, it links to the Deal Workspace. Context is the connective tissue between Workspaces — it creates a network, not a dead end.

**5.4 — Curated, not complete.**
Context shows what is recent and relevant. Not all notes — the recent and significant ones. Not all deals — the active ones. Not all tasks — the open and approaching ones. A Context section that shows all historical records has become a database browser. The user should leave Context with a broader understanding of connections, not with a complete record of everything associated with this entity.

**5.5 — Never contain recommendations.**
Context items are navigable facts about connections. They do not contain suggestions, prompts, or calls to action. "Company: Acme Corp — 3 active colleagues in system" is Context. "Consider reaching out to the other Acme contacts to triangulate this relationship" is Decision, and it does not belong in Context.

**5.6 — Empty sections are not shown.**
If a Context section has no items — no active deals, no related notes, no open tasks — that section is not rendered. The Context tab shows only what exists. An empty Context tab shows a calm empty state for the entire tab. Empty sections within a non-empty tab are simply absent.

---

## Chapter 3 — Grammar Rules

The following rules extend the Five Questions with the specific constraints required to preserve the Grammar across all Workspace types.

These rules are permanent. They apply to every Workspace built on the Gunimi platform.

---

### Separation rules

**Rule 3.1 — One question per section.**
Each section answers exactly one of the Five Questions. A section that attempts to answer two questions has violated the Grammar. When a section feels "overfull," it is almost always because it has absorbed work that belongs to an adjacent section.

**Rule 3.2 — One answer per question.**
Each question is answered exactly once per Workspace. If the same signal appears in both Situation and Decision, one of them has violated its boundary. If the same event appears in both Preparation and Context, one of them has violated its boundary.

**Rule 3.3 — Signals resolve in one layer.**
Every signal — every observation about the state of the business context — surfaces in exactly one section. The section that surfaces it owns it. Other sections that could reference it defer. The Situation surfaces a signal. The Decision acts on it. The Preparation prepares for the action. None of them re-surface the original signal.

---

### Directional rules

**Rule 3.4 — Decision drives Preparation. Always.**
The content of the Preparation section is determined by the content of the Decision section. If the Decision changes — because new data has arrived or a threshold has been crossed — the Preparation content changes with it. A Preparation section that is independent of Decision has lost its purpose.

**Rule 3.5 — Story never predicts.**
The moment Story speaks about what might happen next, it has become a hybrid of history and Decision. Story ends where the present begins. "Three meetings over six weeks" is Story. "This trajectory suggests a close is imminent" has left Story and entered Decision.

**Rule 3.6 — Context never repeats Preparation.**
The dividing line between Preparation and Context is immediacy. Preparation surfaces what the user needs for the current recommended action. Context surfaces what is connected more broadly. An item that belongs in both belongs in only one. The tiebreaker: if the item is needed for the immediate action, it belongs in Preparation.

---

### Language rules

**Rule 3.7 — Business language. Always.**
Every word visible in a Workspace is the language a business owner would use to describe the situation. Technical language, database language, software language, and developer language are prohibited. "No activity in 14 days" is business language. "updated_at timestamp exceeds STALE_THRESHOLD_DAYS" is not. "This deal closes next Friday" is business language. "expected_close_date: 2026-07-12" is not.

**Rule 3.8 — Natural time. Always.**
Time is expressed in natural language throughout the Workspace. "3 days ago." "Last Tuesday." "In 4 days." "Next month." ISO timestamps, Unix timestamps, and numeric date strings do not appear in any Workspace, in any section, anywhere.

**Rule 3.9 — No CRM jargon.**
The following words and phrases are prohibited in every Workspace: Record, Entity, Module, Log Activity, Lead, Prospect, Account, Convert, Pipeline Stage (as a label — "stage" may be used in context), Created Date, Last Modified, Source, Lead Score. These terms describe how CRMs are built. Gunimi describes how businesses work.

---

### Integrity rules

**Rule 3.10 — No fabricated information.**
A Workspace never invents data it does not have. When information is insufficient to assess a situation, this is stated explicitly: "Limited history available. Add more contact history to improve this assessment." A Workspace that fabricates confidence when data is insufficient has violated the foundational trust contract.

**Rule 3.11 — No AI identification.**
Nothing in any Workspace identifies content as AI-generated. No section title, no badge, no tooltip, no footnote, no disclaimer. The intelligence is infrastructure. The content belongs to the Workspace. The user experiences better decisions — they do not experience AI.

**Rule 3.12 — No duplicated signals.**
The same observation about the business context appears in exactly one section. If the Situation observes "no activity in 14 days" and the Decision recommends "follow up because of no activity in 14 days," the Decision has absorbed the Situation signal into its reasoning sentence. The Situation does not then also display the same observation. The signal has been claimed by the Decision's reasoning. Situation surfaces secondary signals only.

---

### Completeness rules

**Rule 3.13 — Healthy states are explicit, not silent.**
When a business context requires no action — when everything is on track, tasks are current, relationships are active — Workspaces do not disappear their content. The Decision section shows an explicit healthy state. The Situation section may show a calm positive observation. Absence of content in a section that should always have something is indistinguishable from a bug. Explicit healthy states are not neutral — they are a positive signal that the system is watching and has nothing to report.

**Rule 3.14 — Empty sections do not render.**
A section with no items is not shown. This is the opposite of fabrication: rather than showing placeholder content, the Workspace simply does not render the section. Empty Preparation: not rendered. Empty Context section: not rendered. The Workspace is honest about what it knows.

**Rule 3.15 — Decision is always present.**
The one exception to Rule 3.14: the Decision section is always rendered, even when the answer is a healthy state. Decision is the core promise of a Workspace — the user always leaves knowing what (if anything) requires their attention. The healthy state is a valid and complete Decision answer.

---

## Chapter 4 — Information Flow

### The intended mental journey

A user opens a Workspace. They have been away from this business context — perhaps for hours, perhaps for weeks. They need to be oriented before they can act. They need to act before they need to explore. They need to explore if they want to go deeper.

The Grammar is designed around this journey. Each section corresponds to one stage of the journey. The order is not aesthetic. It is cognitive.

```
Reality      →   Situation     "Where am I?"
     ↓
Direction    →   Decision      "Where should I go?"
     ↓
Readiness    →   Preparation   "What do I bring?"
     ↓
History      →   Story         "How did I get here?"
     ↓
Connections  →   Context       "What else is part of this picture?"
```

### Why this order minimizes cognitive load

**Step 1 — Reality before Direction.**
Before a user can evaluate a recommended action, they need to understand the present situation. If Decision comes first — if the user reads "follow up with Maria" before understanding why — they must ask the question the Situation was supposed to answer. Situation first provides the orientation that makes Decision immediately interpretable.

Consider: a user opens a deal Workspace and reads "Follow up on this deal." Without orientation, they ask themselves: "Why? What's happening? When did I last speak to them?" Those questions create cognitive load. With Situation first, those questions are already answered. The Decision lands with its evidence already established.

**Step 2 — Direction before Readiness.**
Preparation is only meaningful once the recommended direction is known. If Preparation appeared before Decision, the user would be handed a briefing folder without knowing what meeting they are going to. Preparation after Decision means every assembled item has immediate context: "I know where I'm going — what do I need to bring?"

**Step 3 — History after Readiness.**
The Story tab is deliberately not the first thing a user sees when they open a Workspace. History is context for the present, but it requires the present to be established first for it to be meaningful. A user who reads the Story before understanding today's situation is reading a novel without knowing what chapter they are in. History after the present means the user reads the Story with orientation — they know what the Story is building toward.

**Step 4 — Connections after History.**
Context is the deepest layer of the Workspace — the map of related entities, broader relationships, and connections beyond the immediate picture. It is appropriate that it is last. A user who has oriented themselves (Situation), decided on a direction (Decision), prepared for the action (Preparation), and understood the arc of the relationship (Story) is now ready to explore connections. Context is for depth, not for orientation.

### What violating this order costs

Any deviation from this order imposes a cognitive tax:

- **Story before Situation** — the user reads history without knowing what it's building toward. They must synthesize their own present from historical records. This is the CRM model.
- **Decision before Situation** — the user receives a recommendation without the evidence that grounds it. They either trust without understanding or backtrack to find context.
- **Context before Preparation** — the user is offered connections before knowing what they are preparing for. The connections lack immediate relevance.

The order is not a preference. It is the structural answer to the question: in what order does a human mind need information to act effectively with minimal effort?

---

## Chapter 5 — What Must Never Happen

These are the anti-patterns — the ways the Grammar breaks in practice. Each anti-pattern has been named, described, and traced to the Grammar rule it violates.

---

### Anti-pattern 1 — Situation absorbs Decision

**What it looks like:**
The Situation section says: "The deal has had no activity in 14 days. You should follow up immediately. The proposal is unanswered."

**Why it violates Grammar:**
The word "should" is the violation. Situation observes. The moment it recommends, it has absorbed the Decision section's responsibility.

**Why it matters:**
The user learns to look at the Situation section for their next action. The Decision section becomes redundant. Over time, the Situation section grows — because every new signal someone wants to "make actionable" gets added to it. The section becomes a mixed briefing that requires the user to separate observations from recommendations themselves.

**Correct form:**
Situation: "No activity in 14 days. Proposal unanswered."
Decision: "Follow up with this deal — the proposal has been unanswered for 14 days."

---

### Anti-pattern 2 — Decision absorbs Situation

**What it looks like:**
The Decision section says: "This deal has been inactive for 14 days. The proposal was sent on June 15th. The contact's last email was June 12th. The close date is July 20th. Given all this, you should follow up."

**Why it violates Grammar:**
The Decision section has re-delivered the Situation before stating the recommendation. The user has read the same information twice.

**Why it matters:**
The Decision section becomes long and slow. Users begin skipping to the end of the Decision section for the recommendation, which defeats the purpose of the section. The brevity and directness that makes the Decision trustworthy is lost.

**Correct form:**
Decision: "Follow up on this deal — no response to the June 15th proposal and the close date is in 35 days."

The evidence is in one sentence, sourced specifically, attached to the action. The Situation section has already provided the full context.

---

### Anti-pattern 3 — Preparation introduces new analysis

**What it looks like:**
A Preparation item reads: "Last meeting three weeks ago — the tone suggests uncertainty. The prospect may be stalling. Consider addressing their hesitation directly."

**Why it violates Grammar:**
"Consider addressing their hesitation" is a recommendation. "The tone suggests uncertainty" is analysis. Preparation assembles facts; it does not interpret them or offer additional direction.

**Why it matters:**
The user is now receiving a second, implicit Decision inside the Preparation section. The clarity of a single recommendation is undermined. The user must now weigh the Decision recommendation against the Preparation suggestion and decide which to follow.

**Correct form:**
Preparation item: "Last meeting: 3 weeks ago. Outcome: discussed Q3 timing. Follow-up requested by: prospect."

The user receives the assembled fact. They draw their own conclusion about tone. The Preparation has done its job — assembly, not interpretation.

---

### Anti-pattern 4 — Preparation becomes a second Decision

**What it looks like:**
After the Decision recommends "follow up with Maria," a Preparation item reads: "You might also want to reach out to her manager to triangulate the relationship."

**Why it violates Grammar:**
This Preparation item contains a recommendation. It has introduced an alternative course of action after the Decision section has already closed with a single recommendation.

**Why it matters:**
The user came to the Workspace for one clear action. They now have two. The Decision section's directness has been diluted by a second opinion embedded in Preparation. This is how the "one recommendation" principle erodes over time — not in the Decision section itself, but in adjacent sections that start making decisions.

**Correct form:**
If contacting the manager is the right recommendation, it belongs in the Decision section as an alternative decision — one that the priority algorithm chose or did not choose. If the algorithm chose "follow up with Maria" as higher priority, the manager recommendation does not appear anywhere.

---

### Anti-pattern 5 — Story becomes Activity Feed

**What it looks like:**
The Story tab shows a reverse-chronological list:
- 2 hours ago — Task: "Send follow-up email" — Added by Alex
- 1 day ago — Note added: "Call went well"
- 3 days ago — Email sent to maria@acme.com
- 5 days ago — Stage changed: Proposal → Negotiation
- 1 week ago — Task: "Prepare contract" — Completed by Alex

**Why it violates Grammar:**
This is a log, not a Story. It is reverse-chronological. Every event is individually listed. System events are shown verbatim. No synthesis has occurred.

**Why it matters:**
The user must read every entry to construct the narrative themselves. The log model is exactly what the Story section exists to replace. A user who arrives at the Story tab expecting a narrative and finds a log has gained nothing from the Workspace architecture over a traditional CRM.

**Correct form:**
Story begins with the deal's origin, moves forward chronologically, shows primary milestones individually ("Proposal sent — June 15th"), and groups secondary events ("Two follow-up tasks added — week of June 10th"). The user reads the arc in 30 seconds.

---

### Anti-pattern 6 — Context becomes a database browser

**What it looks like:**
The Context tab shows:
- Notes (47)
- Tasks (12)
- Emails (34)
- Activities (89)
- Files (3)

Each with a list showing all items of that type, with sorting and filtering controls.

**Why it violates Grammar:**
This is a module-based layout embedded in a Context tab. The sections are organized by data type, not by relationship type. The user is being offered everything, not something relevant.

**Why it matters:**
The Context tab has become a second navigation layer inside the Workspace. The user is now browsing data rather than understanding connections. This is precisely what the Workspace architecture was designed to eliminate.

**Correct form:**
Context tab contains curated sections: "Company" (linked), "Active Deals" (recent, relevant, linked), "Recent Notes" (the most recent 3–5, navigable), "Open Tasks" (the pending ones, not all completed ones). The sections are organized by business relationship type. Every item is navigable. No filters, no sorting controls, no counts displayed as primary information.

---

### Anti-pattern 7 — The same signal in two sections

**What it looks like:**
Situation: "This relationship has been quiet for 18 days."
Decision: "Reach out to Maria — the relationship has been quiet for 18 days."

**Why it violates Grammar:**
The "18 days quiet" signal has appeared in both Situation and Decision. The user reads the same observation twice.

**Why it matters:**
Duplication forces reconciliation. The user, reading the Decision section, must confirm whether the "18 days" in Decision is the same signal as the "18 days" in Situation, or whether they are different observations that happen to use the same number. This is cognitive work that the system created and the user must resolve.

**Correct form:**
When Decision absorbs a signal as the basis for its recommendation, Situation suppresses that signal and shows only what Decision has not addressed. If "18 days quiet" is the primary signal driving the Decision, Situation either shows nothing (if that is the only signal) or shows secondary signals that Decision did not address.

---

### Anti-pattern 8 — The healthy state disappears

**What it looks like:**
When no action is required, the Decision section simply does not render. The Overview tab shows Situation, then nothing, then Business Summary. The absence creates ambiguity.

**Why it violates Grammar:**
The Decision section's absence is indistinguishable from a loading failure, a bug, or an incomplete implementation. The user does not know whether the system has nothing to recommend or whether something failed.

**Why it matters:**
Absence of content trains users to expect absence of content even when it signals a problem. The "this deal is on track" signal is valuable. Its absence removes that signal from the user's model of the Workspace.

**Correct form:**
The Decision section always renders. When there is no urgent action, the healthy state is shown explicitly: "This deal is on track — no action required." or an equivalent calm, honest statement appropriate to the business context.

---

### Anti-pattern 9 — Preparation independent of Decision

**What it looks like:**
The Preparation section always shows the same items regardless of what the Decision section recommended: "Last meeting, last email, current deal stage, owner." These items never change even when the Decision changes.

**Why it violates Grammar:**
Preparation has become a fixed summary block rather than a context-specific briefing. It is no longer conditioned on the Decision action. It prepares for everything, which means it prepares for nothing in particular.

**Why it matters:**
The user preparing to "follow up on a stale deal" needs different context than the user preparing to "present a closing proposal." The same items in both cases means the Preparation section adds no incremental value over reading the Business Summary.

**Correct form:**
The Preparation resolver reads the current Decision action and assembles items specifically relevant to that action. "Follow up on stale deal" surfaces last interaction date, last email subject, open questions from the last meeting. "Prepare closing proposal" surfaces deal value, last negotiated terms, contact's decision timeline. The items change when the action changes.

---

## Chapter 6 — Workspace Invariants

These are the rules that hold true for every Workspace on the Gunimi platform, forever. They are not suggestions. They are the conditions under which a Workspace may be called a Gunimi Workspace.

A Workspace that violates any invariant must be corrected before it can be considered complete.

---

**Invariant 1 — Exactly one primary Decision.**
A Workspace contains zero (healthy state) or one primary recommendation. Never more than one. The healthy state is a valid Decision answer. Multiple recommendations are a violation.

**Invariant 2 — No duplicated signals.**
Every signal surfaces in exactly one section. The system resolves duplication. Users never reconcile.

**Invariant 3 — Decision drives Preparation.**
Preparation content is always conditioned on the current Decision action. Preparation independent of Decision has lost its meaning.

**Invariant 4 — Story is chronological.**
Every Story in every Workspace is ordered oldest-to-newest, always. No exceptions.

**Invariant 5 — Story explains. Never predicts.**
Story ends where the present begins. No forward-looking language exists in any Story section.

**Invariant 6 — Context does not duplicate Story.**
Time is the discriminator. Past events belong in Story. Current connections belong in Context.

**Invariant 7 — Context does not duplicate Preparation.**
Immediacy is the discriminator. What the user needs for the current action is Preparation. What is broadly connected is Context.

**Invariant 8 — No AI identification.**
No section, label, badge, icon, or language in any Workspace identifies content as AI-generated.

**Invariant 9 — No fabricated information.**
When data is insufficient, this is stated honestly. Fabricated confidence destroys trust.

**Invariant 10 — Trust before intelligence.**
When evidence is insufficient for a recommendation, no recommendation is made. An honest empty state or calm healthy state is more valuable than a plausible recommendation not grounded in specific evidence.

**Invariant 11 — Business language. Always.**
Every visible word is business language. No technical language, no database language, no developer language, no CRM jargon.

**Invariant 12 — Natural time. Always.**
Dates and times are expressed in natural language. ISO timestamps do not appear in any user-facing surface.

**Invariant 13 — Empty sections are not rendered.**
Sections with no items are absent. Placeholder content, artificial busyness, and empty widgets are prohibited.

**Invariant 14 — Decision always renders.**
The one exception to Invariant 13. The Decision section is always present, showing either a recommendation or an explicit healthy state.

**Invariant 15 — Single Ownership is visible.**
Every Workspace header shows exactly one owner. Ownership is never hidden, never unassigned, never implicit.

**Invariant 16 — Calm before completeness.**
A Workspace that shows less with more clarity is better than a Workspace that shows everything. Showing only what is relevant today is not incompleteness. It is the product.

**Invariant 17 — Healthy states are explicit.**
When a business context is healthy and no action is required, the Workspace shows this explicitly. Absence of content is not the healthy state. An explicit calm signal is.

**Invariant 18 — Context entries are navigable.**
Every item in a Context section links to its Workspace or entity. Context is not a display layer. It is a navigation layer with semantic meaning.

**Invariant 19 — Preparation is conditional.**
Preparation renders only when there is something to prepare. When the business context is healthy and the Decision shows a healthy state, Preparation is absent. Presence of Preparation implies an action to prepare for.

**Invariant 20 — Grammar applies universally.**
The Grammar applies to every Workspace type — Deal, Contact, Company, Meeting, Project, or any future type. No Workspace type is exempt from the Five Questions, the Grammar Rules, or the Invariants.

---

## Chapter 7 — The Grammar Test

Before any Workspace is considered complete, it must pass this test. The test applies to every section independently, and then to the Workspace as a whole.

A section passes only if it answers its own question and no one else's.
A Workspace passes only if all sections pass and no signal appears in more than one section.

---

### Section Audit

**Situation — passes if:**

- [ ] Every visible statement describes a current, observable condition
- [ ] No statement recommends an action
- [ ] No statement predicts a future state
- [ ] No statement uses evaluative language ("neglected," "urgent," "good," "bad")
- [ ] No statement repeats a signal already owned by Decision
- [ ] All time expressions use natural language
- [ ] All entity references use business language, not database field names
- [ ] If no meaningful signals exist, section either shows calm state or is absent

**Decision — passes if:**

- [ ] Contains exactly one recommendation (or explicit healthy state)
- [ ] Recommendation is expressed in imperative voice
- [ ] Recommendation includes exactly one evidence sentence with specific data
- [ ] Does not restate the Situation before giving the recommendation
- [ ] Does not contain preparation items, context items, or story references
- [ ] Healthy state is explicit and calm when no action is required
- [ ] Section renders in all states (recommendation or healthy state — never absent)
- [ ] No AI identification anywhere

**Preparation — passes if:**

- [ ] Every item directly supports the current Decision action
- [ ] No item contains recommendations or directional language
- [ ] No item repeats information already shown in Context
- [ ] Items are expressed as assembled facts, not interpretations
- [ ] Items are different from what they would be for a different Decision action
- [ ] Section is absent when the Decision shows a healthy state
- [ ] No placeholder items are present

**Story — passes if:**

- [ ] Events are ordered oldest to newest without exception
- [ ] Primary events are individually rendered with human-language descriptions
- [ ] Secondary events are grouped into activity milestones, not individually listed
- [ ] No event contains forward-looking language or recommendations
- [ ] No event describes the present state (Situation owns the present)
- [ ] No event uses system language, field names, or technical descriptions
- [ ] First event is the origin of the relationship or business context

**Context — passes if:**

- [ ] Sections are organized by relationship type, not data type
- [ ] Every item is navigable to a Workspace or entity
- [ ] No item duplicates content shown in Preparation
- [ ] No item duplicates events shown in Story
- [ ] No item contains recommendations
- [ ] Items are curated (recent and relevant), not complete
- [ ] Empty sections within Context are absent
- [ ] No ISO timestamps, no database IDs, no system language

---

### Workspace Audit

After all five sections pass their individual audits:

**Signal integrity:**

- [ ] Identify every observable condition surfaced in the Workspace
- [ ] Confirm each condition appears in exactly one section
- [ ] Confirm Situation has suppressed any signal claimed by Decision's reasoning sentence
- [ ] Confirm Preparation items are different from Context items

**Grammar compliance:**

- [ ] Situation describes without prescribing
- [ ] Decision chooses without re-describing
- [ ] Preparation assembles without recommending
- [ ] Story narrates without predicting
- [ ] Context connects without duplicating

**Invariant compliance:**

- [ ] Exactly one primary Decision (or healthy state)
- [ ] Decision always renders
- [ ] Story is strictly chronological
- [ ] No AI identification anywhere
- [ ] No fabricated information
- [ ] No database language or technical fields
- [ ] Natural language for all time expressions
- [ ] Owner visible in header
- [ ] Empty sections absent

**The five-second test:**

Open the Workspace. Without scrolling, without clicking, within five seconds:

- [ ] The user knows what is happening (Situation or header)
- [ ] The user knows what to do next (Decision)
- [ ] The user knows why (Decision reason sentence)

If any of these three fails within five seconds, the Workspace fails the Grammar Test regardless of whether individual sections passed their audits.

---

## Final Section — The Architecture Chain

### How the layers relate

Every Workspace is the product of a layered architecture. Each layer answers a different kind of question. Each layer constrains the layer below it. No layer may contradict a layer above it.

```
Product Bible
      ↓
Workspace Principles
      ↓
Workspace Contract        ← does not yet exist
      ↓
Workspace Grammar
      ↓
Workspace Blueprint
      ↓
Implementation
```

---

**Product Bible — WHY**

The Product Bible is the constitution of Gunimi. It answers why the product exists, what it values, how it thinks about AI, design, collaboration, and engineering, and what it pledges never to do.

The Product Bible is resolved only by the founding values of Gunimi. No implementation decision, no market pressure, no competitive trend changes the Product Bible. If a proposed feature conflicts with the Product Bible, the feature changes. The Bible does not.

---

**Workspace Principles — WHAT**

The Workspace Principles define what every Workspace contains. Structure: header, metrics, exactly four tabs. Content: the five sections and their assignment to tabs. Rules: one recommendation, honest empty states, calm software, business language.

The Principles are the structural contract. They define the skeleton. They do not define the thinking that fills it.

---

**Workspace Contract — WHEN** *(pending)*

The Workspace Contract — which does not yet exist — will define when each rule applies and the binding agreement between the product and each Workspace implementation. It will sit between Principles (structural rules) and Grammar (cognitive rules), providing the explicit conditions under which deviations are prohibited and exceptions are defined.

When `docs/WORKSPACE_CONTRACT.md` is created, this Grammar and all Workspace Blueprints must be reviewed against it. The Grammar does not assume its contents — it operates from the Principles and the evidence of the Reference Workspace.

---

**Workspace Grammar — HOW**

The Workspace Grammar — this document — defines how every Workspace thinks. It defines the cognitive language each section speaks, the rules that govern what each section is allowed to express, and the invariants that hold across all Workspace types.

The Grammar is not resolved by individual Blueprints. It is the authority that Blueprints must follow. If a Blueprint proposes a Workspace where the Situation section recommends, the Blueprint is incorrect. The Grammar resolves it.

---

**Workspace Blueprint — WHAT FOR A SPECIFIC TYPE**

A Workspace Blueprint applies the Grammar to a specific business context. The Deal Workspace Blueprint defines what Situation, Decision, Preparation, Story, and Context mean for a business opportunity. The Contact Workspace Blueprint defines what they mean for a person and a relationship.

The Blueprint is the bridge between abstract architecture and specific business meaning. It answers: given everything the Grammar requires, what does this Workspace type look like for its specific business context?

A Blueprint may not violate the Grammar. If a Blueprint requires a Grammar violation to serve its business context, the Blueprint is incorrect, not the Grammar.

---

**Implementation — HOW IT IS BUILT**

Implementation manifests a Blueprint in code. The resolvers, components, locale keys, data fetching patterns, and state management choices that make the Blueprint real.

Implementation may not violate a Blueprint. If a technical constraint appears to require a Blueprint violation, the constraint must be resolved differently. The implementation is the most flexible layer — constraints here are solved by engineering. Constraints above this layer are solved by architecture.

---

### The chain in practice

A question about whether a specific piece of information belongs in the Preparation section is answered by the Grammar (Chapter 3, Rule 3.1: conditioned on the Decision action).

A question about whether a specific Workspace type needs a Story tab is answered by the Workspace Principles (every Workspace has exactly four tabs, Story is always one of them).

A question about whether a specific feature should be built at all is answered by the Product Bible (the Executive Assistant test, the Decision Framework, the Pledge).

Questions flow upward. Constraints flow downward. No layer contradicts a layer above it.

---

### Why the Grammar must outlive the implementation

The Grammar is written to be read in 2030 with the same validity it has today.

Technology changes. The resolver pattern will be replaced by something better. The GDL components will be redesigned. The database schema will evolve. The AI models powering the intelligence layer will change multiple times before this document requires revision.

None of those changes affect the Grammar. The Grammar does not describe how Workspaces are implemented. It describes how they think. Thinking is independent of implementation.

As long as Gunimi builds Workspaces — as long as every business object is a complete operational environment — the Grammar describes what those Workspaces must be. The specific technology that renders them, the specific AI that populates them, the specific components that display them: these change.

The Situation observes. The Decision chooses. The Preparation assembles. The Story narrates. The Context connects.

That does not change.

---

**Version:** 1.0
**Created:** 2026-07-08
**Authority:** Gunimi Product Bible v1.0 · Workspace Principles · Deal Workspace Blueprint v1.0 · Contact Workspace Blueprint v1.0
**Applies to:** Every Workspace type, current and future
**Next review:** After WORKSPACE_CONTRACT.md is created
