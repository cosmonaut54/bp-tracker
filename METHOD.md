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

Two tools, two distinct stages, no overlap between them.

| Stage | Tool | What it produced |
|---|---|---|
| Spec | Me | Plain-language description of what I wanted |
| Build | **Gemini** | The complete working app, start to finish |
| Deploy | Me + GitHub Pages | Repo created, published from root |
| Review & hardening | **Claude** | Defect analysis of the finished repo, then the fixes |

**Prompting approach (build stage):** I provided a clear description of the problem that I needed solved, listed the functionality I needed, and stated my access requirements.

**Gemini built the app.** All of it — markup, styling, localStorage, the AHA/ACC
classification logic, the Chart.js trend graph, the CSV export, the mobile layout.
I described what I wanted and Gemini produced a single-file app that worked. This
is what Gemini is good at: take a plain-language description, return a complete,
working, well-organized thing.

**Prompting approach (review stage):** I confirmed Claude could access the repo and requested it be reviewed. I have many personalized settings and skill files created for Claude that instruct Claude on how to respond to requests. For requests to access and review code, Claude has instructions directing it to evaluate for accuracy, completeness, efficiency, optimization, and security. 

**Claude reviewed it.** I gave Claude access to the finished repo and asked whether
it could see it. Claude read the code cold, with no involvement in writing it, and
came back with three defects and a fix for each. It built no part of the original
app and gets no credit for it. What it contributed was the pass that turned a
working app into a correct one.

**Why the split matters:** the review caught things the build missed *because* it
was a different model reading with fresh eyes and no memory of its own reasoning.
A builder tends to re-read its intent rather than its output — it knows what the
code was meant to do, which is exactly the blind spot that let a README describe
features that weren't there. Handing a finished artifact to a second model with no
stake in it is a different operation from asking the first one to check its work.

## Numbers

- Time to first working version: _(fill in)_
- Time to shipped: _(fill in)_
- Total cost: $0 — GitHub Pages free tier, no domain, no backend
- Files in the finished app: 7 (README, index.html, manifest, service worker, 2 icons, this file)

## What Gemini got right

The first version was genuinely usable, not a demo:

- **The classification logic was correct**, including a subtlety that's easy to get
  wrong. The AHA "Elevated" band (120–129 systolic *and* diastolic under 80) only
  resolves correctly if Stage 1 is tested first. Gemini ordered the checks properly.
- **Single file, zero build step.** No npm, no bundler, no framework. Drop it on
  any static host and it runs. For an app this size that's the right call, and it
  made hosting free.
- **localStorage was the right storage choice**, which made the privacy goal real
  rather than a promise — the readings physically cannot leave the device.
- **Mobile-first layout** that works one-handed, with a coherent dark theme.

## What Claude found

Three defects, all in code that looked finished:

1. **The README described an app that didn't exist.** It claimed "Progressive Web
   App," "Offline Ready," and gave install instructions for iOS and Android. There
   was no `manifest.json` and no service worker, so Android would never offer to
   install it and it would not load offline. Docs and code were generated in the
   same session and neither was checked against the other. Most transferable lesson
   here: **a generated README documents intent, not the artifact.**
2. **The notes field was injected with `innerHTML` and no escaping.** The data is
   local-only so there's no attacker, but typing an apostrophe or a `<` into a note
   would corrupt that row's rendering.
3. **Offline was impossible by construction anyway** — Tailwind and Chart.js load
   from CDNs at runtime. Even with a service worker, no network meant no styling
   and no chart until those were precached too.

Claude then wrote the fixes: manifest, service worker with CDN precaching, an
`escapeHTML` helper, and the icon set.

One limitation neither tool could solve: Safari won't accept SVG for
`apple-touch-icon`, so iOS shows a screenshot on the home screen until a PNG gets
added, and committing a binary file was outside what the connector could do.

## What I'd do differently

Ask for the PWA layer up front. "Make it installable and work offline" is one
clause in the original build prompt and an entire follow-up session afterward.

Run the review stage before publishing rather than after. The app was live and on
my phone in a state where its own README was wrong about it.

## Reusable pattern

**Build with one model, review with another.** That's the finding from this build
and the one I most want to test on the next few. Gemini is strong at generation —
plain description in, complete working artifact out. Claude is strong at the pass
afterward — reading a codebase it didn't write and finding what's wrong with it.
Using either for the other's job wastes what it's good at. One data point so far;
the portfolio exists partly to find out whether it holds.

**Single-file HTML + localStorage + GitHub Pages** is a strong default for any
personal utility that doesn't need a server. Free, permanent, no maintenance, no
accounts, data stays on the device.

**The review checklist worth running on anything generated this way:**

- Does the README describe files that actually exist?
- Is user-entered text escaped before it hits `innerHTML`?
- Does it load with the network off?
- Does it install to a phone home screen, and does the icon look right?
- Do third-party CDN scripts break the offline claim?
