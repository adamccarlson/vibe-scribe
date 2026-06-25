---
name: sync
description: Re-audit the Vibe Scribe map against the actual codebase — verify each Lexicon handle's anchor still resolves, check the component catalog and dependency map against reality, refresh "Last verified" dates on what's confirmed, and flag (or, with confidence, fix) anything that drifted. Use when the user asks to sync, verify, refresh, or check whether the map is still accurate. Optional argument scopes it to one component.
allowed-tools: Read Glob Grep Bash Edit
---

# /sync

Walk `system-overview.md` and check it against the code as it actually is **right now**. This is the
command that keeps the map *trustworthy* — without it, the docs quietly rot and become worse than
nothing. `/sync` is the antidote: it confirms what's still true, refreshes the `Last verified` dates,
and surfaces what's drifted.

> **Verify, don't rewrite.** Confirm claims against the code; refresh dates on what holds; **fix only
> what you're confident about.** When you're unsure whether something drifted, **flag it for the user** —
> don't silently rewrite the map. And **never retire or remove** a component or handle on your own;
> *propose* it and let the user confirm (removing map content is a deletion — treat it like one).

## Step 1 — Read the map and set scope

- Read `system-overview.md`. **If it doesn't exist:** tell the user to run `/vibe-scribe-setup` first. Stop.
- **Scope:** `/sync` audits the whole map; `/sync <component>` audits just that part (faster on a big map).
- **Skip the Retired (tombstone) section** — tombstones describe a past state, they don't drift, and they're
  not re-verified.

## Step 2 — Audit each verifiable element

For the section(s) in scope, classify each item:

1. **Lexicon handles** — each has an **anchor** (a path or symbol). Verify it resolves (Glob/Grep: does the
   file/dir/symbol exist?). The anchor is the most mechanically checkable thing in the whole map.
2. **Component catalog entries** — confirm the component still exists at its stated location; spot-check the
   description and "what breaks if it's down" for obvious contradictions with the code.
3. **Dependency map** — confirm the named nodes still exist. (Edges are harder to verify mechanically; check
   for the obviously-broken, don't over-reach.)
4. **What this is / Conceptual framework** — high-level and least mechanically verifiable. Only touch these
   if they're *clearly* wrong; otherwise leave them.

Sort each item into one bucket:

| Bucket | What it means | Action |
|---|---|---|
| **Confirmed** | matches the code | bump `Last verified` → today |
| **Drifted (confident fix)** | small, unambiguous mismatch (anchor moved, name changed) | fix it, set `Last verified` → today, note it |
| **Drifted (uncertain)** | something's off but the right fix isn't obvious | **flag for the user**, leave as-is |
| **Anchor gone** | the thing it points to no longer exists | **propose** a tombstone (retire the handle, with a successor if you can tell) — confirm with the user, don't auto-retire |

## Step 3 — Apply the safe updates; propose the rest

- **Confirmed → refresh dates.** Set `Last verified` to today's date on everything that checked out.
- **Confident fixes → apply.** Update moved anchors, corrected names, obvious description fixes. Set their
  `Last verified` to today.
- **Uncertain drift → flag, don't fix.** List it for the user with what you saw and what you suspect.
- **Removals / retirements → propose only.** If a component appears gone, *describe* what you'd retire (move
  its handle to the Retired section with a successor pointer + journal link) and ask the user to confirm
  before doing it. Same for deleting any map content.

## Step 4 — (optional) Note what's missing

While you're in the code, if you notice a **major** new component that isn't on the map at all, mention it
and offer to add it (coin a handle, anchor it, write a catalog entry). Keep this to the significant gaps —
don't try to inventory every new file.

## Step 5 — Log it (only if substantive)

If `/sync` made **substantive** corrections (fixed real drift, retired a handle, added a component), append a
short `dev-journal.md` entry: `### /sync: corrected the map (<today>)` + what changed and why. **If it only
refreshed dates, don't log** — that's routine upkeep, not a system change worth a diary entry.

## Step 6 — Report

Tell the user plainly what you found:

> "Synced the map. **<N> parts confirmed and re-dated.** Fixed: <short list>. **Flagged for you:** <the
> uncertain ones>. **Looks gone — retire?** <proposed tombstones>. <Any major thing missing from the map.>"

If everything checked out, say so cleanly — *"the map's accurate, all dates refreshed."*

## Principles

- **Conservative by default.** Refresh and fix the obvious; *propose* anything that deletes or retires.
  Never remove map content without the user's say-so.
- **Don't fabricate.** Verify against the code. If you can't tell, flag it — uncertainty stated beats
  confidence faked. (This is the same discipline as `/briefing` and setup.)
- **Freshness is the whole point.** A `Last verified` date is a promise; only stamp today's date on something
  you actually re-checked.
- **Skip tombstones** — they're frozen history, not live claims.
