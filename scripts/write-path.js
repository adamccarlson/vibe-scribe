#!/usr/bin/env node

// Vibe Scribe — write-path hook (Stop). STUB.
//
// Intent: at end-of-work, ensure the living docs get updated (the "automatic, invisible"
// write-path). This is the load-bearing open design question (see DESIGN.md → Open questions
// and PROTOCOL.md → Open items): a Stop hook fires AFTER the model stops, so it cannot itself
// write reasoned doc updates. Candidate mechanisms to decide between:
//   (a) Stop hook that, when a real change occurred this session, emits a continuation
//       instruction so the agent updates the docs before truly stopping;
//   (b) instruction-only (the AGENTS.md protocol) with no hook — softer, but portable;
//   (c) a hybrid: hook detects "uncommitted/changed files since session start" and only then
//       nudges the doc update, to avoid noise on read-only sessions.
//
// For now this is a no-op placeholder so the plugin loads cleanly. Decide the mechanism during
// the Claude Code reference build, then implement here.

process.exit(0);
