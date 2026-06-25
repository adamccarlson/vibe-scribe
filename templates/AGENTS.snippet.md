<!--
  AGENTS.snippet.md — the instruction block the setup skill injects into the user's project
  AGENTS.md (read natively by Codex; imported by Claude Code via a one-line CLAUDE.md;
  referenced by the Cursor rule via @AGENTS.md). This is the portable "always-on" behavioral
  layer — a condensed form of PROTOCOL.md. STUB: finalize wording during the Claude Code build.
-->

## Vibe Scribe — living project memory

This project uses **Vibe Scribe**. Two markdown documents in the repo carry the project's
understanding across sessions; keep them true as a side effect of your work.

- **`dev-journal.md`** (the log — append-only): at the end of a chunk of work that made a *real
  system change*, add a dated entry — what changed, **why**, decisions + rejected alternatives,
  anything to watch. Never edit past entries. Refer to components by their Lexicon handles.
- **`system-overview.md`** (the map — revise in place): update the affected component/dependency/
  runbook/Lexicon entries to reflect current reality, and refresh their `Last verified` date.

Keep them distinct: the journal records the *delta + why*; the overview holds the *resulting state*.
Don't write the same facts in both. Coin memorable **Lexicon** handles for parts of the system and
use them consistently. <!-- TODO: condensed Lexicon + diagram + briefing rules from PROTOCOL.md -->

On request (or when warranted — "earned"), deliver a **`/briefing`**: a plain-language synthesis of
what the system is, what changed recently, and what's healthy, in the project's own coined vocabulary.
