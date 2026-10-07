# @kitchenx/api-client

HTTP transport shared by both apps: typed client, middleware (auth header, single-flight token refresh, Idempotency-Key, request ID), ApiError mapping, pagination helpers and presigned file upload.

**Contains:** types generated from the backend OpenAPI spec, split into `/customer` and `/warehouse` entry points so the customer app can never import warehouse schemas.

**Does not contain:** endpoint functions or query hooks. Those belong to each app's features.
