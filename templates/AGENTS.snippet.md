<!--
  AGENTS.snippet.md — the instruction block the setup skill injects into the user's project
  AGENTS.md (read natively by Codex; imported by Claude Code via a one-line CLAUDE.md; referenced
  by the Cursor rule via @AGENTS.md). This is the portable "always-on" behavioral layer — a
  condensed, self-contained form of PROTOCOL.md. Strip this comment when injecting.
-->

## Vibe Scribe — living project memory

This project uses **Vibe Scribe**. Two markdown files in the repo carry the project's understanding
across sessions. Keep them true as a side effect of your work.

### The two documents

- **`dev-journal.md`** — the **log** (append-only history). At the end of a chunk of work that made a
  *real change* to the system, add a dated entry: what changed, **why**, decisions and rejected
  alternatives, anything to watch. Never edit past entries.
- **`system-overview.md`** — the **map** (current state, revised in place). Component catalog,
  dependency map, runbook, and the Lexicon. Update the affected entries to match reality and refresh
  their `Last verified` date.

### Disciplines

- **One pass** — update both at the end of a real-change chunk of work.
- The **overview's changelog lives in the journal**, not in the overview.
- **Don't duplicate** — journal = the delta + the why; overview = the resulting state. Never the same
  facts in both voices.
- **Trigger = a real system change** (new component, changed topology, new/resolved failure mode), not
  cosmetic edits.
- **Staleness is first-class** — only stamp today's `Last verified` on something you actually re-checked.
- **Never delete or retire** map content on your own — *propose* it and let the user confirm.

### The Lexicon (coined vocabulary)

Coin memorable, plain-language **handles** for the system's parts (e.g. *the Gatekeeper* → `src/auth/`),
each anchored to a real path with a one-line definition. Use the handles **consistently** everywhere —
journal, overview, briefings — that's the shared vocabulary. Retired handles become **tombstones** (kept,
with a successor pointer), not deletions.

### Diagrams (ASCII only)

When structure or flow matters, *show* an ASCII diagram, paired with a one-line plain explanation, with
nodes named as Lexicon handles. Repertoire: **topology · logic/flowchart · swimlane · conceptual
framework**. Be selective, and don't fabricate connections that aren't in the map.

### Briefings

On request — or when a lot has changed — give a **briefing**: a plain-language synthesis of what the
system is, what changed recently, and what's healthy, in the project's own handles, with diagrams where
they help. Flag any stale (old `Last verified`) section as lower-confidence.

### Keeping the docs current

At the end of work, **if you changed code but haven't updated these docs, update them before finishing.**
A stop hook enforces this on Claude Code, Cursor, and Codex; everywhere, treat it as a standing
instruction. The user can tune enforcement in `.vibe-scribe.json` (`block` / `nudge` / `off`).
