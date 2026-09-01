# METHOD — BP Tracker

| | |
|---|---|
| **What it does** | Logs daily blood pressure readings on my phone, categorizes them against AHA/ACC ranges, charts the trend, exports CSV for doctor visits |
| **Who it's for** | Me |
| **Live** | https://cosmonaut54.github.io/bp-tracker/ |
| **Repo** | https://github.com/cosmonaut54/bp-tracker |
| **Status** | Live |
| **Built** | September 2026 |

---

## Why it exists

Every blood pressure app in the store wants an account, serves ads, or syncs
readings to somebody else's server. I wanted to tap three numbers once a day on
my phone and have the data stay on the phone. No login, no ads, no cloud.

Secondary reason: I wanted a small, real, finished thing to test how far
AI-assisted building goes when I write none of the code myself.

## Method

| Stage | Tool | What it produced |
|---|---|---|
| Idea / spec | Me | Plain-language description of what I wanted |
| First build | Gemini + Claude | Complete single-file HTML app |
| Review / hardening | Claude | Found and fixed three defects, added PWA layer |
| Deploy | GitHub Pages | Free static hosting off the repo root |

**Division of labor:** Gemini and Claude produced the entire working app —
markup, styling, storage, classification logic, chart, CSV export. I described
what I wanted and hosted the result. The review pass was a separate Claude
session reading the finished repo cold, which is what surfaced the defects: the
model that writes the code is not the best judge of whether it's done.

**Prompting approach:** conversational and iterative rather than one long spec.
Described the problem, reacted to what came back.

**Code written by hand:** none.

## Numbers

- Time to first working version: _(fill in)_
- Time to shipped: _(fill in)_
- Total cost: $0 — GitHub Pages free tier, no domain, no backend
- Files in the finished app: 7 (README, index.html, manifest, service worker, 2 icons, this file)

## What the AI got right

The first version was genuinely usable, not a demo. Specifically:

- **Classification logic was correct**, including a subtlety that's easy to get
  wrong: the AHA "Elevated" band (120–129 systolic *and* diastolic under 80) only
  works if Stage 1 is tested first. The generated ordering handled it.
- **Single file, zero build step.** No npm, no bundler, no framework. Drop it on
  any static host and it runs. For an app this size that's the right call and it
  made hosting free.
- **localStorage was the right storage choice** and it made the privacy goal real
  rather than a promise — the readings physically cannot leave the device.
- **Mobile-first layout** that actually works one-handed, with a sensible dark theme.

## What the AI got wrong

Three defects, all in code that looked finished:

1. **The README described an app that didn't exist.** It claimed "Progressive Web
   App," "Offline Ready," and gave install instructions for iOS and Android.
   There was no `manifest.json` and no service worker, so Android would never
   offer to install it and it would not load offline. The docs and the code were
   generated in the same breath and nobody checked one against the other. This is
   the most transferable lesson here: **a generated README documents intent, not
   the artifact.** Verify every claim against the actual files.
2. **The notes field was injected with `innerHTML` and no escaping.** The data is
   local-only so there's no attacker, but typing an apostrophe or a `<` into a
   note would corrupt that row's rendering. Fixed with an `escapeHTML` helper.
3. **Offline was impossible by construction anyway** — Tailwind and Chart.js load
   from CDNs at runtime. Even with a service worker, no network meant no styling
   and no chart until those got precached too.

One limitation I couldn't fix through this toolchain: Safari won't accept SVG for
`apple-touch-icon`, so iOS shows a screenshot on the home screen until a PNG gets
added. Committing a binary file was outside what the connector could do.

## What I'd do differently

Ask for the PWA layer up front instead of bolting it on. "Make it installable and
work offline" is one clause in the original prompt and an entire follow-up session
afterward.

Read the generated README against the generated code before believing either one.

## Reusable pattern

**Single-file HTML + localStorage + GitHub Pages** is a strong default for any
personal utility that doesn't need a server. Free, permanent, no maintenance, no
accounts, and the data stays on the device.

The standard checks worth running on anything generated this way:

- Does the README describe files that actually exist?
- Is user-entered text escaped before it hits `innerHTML`?
- Does it load with the network off?
- Does it install to a phone home screen, and does the icon look right?
- Do third-party CDN scripts break the offline claim?
