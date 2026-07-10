# Gunimi Blueprint — Today Experience v1.0

**Version:** 1.0
**Status:** Foundational — permanent
**Authority:** Gunimi Product Bible v1.0 · Workspace Principles · Workspace Contract v1.0
**Note:** This document is the permanent design authority for the Today experience. When any implementation of Today conflicts with this document, the implementation changes. This document does not.

---

> *"Most software shows you what happened. Today shows you what matters."*

---

> *"A dashboard requires the user to think. Today has already done the thinking."*

---

## Preface

Every product needs a place where the day begins.

For most business software, that place is a dashboard — a page of accumulated metrics, charts, and counters that summarize historical activity. The user looks at it, gathers a general sense of things, and then decides where to go next.

Gunimi does not have a dashboard.

Gunimi has Today.

The difference is not visual. It is philosophical. A dashboard is passive — it stores information and waits for the user to derive meaning from it. Today is active — it has already derived meaning and presents the user with a single clear orientation for the next several hours.

A dashboard answers: *"What happened?"*

Today answers: *"What should I do right now?"*

That shift in orientation — from past to present, from data to decision, from storage to preparation — is the entire premise of this document.

---

## Task 1 — Purpose

### Why Today exists

Every business owner carries the same invisible burden: the mental overhead of remembering what is happening across every relationship, every opportunity, every commitment, every conversation.

Before opening anything in the morning, they already have cognitive weight. Which deal is at risk? Who was supposed to follow up with Acme? Did the proposal from last Thursday get a response? Is there anything due today? Did the team finish that deliverable?

This burden accumulates invisibly and slowly degrades every working day. The user never consciously thinks "I am spending cognitive energy on tracking status" — they simply feel scattered, reactive, and behind.

Today exists to absorb that burden entirely.

When a founder opens Gunimi, the system has already spent the night assessing the state of every relationship, every deal, every open commitment, every approaching deadline, and every stale signal. By morning, Today has collapsed all of that into what matters right now — ordered, prioritized, and ready.

The founder arrives at the first thing they should do, not the accumulated history of everything that happened.

### The business question Today answers

Today answers one question for the entire business:

> **"What does my business need from me in the next few hours?"**

Not: "What happened since I last looked?"
Not: "How is my pipeline performing?"
Not: "What are my activity metrics?"

The question is always forward-looking, always personal, always grounded in the present moment. Not a historical report. A preparation.

### Why Today is different from a dashboard

The distinction is not about design. It is about who did the thinking.

**A dashboard trusts the user to derive meaning.** It shows charts, counters, and accumulated data, then waits. The user must read, synthesize, compare, decide what matters, and determine what to do. This is intellectual work — and most users, most mornings, do not have the time or energy to do it well.

**Today has already done that work.** It presents the conclusion, not the data. It says: this is the deal that needs your attention today, and this is why. It does not show a trend line and let the user decide whether the trend is concerning.

A dashboard requires a capable analyst to extract value from it. Today delivers value to any business owner who simply opens it.

The user should never have to interpret Today. They should only have to act on it.

---

## Task 2 — The Cognitive Experience

### The 30 seconds that matter

A user opens Gunimi at 8:47 in the morning. Their first cup of coffee is in their hand. Their day has not yet started in their mind.

What happens in the next 30 seconds defines whether Today is useful or forgettable.

---

**Seconds 0–3: Immediate orientation.**

The user sees their business name, their name, and one sentence that sets the tone for the day. Not a motivational message. A businesslike orientation: "3 things need your attention today" or "Everything is on track — your only priority is the Acme proposal."

This is the equivalent of an executive assistant greeting you at the door and giving you the one-sentence briefing before you sit down. The user immediately knows whether today is calm or active. They have not yet read anything.

---

**Seconds 3–10: The single most important thing.**

One card. One recommendation. For the entire business.

It might say: "Follow up with Marcus at Orbit Systems — the $45,000 proposal has gone unanswered for 9 days and the expected close is Thursday."

The user reads it once. They understand it immediately. They know what to do first. If they do only one thing today, this is the thing that moved their business forward.

They have not scrolled. They have not clicked. They have not read a chart. In ten seconds, they have their priority.

