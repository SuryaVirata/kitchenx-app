# tooling

Shared configuration packages, used by apps and packages as dev dependencies.

- `tsconfig/` base TypeScript config for shared packages (the apps extend `expo/tsconfig.base`)

Still to come: `eslint-config/` (including import-boundary rules: apps must not import each other, packages must not import apps, the customer app must not import warehouse API types) and `jest-preset/`.
