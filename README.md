# *Vibe Scribe*

> **Never lose your place.**

*Vibe Scribe* keeps your project's *understanding* in the repo — not in your head, and not trapped in one AI session. It maintains two plain-markdown documents automatically, as a side effect of the work:

- **`dev-journal.md`** — the **log**: what changed, when, and *why* (append-only history).
- **`system-overview.md`** — the **map**: what exists right now, how it fits, what breaks if it's down, and a **Lexicon** of memorable names for every part of your system.

Because it's plain markdown in your repo, that understanding survives every boundary that normally destroys it — a new session, a context-window reset, a teammate handoff, a switch of tools, a reboot.

It's not a beginner tool. The gap between *code that exists* and *understanding that exists* is a property of AI-assisted development itself — a beginner hits it as a wall, a staff engineer feels it as drag. Same gap. *Vibe Scribe* closes it for everyone.

## How it works

- **Write-path (automatic):** as you work, *Vibe Scribe* updates the journal and overview for you — no command to remember. A stop-hook safety net quietly catches the times you change code but forget to write it down.
- **Read-path (on demand):**
  - `/briefing` — have your codebase explain itself, in plain language, in your own coined vocabulary.
  - `/sync` — re-audit the docs against reality and flag anything that's gone stale.

## Works across

Claude Code · OpenAI Codex · Cursor — one shared core, thin per-tool adapters. The docs it produces are tool-agnostic markdown, so your context comes with you even if you switch.

**Validation status (honest):**
- **Claude Code** — reference implementation; the most exercised.
- **OpenAI Codex · Cursor** — wired per each tool's published hooks API and modeled on a proven plugin pattern, but the safety-net hook hasn't been run live in-host yet. Everything fails open, and `.vibe-scribe.json` (`nudge` / `off`) is the escape hatch if anything misbehaves.

## Status

🚧 **Early.** Designed and built across all three tools — the setup flow, the safety net, and the `/briefing` + `/sync` skills are implemented and unit-tested. Still to come: live end-to-end tests inside each host, and a v0.1 release cut. See [`DESIGN.md`](./DESIGN.md) for the full design and rationale.

## Naming

`vibe-scribe` is the identifier — package, repo, commands, config. *Vibe Scribe* is the human name, styled in italics in the README and reader-facing prose. (Dense internal docs leave it plain, so the name doesn't compete with emphasis-italics.)

---
By Adam Carlson