---

**Seconds 10–25: The business picture.**

Below the priority, a small number of signals — never more than five. Each one is a specific, actionable observation about the state of the business today. Not historical context. Not general analysis. Specific observations that require a response within hours, not weeks.

"Maria from Zenith Ltd has not heard from you in 23 days."
"The Holborn Partnership close date passed — update it or close the deal."
"Two tasks due today across three deals — one is flagged as blocked."

The user scans these in 15 seconds and understands the shape of their day. They know what is urgent and what can wait. They did not need to open five different pages to learn this.

---

**Seconds 25–30: The rest, at a glance.**

At the bottom of what is visible without scrolling, the user can see whether there is anything in their upcoming day — a meeting in two hours, a commitment they made to a customer — and whether their relationships are generally healthy.

There is nothing demanding here. These are contextual signals, not alarms. The user can choose to engage with them or leave Today and go directly to the one thing they already know matters.

---

**What the user does next:**

They click through to the Workspace for the recommended action. They complete the action. They return to Today. They move through the signals that matter to them. In thirty minutes, their morning orientation is complete — not because they worked through a todo list, but because the system surfaced only what needed surfacing.

The day begins with clarity instead of scattered context.

---

### The design principle behind this flow

Every second of cognitive load that Today carries is a second the user does not need to spend. The goal is not to give users more information — it is to give them less to think about.

The information hierarchy must be felt, not just seen. The most important thing is visually dominant. Secondary signals are present but quiet. Context is available without being prominent.

The user should never consciously think "I am reading Today." They should think "I know what to do today."

---

## Task 3 — The Sections

### Architecture principle

Today does not use widgets. Today does not use a configurable grid. Today does not have cards that users can rearrange.

Today is opinionated. The order of sections is the product's assessment of what should be seen first. The content is the product's assessment of what matters. The user's role is not to configure the experience — it is to work inside it.

---

### Section 1 — The Focus

**The question it answers:** *"What is the single most important thing I should do today?"*

**Purpose:**

Focus is the center of Today. It exists because a user who opens the product and sees five equal priorities has not been helped — they have been given a todo list. The entire premise of Gunimi is that the system has a view about what matters most, and it states that view.

Focus surfaces one recommendation for the entire business. One. It is the cross-entity Decision Layer applied to the broadest scope possible.

**Business value:**

The Focus card is the answer to the question every business owner wakes up asking. It provides immediate orientation — the mental equivalent of "start here." A business owner who acts on the Focus card every morning, consistently, is not just more productive. They are less anxious, because the one thing they must not forget has already been surfaced before they had to remember it.

**Ordering reason:**

Focus must be the first thing the user reads because it is the most time-sensitive, highest-value piece of information on the screen. Every other section is context. Focus is the action.

If Focus is placed below other content, users will read the other content first and arrive at Focus already partially fatigued. The product's most valuable judgment should arrive first, uncontested.

**Information ownership:**

Focus owns the single highest-priority signal across the entire business. It does not surface everything that requires attention — it surfaces the one thing that requires attention first.

Its priority algorithm evaluates across all entities, all signal types, and all urgency levels. The Focus is always grounded in specific, observable evidence. It always explains its reasoning in one sentence. The reasoning is always a business fact, never an opinion.

When there is no urgent priority — when every deal is on track, every relationship is active, every commitment is current — the Focus card does not manufacture urgency. It shows a calm, honest statement: "Your business is in good shape. No immediate priority today."

This honest empty state is as valuable as any recommendation. A business owner who opens Today and sees "No immediate priority" should feel calm, not suspicious.

---

### Section 2 — Attention Required

**The question it answers:** *"What will have a consequence if I don't act on it today?"*

**Purpose:**

Attention Required is not a task list. It is the set of business signals that have a time dimension — signals where inaction today changes the outcome for the worse. A proposal that has been unanswered for two weeks is a signal. A deal whose close date passed three days ago is a signal. A meeting starting in ninety minutes with a contact whose last interaction was three months ago is a signal.

These are not generic todo items. They are moments where the business has already arrived at a point of consequence, and the user must decide to act or consciously defer.

