---
name: kitchenx-customer-prototype
description: >-
  Builds KitchenX customer mobile prototype screens with the existing UI and
  UX. Use when adding or changing customer app screens, layout, navigation,
  copy, or images in kitchenx-app, including requests about consistency,
  phone or tablet layout, prototype data, brand guidelines, fonts, Gabriel Sans,
  Degular, or handing the UI to a backend later.
---

# KitchenX customer prototype

This repo is the customer app only. The work now is a tappable screen prototype. Do not build admin or warehouse apps here. Do not connect a backend unless the user asks.

A later backend, possibly from another repo, should replace the local data only. Keep the screen components reusable.

## Where code goes

- Screen UI: `apps/customer/src/features/<area>/`
- One thin route per screen: `apps/customer/src/app/`
- Navigation: `apps/customer/src/shell/AppRouter.tsx`
- Shared session values (city, mobile destination, business type): `apps/customer/src/shell/CustomerSession.tsx`
- Images: `apps/customer/assets/`

Do not put screen layout back into a single root component. Do not switch the app entry to `expo-router/entry`. Expo Router is installed, but its web bundle needs the `lightningcss` native module, which Windows Application Control blocks on the current machine. Keep using `AppRouter`.

## Visual rules

Match the screens already in the app. Do not invent a new visual system.

- Brand colours and font names live in `apps/customer/src/theme/theme.ts`. Import them. Do not paste a second copy of the hex values into a screen.
- Background `#FFFFFF`.
- Primary orange `#FF4F18` for buttons, active icons, prices, links, and focus.
- Selected delivery mode `#1B2430` with white text. Unselected mode is light gray with dark text.
- Text `#17171A`. Secondary text `#6B7280`.
- Fields `#F3F4F6`, radius 16, no heavy borders.
- Selected card: 1.5px `#FF4F18` border, fill `#FFF1EC`.
- Unselected card: white fill, border `#E4E6EB`.
- Errors `#D92D20`. Positive status `#1B9E4B`.
- Buttons: height 54, radius 16, white bold label. Disabled button `#E8EAEE` with label `#98A2B3`.
- Horizontal padding 16 or 20. Same left and right edge on a screen.
- No glass, blur, translucent cards, or desktop multi-column layouts.

Phone first. The layout must still work at 320px wide and on a tablet. On width over 600, keep one centered column no wider than 480. Do not stretch the phone UI across a tablet.

The focused field must stay visible when the keyboard opens. Use the real keyboard type: phone pad for a mobile number, number pad for OTP and PIN, default text for names and addresses. Do not draw a fake keyboard.

## Prototype behaviour

Every new screen must be reachable by tapping. Use local state or a constant list in that feature. Pass data into the screen as props so a later API call can replace the constant.

If a provider is not connected, continue to the next screen. Do not block the demo with a "not connected" error. Do not show a message that says the server saved, charged, or verified something when it did not.

Do not hard-code a second copy of prices, stock, or addresses inside the layout. One data list per feature.

## Images

Reuse files in `apps/customer/assets/`. The folder is already about 45 MB. Do not add new photos larger than 400 KB. When you touch an existing image over 1 MB, compress it and check the screen still looks the same. Prefer PNG with transparency for cut-out products and the logo. Do not generate a replacement illustration when an asset already exists.

## Before finishing a screen

1. Open the customer web app and tap through the new path.
2. Check 393px wide and 320px wide. If the layout is a full screen, also check a tablet width.
3. Confirm the primary button is not hidden behind the bottom bar or the keyboard.

The brand guidelines name the fonts. The PRD does not. The customer app is not using either brand font.

**What the guidelines ask for**

- The primary font is **Gabriel Sans**.
- The secondary font is **Degular Variable**.
- The PDF does not list a weight scale such as Regular, Medium, or Bold. The file itself only embeds Gabriel Sans Trial Normal, and Degular Variable Text Thin. Poppins Regular is also inside the PDF, but the typography page does not name it as a brand font.
- The colours on the page are **#ff4f18**, **#141517**, and **#f2f4f7**, plus an orange gradient. No icon set is named. The brand-elements and imagery pages have no written icon or photo rules.

**What the app uses now**

- Brand colours and font roles live in `apps/customer/src/theme/theme.ts`. Text goes through `apps/customer/src/ui/Text.tsx`. Do not set `fontFamily` or paste brand hex values in a screen.
- Heading weight (600 and above) uses the heading role. Other text uses the body role.
- Heading role is Gabriel Sans when that file is added. Body role is Degular when that file is added. Until then both roles load Inter, the free fallback.
- Orange **#FF4F18** matches the guide.
- Body text uses **#141517**.
- Fields use **#F2F4F7**.

Use Gabriel Sans for headings and buttons, and Degular for body text, once you have the licensed font files. The copy in this PDF is a trial cut, so it should not be shipped in the app as-is.
