# ADR 0001: Two apps in one monorepo

**Status:** Proposed
**Date:** 2026-10-07
**Source:** KitchenX PRD v0.4

## Context

PRD v0.4 defines two mobile interfaces for Phase 1: the Customer App (also delivered as the Customer Web App) and the Warehouse App (Section 02).

- The users are different: merchants buying stock vs. warehouse staff working the floor (Section 04).
- Navigation is different (Fig 5.1 vs. Fig 5.2).
- Permissions are different (Section 20).
- Device needs are different: payments, maps and AR for customers; scanning for the warehouse.
- Both apps use the same Go backend, the same auth/session model, the same error model and the same design tokens.

## Options

| Option | Summary | Verdict |
|---|---|---|
| A. One app, role-based | One binary switches experience by role | Rejected. Ships warehouse screens, schemas and permissions in a public store app, and ties warehouse releases to customer App Store review. |
| B. Two repos | Fully independent | Rejected for now. Shared transport, auth and types would need a private registry and version bumps, and would drift. Double the CI and Expo SDK upgrade work for one team. |
| C. Monorepo, two apps | `apps/customer`, `apps/warehouse`, small shared packages | **Chosen** |

## Decision

Use one pnpm-workspace monorepo (this repo, `kitchenx-app`) with:

- `apps/customer`: Expo app for iOS, Android and Web
- `apps/warehouse`: Expo app, Android-first, no web target
- `packages/api-client`, `packages/auth`, `packages/ui`, `packages/platform`: infrastructure only, no business logic
- `tooling/*`: shared configuration

Each app keeps its own bundle ID, EAS project, store listing and update channel.

## Consequences

- A backend contract change is one PR that updates shared code and both apps.
- One Expo SDK upgrade covers both apps.
- Import-boundary lint rules are required so the apps stay independent.
- Revisit if separate teams own each app, the warehouse app changes stack, or an external vendor must only see one app.
