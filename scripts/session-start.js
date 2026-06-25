#!/usr/bin/env node

// Vibe Scribe — session start (Claude Code "SessionStart" hook).
//
// Records a snapshot of what's already changed when the session begins, so the write-path
// safety net can later tell what changed during THIS session (vs. what was already dirty).
// (Also the future home of the "earned" briefing nudge — see TODO.) Fail-open.

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');

function readStdin() {
  try { return JSON.parse(fs.readFileSync(0, 'utf8') || '{}'); } catch { return {}; }
}
function git(args, cwd) {
  return execSync(`git ${args}`, { cwd, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
}

function main() {
  const input = readStdin();
  const cwd = input.cwd || process.cwd();

  let head = '';
  try { head = git('rev-parse HEAD', cwd); } catch { process.exit(0); }   // not a git repo → nothing to baseline

  let dirty = [];
  try {
    // Do not trim — a leading status space is significant in porcelain output.
    const out = execSync('git status --porcelain', { cwd, stdio: ['ignore', 'pipe', 'ignore'] }).toString();
    dirty = out.split('\n').filter(Boolean).map((line) => {
      const p = line.slice(3);
      const arrow = p.indexOf(' -> ');
      return (arrow >= 0 ? p.slice(arrow + 4) : p).trim();
    }).filter(Boolean);
  } catch { /* ignore */ }

  try {
    fs.writeFileSync(
      path.join(os.tmpdir(), `vibe-scribe-${input.session_id || 'unknown'}.json`),
      JSON.stringify({ head, dirty })
    );
  } catch { /* ignore */ }

  // TODO (earned briefing): when warranted (high change-volume since last session, a stale
  // overview section, or a session that ended mid-task), emit
  // {"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":"… suggest /briefing …"}}

  process.exit(0);
}

try { main(); } catch { process.exit(0); }   // fail-open
