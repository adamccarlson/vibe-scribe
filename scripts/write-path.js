#!/usr/bin/env node

// Vibe Scribe — write-path safety net (Claude Code "Stop" hook).
//
// Quietly checks whether you changed code this session but didn't update the living docs; if so
// (and only then), asks the AI to jot it down before wrapping up. Strict by default; dial it down
// via .vibe-scribe.json. The git gate lives in scripts/lib/changes.js (shared with the Cursor hook).
// Fail-open: any error just lets the session end.

const fs = require('fs');
const { assess, loadConfig } = require('./lib/changes');

function readStdin() { try { return JSON.parse(fs.readFileSync(0, 'utf8') || '{}'); } catch { return {}; } }

function main() {
  const input = readStdin();
  if (input.stop_hook_active) process.exit(0);               // loop guard

  const cwd = input.cwd || process.cwd();
  const mode = loadConfig(cwd).enforcement || 'block';       // block | nudge | off
  if (mode === 'off') process.exit(0);

  const r = assess(cwd, input.session_id);
  if (!r.needsUpdate) process.exit(0);

  if (mode === 'nudge') { process.stderr.write(`\n📓 ${r.reason}\n`); process.exit(0); }

  // Default (block): block the stop and hand the instruction to the agent.
  process.stdout.write(JSON.stringify({ decision: 'block', reason: r.reason }));
  process.exit(0);
}

try { main(); } catch { process.exit(0); }   // fail-open
