# Vibe Scribe — Protocol (shared core)

> This is the tool-agnostic behavioral core. The setup skill installs a condensed form of this
> into the user's project instruction file (`AGENTS.md`, imported by `CLAUDE.md`). The full
> rationale for every rule lives in [`DESIGN.md`](./DESIGN.md).
>
> **Status: v0.1 stub** — rules below are settled; sections marked _(TODO)_ need expansion.

## The two documents

- **`dev-journal.md` — the log.** Temporal, **append-only**. What changed, when, why, what was learned. Never edit history.
- **`system-overview.md` — the map.** Current-state, **revise-in-place**. Component catalog, dependency map, runbook, and the Lexicon. Old content is replaced, not appended.

Same maintenance habit, **opposite update semantics**. Don't conflate them.

## Write-path disciplines

1. **One pass.** Update both documents in a single end-of-work reflection step.
2. **The overview's changelog lives in the journal**, never in the overview.
3. **Don't duplicate.** Journal = the delta + the why + a section pointer. Overview = the resulting state. Never the same facts in both voices.
4. **Trigger = real system change** (new component, changed topology, new/resolved failure mode), not cosmetic edits.
5. **Staleness is first-class.** Every overview entry carries a `Last verified` date. An old date means *treat as suspect; re-verify before relying on it.*
6. **Canonical handles.** Once a thing is coined in the Lexicon, always refer to it by that handle in journal entries.

## The Lexicon (coined vocabulary)

Coin **memorable, parrot-back-able** handles for components and patterns. Entry shape:

```
The Gatekeeper  →  src/auth/                              (anchor: the real artifact)
   "Checks who you are before any request gets through."  (plain one-line definition)
   Last verified: YYYY-MM-DD
```

- **First-class** (a central "Lexicon" section), so handles can be deduped and stay stable across refactors (the handle holds; the anchor updates underneath).
- **Tombstones:** retired terms are kept (in a separate "Retired" subsection) with a successor pointer + a link to the journal entry that retired them. They're write-once/frozen → exempt from the staleness audit. Used for resolution ("that's now the Concierge") and resurrection/fork.
- **Selectivity:** coin for concepts/subsystems that lack a natural name — not every file.

## Diagram repertoire (ASCII only — text-native, renders anywhere)

A repertoire, not a checklist — pick the right one; never generate all four for everything. Always pair a diagram with a plain-language explanation. Boxes are Lexicon handles.

1. **Structure / topology** — what's wired to what. _(workhorse)_
2. **Logic / flow (flowchart)** — control flow through a method: steps, decisions, branches. _(workhorse; most debugging-relevant)_
3. **Swimlane** — a process partitioned by actor/owner, showing handoffs. _(situational; fall back to owner-annotated flow past ~3–4 lanes)_
4. **Conceptual framework** — mixed-concern big-picture (architecture + logic + hardware/infra); the orientation diagram. _(situational; least verifiable — use sparingly)_

Selectivity for logic diagrams: only non-obvious control flow. Logic diagrams drift faster than topology — `Last verified` matters most here.

## Read-path

- **`/briefing`** — human-first synthesis of the overview (+ recent journal), in plain language and the user's coined vocabulary. Doubles as an AI session-start refresher (synthesis + a confirmation handshake). _Trigger:_ **earned** (high change-volume since last session, a stale section, or a session that ended mid-task), always available on demand. Modes _(TODO: finalize):_ scoped (`/briefing <component>`), freshness-aware, bug-context.
- **`/sync`** — re-audit the overview + Lexicon against reality; flag drift; bump `Last verified`; verify each handle's anchor still resolves.

## Write-path mechanism — how the docs actually get updated

**Primary (all tools): instruction.** The `AGENTS.md` protocol tells the agent to update both docs at the end of a chunk of work that made a real change. Portable; works everywhere.

**Backstop (Claude Code + Cursor — both wired & tested): a quiet safety net.** A stop hook checks: did this session change source files but leave the docs untouched? If so, it asks the agent to update them before stopping. Otherwise it stays silent — if the docs were already updated (the normal case), the backstop never fires. Claude Code: `scripts/write-path.js` (`Stop` → `decision:block`). Cursor: `.cursor/hooks/write-path.js` (`stop` → `followup_message`, loop-safe via `loop_count`/`loop_limit`). Shared git gate: `scripts/lib/changes.js`. Codex: instruction-only (no stop-hook equivalent).

- Loop-safe via `stop_hook_active`; **fail-open** (any error → let the session end).
- "This session's changes" = current git changes minus a baseline recorded at `SessionStart` (`scripts/session-start.js`). Not a git repo → backstop stays silent (instruction-only).
- Updates the working tree only; **never commits** (docs travel with your code change).

**Enforcement knob** — `.vibe-scribe.json` → `"enforcement"`: `block` (default: pause and update before stopping), `nudge` (remind, don't block), or `off`. "Strict, with an off-switch."

## Open items _(TODO)_

- [ ] Concrete heuristics for the "earned" briefing trigger (`scripts/session-start.js`).
- [ ] Skill bodies (`/briefing`, `/sync`) + `vibe-scribe-setup` finalization.
- [x] Cursor stop-hook backstop (`followup_message`) — verified against Cursor docs, wired, and tested.
