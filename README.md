# BP Tracker

A private, ad-free blood pressure and weight log that runs on your phone. No account,
no server, no tracking. Every reading stays in your browser's storage on your device.

**Live:** https://cosmonaut54.github.io/bp-tracker/

---

## Why

Every blood pressure app in the store wants an account, serves ads, or syncs readings
to somebody else's server. This one does none of that. You tap in a reading, it tells
you where that reading sits, and the data never leaves the phone.

## What it does

**Blood pressure**
- Categorizes every reading against the American Heart Association ranges — Healthy,
  Elevated, Stage 1, Stage 2, Crisis
- A stage reference table that highlights where your latest reading falls, so the
  category label means something
- Trend chart with dashed lines at 120 and 80, the healthy ceilings for each number
- 7-day rolling average, which is closer to what a doctor looks at than any single reading

**Weight and BMI**
- Weigh-in log with BMI calculated from the height in your profile
- Chart points colored by BMI band, with a dashed reference line at BMI 25
- Change over the selected time window

**Both**
- Time ranges: 7, 14, 30, 90 days, and year to date
- All timestamps pinned to Eastern time, so a reading logged at 9am reads 9am
  regardless of which device or timezone you open it from
- Deleting an entry asks for confirmation first and names the entry it's about to remove

## Pages

A fixed bottom bar switches between four screens:

| | |
|---|---|
| **Home** | Latest reading and weight at a glance, 7-day average, quick add for either or both, recent activity |
| **Pressure** | Log a reading, trend chart, full history, stage reference |
| **Weight** | Log a weigh-in, weight and BMI chart, BMI band table, weigh-in history |
| **Profile** | Height and sex, backup and restore, CSV export, storage status |

## Your data

Everything lives in this browser's local storage on this device. Nothing is uploaded
and there is no account, which is the point — but it also means a cleared browser, a
lost phone, or a reinstall takes the data with it.

Three things protect against that:

- **Download Backup** writes a single JSON file containing every reading, every
  weigh-in, and your profile.
- **Restore from Backup** reads that file back, on this phone or a new one. It merges
  rather than replaces, skipping entries that are already present, so running it twice
  is harmless and an old backup can't overwrite newer readings.
- The app requests **persistent storage** on load, asking the browser not to evict the
  data when the device runs low on space. The Profile page reports whether that was
  granted, and warns when your last backup is more than 30 days old.

**Export CSV** is separate, and it's for your doctor. It's a one-way export — a
spreadsheet can read it, but the app cannot restore from it.

## Install on your phone

1. Open the live URL in your mobile browser.
2. **iOS (Safari):** Share → *Add to Home Screen*
3. **Android (Chrome):** menu → *Install app*

Once installed it runs offline. The service worker caches the app shell along with the
two CDN scripts it depends on.

## Known limitations

- **iOS home screen icon** shows a page screenshot rather than the app icon. Safari
  won't accept an SVG for `apple-touch-icon` and no PNG has been added yet.
- **No reminders.** A daily notification would need a server for web push on iOS,
  which would break the no-backend design.
- **One device at a time.** There's no sync. Moving to a new phone means downloading a
  backup and restoring it.
- **Not a medical device.** This records and charts what you enter. It doesn't diagnose
  anything and it isn't a substitute for your doctor's own reading.

## Built with

No code in this project was written by hand. Gemini built the first working version,
Claude reviewed it and implemented everything after that, and the product direction —
every feature and UX correction — came from using the thing daily.

See [METHOD.md](METHOD.md) for the full account, including what each model got right,
what it got wrong, and what turned out to be the actual bottleneck.

## Technical notes

- Single `index.html`, no build step, no framework, no npm
- Tailwind CSS and Chart.js from CDNs, both precached by the service worker
- `localStorage` for records, `Intl.DateTimeFormat` with `America/New_York` for all display
- Hosted free on GitHub Pages from the repository root
