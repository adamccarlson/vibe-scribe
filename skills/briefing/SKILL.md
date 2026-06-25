---
name: briefing
description: Have the codebase explain itself — a plain-language briefing on what the system is, what changed recently, and what's healthy or broken, in the project's own coined vocabulary. Use when the user asks for a briefing, an overview, or "where did we leave off," or at the start of a session to re-orient.
allowed-tools: Read Glob Grep Bash
---

# /briefing

Deliver a human-first briefing from `system-overview.md` (+ recent `dev-journal.md` entries).

> **STUB — v0.1.** Behavior is specified in `PROTOCOL.md` → Read-path and `DESIGN.md` → Skills.
> Fill in the procedure below once the briefing modes and "earned" trigger are finalized.

## What it does

- **Human-first:** plain language, narrative, skimmable. Lead with *what is this · what changed · what's healthy or broken.* Speak in the project's **Lexicon** handles.
- **Doubles as an AI session-start refresher:** generating the briefing proves the docs were loaded; invite the user to confirm or correct (the confirmation handshake).
- **Flag freshness:** call out any section whose `Last verified` date is old as lower-confidence.

## Modes (TODO)

- [ ] Default: whole-system briefing.
- [ ] Scoped: `/briefing <component>` — deep on one Lexicon handle.
- [ ] `what changed` — narrate recent journal entries.
- [ ] Bug-context: read dependency map + runbook to orient on an error.

## Procedure (TODO)

1. Read `system-overview.md` (and `dev-journal.md` tail for "what changed").
2. ... fill in.
