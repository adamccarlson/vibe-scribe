#!/usr/bin/env node

// Vibe Scribe — session start (Claude Code "SessionStart" hook).
// Records a baseline of what's already changed, so the write-path safety net can scope to THIS
// session's changes. (Future home of the "earned" briefing nudge — see TODO.) Fail-open.

const fs = require('fs');
const { recordBaseline } = require('./lib/changes');

function readStdin() { try { return JSON.parse(fs.readFileSync(0, 'utf8') || '{}'); } catch { return {}; } }

function main() {
  const input = readStdin();
  recordBaseline(input.cwd || process.cwd(), input.session_id);

  // TODO (earned briefing): when warranted, emit
  // {"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":"… suggest /briefing …"}}
  process.exit(0);
}

try { main(); } catch { process.exit(0); }   // fail-open
