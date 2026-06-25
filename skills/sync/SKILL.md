---
name: sync
description: Re-audit the Vibe Scribe docs against the actual codebase — flag drift, refresh "Last verified" dates, and verify each Lexicon handle's anchor still resolves. Use when the user asks to sync, verify, or refresh the docs, or to check whether the overview is still accurate.
allowed-tools: Read Glob Grep Bash Edit
---

# /sync

Verify `system-overview.md` (and the Lexicon) against reality; flag and repair drift.

> **STUB — v0.1.** Behavior is specified in `PROTOCOL.md` and `DESIGN.md` → Skills (`/sync`).

## What it does

- Check each component-catalog / dependency / runbook claim against the current code.
- Verify each **Lexicon** handle's `anchor` still resolves (the path/symbol exists); flag broken anchors.
- Where an entry is confirmed current, bump its `Last verified` date; where it's drifted, flag it (and fix if confident).
- Tombstones are write-once/frozen — **skip** them (they describe a past state and don't drift).

## Procedure (TODO)

1. Parse the overview's entries and Lexicon handles.
2. For each anchor, confirm it resolves (Glob/Grep).
3. ... fill in.
