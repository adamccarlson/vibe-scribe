#!/usr/bin/env node

// Vibe Scribe — install banner. Printed on npm install and by the setup skill (Step 0).
// Kept intentionally light: Vibe Scribe's whole ethos is plain text.

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const CYAN = '\x1b[38;5;75m';
const WHITE = '\x1b[38;5;255m';
const GRAY = '\x1b[38;5;242m';
const GREEN = '\x1b[38;5;114m';

const banner = `
${CYAN}${BOLD}   ┌─────────────────────────────────────────────┐${RESET}
${CYAN}${BOLD}   │   V I B E   S C R I B E                     │${RESET}
${CYAN}${BOLD}   └─────────────────────────────────────────────┘${RESET}
${WHITE}${BOLD}   Never lose your place.${RESET}
${GRAY}   ───────────────────────────────────────────────${RESET}
${DIM}   A self-maintaining dev journal + system overview that${RESET}
${DIM}   keeps your project's understanding in the repo — readable${RESET}
${DIM}   by you and by any AI, across every session, tool, and reboot.${RESET}
${GRAY}   ───────────────────────────────────────────────${RESET}

${WHITE}${BOLD}   Skills${RESET}
${GREEN}   /briefing${RESET}  ${DIM}Have your codebase explain itself — what it is, what changed, what's healthy${RESET}
${GREEN}   /sync${RESET}      ${DIM}Re-audit the docs against reality; flag drift; refresh "Last verified"${RESET}

${WHITE}${BOLD}   Get started${RESET}
${GRAY}   Claude Code:${RESET} ${GREEN}/vibe-scribe-setup${RESET}
${GRAY}   Codex:${RESET}       ${GREEN}$vibe-scribe:vibe-scribe-setup${RESET} ${DIM}(or describe it)${RESET}
${GRAY}   Cursor:${RESET}      ${GREEN}/vibe-scribe-setup${RESET} ${DIM}(or describe it)${RESET}
${GRAY}   ───────────────────────────────────────────────${RESET}
${DIM}   By Adam Carlson${RESET}
`;

console.log(banner);
