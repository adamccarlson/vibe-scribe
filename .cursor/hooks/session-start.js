#!/usr/bin/env node

// Vibe Scribe — session start (Cursor "sessionStart" hook).
// Records a baseline (keyed by conversation_id, which the stop hook also receives) so the
// write-path safety net can scope to THIS session's changes. Fail-open, fire-and-forget.

const fs = require('fs');
const { recordBaseline } = require('../../scripts/lib/changes');

function readStdin() { try { return JSON.parse(fs.readFileSync(0, 'utf8') || '{}'); } catch { return {}; } }
function projectRoot(input) {
  return (input.workspace_roots && input.workspace_roots[0]) || process.env.CURSOR_PROJECT_DIR || process.cwd();
}

function main() {
  const input = readStdin();
  recordBaseline(projectRoot(input), input.conversation_id);
  process.exit(0);
}

try { main(); } catch { process.exit(0); }   // fail-open