**Business value:**

Business owners lose deals not because they made bad decisions — they lose them because they forgot. The proposal that went cold after 12 days. The follow-up that was delayed by a week. The close date that slipped past while everyone was managing something else. These failures are not strategic; they are attentional.

Attention Required is the system's answer to attentional failure. It surfaces only the items where inaction has a defined consequence, filters out everything else, and presents the results in a form the user can process in under sixty seconds.

**Ordering reason:**

Attention Required appears after Focus because it is secondary — the user has already understood the single most important thing. Now they see the supporting landscape: what else needs a decision or action today.

If Attention Required appeared before Focus, the user would land on a list and be expected to derive priorities from it. Focus should answer the priority question; Attention supports it.

**Information ownership:**

Attention owns time-sensitive cross-entity signals. It does not overlap with Focus — the highest-priority item from this set has already been elevated to Focus. Attention shows the rest: the signals that matter today but do not rise to the level of the single most urgent priority.

Every item in Attention is navigable — clicking it takes the user directly to the relevant Workspace.

Maximum visible items: five. Never more. If there are more than five, the system shows the five most urgent and indicates that others exist. This is a cap on cognitive load, not a cap on data.

---

### Section 3 — Relationship Signals

**The question it answers:** *"Who needs to hear from me today?"*

**Purpose:**

Relationship Signals is the people layer of Today. It surfaces the contacts and companies where relationship health has degraded to a level that requires action — not because a task says so, but because the evidence of the relationship itself says so.

This section makes explicit what most business owners already know intuitively but lose track of: relationships require maintenance. A contact you haven't spoken to in four weeks during an active deal is a relationship at risk, regardless of whether any task has been assigned. The system observes this and surfaces it.

**Business value:**

Relationship failures are expensive and slow to notice. A client who felt ignored does not always say so. A prospect who went cold does not always send a "we went with someone else" email. The damage accumulates quietly until it is irreversible.

Relationship Signals is the early warning system. It surfaces relationship health degradation before it becomes relationship failure — when there is still time to act, when a single outreach can restore momentum, when the relationship is salvageable with minimal effort.

**Ordering reason:**

Relationship Signals appears after Attention Required because relationships, while important, are generally less time-compressed than operational signals. A deal closing Thursday needs attention today. A relationship that has been quiet for 23 days needs attention this week — and if today is available, this is the reminder.

**Information ownership:**

Relationship Signals owns health signals derived from relationship activity — last contact dates, interaction frequency, presence or absence of follow-through, relationship lifecycle stage. It does not own task-level signals (those belong to Attention Required) and it does not own deal-stage signals (those belong to Focus or Attention when urgent).

Items in Relationship Signals always link to the Contact or Company Workspace where the relationship is managed.

---

### Section 4 — Today's Work

**The question it answers:** *"What specific work items are mine to complete today?"*

**Purpose:**

Today's Work is the task layer — but specifically filtered to today. Not all pending tasks. Not overdue tasks from six months ago. The tasks that are due today or immediately overdue. The specific commitments the user has made that expire in the current workday.

**Business value:**

Tasks scattered across workspace tabs require the user to visit every workspace to understand their load. Today's Work collapses that — every task due today is visible in one place, without navigation.

The value is not in a better task manager. The value is in the elimination of "I forgot I had that due today." When every today-scoped commitment is visible in the first view of the day, the user begins their day with complete situational awareness of their work obligations.

**Ordering reason:**

Work appears last in the primary sections because it is the most granular. Focus and Attention address the strategic layer of the day. Relationship Signals addresses the people layer. Work addresses the execution layer. The user should understand strategy before execution — not the reverse.

**Information ownership:**

Today's Work owns tasks with due dates in the current day or past due dates not yet completed. It does not own tasks scheduled for later in the week. It does not own subtasks or dependencies without their own due dates.

Each task shows its title, its associated entity (the Deal or Contact it belongs to), its due date in natural language, and a link to the Workspace where it lives.

---

### What Section ordering communicates

The ordering of sections is not arbitrary. It reflects a philosophy about how good work happens:

