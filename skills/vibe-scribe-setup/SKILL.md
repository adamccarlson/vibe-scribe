---
name: vibe-scribe-setup
description: Configure Vibe Scribe for the current project. Writes the protocol into the project's instruction file (AGENTS.md, imported by Claude Code via a minimal CLAUDE.md), creates the dev-journal.md + system-overview.md living docs, and seeds the map by reading the existing codebase. Run once per project.
allowed-tools: Read Glob Grep Write Edit Bash
---

# Vibe Scribe Setup

Switch Vibe Scribe **on** for the current project: install the always-on instructions, create the
two living documents, and — the part that makes it immediately useful — **seed the map by reading
the code that's already here**, so the user finishes setup with a real picture of their project, not
a blank page.

Installing the plugin gives the tool the machinery (the skills + the write-path safety net). This
skill activates it for *this* project.

> Be safe and idempotent: never overwrite an existing journal or overview, never duplicate the
> instruction block on a re-run, and confirm before writing. If anything fails, say so plainly and
> stop — don't leave the project half-configured.

## Process

### Step 0 — Show the banner

Run, exactly as written, and let the output show:

```
node "${CLAUDE_PLUGIN_ROOT}/postinstall.js"
```

(`${CLAUDE_PLUGIN_ROOT}` is the Claude Code variable for the plugin's install path. On Codex/Cursor,
resolve the plugin root the host provides; if you can't, skip the banner and continue.)

### Step 1 — Survey the project

Quietly get your bearings before proposing anything:

- Is this a **git repo**? (`git rev-parse --is-inside-work-tree`) — the write-path safety net needs git.
- Is it a **new/empty** project or an **existing codebase**? (Look for source files, `package.json`,
  `README`, `pyproject.toml`, etc.) This decides how much there is to seed.
- Do `AGENTS.md`, `CLAUDE.md`, `dev-journal.md`, or `system-overview.md` **already exist**?

### Step 2 — Explain and confirm

Tell the user what you'll do, in plain language, and get a yes:

> "I'll switch Vibe Scribe on for this project:
> 1. **Tell me to keep your notes updated** — I'll add the Vibe Scribe instructions to `AGENTS.md`
>    (and a one-line `CLAUDE.md` so Claude Code picks them up). This is what keeps the two documents
>    current automatically as we work.
> 2. **Create the two documents** — a **dev journal** (what changed and why) and a **system overview**
>    (a map of what your project is, plus plain-language names for its parts).
> 3. **Fill in the map for you** — I'll read through your existing code and sketch the initial map, so
>    you can run `/briefing` right away and have the project explain itself back to you.
>
> A safety net is also active: when you change code but forget to update the notes, I'll jot it down
> before we wrap up. It's strict by default — you can relax or disable it anytime in `.vibe-scribe.json`
> (`block` / `nudge` / `off`)."

If the project isn't a git repo, mention that the automatic safety net stays off until it is, but the
docs and `/briefing` still work.

### Step 3 — Write the instruction file (idempotent)

Inject the Vibe Scribe protocol into the project's `AGENTS.md`, wrapped in markers so a re-run replaces
rather than duplicates:

```
<!-- vibe-scribe:begin -->
... contents of templates/AGENTS.snippet.md ...
<!-- vibe-scribe:end -->
```

- If `AGENTS.md` doesn't exist, create it with this block.
- If it exists **with** the markers, replace the block between them (so the protocol stays current).
- If it exists **without** the markers, append the block at the end. Don't disturb other content.
- Ensure a `CLAUDE.md` exists containing the line `@AGENTS.md` (create a minimal one if absent; append
  the import if `CLAUDE.md` exists without it). This is how Claude Code picks up the same instructions.

The snippet content lives at `${CLAUDE_PLUGIN_ROOT}/templates/AGENTS.snippet.md`. Read it and strip its
leading HTML comment (the authoring note) before injecting.

### Step 4 — Create the living documents

For each of `dev-journal.md` and `system-overview.md`: **if it already exists, leave it untouched**
(and skip seeding it in Step 6 — never clobber the user's notes). Otherwise create it from
`${CLAUDE_PLUGIN_ROOT}/templates/`. If you can't read the templates, recreate the structure described
in `PROTOCOL.md` (journal = header + format note; overview = What this is / Conceptual framework /
Component catalog / Dependency map / Runbook / Lexicon{Live, Retired}).

### Step 5 — Create the config (off-switch)

If `.vibe-scribe.json` is absent, create it with the default:

```json
{ "enforcement": "block" }
```

Mention to the user that this is where they dial the safety net down (`nudge`) or off (`off`).

### Step 6 — Seed the map (the important step)

This is what makes setup worth running. Read the existing codebase and populate `system-overview.md`
with a **real** first map. **Skip this step for an empty/new project** (there's nothing to map yet) —
the map will fill in as they build.

For an existing codebase:

1. **Get the shape.** Read the entry points, `README`, manifest (`package.json`/`pyproject.toml`/etc.),
   and the top-level directory layout. Identify the **major** subsystems/components (aim for ~5–12, not
   every file).
2. **What this is** — write one plain-language paragraph: what the project does, for whom.
3. **Conceptual framework** — optionally add one ASCII orientation diagram (the front door): the major
   parts + how they relate, including any hardware/infra and external services if relevant.
4. **Component catalog** — one entry per major part: what it is · where it lives · what breaks if it's
   down · any gotcha. Use the part's **Lexicon handle** as the heading.
5. **Dependency map** — an ASCII topology diagram of how the parts connect.
6. **Lexicon** — coin a **memorable, plain-language handle** for each major part, anchored to its real
   path, with a one-line definition and today's date as `Last verified`. Example:
   `**The Gatekeeper** → \`src/auth/\` — checks who you are before any request runs. (Last verified: <today>)`
7. **Runbook** — leave a "none recorded yet" placeholder; it grows as bugs get fixed.

**Seeding discipline (important):**
- **Anchor everything to real paths** — verify each path/symbol exists (Glob/Grep) before writing it.
- **Don't fabricate.** If you're unsure what a part does, say so and mark it to be confirmed by `/sync`
  rather than guessing. A map that admits uncertainty beats a confident-but-wrong one.
- **Coin selectively** — name concepts and subsystems, not every file. Memorable, concrete, short — not
  jargon. Check you haven't reused a handle.
- **Plain language throughout** — write it for someone who doesn't already know the system.
- Set every `Last verified` to **today's date**.

### Step 7 — Seed the first journal entry

Append one dated entry to `dev-journal.md`:

```
### Vibe Scribe initialized (<today>)
- Set up Vibe Scribe for this project; established the initial map.
- Named the major parts: <list the Lexicon handles coined>.
- <One or two things worth noting from the first read — anything surprising, any part left uncertain
  for /sync to confirm.>
```

### Step 8 — Confirm

Tell the user it's set up, in plain terms:

> "Done — Vibe Scribe is on for this project. I've created your dev journal and a starter system map
> (with names for the main parts), and I'll keep both current as we work. Try **`/briefing`** to have
> the project explain itself back to you, or **`/sync`** anytime to re-check the map against the code."

## Notes

- **Idempotent / safe:** re-running updates the instruction block in place and never overwrites existing
  journal/overview content.
- **Fail-safe:** if a step errors, report it plainly and stop; don't leave a half-configured project.
- **Cross-tool:** the same skill runs on Claude Code, Codex, and Cursor. Only the plugin-root path
  resolution and the banner differ per host; the rest is identical.
