---
name: kitchenx-customer-prototype
description: >-
  Rules for every KitchenX customer-app change. Use when adding a feature,
  fixing a bug, or changing screens, layout, navigation, copy, images, or
  local data in kitchenx-app. Also use for screenshots, reuse, stale code,
  brand fonts, Gabriel Sans, Degular, and later backend wiring. Confirm a
  bug exists before fixing it, and search for an existing feature before
  starting a new one.
---

# KitchenX customer prototype

This repo is the customer app only. The work now is a tappable frontend prototype of the real app. Do not build admin or warehouse apps here. Do not connect a backend unless the user asks.

A later backend replaces local data only. Screen components stay. These rules are the only copy. Do not restate them in another file.

## Before a bug fix

1. Reproduce the bug on the running customer app before editing.
2. Record the proof: screen, what you tapped, and what showed up. Name the file that owns that screen.
3. If you cannot reproduce it, stop. Report that. Do not patch from the claim alone.
4. After the change, repeat the same steps and show the bug is gone.

## Before a new feature

1. Search `apps/customer/src/features`, `apps/customer/src/shell/AppRouter.tsx`, `apps/customer/assets`, and `apps/customer/src/theme/theme.ts`.
2. If that screen, flow, or control already exists, extend it. Do not start a second copy.
3. Read that feature's README and its PRD ids. If `docs/open-questions.md` still blocks the feature, stop. Do not invent the product rule.
4. Read `theme.ts` and a nearby screen before writing a new one.

## Where code goes

- Screen UI: `apps/customer/src/features/<area>/`
- One thin route per screen: `apps/customer/src/app/`
- Navigation: `apps/customer/src/shell/AppRouter.tsx`
- Shared session values (city, mobile destination, business type): `apps/customer/src/shell/CustomerSession.tsx`
- Images: `apps/customer/assets/`
- Repeated colour, type, button, field, and card styles: `apps/customer/src/theme/theme.ts` and `apps/customer/src/ui/Text.tsx`

Do not put screen layout back into a single root component. Do not switch the app entry to `expo-router/entry`. Expo Router is installed, but its web bundle needs the `lightningcss` native module, which Windows Application Control blocks on this machine. Keep using `AppRouter`.

Shared packages (`api-client`, `auth`, `ui`, `platform`) hold infrastructure only. Business UI and feature data stay in the customer app. Apps never import from each other. Packages never import from apps. The backend owns stock, GST, ETA, promotions, and phase flags. This app displays results.

## Reuse

- A colour, size, label, list, or component used twice lives in the theme, `src/ui`, or that feature's one data list. The screen imports it.
- Do not copy a config block into the new file.
- Do not add a library for something the repo already does.
- Pass data into the screen as props. One list per feature for prices, stock, and addresses. Do not hard-code a second copy inside the layout.

## Code shape

- Delete unused files, unused assets, commented-out blocks, and the old screen when you replace it.
- Do not leave scaffold or boilerplate the screen does not use.
- A comment only when the reason is not obvious from the code. Do not restate the PRD or narrate the change.
- TypeScript stays strict. Do not silence a type with `any`.
- Do not commit secrets. `EXPO_PUBLIC_*` values are public.

## Prototype now, backend later

Keep every new screen reachable by tapping. Use local state or a constant list in that feature.

The screen does not fetch. One module in the feature owns the list or action a later API will replace. Do not shape the screen so that wiring the backend means a rewrite.

If a provider is not connected, continue to the next screen. Do not block the demo with a "not connected" error. Do not show a message that the server saved, charged, or verified something when it did not.

## When the user attaches a screenshot

The screenshot decides layout, order, copy, and what is on the screen. The KitchenX theme decides colour, type, buttons, fields, and cards.

1. Reuse a nearby screen. Rebuild with `colors` from the theme and `Text` / `TextInput` from `apps/customer/src/ui/Text.tsx`.
2. Do not copy the screenshot's font, a second orange, glass, blur, or a desktop layout.
3. Do not paste hex values or `fontFamily` into the screen. Weight 600 and above is the heading role. Other text is the body role.
4. Keep it tappable with local data. Do not add a backend call.

## Visual rules

Match the screens already in the app. Do not invent a new visual system.

- Import `colors`. Do not paste a second copy of the hex values into a screen.
- Background `colors.white` (`#FFFFFF`).
- Primary orange `colors.orange` (`#FF4F18`) for buttons, active icons, prices, links, and focus.
- Selected delivery mode `#1B2430` with white text. Unselected mode is light gray with dark text.
- Text `colors.ink` (`#141517`). Secondary text `#6B7280`.
- Fields `colors.field` (`#F2F4F7`), radius 16, no heavy borders.
- Selected card: 1.5px `#FF4F18` border, fill `#FFF1EC`.
- Unselected card: white fill, border `#E4E6EB`.
- Errors `#D92D20`. Positive status `#1B9E4B`.
- Buttons: height 54, radius 16, white bold label. Disabled button `#E8EAEE` with label `#98A2B3`.
- Horizontal padding 16 or 20. Same left and right edge on a screen.
- No glass, blur, translucent cards, or desktop multi-column layouts.

Phone first. The layout must still work at 320px wide and on a tablet. On width over 600, keep one centered column no wider than 480. Do not stretch the phone UI across a tablet.

The focused field must stay visible when the keyboard opens. Use the real keyboard type: phone pad for a mobile number, number pad for OTP and PIN, default text for names and addresses. Do not draw a fake keyboard.

## Images

Reuse files in `apps/customer/assets/`. Do not add a new photo larger than 400 KB. When you touch an existing image over 1 MB, compress it and check the screen still looks the same. Prefer PNG with transparency for cut-out products and the logo. Do not generate a replacement illustration when an asset already exists.

## Before you finish

1. Open the customer web app and tap through the path you changed.
2. For a bug, use the same steps that proved it. For a screen, check 393px wide and 320px wide. If the layout is a full screen, also check a tablet width.
3. Confirm the primary button is not hidden behind the bottom bar or the keyboard.

## Fonts

The brand guidelines name the fonts. The PRD does not. The customer app is not using either brand font yet.

- Primary font in the guidelines: Gabriel Sans. Secondary: Degular Variable.
- The PDF does not list a weight scale. It only embeds Gabriel Sans Trial Normal and Degular Variable Text Thin. Poppins Regular is inside the PDF and is not a named brand font.
- Guideline colours are `#ff4f18`, `#141517`, and `#f2f4f7`, plus an orange gradient. No icon set is named.
- Heading role is Gabriel Sans once that licensed file is added. Body role is Degular once that licensed file is added. Until then both roles load Inter.
- Do not ship the trial fonts from the PDF.