1. Start with what matters most (Focus)
2. Understand what expires today (Attention)
3. Know who needs you (Relationships)
4. Execute what is committed (Work)

A user who moves through these sections in order has performed a complete morning briefing. They have oriented themselves at the strategic level, understood the urgency layer, assessed their relationship health, and confirmed their commitments. Everything else in their day is execution within that frame.

---

## Task 4 — Decision Philosophy

### The problem this solves

Traditional dashboards create the illusion of decision support. They show users an array of metrics and signals and leave the synthesis to the user. The user must read, compare, prioritize, and decide — often under time pressure, without complete context, while simultaneously trying to begin their day.

This is not decision support. This is data presentation with the expectation that the user will do the intellectual work themselves.

Gunimi has decided to do that work. Today is the expression of that decision.

### The philosophy

**One recommendation, grounded in evidence, explains itself.**

The Focus card never shows multiple recommendations. Not two equal priorities. Not a ranked list. One thing — the one thing the system believes is the most valuable use of the user's next action.

The reason for this is psychological as much as functional. A user who sees one recommendation knows what to do. A user who sees three recommendations must choose — and the act of choosing, even among good options, creates cognitive friction that erodes momentum.

One recommendation, stated with confidence, eliminates the need to choose. The user either follows it or consciously overrides it. Both are good outcomes. The former advances the business. The latter is an informed decision.

**Specificity earns trust.**

Vague signals create skepticism. "You should follow up on a deal" is forgettable. "Follow up with Marcus at Orbit Systems — the $45,000 proposal has gone unanswered for 9 days and the expected close is Thursday" is impossible to ignore.

The difference is specificity. Specific recommendations are believable because they are traceable — the user can see exactly what evidence drove them. Vague recommendations feel like guesses.

Every recommendation in Today names the entity, names the signal, and names the time dimension. The reason is always one sentence of specific evidence, not a general principle.

**Never fabricate urgency.**

The most destructive pattern in business software is manufactured urgency — surfacing signals that do not require action, adding visual alarm where no alarm is warranted, creating the sensation of busyness in the absence of genuine business pressure.

Gunimi never does this. When the business is healthy — deals on track, relationships active, commitments current, no approaching deadlines — Today says so. The honest quiet state is as important as any recommendation.

A user who has learned that Gunimi is quiet when there is nothing urgent will trust its alarm when it speaks. A user who has learned that Gunimi always has something to say will learn to ignore it.

Silence is not failure. Silence is accuracy.

**Priority is computed, not configurable.**

Users do not configure the priority algorithm of Today. The system evaluates priority using consistent, transparent criteria, and applies them uniformly.

This is a deliberate design decision. Configurable priority creates the illusion of personalization while placing the burden of configuration on the user. The user must now maintain the configuration — and if they fail to, the system gives them wrong information. Computed priority removes that burden and makes the system accountable for its assessments.

The priority criteria are observable and consistent:
1. Time proximity — signals that expire soonest are evaluated first
2. Value at risk — higher-value entities receive stronger weighting when urgency is equal
3. Relationship depth — established relationships that have gone quiet are prioritized over new relationships that haven't been initiated
4. Commitment age — overdue commitments receive escalating priority with time

These criteria are never exposed to the user. They experience the output — the correct priority — not the formula.

---

## Task 5 — Business Health

### The problem with scores

A health score — "Your business is at 73% health" — is meaningless without an explanation of how 73% was computed, what 100% represents, and what specific action would move it to 74%.

Worse: a score creates a new question ("is 73 good?") without answering the original question ("what should I do today?"). The score becomes something the user must interpret before they can act on it.

Gunimi never communicates health as a score, a percentage, or a metric. These formats require interpretation. Today's goal is to eliminate interpretation, not invite it.

### The problem with executive dashboards

Executive dashboards communicate health through trends — revenue trends, activity trends, deal velocity. These formats require comparison: is this week's number better or worse than last week? Is the trend improving or declining?

Comparison requires memory. The user must remember what last week's number was, or find it, to know whether this week's is better. That is cognitive work. Today does not ask users to perform cognitive work before they understand the state of their business.

### The calm alternative

Business health in Today is communicated through a single derived assessment, expressed in natural language, in the Today header.

