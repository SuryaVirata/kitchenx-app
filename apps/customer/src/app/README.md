# app (routes)

Each file renders one screen from `src/features` or `src/shell`. Navigation lives in `src/shell/AppRouter.tsx`.

```
_layout.tsx                 session, splash, current route
index.tsx                   welcome
(auth)/login.tsx            mobile number
(auth)/otp.tsx              one-time code
(onboarding)/business.tsx   business type
(onboarding)/needs.tsx      what the business buys
(onboarding)/location.tsx   city and pin
(shop)/shop.tsx             customer home
(shop)/delivery.tsx         delivery location
```

Expo Router is the usual file-based router for Expo. It is installed, but this machine cannot bundle it: Windows Application Control blocks the `lightningcss` native module that Expo Router's web build requires. The route files above are the structure we follow until that module can load.
