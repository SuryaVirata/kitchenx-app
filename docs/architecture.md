# Mobile architecture (summary)

Based on KitchenX PRD v0.4. Decisions marked *(proposed)* still need sign-off.

## What is in this repo

| Interface | Here? | Notes |
|---|---|---|
| Customer Mobile App | Yes | `apps/customer` (iOS, Android) |
| Customer Web App | Yes *(proposed)* | `apps/customer` via React Native Web |
| Warehouse Mobile App | Yes | `apps/warehouse` |
| Warehouse Web Console | Open question | Mentioned in Section 04 and FR-WH-059 but not in scope list |
| Platform / Finance / Technical Admin, RM view | No | `kitchenx-dashboard` |
| Starter Kit / Procurement Audit lead forms | No | `kitchenx-marketing-site` |

## Main decisions *(proposed)*

| Decision | Choice |
|---|---|
| Framework | Expo (SDK 57) with prebuild, dev clients, EAS |
| Language | TypeScript, strict |
| Routing | Expo Router; route files stay thin and re-export feature screens |
| Server state | TanStack Query (catalogue, stock, server-side cart, ETA, orders, config) |
| Client state | Zustand (session snapshot, active outlet, UI flows) |
| API | Types generated from the backend OpenAPI spec; shared transport in `@kitchenx/api-client`; endpoints owned by features |
| Storage | expo-secure-store (tokens), MMKV (preferences), expo-sqlite (warehouse drafts and outbox) |
| Scanning | expo-camera behind a `Scanner` interface |
| Push | expo-notifications, sending native FCM/APNs tokens to the backend |
| Maps | react-native-maps (Google) with a web variant |
| AR | AR Quick Look / Scene Viewer with server-provided models |
| Testing | Jest + React Native Testing Library + MSW; Maestro for E2E |
| CI/CD | GitHub Actions for PR checks; EAS Build/Update/Submit per environment |

## Rules

1. **The backend owns business rules.** Stock reservation and decrement, GST, ETA and delivery partner choice, promotions, referral credit, phase flags and roles are server-side. The apps display results.
2. **Phase flags and business settings come from the server at runtime** (SYS-15, SYS-17, FR-TAD-006), so switching to Phase 2 needs no app release.
3. **"Offline sale" means walk-in selling, not network-offline.** Stock-changing actions need a live server confirmation (SYS-01, SYS-04, FR-WH-059). The warehouse app keeps drafts and an idempotent outbox to survive network drops.
4. **Every mutation carries an `Idempotency-Key`**, so retries never move stock twice or create two invoices.
5. **Shared packages hold infrastructure only.** Business components stay in their app.
6. **Fulfilment mode is never sent to or shown in the customer app** (SYS-11).

## Environments *(proposed)*

Development, QA, Staging and Production, each with its own EAS build profile, bundle ID suffix, API URL and update channel. Secrets live in EAS environment variables, never in git. `EXPO_PUBLIC_*` values are public.

See [open-questions.md](open-questions.md) for PRD gaps that block parts of this design.
