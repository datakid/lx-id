# Raqam — رقم

Egyptian National ID & Retirement toolkit. Everything runs in the browser, and no data is sent anywhere.

## Brand
- **Name:** Raqam (Arabic for "number").
- **Mark:** the 14-digit ID drawn as two rows of pills on an espresso tile. Amber is the birth date, blue is the governorate, rose is the serial/gender digit and the cream dot is the check digit. The shapes sit on one even grid (rows run x 13–51 with 3.5-unit gaps) and are optically centred.
- **Files:** `icons/raqam.svg` (favicon/app icon), `icons/raqam-maskable.svg` (PWA maskable icon, full-bleed with a safe zone). On iOS, a matching PNG `apple-touch-icon` is drawn at runtime.

## Visual language (v2 pass)
- Flat, quiet surfaces: solid warm-paper cards, hairline borders and soft shadows. No glass blur by default.
- Removed every shimmer, sheen, gloss sweep, drifting orb, noise grain, chip shine and hover bounce.
- Radius scale 22 / 16 / 12 / 9 px, plus a 12 px control radius. Rounded but not pill-shaped, and the same across buttons, inputs, tabs and pills.
- Primary button: ink in light mode, amber in dark mode. Selected states use a neutral raised segment with an amber icon accent.
- ID card: a deep espresso surface with a single faint amber glow. Each digit group carries a small colored tick (amber/blue/rose) in place of loud top borders.
- Numerals: Fraunces with lining, tabular figures for KPIs, countdowns and the ring.
- Motion: short fades only, and `prefers-reduced-motion` is respected.

## Features
- **ID Tools:** decode a single ID, batch analytics (KPIs, gender donut, governorate bars, age-band columns), Excel/CSV upload and export.
- **Formulas:** Excel/Sheets formulas for birth date, gender, retirement age and date.
- **Dates:** between dates (working days and holidays), add/subtract, age, weekday, leap years, Hijri/Coptic conversion, prayer times.
- **Reference:** ID structure, governorates, Law 148/2019, calendar method notes.
- Arabic/English (RTL), light/dark mode, surface presets, command palette, PWA (offline shell).

## Entry routes
`#/id/single`, `#/id/batch`, `#/id/upload`, `#/formula`, `#/dates/{between|addsub|age|weekday|leapyears|calendars|prayer}`, `#/reference/{structure|governorates|law|dates}`

## Files
`index.html` (app + base styles), `css/raqam.css` (design layer, loaded last), `sw.js` (cache `raqam-shell-v2`), `manifest.webmanifest`, `icons/`.

## Storage
localStorage `raqam-state-v1` (preferences); sessionStorage `raqam-session-v1` (ID numbers, only if the user turns this on). No backend tables.

## Next steps
- Merge the base `<style id="base-style">` into `css/raqam.css` as one stylesheet.
- Pre-rendered PNG icons (192/512) for older Android launchers.
