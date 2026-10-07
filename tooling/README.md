# tooling

Shared configuration packages, used by apps and packages as dev dependencies.

- `tsconfig/strict.json` strictness flags shared by every workspace (`strict`, `noUncheckedIndexedAccess`)
- `tsconfig/base.json` full config for shared packages (extends `strict.json`)

Apps extend `["expo/tsconfig.base", "@kitchenx/tsconfig/strict.json"]`, so they keep Expo's module and JSX settings and get the same strictness as the packages.

Still to come: `eslint-config/` (including import-boundary rules: apps must not import each other, packages must not import apps, the customer app must not import warehouse API types) and `jest-preset/`.
