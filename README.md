# Raqam (رقم) 3.3 — Egyptian National ID, Retirement & Date Toolkit

## What 3.4 adds
- **Holiday decree overrides** (`#/dates/holidays`): use the pen on any row to move a holiday, extend it to several days or mark it *Not observed*, with an optional decree reference. **Add by decree** creates extra holidays such as bridge days. Overridden rows show a *Decree* chip and the date they were computed for, and cancelled rows are struck through. **Import decrees / Export** exchange a JSON file (`{format:'raqam-holiday-overrides',version:1,years:{2026:{set:{h_june30:{d:['2026-07-02'],src:'…'}},extra:[{d,label,src}]}}}`) so HR can publish one file. Overrides feed the year table, .ics export and "Add year to my holidays". Stored in `localStorage` as `hOverrides`.
- **Rows control** next to **Columns** (both labelled buttons with a live count) in Batch and Spreadsheet results. Include or exclude groups by status, sex, age band, governorate or flag, or keep only the first occurrence of each duplicate. Insights, charts, the table, copy and exports all follow the selection.
- **Charts as images**: every insight panel has a **PNG** button that renders a crisp 2× chart in the current theme and language (RTL aware).
- **Web Worker** (`js/worker.js`, `js/jobs.js`): spreadsheets are read and parsed off the main thread, and batches of 1,500+ IDs are analysed there, so the page stays responsive at 200k+ rows. Results are slimmed before transfer, progress shows on the button, and **Cancel** stops cleanly. It falls back to chunked main-thread parsing if Workers are unavailable. `tests.html` checks worker output against the main thread on 60,000 rows.

## What 3.3 changes — interface polish
- **One component language**: every `<select class="field">` is automatically upgraded (`js/kit.js`) to a styled dropdown that opens as the same frosted menu used for column pickers and the calendar. It has a checkmark on the selected option, keyboard support (↑/↓, Home/End, type-ahead, Esc, Tab) and a native `<select>` kept underneath, so `.value` and `change` handlers keep working.
- **Confirm dialog** (`Kit.confirm`, returns a Promise): clearing holidays, clearing a large batch, removing a processed spreadsheet, importing settings and resetting everything now ask first. On phones it opens as a bottom sheet. Every destructive action still offers Undo.
- **Toasts** collapse smoothly with height instead of jumping, pause while hovered, merge duplicates (pulsing instead of stacking), and sit above the bottom nav on phones.
- **No flicker**: results are painted with `paint()` (`Kit.paint`), which skips identical HTML, keeps the scroll position, and fades only when the layout really changes. Switching sub-tabs inside a section swaps only `#view`. Settings changes refresh in place (`App.soft`), keeping the scroll position and focus. Counters tween from their previous value.
- **Gliding indicators**: segmented controls, sub-tabs, the top nav and the bottom nav share one sliding pill that is re-measured when fonts load, on resize and on RTL.
- **Theme switch** reveals the new theme in a circle from the button (View Transitions). It falls back to a cross-fade, and the sun/moon icon morphs.
- **Typography**: variable Fraunces (SOFT axis), Inter with optical sizing and alternate glyphs (cv05/cv08/cv11/ss03), tabular lining numbers wherever figures align, balanced headings and pretty-wrapped body text. Arabic keeps Cairo with natural spacing.
- **SVG**: rebuilt brand files with an optically centred mark and a three-stop amber gradient. The Qibla compass has a 72-tick dial and a spring-animated needle, and the gear icon is redrawn with smooth curves.
- **Motion** follows one easing set (`--ease-out`, `--spring`), and every animation respects `prefers-reduced-motion`.

## Brand
- **Mark**: a calligraphic amber ر (first letter of رقم) with three dots along its curve in the ID's segment colours: blue for place, rose for serial/sex, cream for the check digit. It merges the letter with Raqam's original segmented-ID mark and stays legible at 16 px. One source (`MARK` in `js/ui.js`) feeds the header, the ID-card watermark and the iOS icon.
- The dots pop in one after another when the page loads.
- **Files**: `images/raqam.svg` (favicon/app), `images/raqam-maskable.svg` (PWA maskable), `images/raqam-mono.svg` (single-colour mask icon). A PNG apple-touch-icon is drawn at runtime.
- **Wordmark**: "Raqam." in Fraunces with an amber full stop; "رقم." in Cairo for Arabic.
- **Palette** kept from v3: amber `#C96E39→#F6C799`, ink `#0D0A07→#2B2119`, cream `#F4ECDD`, with azure and rose as data colours.
- The mark draws itself in on load, and a faint watermark of it sits on the ID card.

A private, browser-only toolkit for working with Egyptian national IDs (الرقم القومي), Law 148/2019 retirement dates, and calendar math (Gregorian, Hijri Umm al-Qura, Coptic, Julian), plus Egyptian holidays and prayer times. Bilingual (English / العربية, full RTL), light/dark, installable PWA. Nothing is sent to a server.

## What 3.0 changes
- Rebuilt from scratch as modules (`js/core/*` engines, `js/views/*` UI) instead of one 580 KB file.
- Same visual identity (amber/ink palette, ring brandmark, Fraunces/Inter/Cairo), but calmer, rounder and lighter.
- **Date engine** works on integer day numbers (Rata Die), so there is no time-zone or daylight-saving drift. Valid for years 1–9999.
- **Hijri** now uses the official **Umm al-Qura** calendar through the browser's Intl engine, falling back to tabular arithmetic outside 1318–1500 AH. You can adjust it by ±2 days.
- **Retirement**: offers both legal readings (age at 60 / age in force at retirement), the retirement-date rounding used by employers (exact / end of month / next month), and a choice for how 29 Feb anniversaries are handled.
- **Smart date input** everywhere: `12/05/1998`, `1998-05-12`, `12 May 98`, `١٢ مايو ١٩٩٨`, `today`, `+30d`, `next fri`. Includes a calendar popover that shows Hijri days, and arrow-key nudging.