Not a score. Not a trend line. A sentence.

**Healthy state:**
> "Your business is in good shape today."

**Attention state:**
> "3 things in your pipeline need attention."

**At-risk state:**
> "2 deals are at risk of stalling. One relationship needs immediate outreach."

Each assessment is:
- One sentence
- In plain business language
- Derived from observable evidence (not a formula that the user must trust blindly)
- Calm in its phrasing even when the content is urgent

The difference between "at-risk" and "attention" is not a threshold on a KPI. It is the system's judgment about whether the signals it has found require same-day action or same-week awareness.

### What health is not

Business health in Today is not:
- A product engagement metric (how often the user has logged in)
- A data completeness score (how many fields have been filled)
- An AI confidence rating (how certain the system is about its assessments)
- A comparison to other businesses or benchmarks

These metrics exist for the software, not for the business owner. Business health in Today is a reflection of the actual business — the deals, the relationships, the commitments — not of the user's relationship with the software.

### The deeper principle

Communicating health as a natural language assessment has a structural advantage: it forces the system to be honest in a way that scores never are.

A score can always be justified after the fact — the algorithm can be tuned to produce a number that seems reasonable. A sentence cannot hide. "Your business is in good shape today" is either true or false — and the user's experience of their actual business will immediately reveal which.

Natural language health assessments keep Gunimi accountable to reality.

---

## Task 6 — Signals Taxonomy

Signals are the raw material of Today. Not all signals deserve the same prominence, the same urgency, or the same position in the experience. The taxonomy below defines which signals belong to Today and how they should be understood.

### Tier 1 — Immediate consequence signals

These signals belong in Focus or Attention Required. They require action in the current day or the situation worsens.

**Approaching close dates**
A deal whose expected close date is within the next 7 days. The signal is time-bound and consequential — missing a close window creates renegotiation pressure and damages pipeline reliability.

**Unanswered proposals**
A proposal sent without a response for more than a threshold number of days. The signal is staleness combined with value at risk — the longer a proposal waits unanswered, the colder the opportunity becomes.

**Overdue commitments**
Tasks past their due date that belong to active deals or active relationships. Not generic overdue tasks — specifically tasks that a customer or colleague is waiting on.

**Deals passing close dates**
A deal whose expected close date has already passed without being updated or closed. This is one of the most reliable indicators that a deal is in trouble — and it is completely preventable.

**Meetings starting within hours**
A meeting in the next 2–4 hours with a contact whose relevant context is not prepared. The signal is preparation, not calendar management.

---

### Tier 2 — Relationship health signals

These signals belong in Relationship Signals. They represent degradation that should be addressed within the current week.

**Stale relationships**
A contact in an active deal or active partnership who has not been engaged beyond a threshold period (e.g., 14–30 days depending on the relationship depth and deal stage). The signal is the gap between last contact and today.

**New contacts, no outreach**
A contact added recently with no interaction recorded. The relationship exists in the system but not in reality. The signal is the opportunity cost of delay.

**Follow-up obligations**
An implicit or explicit commitment made in a previous interaction that has not been fulfilled. "I'll send you the details by end of week" — if it is now the following Monday, this is a signal.

**Upcoming relationship milestones**
A contact whose company is going through a known event (a product launch, a renewal, a contract anniversary) that represents an opportunity for timely, relevant outreach.

---

### Tier 3 — Work signals

These signals belong in Today's Work. They represent specific commitments due within the current day.

**Tasks due today**
Tasks assigned to the current user with a due date in the current calendar day.

**Immediately overdue tasks**
Tasks that were due yesterday or in the recent past that have not been completed. Not tasks from months ago — tasks that are recent enough that the delay still matters.

**Blocked work**
Tasks explicitly marked as blocked, where the block has not been addressed. These appear as signals because blocked work represents coordination failures that compound over time.

---

### Tier 4 — Team and pipeline signals (post-Alpha)

These signals are defined for future phases. They belong to Today but require data sources and coordination features that are not yet built.

**Waiting for teammate**
A task or decision that the current user is blocked on, where the blocker is a specific team member.

