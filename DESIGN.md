# Vibe Scribe

> **Never lose your place.**

A Claude Code plugin that maintains two living documents — a **dev journal** and a **system overview** — automatically, as a side effect of work. Understanding stops living only in someone's head (yours or the AI's) and starts living in your repo, where it survives every boundary that normally destroys it.

---

## The problem

The gap between *code that exists* and *understanding that exists* is not a beginner problem. It's a property of **AI-assisted development itself**.

AI generates code faster than any human fully internalizes it — whether that human is a first-week vibe coder or a staff engineer. Everyone now works above a growing layer of "stuff I directed but didn't fully absorb." A beginner hits it as a wall (can't navigate at all). An expert feels it as drag (ships fast, but the understanding debt compounds). **Same gap, different intensity.**

And the gap is made worse by a hard fact: **code records *what*, never *why*.** No amount of expertise reconstructs intent, rejected alternatives, or the reason a thing is shaped the way it is from a diff. That knowledge only survives if something captures it as it happens.

It dies at **boundaries** — and they're all the same failure mode wearing different clothes:

| Boundary | What severs the thread |
|---|---|
| **Sessions** | a conversation ends; the next one starts cold |
| **Context windows** | something gets summarized or dropped |
| **Time** | you return to a project after months |
| **People** | you hand off to a teammate, or inherit a legacy service |
| **Models / tools** | you switch agents, or a fresh one spins up |
| **Machines** | a reboot, a new laptop |

## The thesis

**Make understanding a build artifact** — an output that accumulates automatically as you work, readable by human and AI alike. Understanding becomes a *result* of building, not a *prerequisite* for it.

Vibe Scribe is **one bridge across all of those boundaries**, because the fix is identical in every case: the understanding lives in durable files, not in volatile memory — human or model.

- **Lead hook (first impression):** *Never lose your place.* — portable context; visceral, immediately felt, demo-able in one sentence.
- **Depth (what keeps people):** *Understanding as a build artifact.* — the deeper, more novel claim, revealed once they're in the door.

## Positioning

- **Lead with the universal claim** (everyone from beginner to staff engineer experiences the disconnect), not accessibility. The "vibe coder" framing is the wedge / origin story — the charming backstory, not the ceiling.
- **Keep the name.** "Vibe Scribe" is the friendly name for a serious tool. Plenty of infrastructure has playful names.
- **Not lock-in.** The output is plain markdown in your repo — model-agnostic, tool-agnostic, vendor-neutral. It ships as a Claude Code plugin, but what it *produces* outlives any one tool. The knowledge is yours, in your repo, readable by anything. You accrue understanding as an asset; you don't rent it from a vendor.

---

## The two documents

Two opposite shapes of memory, maintained by the same habit but with **opposite update semantics**:

### `dev-journal.md` — the log
- **Temporal, append-only.** What changed, when, why, and what was learned.
- You **never edit history** — old entries are a record.
- Value is *diachronic*: it preserves the reasoning trail (decisions, dead-ends, the *why*).

### `system-overview.md` — the map
- **Current-state, revise-in-place.** What exists right now and how it fits.
- Old content gets **replaced**, not appended.
- Value is *synchronic*: it answers "what is true today."
- Contains: a plain-language overview, a **component catalog**, a **dependency map** ("if X is down, you lose Y"), a **runbook** of known failures, and the **Lexicon** (below).

> A journal that gets edited loses its history; an overview that only gets appended rots into contradiction. Conflating them is the easy mistake. Keep them distinct.

---

## Core disciplines (the write-path)

These are what make the docs stay *true* — the part everyone fails at by hand.

1. **One pass.** Update both documents in a single end-of-work reflection step.
2. **The overview's changelog lives in the journal**, never in the overview. A map carrying its own changelog is the append-creep that rots it.
3. **Don't duplicate.** The journal records *the delta + the why + a section pointer*; the overview holds *the resulting state*. Never write the same facts in both voices.
4. **Trigger = real system change** (new component, changed topology, new/resolved failure mode) — not cosmetic doc edits. Couples maintenance to *work*, not to *editing*.
5. **Staleness is a first-class signal.** Every entry carries a `Last verified` date. An old date means *treat this as suspect and re-verify* before relying on it. This is the mechanism that keeps a living doc honest — most "keep docs updated" attempts die because the doc silently goes stale and nobody knows which parts to trust.
6. **Canonical handles.** Once a thing is coined in the Lexicon, *always* refer to it by that handle in journal entries. Consistency is what makes a coined term a reliable index (see Lexicon).

---

## The Lexicon — coined vocabulary

A vibe coder who doesn't understand their system fundamentally **lacks the vocabulary to talk about it** — you can't say "fix the auth thing" precisely if you have no name for the auth thing. So the AI coins **memorable, parrot-back-able handles** for components and patterns. The name becomes a *handle* the user can hold without holding the whole concept.

> **Precedent:** Kai already proved this with its `wiki_title` (memorable — "The Expertise Trap") vs `label` (precise — "Expertise-Calibrated Fallacy Susceptibility") duality, with search that resolves either. Vibe Scribe generalizes the pattern from graph nodes to system components.

### Entry shape

```
The Gatekeeper  →  src/auth/                                  (anchor: the real thing)
   "Checks who you are before any request gets through."      (plain definition)
   Last verified: 2026-06-24                                  (freshness)
```

### First-class (a central "Lexicon" section), not inline — because a central list unlocks two things scattered names can't:

1. **Collision enforcement.** You can only guarantee unique, non-confusable handles by coining *against* a single list. Inline, the AI might name two different things "the Gate."
2. **Referential stability across refactors.** When `src/auth/` becomes `src/identity/gatekeeper.ts`, the **handle stays "the Gatekeeper"** — only the anchor updates underneath. The user's vocabulary survives code churn. The name is a **stable pointer over a shifting implementation**.

### One handle → three views (the cross-document index)

Say "the Gatekeeper" once and it resolves three ways:
- **Lexicon** → *what it is* (definition + anchor)
- **Journal** → *how it got here* (grep the handle → the component's full history and the reasoning behind every change)
- **Code** → *where it lives* (the anchor)

> **The Lexicon is the dictionary; the journal is the literature.** A dictionary alone doesn't teach a language — you learn words by meeting them in sentences, repeatedly, in context. The journal is the corpus where the vocabulary gets *used*, so the names stick through exposure. Every briefing that narrates "the Gatekeeper got stricter" is another sentence in that corpus.

### Tombstones (retired terms are kept)

Two uses:
- **Resolution:** when the user parrots back a retired name, the AI says *"retired on X, it's now part of the Concierge"* — instead of silently misresolving to the wrong code.
- **Resurrection / fork:** a tombstone is a breadcrumb back to a prior design you might want to revive or build similar to. The Lexicon becomes a **reuse catalog**, not just a name index.

Tombstone entry = handle + `RETIRED` status + retired-date + successor pointer (one hop; the resolver walks the chain) + **a link back to the journal entry** that recorded the retirement. Resurrection flow: read tombstone (overview) → follow the link to the journal (history) → grep the handle for the full biography → reconstruct or fork.

- **Tombstones are write-once / frozen** — they describe a past state that won't drift, so they're **exempt from the staleness audit**. Near-zero maintenance.
- Keep them in a visually separate "Retired" subsection so they don't crowd the live vocabulary.
- Mirrors established soft-delete / 301-redirect patterns.

---

## Architecture

The plugin bundles three things, split along one clean line — **what should *happen* vs. what the user *asks for*:**

| Layer | What | How |
|---|---|---|
| **Write-path** | maintain both docs as a side-effect of work | **Hook / `CLAUDE.md` protocol** — automatic, invisible. *Must not* be a command the user remembers to run, or it won't happen. |
| **Read / audit-path** | query and verify the docs | **Skills** — user-invoked slash commands. |
| **Scaffolds** | empty journal + overview + Lexicon templates | Shipped with the plugin. |

## Skills

### `/briefing` — the headline feature
The read-path payoff that makes the quiet write-path worth it. *Ask your own codebase to explain itself — and the explanation is always current because it's continuously verified.*

- **Human-first.** Plain-language, narrative, skimmable. One format — leads with *what is this · what changed · what's healthy or broken.*
- **Doubles as an AI session-start refresher.** The AI doesn't need a separate machine format (it gets the raw docs in context); its benefit is **synthesis** + a **confirmation handshake** — generating the briefing *proves* it loaded the state, and gives the user a moment to confirm or correct. Both start aligned. *(This is exactly the manual briefing Claude gave after a reboot mid-session — `/briefing` automates it.)*
- **Trigger = "earned."** Brief proactively only when warranted — high change-volume since last session, a section went stale, or the last session ended mid-task — and always available on demand. Avoids the changelog-nobody-reads failure mode; self-rations using machinery already present.
- **Dimensions:**
  - *Scoped:* `/briefing auth`, `/briefing what changed this week`.
  - *Freshness-aware:* flags its own low-confidence sections — *"the payments section was last verified three weeks ago, treat it as suspect."*
  - *Bug-context:* *"I'm getting this error — brief me on what's involved"* → reads the dependency map + runbook to orient before anyone touches code (the debugging first-responder).

### `/sync` — the credibility mechanism
Re-audit the overview and Lexicon against reality; flag drift; bump `Last verified` dates; verify each Lexicon handle's anchor still resolves. This kills the strongest objection to the whole approach ("the docs rot, then they're worse than nothing").

### (future) bug → runbook capture
Every fixed bug becomes a runbook entry; the docs compound — after a while the AI doesn't *reason* a recurring bug out, it *looks it up*.

---

## Differentiation & prior art

**Neighbors to clear before publishing:** Architecture Decision Records (ADRs), runbooks, "living documentation," and the "Memory Bank" pattern for coding agents.

**What's actually differentiated:**
- **Automatic maintenance** — the part every org tries by hand (ADRs, wikis, runbooks) and watches rot. The contribution isn't the artifacts; it's keeping them true without willpower.
- **Staleness as a first-class signal** — the doc is honest about what it might be wrong about.
- **The coined-vocabulary cross-document index** — one handle threading Lexicon ↔ journal ↔ code, with tombstones as a reuse catalog.
- **The read-path (`/briefing`) as the payoff** — most "explain my codebase" tools regenerate from scratch each time and can't tell fresh from stale; this one briefs from a continuously-verified source.

> Run a `/prior-art` pass on "agent memory bank / dev journal / living documentation" before any public release.

---

## Open questions / decisions still to make

- [ ] Final wording of the lead hook ("Never lose your place" is the current front-runner).
- [ ] Exact write-path mechanism in Claude Code: a `Stop` hook, `CLAUDE.md` instructions, or both?
- [ ] Concrete heuristics/thresholds for the "earned" briefing trigger.
- [ ] Lexicon as the overview's front-door / name-indexed TOC, or a dedicated section?
- [ ] What the empty scaffolds look like (journal + overview + Lexicon templates).
- [ ] MVP scope (proposed below).

## Proposed v1 / MVP

Smallest shippable slice:
1. The two doc templates + the Lexicon scaffold.
2. The always-on write-path protocol (maintain journal + overview as a side-effect of work).
3. `/briefing` (human-first, on-demand to start; "earned" auto-trigger as a fast-follow).

Defer: `/sync` audit, tombstone tooling, scoped/bug-context briefing modes, bug→runbook capture.

---

## Provenance & IP note

Concept and the key design decisions are **Adam's**. Several mechanism elaborations originated with Claude during design sessions — **sort attribution before any IP capture or public disclosure.** Vibe Scribe is a **separate project** from the Kai product and the InventorLab plugin; keep the boundaries clean. Public disclosure (a `git push` to a public remote, a release) starts IP clocks — pause and review before publishing.
