# @kitchenx/warehouse

KitchenX warehouse app for Warehouse Supervisors and Warehouse Managers: goods receipt, picking, packing, dispatch, walk-in sales and stock counts. Android-first, iOS-capable. No web target.

```bash
pnpm --filter @kitchenx/warehouse start
```

- `src/app/` routes (thin), with manager-only routes behind a role guard
- `src/features/` one folder per feature; each README lists its PRD requirement IDs
- `src/scanning/` scanner interface and implementations
- `src/outbox/` drafts and idempotent mutation queue
- `src/shell/`, `src/lib/`, `e2e/` same as the customer app