**Waiting for customer**
An explicit open loop — a question asked, a document requested, an approval needed — where the customer has not responded.

**Opportunities closing soon (team-wide)**
For managers and business owners: deals across the team that are approaching close dates and require leadership attention.

**Team coordination alerts**
Two team members engaging the same contact or working on overlapping tasks without awareness of each other.

---

### What signals do NOT belong in Today

**Historical activity.** What happened last week, last month, or ever — this is Story content within individual Workspaces, not Today content.

**Pipeline totals.** "You have 14 active deals worth $320,000." This is a dashboard metric. It does not tell the user what to do.

**Completion rates.** "You completed 7 of 12 tasks this week." This is performance reporting. It does not tell the user what to do today.

**AI activity logs.** "Gunimi analyzed 47 contacts since your last login." This is AI theater — the system performing its intelligence rather than applying it.

**Low-priority signals.** If a signal does not create a meaningful consequence within 72 hours, it does not belong in Today. It may belong in a Workspace, in a weekly digest, or nowhere.

---

## Task 7 — What Must Never Appear

The following elements are explicitly prohibited in Today. Each prohibition protects a specific principle established in the Product Bible or the Open Alpha Experience.

---

**Charts of any kind.**

Bar charts, line charts, pie charts, area charts, trend graphs. Charts require the user to interpret visual data and derive meaning. Today has already done the interpretation. Charts are not the conclusion — they are the data the conclusion was drawn from. The conclusion belongs in Today. The data belongs in a future analytics view.

If something cannot be communicated in a sentence, it does not belong in Today.

---

**Activity feeds.**

A chronological list of things that happened — deals updated, notes added, tasks completed, emails sent — is a log, not a briefing. An activity feed requires the user to read and filter. Today has already filtered. The raw materials do not need to be shown.

---

**Notification centers.**

A place where all alerts are accumulated and displayed as a list treats all signals as equal in importance. They are not. Today's hierarchy — Focus, Attention, Relationships, Work — exists precisely to communicate that some signals matter more than others.

A notification center collapses the hierarchy and asks the user to recreate it. This is the work Today was built to eliminate.

---

**Unread counters.**

"47 unread emails." "12 new activities." These are volume metrics, not intelligence. They tell the user how much there is to process, not what to process. Today does not add to the user's cognitive burden — it reduces it.

---

**Random KPIs.**

"Average deal velocity: 34 days." "Email open rate: 42%." "Contacts created this month: 7." These numbers exist to make the product appear analytical. They do not help a business owner decide what to do in the next hour.

A KPI belongs in Today only if its current value directly implies a specific action. Almost no KPI passes this test.

---

**AI chat or AI assistant interfaces.**

Today is not a place to ask questions. It is a place that has already answered the questions. An AI chat interface inverts the relationship — it asks the user to formulate questions, then answers them. Today formulates the questions on behalf of the user and answers them without being asked.

An AI chat panel in Today would signal to the user that the system does not proactively think — it only responds. That is precisely the opposite of what Gunimi is.

---

**Duplicate information.**

Any signal that is already present in the Focus card must not appear again in Attention Required or any other section. Any relationship mentioned in Relationship Signals must not appear again in Today's Work. Information that appears twice forces the user to reconcile it — to ask "is this the same thing I already read?" — and that reconciliation is cognitive friction that Today must never create.

---

**CRM terminology.**

"Lead," "Prospect," "Account," "Activity Log," "Pipeline Stage," "Module," "Record," "Entity." These words describe how CRMs are built. Today describes how businesses work. Business owners talk about deals, relationships, follow-ups, and priorities. Today uses that language.

---

**Anything requiring interpretation.**

If the user must think before understanding, the content is wrong for Today. Numbers without context, abbreviations without expansion, icons without labels (for unfamiliar icons), technical language, scores without explanation — these all require interpretation. Today does not ask the user to interpret. It asks them to act.

---

**Configurable widgets or layouts.**

Today is not a personal homepage builder. Giving the user a configurable grid places the burden of product design on the user — they must decide what should be visible, in what order, at what size. This defeats the purpose of Gunimi entirely.

The order of sections in Today reflects a considered judgment about how information should be received. That judgment is the product's responsibility, not the user's preference.

