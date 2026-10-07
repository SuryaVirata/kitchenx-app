# app (routes)

Expo Router route files go here once Expo Router is added. Route files stay thin and re-export screens from `src/features/*`.

Planned route groups:

```
_layout.tsx            startup gate + providers
(auth)/                login, OTP
(onboarding)/          business type, details, documents, pending
account-status         rejected / deactivated
(app)/
  (tabs)/              home, catalogue, cart, orders, account
  product/[id], order/[id]/…, complaint/…, offers/…, services/…,
  packaging/…, reports/…, bulk/…, outlets/…
  talk-to-x            modal, reachable from every screen
```

On web, `(app)/_layout.web.tsx` swaps the tab bar for a left sidebar (FR-CUST-101).
