---
name: vibe-scribe-setup
description: Configure Vibe Scribe for the current project. Writes the protocol into the project's instruction file (AGENTS.md, imported by Claude Code via a minimal CLAUDE.md), and creates the dev-journal.md + system-overview.md docs from templates. Run once per project.
allowed-tools: Read Glob Grep Write Edit Bash
---

# Vibe Scribe Setup

Configure the current project so Vibe Scribe maintains its living docs automatically.

> **STUB — v0.1.** Mirrors InventorLab's setup pattern (one `AGENTS.md`, imported by `CLAUDE.md`).
> Finalize the exact wording once the write-path mechanism is settled.

## Process

**Step 0 — Show the banner.** Run, exactly as written:

```
node "${CLAUDE_PLUGIN_ROOT}/postinstall.js"
```

**Step 1 — Explain and confirm.** Tell the user what you'll do:

> "I'll set up Vibe Scribe for this project:
> 1. **Add the protocol to your instruction file** — written to `AGENTS.md` (read natively by Codex; for Claude Code, a one-line `CLAUDE.md` with `@AGENTS.md` is also created; Cursor picks it up via the always-on rule). This tells me to keep the two docs current as a side effect of our work.
> 2. **Create the living docs** — `dev-journal.md` (the log) and `system-overview.md` (the map, with a Lexicon section), from templates.
> 3. **Seed the first entries** — an initial overview pass + a first journal entry, so you start with a real map, not an empty file."

**Step 2 — Write the instruction file.** Inject `templates/AGENTS.snippet.md` into the project's `AGENTS.md` (create it if absent). For Claude Code, ensure a `CLAUDE.md` exists containing `@AGENTS.md`. _(TODO: idempotent injection; don't duplicate on re-run.)_

**Step 3 — Create the docs.** Copy `templates/dev-journal.md` and `templates/system-overview.md` into the project root if absent.

**Step 4 — Seed (optional, recommended).** Do a first pass over the codebase to populate the overview's component catalog + a starter Lexicon, then write the first journal entry. _(TODO: depth/limits of the initial pass.)_

**Step 5 — Confirm.** Tell the user it's set up and that `/briefing` and `/sync` are available.
