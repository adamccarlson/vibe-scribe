---
name: briefing
description: Have the project explain itself — a plain-language briefing on what the system is, what changed recently, and what's healthy or broken, in the project's own coined vocabulary. Use when the user asks for a briefing, an overview, "where did we leave off," or to re-orient at the start of a session. Optional argument scopes it — a component name (deep dive), "what changed", or an error/symptom (debugging orientation).
allowed-tools: Read Glob Grep Bash
---

# /briefing

Read the living docs and give the user a **plain-language briefing** — the read-path payoff of
everything Vibe Scribe quietly maintains. This is the moment the project explains itself back to them.

> **Synthesize, don't dump.** A briefing is the docs *digested* — what matters, in plain words — not
> the files pasted back. Read `system-overview.md` and the recent `dev-journal.md`; report what they
> say. **Don't re-analyze the code from scratch** (that's `/sync`'s job) and **don't invent** — if the
> map doesn't cover something, say so.

## Step 1 — Read the living docs

- Read `system-overview.md` (the map) and the tail of `dev-journal.md` (recent history).
- **If they don't exist:** tell the user Vibe Scribe isn't set up here yet and to run `/vibe-scribe-setup`
  first (it draws the map). Stop.
- Note each section's `Last verified` date — you'll flag stale ones.

## Step 2 — Pick the mode from the user's argument

| Argument | Mode |
|---|---|
| *(none)* | **Whole-system** briefing |
| a component / Lexicon handle (e.g. `the Gatekeeper`, `auth`) | **Scoped** deep-dive |
| `what changed`, `recent`, `since last time`, `this week` | **What-changed** narrative |
| an error message or symptom | **Bug-context** orientation |

If it's ambiguous, make your best guess and say which you chose.

## Step 3 — Deliver the briefing

Across all modes: **plain language**, skimmable, and speak in the project's **Lexicon handles** (the
coined names) — that's the shared vocabulary. **Lean visual** — when structure, flow, or relationships
are involved, *show* an ASCII diagram, don't just describe it (see *Diagrams* below). Keep it tight; a
briefing, not a wall of text.

### Whole-system (default)

1. **What this is** — one or two plain sentences (from the overview's "What this is").
2. **The shape** — show the system's ASCII map (conceptual framework or dependency map) and read it
   back in one line ("requests come in through the Gatekeeper, which hands to the Concierge…").
3. **What changed recently** — 1–3 lines from the latest journal entries, in plain language.
4. **What's healthy / what to watch** — anything in the runbook, any known issue, and any section whose
   `Last verified` date is old (flag it as lower-confidence — see Freshness below).
5. **The handshake** — close by inviting confirmation: *"Does that match how you understand it? Tell me
   if anything's off."* Then offer to go deeper (`/briefing <part>`).

### Scoped — `/briefing <component>`

1. **Resolve the handle** in the Lexicon. If it's a **tombstone** (retired), say so and point to its
   successor ("that was retired — it's now part of *the Concierge*"). If it's not in the Lexicon, say so
   and offer the closest match.
2. **What it is** (plain) · **where it lives** (the anchor path) · **how it fits** (its connections from
   the dependency map) · its **logic** if there's a flowchart for it · any **gotchas / runbook** entries.
3. **Its recent history** — grep `dev-journal.md` for the handle and summarize how it got to today.
4. Flag staleness if its `Last verified` is old.

### What-changed — `/briefing what changed [timeframe]`

- Read the recent `dev-journal.md` entries (filter by timeframe if given).
- Narrate them as a short, plain-language story — what moved and why — naming the handles involved.
  Not a changelog dump; a "here's what's been happening."

### Bug-context — `/briefing <error or symptom>`

You're the **first responder**, not the fixer. Orient them:

- From the **dependency map** + **component catalog** + **runbook**, name the parts most likely involved
  and the "if X is down you lose Y" relationships that matter for this symptom.
- If the **runbook** already has an entry for this failure, surface it.
- Check the recent journal for changes that could be related ("the Gatekeeper changed two entries ago").
- End by pointing at the likely place(s) to look — don't start editing code unless the user asks.

## Diagrams — lean visual

A briefing about structure, flow, or relationships should almost always *show* it. Default to producing
an ASCII diagram when it's applicable:

- **Whole-system** → the system map (topology, or the conceptual framework for the big picture).
- **Scoped** → a focused mini-diagram of just that component and its immediate neighbors, plus a **logic
  flowchart** if it has non-trivial branching.
- **Bug-context** → a small flow or topology that highlights the suspect path — *where the request can die.*
- **What-changed** → usually prose, but show a small before/after when the change was structural.

Pick the right type from the repertoire (topology · logic/flowchart · swimlane · conceptual framework),
keep it **ASCII**, draw the nodes as **Lexicon handles**, and pair every diagram with a one-line plain
explanation. Two guardrails: **don't fabricate topology** — compose the diagram from what the overview /
dependency map already records (a focused subset is fine; invented connections are not); and **stay
selective** — skip the picture when plain prose is genuinely clearer (a one-box answer doesn't need art).

## Freshness — be honest about confidence

The docs carry `Last verified` dates for a reason. If a section you're briefing from is old, **say so**:
*"Heads up — the payments section was last verified three weeks ago, so treat that part as a best guess;
run `/sync` to refresh it."* A briefing that flags its own stale spots is trustworthy; one that sounds
equally confident about everything is not. If the docs are thin or missing a part the user asked about,
say that plainly and offer to look at the code directly or run `/sync`.

## Principles

- **Plain language.** No jargon, no internal labels, no file dumps. Write for someone who doesn't already
  know the system. (If you catch yourself explaining a mechanism in three clauses, simplify.)
- **Speak in handles.** Use the project's coined names — it teaches the vocabulary through use.
- **Synthesize from the docs; don't fabricate.** Report what the map says. Unknown ≠ guess.
- **Diagrams are ASCII and always explained.** Show the picture, then say what it means in one line.
- **It's also the AI's refresher.** At session start, producing this proves you've loaded the project's
  state — the handshake at the end lets the user correct you before you both proceed.
