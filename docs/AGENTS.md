# Agents Guide

This repository builds **Rental Studio** — a property management and renovation planning app for landlords.

## Product Snapshot

- **MVP focus:** renovation planning with interactive SVG floor plans, hotspots, layers, design variants, and share links.
- **Future:** tenant portal (magic links, issues, docs, payments, inventory).
- **Stack:** Bun, Hono, Hono JSX + HTMX, PostgreSQL + Drizzle.

## What to Build (MVP)

Agents should prioritize MVP features only:

1. Interactive SVG viewer with hotspots (data-type based).
2. Layer toggles (electrical, furniture, fixtures).
3. Design variants (multiple layouts for the same unit).
4. Secure share links for collaborators.

## Non-goals (for now)

- Tenant portal features.
- Payments and accounting.
- Advanced permissions/roles.

## How to Work

- **Keep changes minimal.** Prefer small, focused PRs.
- **Follow existing patterns** in `apps/web` and `packages/`.
- **Write issues first** (GitHub Issues in this repo) for work that changes behavior or data.

## Definition of Done

- Feature matches the MVP scope above.
- Includes tests or validation steps when relevant.
- README or docs updated only if required by the change.

## References

- `README.md` for setup and structure.
- GitHub Issues and Milestones for current scope.

## Writing style

English prose — docs, code comments, commit and PR text, issues, user-visible strings —
follows [Simplified Technical English](https://www.asd-ste100.org/) (ASD-STE100): one
meaning per word, active voice, imperative for instructions, simple tenses, one
instruction per sentence (max 20 words), no jargon or metaphor. Code identifiers are exempt.
