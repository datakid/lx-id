# Raqam — رقم

Egyptian National ID & Retirement toolkit. Everything runs in the browser, and no data is sent anywhere.

## Brand
- **Name:** Raqam (Arabic for "number").
- **Mark:** the 14-digit ID drawn as two rows of pill shapes. Amber is the birth date, blue is the governorate, rose is the serial/gender digit and the cream dot is the check digit.
- **Files:** `icons/raqam.svg` (favicon/app icon), `icons/raqam-maskable.svg` (PWA icon). On iOS, a PNG `apple-touch-icon` is generated at runtime.

## Features
- **ID Tools:** decode a single ID (shown as a dark ID card with color-coded segments), batch analytics (KPIs, gender donut, governorate bars, age-band columns), Excel/CSV upload and export.
- **Formulas:** Excel/Sheets formulas for birth date, gender, retirement age and date.
- **Dates:** between dates (working days and holidays), add/subtract, age, weekday, leap years, Hijri/Coptic conversion, prayer times.
- **Reference:** ID structure, governorates, Law 148/2019, calendar method notes.
- Arabic/English (RTL), light/dark mode, command palette, PWA (offline shell).

## Entry routes
`#/id/single`, `#/id/batch`, `#/id/upload`, `#/formula`, `#/dates/{between|addsub|age|weekday|leapyears|calendars|prayer}`, `#/reference/{structure|governorates|law|dates}`

## Logic fixes in this version
- **Retirement age:** the age in force on the date the person actually reaches it now applies. Example: someone who turns 60 in March 2032 and 61 in March 2033 retires at 61, not 60. The live app and the generated Excel formulas use the same rule.
- **Years to retirement:** now counted in whole calendar years instead of `/365.25`.
- **Retirement progress % in Excel:** now day-based, so it matches the app.
- **Service worker:** cached the non-existent `id.html`. It now caches the real shell and falls back to it when offline for navigation requests.
- **Saved settings:** carried over from the old `lxid-*` storage keys.
- **Code comments:** removed.

## Files
`index.html` (app), `css/raqam.css` (design system layer), `sw.js`, `manifest.webmanifest`, `icons/`. `original/` is the untouched upload, kept for reference, and can be deleted.

## Storage
localStorage `raqam-state-v1` (preferences); sessionStorage `raqam-session-v1` (ID numbers, only if the user turns this on). No backend tables.

## Next steps
- Move the legacy base CSS (`<style id="base-style">`) into `css/raqam.css` as a single stylesheet.
- Pre-rendered PNG icons (192/512) for older Android launchers.
