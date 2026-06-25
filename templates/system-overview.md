# System Overview

> The **map**: current state, revised in place (not appended). Describes the system *as it
> actually runs today*. Every entry carries a `Last verified` date — an old date means treat
> that entry as suspect and re-verify before relying on it.

## What this is

<!-- One plain-language paragraph: what the system does, for whom, the big picture. -->

## Conceptual framework

<!-- Optional ASCII orientation diagram: architecture + logic + hardware/infra at a glance.
     The front door. Revisit only when the system's fundamental shape changes. -->

## Component catalog

<!-- Per component: what it is · where it runs · health check · what breaks if it's down ·
     gotchas · Last verified. Use the Lexicon handle as the heading. -->

## Dependency map

<!-- ASCII topology: what's wired to what. "If X is down, you lose Y."
     Label each edge with a short plain-language relationship, not a bare arrow, e.g.:
       Client ──(calls)──▶ The Gatekeeper ──(hands off to)──▶ The Concierge
                                                  │
                                          (owns the data in)
                                                  ▼
                                              The Vault
     Common labels: calls / sends to · owns the data for / reads from / writes to · triggers /
     notifies · depends on / requires · wraps / extends · replaces / supersedes. -->


## Runbook

<!-- Known failure modes and how to recover. Grows by one entry every time a bug is fixed. -->

## Lexicon

> Coined handles for the parts of this system. Each: **Handle** → `anchor` — plain definition (Last verified: date).
> The handle is a stable pointer; if the code moves, update the anchor, keep the name.

### Live

<!-- The Gatekeeper → `src/auth/` — checks who you are before any request runs. (Last verified: YYYY-MM-DD) -->

### Retired (tombstones)

<!-- The Courier → RETIRED YYYY-MM-DD → now part of **the Concierge**. See journal entry of that date.
     Write-once; kept for resolution and for resurrecting/forking past designs. -->