---

## Task 8 — Relationship with Workspaces

### The three-layer operating model

Today → Workspace → Work

These are not three different places in the product. They are three modes of engagement with the same business.

**Today is orientation.** It answers: what matters across my entire business right now? Its scope is the whole. Its time horizon is today. Its primary output is a focused direction.

**Workspace is context.** It answers: what is everything I need to know and do for this specific entity right now? Its scope is one deal, one contact, one company. Its time horizon is the lifetime of that entity. Its primary output is complete situational awareness and a clear next action.

**Work is execution.** It happens inside Workspaces — adding notes, completing tasks, sending emails, moving stages. Its scope is a specific action on a specific entity. Its time horizon is the next few minutes.

The user moves through these modes continuously throughout their day. They are not separate destinations — they are a natural flow.

---

### When the user leaves Today

The user leaves Today when they have a specific action to take.

Today surface a signal: "Follow up with Marcus at Orbit Systems." The user clicks through to the Marcus Contact Workspace. The Workspace provides the full context — the story of the relationship, the relevant preparation, the recommended action. The user acts. Then they return.

Today does not try to contain the execution. Execution belongs in the Workspace, because execution requires full context. Today contains the decision about which Workspace to enter — nothing more.

---

### When the user returns to Today

The user returns to Today when they have completed an action and are ready for the next orientation.

After following up with Marcus, they return to Today. The signal for Marcus may now be resolved — the system knows outreach happened. The next signal surfaces. The user moves through their day as a series of focused context-switches: Today → Workspace → Today → Workspace.

This rhythm — orientation, execution, orientation, execution — is how productive business work actually happens. Today provides the orientation layer. The rest of Gunimi provides the execution layer.

---

### How Today feeds from Workspaces

Today does not have its own database. Every signal in Today is derived from data that lives in Workspaces.

The deal that appears in Focus exists in the Deal Workspace. The relationship that appears in Relationship Signals exists in the Contact Workspace. The task that appears in Today's Work lives in the Work tab of a specific Workspace.

Today is the cross-workspace intelligence layer. It reads across all Workspaces, evaluates all signals, applies the priority algorithm, and presents the result. When the user clicks a signal in Today, they enter the Workspace that owns that signal.

This architecture means Today requires no new data. It requires new intelligence — the ability to look across all entities and determine which ones matter most right now.

---

### What Today should NOT do

Today should not replace Workspaces. A user who never opened a Workspace and only used Today would miss the narrative depth, the preparation, the relationship story, the full context that workspaces provide. Today is the summary layer. Workspaces are the operational layer.

Today should not try to provide context that belongs in a Workspace. If a signal in Today tempts the user to need more information before they can act on it, that information belongs in the Workspace, not in Today. Today shows the signal. The Workspace shows the context.

Today should not track what the user did inside a Workspace. Today's role is orientation, not monitoring. When a signal resolves, the system updates naturally because the underlying Workspace data changed — not because Today was tracking the user's behavior.

---

## Task 9 — Open Alpha Definition

### The minimum Today must do

For Open Alpha, Today must demonstrate the central product promise: Gunimi has already done the thinking, so you don't have to.

A user who opens Today for the first time should experience, within thirty seconds, the sensation of having a system that already understands the state of their business. This sensation must be present on Day 1 with their first deal and first contact. It must not require days or weeks of data accumulation before it becomes useful.

### What Today requires for Alpha

**The Focus card is non-negotiable.**

A Today without a Focus card is a dashboard. The Focus card is the moment where the product's intelligence becomes visible as preparation rather than as data. Without it, Today has no reason to exist as a distinct experience.

The Focus card must surface on the first day of use, even when the user has added only one deal or one contact. The intelligence adapts to what is available, not to an arbitrary data threshold.

**Attention Required is non-negotiable.**

This section is the bridge between Focus and execution. Without it, the user has one recommendation and no supporting context for the rest of their day. Even at Alpha, Today must show the time-sensitive landscape beyond the single priority.

**Relationship Signals is Alpha-included but lightweight.**

