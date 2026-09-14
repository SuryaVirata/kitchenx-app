# kitchenx-app

Native **React Native (Expo)** app for **KitchenX**, including RN web.

KitchenX is a B2B supply platform for the food and beverage trade — restaurants, bakeries, ice-cream parlours, cloud kitchens, sweet shops, catering units, and similar businesses — that order staples and kitchen essentials (fresh produce, dairy, proteins, pantry goods, packaging, and more) in bulk. KitchenX operates its own warehouse(s), holds inventory, and fulfils orders through its own delivery fleet on scheduled routes or through third-party logistics partners. Launch market: Hyderabad; next market: Bengaluru.

This repo will host the customer app/web and warehouse app surfaces described in the KitchenX PRD. There is no Labha analogue (Labha is web-only); the name **`kitchenx-app`** follows Labha kebab-case (`labha-dashboard`, `labha-storefront`) and is preferred over `kitchenx-web-app` because the product is native mobile first, with RN web as an additional target.

## Stack

- React Native + Expo (blank TypeScript template)
- React Native web (`npm run web`)
- Node `>=20`

## Local setup

```bash
npm install
npm start          # Expo dev server
npm run ios        # iOS simulator
npm run android    # Android emulator
npm run web        # RN web
```

## Sibling repositories

| Repository | Purpose |
|---|---|
| [kitchenx-infra](https://github.com/samrit-internal/kitchenx-infra) | Terraform / cloud infrastructure |
| [kitchenx-database-postgres](https://github.com/samrit-internal/kitchenx-database-postgres) | PostgreSQL schema and migrations |
| [kitchenx-backend-go](https://github.com/samrit-internal/kitchenx-backend-go) | Go HTTP API (Fiber modular monolith) |
| [kitchenx-dashboard](https://github.com/samrit-internal/kitchenx-dashboard) | Admin dashboard (React + Vite) |
| [kitchenx-marketing-site](https://github.com/samrit-internal/kitchenx-marketing-site) | Public marketing site (Next.js) |
| [kitchenx-app](https://github.com/samrit-internal/kitchenx-app) | React Native (Expo) customer, warehouse, and RN web |

Naming note: the mobile repo is `kitchenx-app` (not `kitchenx-web-app`) so it stays kebab-case like Labha (`labha-dashboard`, `labha-storefront`) and does not imply a web-only app.
