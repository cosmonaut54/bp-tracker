# METHOD — BP Tracker

| | |
|---|---|
| **What it does** | Logs blood pressure and weight on my phone, categorizes readings against AHA ranges, tracks BMI, charts trends, exports CSV for doctor visits |
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

Three roles, cleanly separated. Nobody did anybody else's job.

| Stage | Who | What it produced |
|---|---|---|
| Spec | Me | Plain-language description of what I wanted |
| Build | **Gemini** | The complete working v1 app, start to finish |
| Deploy | Me + GitHub Pages | Repo created, published from root |
| Review & hardening | **Claude** | Defect analysis of the finished repo, then the fixes |
| Product direction | **Me** | Every subsequent feature and UX correction |
| Implementation | **Claude** | Built what I specified, then verified it |

**Gemini built the app.** All of v1 — markup, styling, localStorage, the AHA
classification logic, the Chart.js trend graph, the CSV export, the mobile
layout. I described what I wanted and Gemini produced a single-file app that
worked. This is what Gemini is good at: plain-language description in, complete
working artifact out.

**Claude reviewed it.** I handed over the finished repo and asked whether it
could see it. Claude read the code cold, with no involvement in writing it, and
came back with three defects and a fix for each. It built no part of the
original app and gets no credit for it.

**I directed everything after that,** and this turned out to be the part that
mattered most. See the section below.

**Prompting approach (build stage):** _(fill in — how the Gemini session was
structured: one spec, or iterative?)_

**Prompting approach (review stage):** minimal. "I created a repo, can you access
it?" No list of concerns, no direction on what to look for.

**Prompting approach (feature stages):** conversational and specific. I described
the problem from the user's side rather than specifying an implementation —
"showing me Stage 2 means nothing," not "add a reference table component."

**Code written by hand:** none, at any stage.

## What I contributed, and why it was the scarce input

Neither model ever proposed a single one of the following. Every one came from
using the app daily and noticing what was wrong with it:

- **The chart showed a date with no time.** Two readings on the same day were
  indistinguishable.
- **Times needed to be pinned to Eastern**, not to whatever device I opened it on.
- **"Stage 2" was a meaningless label.** A number with a category attached tells
  you nothing unless you can see the scale it sits on. This became the stage
  reference table, and it's now the most useful thing on the page.
- **The chart needed the healthy thresholds drawn on it** so a glance says
  whether a reading is where it should be.
- **Seven days was not the only useful window.** Range tabs followed.
- **The date and time in the history list were too loud** and competed with the
  reading itself.
- **Deleting a record happened instantly with no confirmation** — one mis-tap
  destroyed data with no recovery.
- **One long scrolling page was the wrong shape.** It became four pages with a
  fixed bottom nav, defaulting to a home summary.
- **Weight and BMI belonged in the same app,** since they are the other half of
  what my doctor looks at.
- **The weight chart's points should be colored by BMI band,** so the chart
  carries meaning without being read closely.

**The lesson.** Both models produced technically correct work throughout. What
neither produced was product judgment. Claude found real defects — an unescaped
field, a README describing features that did not exist, a date-rollover bug in
the CSV export — but every single one was a *correctness* problem. Not one was a
*usefulness* problem. A reviewing model checks whether the thing works. It does
not know that "Stage 2" means nothing to the person reading it, because it is not
the person reading it every morning.

The scarce input was not code. It was someone using the app daily and saying what
was wrong with it.

## Numbers

- Time to first working version: _(fill in)_
- Time to shipped: _(fill in)_
- Total cost: $0 — GitHub Pages free tier, no domain, no backend
- Files in the finished app: 7 (README, index.html, manifest, service worker, 2 icons, this file)
- Growth: v1 was ~10 KB in one file. The current version is ~53 KB, still one file.

## What Gemini got right

The first version was genuinely usable, not a demo:

- **The classification logic was correct**, including a subtlety that's easy to
  get wrong. The AHA "Elevated" band (120–129 systolic *and* diastolic under 80)
  only resolves correctly if Stage 1 is tested first. Gemini ordered the checks
  properly, and that ordering survived every rewrite since.
- **Single file, zero build step.** No npm, no bundler, no framework. Drop it on
  any static host and it runs. That decision made hosting free and made every
  later change a single-file edit.
- **localStorage was the right storage choice**, which made the privacy goal real
  rather than a promise — the readings physically cannot leave the device.
- **Mobile-first layout** that works one-handed, with a coherent dark theme that
  the later pages inherited without redesign.

## What Claude found

Three defects in v1, all in code that looked finished:

1. **The README described an app that didn't exist.** It claimed "Progressive Web
   App," "Offline Ready," and gave install instructions for both platforms. There
   was no `manifest.json` and no service worker. Docs and code were generated in
   the same session and neither was checked against the other. Most transferable
   lesson here: **a generated README documents intent, not the artifact.**
2. **The notes field was injected with `innerHTML` and no escaping.**
3. **Offline was impossible by construction** — Tailwind and Chart.js load from
   CDNs at runtime, so a service worker alone would not have been enough.

A fourth surfaced later, during the timezone work: **the CSV export used the
device's local date**, so a reading taken at 9:30 PM Eastern exported with
tomorrow's date. Latent in v1, invisible until someone looked at the boundary.

One limitation neither tool could solve: Safari won't accept SVG for
`apple-touch-icon`, so iOS shows a screenshot on the home screen until a PNG gets
added, and committing a binary file was outside what the connector could do.

## Constraint that shaped the process

The GitHub connector had read access to the repo but no write access — the app
was installed on my organization account, not my personal one. So every change
was: Claude writes and verifies the files, I download them, I upload them through
the GitHub web UI. Nothing was ever committed directly.

That was slower, but it had one real benefit: every change arrived as a complete,
verified file rather than an incremental commit, and I saw each one before it
went live. Worth remembering as a deliberate option, not just an obstacle.

## What I'd do differently

Ask for the PWA layer up front. "Make it installable and work offline" is one
clause in the original build prompt and an entire follow-up session afterward.

Run the review stage before publishing rather than after. The app was live and on
my phone in a state where its own README was wrong about it.

Sort out repo write access before starting, not six sessions in.

**Do the UX pass earlier.** Most of the changes above are things I could have
specified in week one if I had sat down and used a paper mock for ten minutes.
Instead each one arrived as a separate round trip after the app was already live.

## Reusable pattern

**Build with one model, review with another.** Gemini is strong at generation —
plain description in, complete working artifact out. Claude is strong at the pass
afterward — reading a codebase it didn't write and finding what's wrong with it.
Using either for the other's job wastes what it's good at. Two data points now;
the pattern held on this build.

**But neither model supplies product judgment, and that is the real bottleneck.**
The models will build correctly whatever you describe. Knowing what to describe
comes from using the thing. Budget for a real usage period between "it works" and
"it's done" — the gap between those two is where all the value in this build was.

**Single-file HTML + localStorage + GitHub Pages** is a strong default for any
personal utility that doesn't need a server. Free, permanent, no maintenance, no
accounts, data stays on the device. It scaled from a 10 KB one-screen app to a
53 KB four-page app without ever needing a build step.

**The review checklist worth running on anything generated this way:**

- Does the README describe files that actually exist?
- Is user-entered text escaped before it hits `innerHTML`?
- Does it load with the network off?
- Does it install to a phone home screen, and does the icon look right?
- Do third-party CDN scripts break the offline claim?
- Does anything involving dates behave correctly at a timezone boundary?
- Is any destructive action reachable in one tap with no confirmation?
