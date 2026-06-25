// Vibe Scribe — shared change-detection for the write-path safety net.
//
// Used by BOTH the Claude Code hooks (scripts/) and the Cursor hooks (.cursor/hooks/), so the
// git logic — and bugs like the porcelain-trim fix — live in exactly one place. Tool-specific
// input/output (Claude's stop_hook_active/decision vs Cursor's loop_count/followup_message) stays
// in each hook's thin wrapper; the gate is here.

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');

const DOC_FILES = ['dev-journal.md', 'system-overview.md'];

function git(args, cwd) {
  return execSync(`git ${args}`, { cwd, stdio: ['ignore', 'pipe', 'ignore'] }).toString();
}
function isGitRepo(cwd) {
  try { git('rev-parse --is-inside-work-tree', cwd); return true; } catch { return false; }
}
function head(cwd) {
  try { return git('rev-parse HEAD', cwd).trim(); } catch { return ''; }
}
// Parse `git status --porcelain`. Do NOT trim the output — a leading status space is significant.
function parsePorcelain(out) {
  return out.split('\n').filter(Boolean).map((line) => {
    const p = line.slice(3);                 // 2 status chars + space, then path
    const arrow = p.indexOf(' -> ');         // "R  old -> new" renames
    return (arrow >= 0 ? p.slice(arrow + 4) : p).trim();
  }).filter(Boolean);
}
function changedFiles(cwd) {
  try { return parsePorcelain(git('status --porcelain', cwd)); } catch { return []; }
}
function loadConfig(cwd) {
  try { return JSON.parse(fs.readFileSync(path.join(cwd, '.vibe-scribe.json'), 'utf8')) || {}; }
  catch { return {}; }
}
function baselinePath(key) {
  return path.join(os.tmpdir(), `vibe-scribe-${key || 'unknown'}.json`);
}

// Record what's already changed at the start of a session (keyed by session/conversation id),
// so assess() can scope to THIS session's changes.
function recordBaseline(cwd, key) {
  if (!isGitRepo(cwd)) return;
  try { fs.writeFileSync(baselinePath(key), JSON.stringify({ head: head(cwd), dirty: changedFiles(cwd) })); }
  catch { /* ignore */ }
}

// Did this session change source files but leave the living docs untouched?
// Returns { needsUpdate, sourceChanged, reason }.
function assess(cwd, key) {
  if (!isGitRepo(cwd)) return { needsUpdate: false, sourceChanged: [] };

  let baseDirty = [];
  try { baseDirty = JSON.parse(fs.readFileSync(baselinePath(key), 'utf8')).dirty || []; }
  catch { /* no baseline → treat all current changes as this session's */ }

  const baseSet = new Set(baseDirty);
  const sessionChanges = changedFiles(cwd).filter((f) => !baseSet.has(f));
  const isDoc = (f) => DOC_FILES.includes(path.basename(f));
  const isCfg = (f) => path.basename(f) === '.vibe-scribe.json';
  const sourceChanged = sessionChanges.filter((f) => !isDoc(f) && !isCfg(f));
  const docsTouched = sessionChanges.some(isDoc);

  if (sourceChanged.length === 0 || docsTouched) return { needsUpdate: false, sourceChanged: [] };

  const shown = sourceChanged.slice(0, 12).join(', ') + (sourceChanged.length > 12 ? ', …' : '');
  const reason =
    `Vibe Scribe: this session changed ${sourceChanged.length} file(s) (${shown}) but the living ` +
    `docs weren't updated. Before stopping, follow the Vibe Scribe protocol — append a dev-journal.md ` +
    `entry (what changed and why) and revise the affected system-overview.md sections + Lexicon ` +
    `(refresh "Last verified"). Keep it concise. Then stop.`;
  return { needsUpdate: true, sourceChanged, reason };
}

module.exports = { assess, recordBaseline, loadConfig, isGitRepo };
