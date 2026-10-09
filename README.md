# kitchenx-app

Native **React Native (Expo)** app for **KitchenX**, including RN web.

KitchenX is a B2B supply platform for the food and beverage trade — restaurants, bakeries, ice-cream parlours, cloud kitchens, sweet shops, catering units, and similar businesses — that order staples and kitchen essentials (fresh produce, dairy, proteins, pantry goods, packaging, and more) in bulk. KitchenX operates its own warehouse(s), holds inventory, and fulfils orders through its own delivery fleet on scheduled routes or through third-party logistics partners. Launch market: Hyderabad; next market: Bengaluru.

This repo is a **monorepo with two Expo apps** and a few small shared packages:

| App | Users | Targets |
|---|---|---|
| [`apps/customer`](apps/customer) | Restaurants, bakeries, shops and other F&B merchants | iOS, Android, Web (React Native Web) |
| [`apps/warehouse`](apps/warehouse) | Warehouse Supervisors and Warehouse Managers | Android-first, iOS-capable |

The admin consoles (Platform, Finance, Technical, RM view) live in `kitchenx-dashboard`, not here. Why two apps in one repo: [ADR 0001](docs/adr/0001-monorepo-two-apps.md).

There is no Labha analogue (Labha is web-only). The name **`kitchenx-app`** follows Labha kebab-case (`labha-dashboard`, `labha-storefront`) and is preferred over `kitchenx-web-app` because the product is native mobile first, with RN web as an additional target.

## Repository layout

```
apps/
  customer/              Customer app (iOS, Android, Web)
    src/app/             routes (thin; Expo Router)
    src/features/        one folder per feature, each README lists its PRD requirement IDs
    src/shell/           providers, startup, guards
    src/lib/             app-specific instances of shared packages
    e2e/                 Maestro flows
  warehouse/             Warehouse app
    src/…                same layout, plus:
    src/scanning/        Scanner interface (camera now, hardware scanners later)
    src/outbox/          drafts + idempotent mutation queue
packages/
  api-client/            HTTP transport, auth middleware, errors, uploads, generated API types
  auth/                  token storage, session, refresh
  ui/                    design tokens and basic UI components
  platform/              env config, logging, analytics, storage, push, i18n
tooling/
  tsconfig/              shared TypeScript config
docs/
  architecture.md        architecture summary
  open-questions.md      PRD gaps that block parts of the design
  adr/                   architecture decision records
```

Rules:

- Shared packages hold infrastructure only. Business components and rules stay in their app; business rules (stock, GST, ETA, promotions, phase flags) are owned by `kitchenx-backend-go`.
- Apps never import from each other. Packages never import from apps.

## Stack

- React Native + Expo (SDK 57), TypeScript strict
- pnpm workspaces
- React Native Web for the customer web app
- Node `>=20`

Planned libraries and decisions are listed in [docs/architecture.md](docs/architecture.md).

## Local setup

```bash
corepack enable          # provides pnpm
pnpm install
pnpm customer            # customer app dev server
pnpm customer:web        # customer web dev server; keep this terminal open for hot reload
pnpm customer:web:clear  # same as above, but clears Metro cache first
pnpm warehouse           # warehouse app dev server
pnpm --filter @kitchenx/customer web
pnpm typecheck
```

## Sibling repositories

| Repository | Purpose |
|---|---|
| [kitchenx-infra](https://github.com/samrit-internal/kitchenx-infra) | Terraform / cloud infrastructure |
| [kitchenx-database-postgres](https://github.com/samrit-internal/kitchenx-database-postgres) | PostgreSQL schema and migrations |
| [kitchenx-backend-go](https://github.com/samrit-internal/kitchenx-backend-go) | Go HTTP API (Fiber modular monolith) |
| [kitchenx-dashboard](https://github.com/samrit-internal/kitchenx-dashboard) | Admin dashboard (React + Vite) |
| [kitchenx-marketing-site](https://github.com/samrit-internal/kitchenx-marketing-site) | Public marketing site (Next.js) |
| [kitchenx-app](https://github.com/samrit-internal/kitchenx-app) | React Native (Expo) monorepo: customer app (mobile + web) and warehouse app |

Naming note: the mobile repo is `kitchenx-app` (not `kitchenx-web-app`) so it stays kebab-case like Labha (`labha-dashboard`, `labha-storefront`) and does not imply a web-only app.
