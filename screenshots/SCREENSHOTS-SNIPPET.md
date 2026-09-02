<!-- Paste near the top of README.md, under the intro line -->

![BP Tracker](screenshots/hero.png)

## Screens

| Home | Blood Pressure | Weight | Profile |
|---|---|---|---|
| <img src="screenshots/01-home.png" width="200"> | <img src="screenshots/02-pressure.png" width="200"> | <img src="screenshots/04-weight.png" width="200"> | <img src="screenshots/06-profile.png" width="200"> |
| Latest reading, 7-day average, quick add | Trend with healthy thresholds, full history | Weight, BMI band, chart coloured by band | Height, backup and restore, storage status |

<details>
<summary>More screens</summary>

| Trend & history | BMI reference |
|---|---|
| <img src="screenshots/03-pressure-trend.png" width="240"> | <img src="screenshots/05-weight-bmi.png" width="240"> |

</details>

<!-- Paste into METHOD.md, in or near the section on what you contributed -->

## How it changed

![v1 next to the current build](screenshots/before-after.png)

The left screen is what Gemini produced from a plain-language description: a working
log with a chart. The right is the same app after the UX pass — every difference between
them came from using it daily and noticing what was missing, not from either model
proposing it.

| | v1 | Now |
|---|---|---|
| Screens | one scrolling page | four, with a fixed nav |
| Chart | last 10 readings, date only | 5 ranges, times, healthy thresholds |
| Category | a label | a label plus the scale it sits on |
| Deleting | instant, no confirmation | confirmation naming the entry |
| Tracked | blood pressure | blood pressure, weight, BMI |
| Backup | CSV export only | full backup and restore |
