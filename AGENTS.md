# KitchenX customer app

This repository is the customer mobile prototype only. Do not add admin or warehouse apps here.

When building or changing screens, follow `.cursor/skills/kitchenx-customer-prototype/SKILL.md`.

If the user attaches a screenshot, use it for layout, order, and copy only. Paint it with the existing KitchenX theme in `apps/customer/src/theme/theme.ts` and `apps/customer/src/ui/Text.tsx`. Do not copy the screenshot's font or colours. Do not paste hex values or font names into a screen. Keep screens tappable with local data. Leave backend connection for later.

The brand guidelines name the fonts. The PRD does not. The customer app is not using either brand font.

**What the guidelines ask for**

- The primary font is **Gabriel Sans**.
- The secondary font is **Degular Variable**.
- The PDF does not list a weight scale such as Regular, Medium, or Bold. The file itself only embeds Gabriel Sans Trial Normal, and Degular Variable Text Thin. Poppins Regular is also inside the PDF, but the typography page does not name it as a brand font.
- The colours on the page are **#ff4f18**, **#141517**, and **#f2f4f7**, plus an orange gradient. No icon set is named. The brand-elements and imagery pages have no written icon or photo rules.

**What the app uses now**

- Colours and font roles are in `apps/customer/src/theme/theme.ts`. Text uses `apps/customer/src/ui/Text.tsx`.
- Heading role is Gabriel Sans when that file is added. Body role is Degular when that file is added. Until then both roles load Inter, the free fallback.
- Orange **#FF4F18** matches the guide.
- Body text uses **#141517**.
- Fields use **#F2F4F7**.

Use Gabriel Sans for headings and buttons, and Degular for body text, once you have the licensed font files. The copy in this PDF is a trial cut, so it should not be shipped in the app as-is.
