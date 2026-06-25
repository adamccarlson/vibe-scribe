#!/usr/bin/env node

// Vibe Scribe — write-path safety net (Cursor "stop" hook).
//
// Same job as the Claude Code Stop hook, adapted to Cursor's contract: input carries
// { status, loop_count, conversation_id, workspace_roots }; output is { followup_message } which
// Cursor auto-submits as the next user message (Cursor's equivalent of Claude's decision:block).
// The git gate is shared via scripts/lib/changes.js. Fail-open.

const fs = require('fs');
const { assess, loadConfig } = require('../../scripts/lib/changes');

function readStdin() { try { return JSON.parse(fs.readFileSync(0, 'utf8') || '{}'); } catch { return {}; } }
function projectRoot(input) {
  return (input.workspace_roots && input.workspace_roots[0]) || process.env.CURSOR_PROJECT_DIR || process.cwd();
}

function main() {
  const input = readStdin();
  if (input.status && input.status !== 'completed') process.exit(0);   // only nudge on a clean finish
  if ((input.loop_count || 0) >= 1) process.exit(0);                   // loop guard (also capped by loop_limit)

  const cwd = projectRoot(input);
  const mode = loadConfig(cwd).enforcement || 'block';                 // block | nudge | off
  // Cursor only has a re-prompt (followup_message); "nudge"/"off" fall back to the AGENTS.md
  // instruction (no auto re-prompt). Only "block" re-submits here.
  if (mode !== 'block') process.exit(0);

  const r = assess(cwd, input.conversation_id);
  if (!r.needsUpdate) process.exit(0);

  process.stdout.write(JSON.stringify({ followup_message: r.reason }));
  process.exit(0);
}

try { main(); } catch { process.exit(0); }   // fail-open