## Features
**ID** (`#/id`, `#/id/<14 digits>`, `#/id/batch`, `#/id/upload`, `#/id/build`)
- **Did you mean…**: when an ID is invalid, Raqam searches every one-typo variant (swapped neighbours, one wrong digit, a missing or extra digit) and offers the valid ones, with the changed digits highlighted.
- **Privacy mask**: hides the serial and check digit on screen and keeps the ID out of the URL. **Recent IDs** live in memory for this session only, or in the tab's session storage if you allow it.
- **Possible twins**: Batch and Spreadsheet flag different IDs that share a birth date and governorate.
- **ID builder**: generates structurally valid, check-consistent test IDs from a birth date, governorate and sex, one or up to 1,000, ready to send to Batch.
- Retirement now defaults to the "age in force at retirement" reading, as in Raqam v1. The "age at 60" reading is still available in Settings.
- Live decoding while you type, with a partial readout for incomplete input. Accepts Arabic-Indic digits, spaces, dashes and scientific notation.
- Six structural checks plus an optional unofficial checksum. Flags: duplicate, 29 Feb birthday, born abroad, under 16, placeholder dates, and more.
- Shows age, next birthday, Hijri/Coptic birth date, zodiac, region, retirement ring, timeline and countdown. Copy, shareable link, print and .ics export.
- **Batch**: paste or extract IDs from any text. Results come with insights (sex split, governorates, age bands, retirements per year), filters, search, sortable and paged tables, column picker, CSV/TSV/XLSX export, and live Excel formulas.
- **Spreadsheet**: upload xlsx/xls/ods/csv (up to 40 MB). You can pick the sheet and header row, and the ID column is detected automatically. Exports keep all your original columns.

**Dates** (`#/dates`, `/add`, `/age`, `/day`, `/convert`, `/holidays`, `/prayer`, `/leap`)
- **Between**: day spans, working days with custom weekends and holidays, net working days, and a weekday breakdown.
- **Add / subtract**: offsets with month-end clamping, or working-days-only mode.
- **Age**: exact age, Hijri age and milestones.
- **Day anatomy**: ISO week, day of year, quarter, Excel serial, JDN and Unix time.
- **Leap years**: check one year or list a range.
- **Calendar converter**: Gregorian ↔ Hijri ↔ Coptic ↔ Julian, plus Easter and Nayrouz.
- **Egyptian holidays** for any year, with .ics export, and a holiday manager that understands ranges and .ics import.
- **Prayer times**: 15 calculation methods (chosen automatically by country), Shafi/Hanafi Asr, high-latitude rules, Qibla direction, monthly table and CSV, search across 7,000+ cities, and "near me".

**Formulas** (`#/formulas`): Excel/Sheets formulas for birth date, sex, governorate, age, exact age, retirement age and date, years left, and validity. Works on a single cell or a table column, with optional LET, in English or Arabic.

**Reference** (`#/ref`, `/gov`, `/law`, `/dates`): ID structure, all governorate codes, the retirement schedule with a calculator comparing both readings, and the calculation methods.

**Shell**: command palette (⌘/Ctrl K, which also handles pasted IDs and dates), `/` to focus the ID box, `1–4` to switch sections, global paste routing, settings (theme, 5 surface styles, 4 font pairings, Hijri method and offset, how ambiguous dates are read, week start, Arabic digits, privacy, export/import/reset settings), and offline service worker.

## Files
```
index.html            app shell
css/app.css           design system
js/core/dates.js      calendar engine and natural-language date parser
js/core/id.js         ID parser, retirement law and Excel formula builder
js/core/prayer.js     prayer and Qibla engine, Egyptian city list, world city loader
js/core/holidays.js   Egyptian holiday pack, holiday text parser, .ics writer
js/i18n.js            English and Arabic dictionaries
js/ui.js              icons, store, formatting, toasts, menus, overlays, date field
js/kit.js             custom select, confirm dialog, glide indicators, flicker-free paint, theme transition
js/jobs.js            worker job runner, chart PNG renderer, row scope (Rows menu)
js/worker.js          off-thread spreadsheet reading and ID parsing
css/kit.css           polish layer: motion tokens, typography, menus, dialogs, toasts, focus rings
js/views/*.js         ID, dates, prayer, formulas, reference, settings, command palette
js/app.js             router and global wiring
data/cities.json      world cities (lazy-loaded)
tests.html            engine self-tests (82 assertions)
sw.js, manifest.webmanifest
```

## Data & storage
There is no backend and no table API. Settings and saved holidays are kept in `localStorage` (`raqam-v3`, existing `lxid-v3` settings are picked up automatically). IDs and birth dates are only kept if you allow it, and then only in `sessionStorage` for that tab. SheetJS and Google Fonts load from CDN.

## Not implemented / caveats
- The check digit's official algorithm is not public, so the checksum shown is a heuristic only.
- Islamic holidays are estimates until officially announced. Cabinet decisions that move holidays to Thursdays are not applied.
- Settings from the old v2 storage key are not migrated.

## Next steps
- A hosted, signed decree feed so overrides update without importing a file.
- Streaming CSV parsing for files above 40 MB.
