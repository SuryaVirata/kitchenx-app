# app (routes)

Expo Router route files go here once Expo Router is added. Route files stay thin and re-export screens from `src/features/*`.

Planned route groups:

```
_layout.tsx            startup gate + providers
(auth)/                staff login
(app)/
  index                dashboard (tiles filtered by role)
  goods-receipt/, picking/, packing/, dispatch/, offline-sale/, alerts/, outbox/
  (manager)/           layout guarded by RequireRole(WH_MANAGER)
    approvals/, routes/, stock-count/, reports/
```

The server enforces roles. The route guard is for UX only.
