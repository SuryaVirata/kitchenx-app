# Open questions from PRD v0.4

PRD gaps that affect the mobile architecture. Each one needs an answer from the product owner before the related feature is built.

| # | Topic | PRD reference | Question | Affects |
|---|---|---|---|---|
| 1 | Delivery agent | FR-CUST-097, FR-CUST-073, FR-FIN-037, FR-CUST-030 | Who records live location, per-item delivery consent, COD cash and "Delivered", and on which device? No driver persona exists. | Possibly a third app in `apps/` |
| 2 | Warehouse Web Console | Section 04, FR-WH-059 | Is it Phase 1, and which screens does it have? | `kitchenx-dashboard` vs. this repo |
| 3 | Warehouse connectivity | SYS-01, SYS-04, FR-WH-059 | What is Wi-Fi coverage on the floor, and what should happen during an outage? | `apps/warehouse/src/outbox` |
| 4 | Pack-station camera | FR-WH-051, FR-WH-056 | How does the app start and confirm the fixed-camera recording? Who uploads from the NAS? | `features/packing` |
| 5 | Printing | FR-WH-057, FR-WH-060 | Printer models; who sends print jobs; counter printer for walk-in sales? | `features/packing`, `features/offline-sale` |
| 6 | Barcode/QR standards | FR-WH-003, FR-WH-011, FR-WH-014 | Which symbologies? Vendor barcodes or KitchenX labels? Are racks and orders labelled? | `src/scanning` |
| 7 | Warehouse devices | Section 04 | Phones or rugged scanners? Android only? Tablets? Minimum OS? | `src/scanning`, layouts |
| 8 | Staff login | FR-TAD-001 | OTP, password or SSO? Session lifetime? Shared devices? | `features/auth`, `@kitchenx/auth` |
| 9 | Customer session lifetime | FR-CUST-001 | Access/refresh token policy | `@kitchenx/auth` |
| 10 | Reservation vs. payment | FR-SYS-001, FR-CUST-014 | Is a prepaid order confirmed before or after payment? How long is stock held for a failed payment? | `features/checkout` |
| 11 | Payment gateways | FR-CUST-014 | Razorpay and Cashfree: which one when? | `features/checkout` |
| 12 | Multi-outlet cart | FR-CUST-005, FR-CUST-013, FR-CUST-082 | Is the cart per outlet or per account? Does one Excel upload split into one order per outlet? | `features/cart`, `features/outlets` |
| 13 | Pending accounts | FR-CUST-004, FR-PAD-026 | What can a merchant do before approval? | `features/onboarding`, navigation |
| 14 | Bulk Excel on mobile | FR-CUST-081 vs. FR-CUST-082 | Web only, or also mobile? | `features/bulk` |
| 15 | AI 360° / AR | FR-CUST-075, FR-CUST-076, FR-SYS-012 | AI provider, output format (GLB/USDZ/images), generation time | `features/packaging` |
| 16 | Talk to X | FR-CUST-078, FR-CUST-079 | In-house or vendor SDK? Streaming replies? | `features/support` |
| 17 | Push provider | Section 21 | FCM/APNs directly? | `@kitchenx/platform` |
| 18 | Referral before install | FR-CUST-099, FR-CUST-104 | Is manual code entry enough, or is an install-attribution provider needed? | `features/onboarding`, `features/offers` |
| 19 | Price variance at goods receipt | FR-WH-048 | Is the unit price typed in, or read from a photo of the bill? | `features/goods-receipt` |
| 20 | Initial stock load, inward bills | FR-WH-005, FR-WH-049 | Mobile or web? | `features/stock-count` |
| 21 | Requirement text missing in v0.4 | FR-CUST-016/061/066/067/068/088/090, FR-WH-008/041–045, FR-PAD-021/024/025/029, FR-SYS-009, FR-TAD-001/002 | Referenced as "restored from v.03" but full text is not in v0.4 | Acceptance criteria |
| 22 | API contract | — | Will `kitchenx-backend-go` publish an OpenAPI spec? | `@kitchenx/api-client` |
| 23 | Monthly AI outreach | FR-CUST-070 | Is there an in-app screen, or is it WhatsApp/SMS only? | Possibly none |
