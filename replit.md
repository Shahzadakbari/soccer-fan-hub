# TacticHub

TacticHub helps football managers browse players, track scouting targets, and manage a transfer budget.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/soccer-fan-hub run dev` — run the Soccer Fan Hub web app
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

_Populate as you build — short repo map plus pointers to the source-of-truth file for DB schema, API contracts, theme files, etc._

## Architecture decisions

- Phases One through Four use local browser state and a bundled player directory. Manager profiles, squad, watchlist, and scouting notes are stored in this browser; this prototype's sign-in is not production authentication.
- The product roadmap has five phases. Phase Four is the current scope; keep the remaining phase modules as placeholders until the user provides their requirements.

## Product

The manager dashboard summarizes the transfer budget, squad value, and scouting watchlist. The player directory supports search, position filtering, watchlist toggles, and budget-checked squad additions. Manager profiles support local sign-up, sign-in, demo access, and saved squad state. Player profiles include skill attributes and personal scouting notes; comparisons and lineup building remain future-phase placeholders.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