At Alpha, Relationship Signals shows the contacts where relationship health has degraded past the staleness threshold. It does not need to show team-wide coordination signals, relationship milestone tracking, or implicit commitment detection. The simplest version — "These contacts need to hear from you" — is sufficient.

**Today's Work is Alpha-included.**

Tasks due today, filtered to the current user. This requires no intelligence — it is a filtered view of existing task data. The implementation cost is low; the value for daily use is high.

**Business health statement is Alpha-included, minimal.**

A single sentence in the Today header that characterizes the current state of the business. Healthy, attention-needed, or at-risk. This requires the same signal evaluation as Focus and Attention — it is simply a higher-level summary of that evaluation.

---

### What Today can defer

**Team-wide signals.** Waiting for teammate, intent broadcasting, coordination detection, team pipeline health — these require presence features and collaboration data that do not exist at Alpha.

**AI-generated daily briefs.** A natural language summary of the business day, prepared overnight, reflecting everything that changed — this requires the Memory layer (institutional memory, relationship synthesis) which is a post-Alpha capability.

**Relationship milestone tracking.** Contract anniversaries, renewal opportunities, event-triggered outreach — these require richer relationship data and event-detection capabilities that can be built incrementally.

**Role-aware Today.** Different summaries for different roles (CEO vs. salesperson vs. CS) — this requires the role awareness system defined in the Product Bible, which is a post-Alpha capability.

**Proactive preparation cards.** "Your 10 AM meeting with Acme starts in 90 minutes. Here's the brief." — this requires real-time event awareness and calendar integration that are beyond Alpha scope.

---

### The Alpha success test for Today

On a morning when a user has 3 active deals, 5 active contacts, and 4 pending tasks — can they open Today and know, within 30 seconds, what to do first?

If yes, Today is ready for Alpha.

If they must scroll, click through multiple sections, or do any synthesis before understanding their priority — Today is not ready.

---

### What to protect above all else

**The Focus card must never become a list.**

The temptation, as Today scales and more data becomes available, will be to surface more recommendations. More signals. More insights. More intelligence.

This is the exact path toward becoming a dashboard.

One recommendation. Every time. For as long as Today exists.

The Focus card's value comes precisely from its constraint. The moment it becomes a list, it loses its purpose — the user must choose again, and the product has surrendered its most important function: having a view.

---

## The Final Question — Habit or Dashboard?

*If someone opens Gunimi every morning for one year — will Today become a habit, or just another dashboard?*

---

The answer depends on one thing: whether Today is reliably, specifically, honestly useful on every single opening.

Not impressively useful. Not comprehensively useful. Specifically useful. The right signal at the right moment for the right reason.

Dashboards are not habits because they are passive. The user opens them, reads the numbers, forms a vague sense of things, and leaves. Nothing was decided. Nothing was acted on with confidence. The value was ambient — it existed, but could not be pointed to.

Today becomes a habit when every morning it surfaces something that the user acts on — and when they act on it, something moves. The deal gets followed up. The proposal gets a response. The relationship that was going quiet gets a message. The commitment that was overdue gets completed.

The feedback loop is: open → understand → act → result.

That loop is the difference between a habit and a feature. Features are used when the user remembers to use them. Habits are formed when the user experiences, repeatedly, that using them produces a specific positive outcome. The specific positive outcome for Today is: the user finishes their morning knowing exactly what they did and why it mattered.

A user who opens Today for 30 days in a row and finds, each time, that the Focus card was right — will open it on Day 31 not because they remembered to, but because they trust it.

**That trust is the habit.**

The product has not earned that trust by being impressive. It earned it by being right. By being specific. By never manufacturing urgency. By staying quiet when there was nothing urgent to say.

The blueprint has succeeded if, a year from now, a business owner cannot imagine starting their day any other way — not because they are loyal to the software, but because the alternative is starting without context.

That is the experience this blueprint is designed to produce.

Not a dashboard.

A morning.

---

**Version:** 1.0
**Created:** 2026-07-10
**Authority:** Gunimi Product Bible v1.0 · Workspace Principles · Workspace Contract v1.0 · Open Alpha Experience v1.0
**Next review:** After Open Alpha completes — audit against real user behavior and revise accordingly
