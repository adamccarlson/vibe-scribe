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

## Visual aids — diagrams

**Decided (Adam, 2026-06-24): ASCII-only.** Text-native diagrams stay diffable, greppable, AI-readable, and in-repo (a PNG breaks all of that), and ASCII additionally renders *anywhere* — bare terminal, SSH, remote session — with zero tooling. Simplicity over capability for v1.

**Diagram repertoire — pick the right one for the question (a repertoire, not a checklist; don't generate all four for everything). Workhorses for MVP are (1) and (2); (3) and (4) are situational.**
1. **Structure / topology** — what's wired to what (component dependency). Answers *"what breaks if X is down."* (the Gatekeeper → Concierge → Vault map.)
2. **Logic / flow (flowcharts)** — control flow *through* a method/process: steps, decisions (diamonds), branches, loops. Answers *"what happens when this runs, and why it took this path."* Often the **more debugging-relevant** kind — bugs live in logic, not wiring. ASCII handles decision diamonds + labeled (yes/no) branches well. Especially valuable in the **journal** for capturing the *why* of non-obvious logic.
3. **Swimlane** — a process partitioned by *actor/owner* (each lane = a component/system, often a Lexicon handle), showing **handoffs** between them. Answers *"who does what, in what order."* Handoffs are exactly where multi-component bugs and false assumptions hide. ASCII caveat: true lanes **sprawl past ~3–4 actors / a handful of steps** — when they get tight, fall back to an **owner-annotated flow** (`[Gatekeeper] auth → [Concierge] orchestrate → [Vault] fetch`), which carries the handoff info without the grid.
4. **Conceptual framework** — a mixed-concern big-picture map that blends **architecture + logic + hardware/infra**. Answers *"what's the fundamental shape."* This is the **front-door / orientation** diagram (top of `system-overview`), and the natural place **hardware finally enters** (the box it runs on, ports, external services). Caveat: it's the **least mechanically verifiable** of the four (impressionistic by nature → most prone to hand-wavy drift) — use **sparingly**, treat it as the system's *constitution* (revisited when the fundamental shape changes), not its *minutes* (every commit).

**Discipline for logic diagrams:** diagram **selectively** — only non-obvious / complex control flow (gnarly branching, decision trees, state machines), never trivial linear methods (that's noise). And logic diagrams **drift faster than topology** (logic changes more than wiring), so `Last verified` matters more — re-verify a method's flowchart when debugging its logic (it doubles as a debugging aid and gets refreshed during the fix).

- **Diagram + explanation, always paired.** The ASCII diagram shows *topology* (what connects to what); a short plain-language walk-through provides *function* (what each box does and how data flows). Structure + meaning. The boxes **are Lexicon handles**, so the walk-through reuses each handle's plain definition — *"a request enters via the Gatekeeper (auth), which hands off to the Concierge (orchestration)…"*. Never a bare diagram.
- **Surfaced via `/briefing`**, stored in `system-overview.md`.
- **Complexity ceiling — scope, don't cram.** ASCII goes spaghetti past ~a dozen boxes. When a system outgrows one diagram, split into several **scoped** diagrams (a top-level map of named subsystems, then one per subsystem) rather than a single unreadable graph. `/briefing <component>` maps naturally to per-subsystem diagrams.
- **Keep it text-native** — no render pipeline (the patent-figure JSON/editor machinery does *not* belong here). Plain markdown is the ethos.
- *Deferred, not rejected:* Mermaid-as-stored-format + diagrams-as-dependency-data. Considered and set aside for simplicity; revisit if systems routinely outgrow ASCII or if machine-parseable topology becomes valuable.

## Relationships — richer vocabulary, not a knowledge graph

**Considered and declined (2026-06-24): a formal component knowledge graph** (typed nodes + edges as a machine-readable graph file). Low ROI for Vibe Scribe:

- The relationships are **already captured** by the dependency map + Lexicon — a graph file would just duplicate them.
- It fights the core principles: a JSON graph is **machine-facing** (vs. human-first plain markdown); a dense typed graph is **hard to keep verified** (and a confidently-wrong graph is *worse* than none — the very failure mode Vibe Scribe exists to prevent); and it's a whole new artifact (vs. minimalism).
- **Why it's low-ROI here but high-ROI in Kai:** Kai's graph *is* the product — the only representation of intellectual relationships (ideas / hypotheses / arguments). A Vibe Scribe component graph would be a **lossy secondary copy of what the code already encodes precisely**; real static-analysis tools extract that structural graph automatically, always-current, for free. Vibe Scribe's value-add is the *why* + plain-language understanding, **not** the graph.

**Chosen instead: enrich the relationship vocabulary in the dependency map.** Edges carry a short **plain-language relationship**, not a bare arrow — *what kind* of dependency. Descriptive and open, **not a rigid ontology** (that's the knowledge graph creeping back in). Common labels (not exhaustive): *calls / sends to · owns the data for / reads from / writes to · triggers / notifies · depends on / requires · wraps / extends · replaces / supersedes* (the last doubles as the tombstone successor link). Roughly 90% of a knowledge graph's value at ~5% of the cost, and it stays human-readable.

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
- [x] **Write-path mechanism — decided & implemented:** instruction-first (portable) + a gated `Stop`-hook *backstop* on Claude Code (`scripts/write-path.js`) that fires only when source changed this session but the docs didn't. Block-by-default with a `.vibe-scribe.json` `enforcement` knob (`block`/`nudge`/`off`); baseline recorded at `SessionStart`. Fail-open, loop-safe, never commits.
- [ ] Concrete heuristics/thresholds for the "earned" briefing trigger.
- [ ] Lexicon as the overview's front-door / name-indexed TOC, or a dedicated section?
- [ ] What the empty scaffolds look like (journal + overview + Lexicon templates).
- [ ] MVP scope (proposed below).

## v0.1 — MVP cut

What got built has outgrown the original "smallest slice" — `/sync`, tombstones, and the full briefing
modes all landed. So the v0.1 cut is about what *ships enabled* vs. what's *deferred*, plus the one gate
before tagging.

**In v0.1 (built + shipping):**
- The two living docs + the **Lexicon** (handles, anchors, tombstones) + the four-type **ASCII diagram
  repertoire** with labeled relationship edges.
- **`/vibe-scribe-setup`** — activate the project and seed the map from existing code.
- **Write-path safety net** — instruction-primary on all three tools, plus the deterministic stop-hook
  backstop (Claude `decision:block`, Cursor `followup_message`, Codex `decision:block`), with the
  `.vibe-scribe.json` enforcement knob (`block` / `nudge` / `off`).
- **`/briefing`** — all four modes (whole-system, scoped, what-changed, bug-context), on-demand, lean-visual.
- **`/sync`** — map-vs-code audit.
- **All three hosts** (Claude Code, Cursor, Codex) from one shared core.

**Deferred (post-v0.1):**
- **Earned / auto-triggered briefing** — the session-start proactive nudge (currently a stub; in v0.1
  `/briefing` is on-demand only).
- **bug → runbook auto-capture** — not built.
- **Mermaid stored-format / diagrams-as-data** — declined for now (see Visual aids).
- **Naming-first design-surface** — speculative future direction.

**Release gate — live in-host tests: *waived for v0.1* (decided 2026-06-24).**
- Live smoke tests in each host are **skipped** for v0.1. Claude Code is the reference (most exercised).
  Codex and Cursor are wired per each tool's published hooks API and a proven plugin pattern, but their
  safety-net hook (`Stop` / `stop`) hasn't run live in-host. (Note: InventorLab validates Codex's
  manifest / skills / `SessionStart` — but it has **no `Stop` hook**, so our Codex backstop is new and
  unverified live.) Risk is bounded: every script is **fail-open** and `.vibe-scribe.json` (`nudge` / `off`)
  disables the backstop. **Validation status is documented in the README** instead of gating the release.
- *Decided (2026-06-24):* enforcement default stays **`block`** — the headline "automatic" value; shipping
  `nudge` would undersell it. The unproven-hook risk is carried by fail-open + the off-switch + the
  documented status (not by weakening the default). Users can still dial down per-project.

---

## Future direction — naming-first coding (speculative)

So far the Lexicon is **retrospective**: the AI coins handles for what already exists. The inversion: the **user coins a handle for what they want to add** — *"a Bouncer that turns away requests arriving too fast"* — and that Lexicon entry becomes the *seed/spec*; the AI implements toward the named intent. The Lexicon flips from a *map* into a **design surface** — the same artifact is both forward (name + intent → code) and backward (name → code + history).

**Honest lineage:** this is close to Domain-Driven Design's **ubiquitous language** (Evans) and readme-driven development — naming/vocabulary-first design is a respected, *known* practice, not new to the field. The potentially fresh part is **democratization**: ubiquitous-language design has always required senior design discipline most teams can't sustain; an AI that translates name + intent → implementation and keeps the Lexicon live and bidirectional could give a beginner that paradigm *without the theory*. The place to look for differentiation (and for any IP) is the AI-mediated, self-maintaining, bidirectional **Lexicon-as-design-surface** — not "naming-first" in the abstract. Clear the DDD prior art before any claims.

## Distribution — multi-tool packaging (Claude Code · Codex · Cursor)

Goal: ship for all three, mirroring InventorLab's proven multi-tool structure.

**Key reality: the core is portable; the automation degrades gracefully.** Vibe Scribe is mostly *instructions + markdown templates*, which every tool's instruction surface can carry. The three tools expose very different automation/command capabilities, so the *experience* varies — but the *artifact* does not.

**Architecture: one shared core + thin per-tool adapters.**
- **Shared core** (tool-agnostic markdown): write-path protocol + the six disciplines + Lexicon rules + diagram repertoire + doc/template scaffolds + briefing/sync behavior. The bulk of Vibe Scribe; identical everywhere.
- **Adapters** install the core into each tool's instruction surface and wire up whatever automation it supports:

| Capability | Claude Code | Cursor | Codex |
|---|---|---|---|
| Instruction surface | `CLAUDE.md` + plugin | `.cursor/rules/*.mdc` (Always) | `AGENTS.md` (native) |
| Automatic write-path | ✅ `Stop` hook (`decision:block`) | ✅ `stop` hook (`followup_message`) | ✅ `Stop` hook (`decision:block`) |
| `/briefing`, `/sync` commands | ✅ Skills / slash commands | ✅ Skills (shared `skills/`) | ✅ Skills (by name/description) |
| Fidelity | **full** (reference) | **full** | **full** |

**All three tools reach full fidelity** — each has a deterministic stop-hook backstop plus the shared skills. The mechanism differs only in wire format: Claude Code and **Codex** both use `decision:block` + `reason` (Codex hooks mirror Claude's contract — same PascalCase events, JSON stdin, `${PLUGIN_ROOT}` paths), so Codex reuses the Claude scripts unmodified; **Cursor** uses `stop` → `followup_message`. The shared git gate (`scripts/lib/changes.js`) and the same `AGENTS.md` instruction layer back all three. *(Codex Stop is loop-safe via the docs-touched gate even without a `stop_hook_active` flag; confirm exact Codex Stop input fields in a live Codex run.)*

**Silver lining (on-brand):** the artifact — the two docs + Lexicon — is **100% portable** regardless of tool (plain markdown in the repo). Switch tools and your Vibe Scribe context comes with you. Not-lock-in extends to the tooling itself.

**Concrete layout — mirrors InventorLab's validated structure (single npm package, shared core, thin adapters):**
```
vibe-scribe/
  package.json          # npm; files[] ships everything; postinstall = banner
  PROTOCOL.md           # SHARED CORE: write-path protocol, the 6 disciplines, Lexicon rules, diagram repertoire
  DESIGN.md             # this doc
  README.md  LICENSE
  skills/               # SHARED verbatim across all three tools (every manifest points at ./skills/)
    briefing/SKILL.md
    sync/SKILL.md
    vibe-scribe-setup/SKILL.md   # writes AGENTS.md (+ CLAUDE.md @import) into the user's project; scaffolds templates
  templates/
    dev-journal.md        # empty journal scaffold
    system-overview.md    # empty overview scaffold (incl. Lexicon section)
  hooks/hooks.json        # Claude: Stop hook → automatic write-path; SessionStart → earned-briefing offer
  scripts/                # write-path / firstrun helpers
  .claude-plugin/         # plugin.json + marketplace.json
  .codex-plugin/          # plugin.json  (→ skills, hooks)
  .cursor-plugin/         # plugin.json  (→ skills, rules, hooks)
  .cursor/rules/vibe-scribe.mdc   # alwaysApply:true → @AGENTS.md + protocol (Cursor's "always-on")
```

**Instruction strategy (from InventorLab):** the setup skill writes ONE `AGENTS.md` into the user's project as the canonical instruction surface; `CLAUDE.md` `@import`s it; the Cursor `.mdc` rule (`alwaysApply:true`) references `@AGENTS.md`. The platform-specific surface is tiny — 3 manifests + 1 Cursor rule + hook registrations. Everything else (skills, templates, `PROTOCOL.md`, `AGENTS.md`) is shared.

**Simpler than InventorLab:** no MCP server (Vibe Scribe is docs + skills; no external tool calls). **Vibe-Scribe-specific upgrade:** InventorLab's Claude hook is `SessionStart` (firstrun); Vibe Scribe adds a **`Stop` hook** — the thing that makes the write-path automatic.

*Build order: Claude Code reference ✅ → Cursor adapter ✅ → Codex adapter ✅ (all three verified against their docs + tested; shared git gate in `scripts/lib/changes.js`). All tools full-fidelity. Remaining: README, prior-art/provenance pass before any public push, MVP cut, and live end-to-end tests inside each host.*

## Provenance & IP note

Concept and the key design decisions are **Adam's**; several mechanism elaborations originated with Claude during design sessions. **Decision (2026-06-24): Adam is not pursuing a patent on *Vibe Scribe* in its current state.** Open-sourcing it is treated as a **defensive publication** — it becomes prior art, which prevents others from patenting these approaches. **No in-depth IP analysis is required before pushing.** The attribution split is retained here only as a courtesy, in case a future, materially different version ever revisits IP — in which case note that a public push already forecloses foreign patent rights and starts the US 12-month grace clock from the publish date. *Vibe Scribe* is a **separate project** from the Kai product and the InventorLab plugin; keep the boundaries clean.
