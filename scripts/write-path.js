#!/usr/bin/env node

// Vibe Scribe — write-path safety net (Claude Code "Stop" hook).
//
// Plain English: when you finish working, this quietly checks whether you changed code
// this session but didn't update the living docs. If so (and only then), it asks the AI to
// jot the update down before wrapping up. If the docs were already updated — the normal case —
// it stays completely silent. Strict by default; dial it down via .vibe-scribe.json.
//
// Fail-open: any error just lets the session end. A broken safety net must never block you.

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');

const DOC_FILES = ['dev-journal.md', 'system-overview.md'];

function readStdin() {
  try { return JSON.parse(fs.readFileSync(0, 'utf8') || '{}'); } catch { return {}; }
}
function git(args, cwd) {
  return execSync(`git ${args}`, { cwd, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
}
function isGitRepo(cwd) {
  try { git('rev-parse --is-inside-work-tree', cwd); return true; } catch { return false; }
}
function changedFiles(cwd) {
  // NOTE: do NOT trim the porcelain output — the first two chars are the status field and
  // a leading space (unstaged change) is significant; trimming it eats the first path char.
  let out;
  try { out = execSync('git status --porcelain', { cwd, stdio: ['ignore', 'pipe', 'ignore'] }).toString(); }
  catch { return []; }
  return out.split('\n').filter(Boolean).map((line) => {
    const p = line.slice(3);                 // porcelain: 2 status chars + space, then path
    const arrow = p.indexOf(' -> ');         // handle "R  old -> new" renames
    return (arrow >= 0 ? p.slice(arrow + 4) : p).trim();
  }).filter(Boolean);
}
function loadConfig(cwd) {
  try { return JSON.parse(fs.readFileSync(path.join(cwd, '.vibe-scribe.json'), 'utf8')) || {}; }
  catch { return {}; }
}
function baselinePath(sessionId) {
  return path.join(os.tmpdir(), `vibe-scribe-${sessionId || 'unknown'}.json`);
}

function main() {
  const input = readStdin();

  // Loop guard: if we already asked for an update once this stop, let it end.
  if (input.stop_hook_active) process.exit(0);

  const cwd = input.cwd || process.cwd();
  const mode = loadConfig(cwd).enforcement || 'block';   // block | nudge | off
  if (mode === 'off') process.exit(0);
  if (!isGitRepo(cwd)) process.exit(0);                  // can't detect changes → stay silent

  // What was already changed at session start (recorded by session-start.js)?
  let baseDirty = [];
  try { baseDirty = (JSON.parse(fs.readFileSync(baselinePath(input.session_id), 'utf8')).dirty) || []; }
  catch { /* no baseline → treat all current changes as this session's */ }

  const baseSet = new Set(baseDirty);
  const sessionChanges = changedFiles(cwd).filter((f) => !baseSet.has(f));

  const isDoc = (f) => DOC_FILES.includes(path.basename(f));
  const isOwnConfig = (f) => path.basename(f) === '.vibe-scribe.json';
  const sourceChanged = sessionChanges.filter((f) => !isDoc(f) && !isOwnConfig(f));
  const docsTouched = sessionChanges.some(isDoc);

  // Silent unless you changed source this session AND the docs weren't updated.
  if (sourceChanged.length === 0 || docsTouched) process.exit(0);

  const shown = sourceChanged.slice(0, 12).join(', ') + (sourceChanged.length > 12 ? ', …' : '');
  const reason =
    `Vibe Scribe: this session changed ${sourceChanged.length} file(s) (${shown}) but the living ` +
    `docs weren't updated. Before stopping, follow the Vibe Scribe protocol — append a dev-journal.md ` +
    `entry (what changed and why) and revise the affected system-overview.md sections + Lexicon ` +
    `(refresh "Last verified"). Keep it concise. Then stop.`;

  if (mode === 'nudge') {
    // Don't block — surface a reminder and let the session end. (Exact surfacing of a
    // non-blocking Stop message may need refinement when we build/test on Claude Code.)
    process.stderr.write(`\n📓 ${reason}\n`);
    process.exit(0);
  }

  // Default: block the stop and hand the instruction to the agent to act on.
  process.stdout.write(JSON.stringify({ decision: 'block', reason }));
  process.exit(0);
}

try { main(); } catch { process.exit(0); }   // fail-open
