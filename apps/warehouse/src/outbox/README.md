# outbox

Local drafts and an idempotent mutation queue (SQLite).

- Drafts keep in-progress forms (goods receipt, offline-sale basket, pick progress) safe across crashes and network drops.
- Every stock-changing request carries a client-generated `Idempotency-Key` that is saved before sending, so retries can never move stock twice or create two invoices.
- Stock-changing actions need a live server confirmation (SYS-01, SYS-04, FR-WH-059). This is not offline-first sync. The server always wins on conflicts, and rejected items show up under "Needs attention".
