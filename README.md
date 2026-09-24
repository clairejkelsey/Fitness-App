# Strength Tracker

A mobile strength training tracker built with Expo / React Native. Handles a
Sunday Pilates check-in, upper/lower/full-body workout logging, progressive
overload prompts every 4 weeks, and history/progress views. Data is stored
on-device with AsyncStorage — no backend, no account.

## Using it day-to-day (no computer required)

The app auto-deploys as a website on every push, via
`.github/workflows/deploy-web.yml` → GitHub Pages. Once Pages is enabled
(one-time step below), it's live at:

```
https://clairejkelsey.github.io/Fitness-App/
```

Open that on your phone and use **Share → Add to Home Screen** (iOS Safari)
to get a home-screen icon that opens full-screen, no browser chrome. After
that, no laptop, dev server, or QR code — just tap the icon.

**One-time setup** (GitHub doesn't allow enabling this from outside its UI):
in the repo on github.com, go to **Settings → Pages**, and under "Build and
deployment" set **Source** to **GitHub Actions**. The next push (or
re-running the "Deploy web app to GitHub Pages" workflow from the Actions
tab) will publish the site.

Data lives in the browser's local storage on whichever phone you use it
from — same one-device-only tradeoff as before, just no longer tied to
Expo Go. The Sunday push notification does **not** work in the website
version (see below).

## Local development

```bash
npm install
npx expo start
```

Scan the QR code with the Expo Go app (iOS/Android) to run it on your phone,
or press `a` / `i` in the terminal to launch an Android/iOS simulator. `npm
run web` also works for a quick browser preview. This is only needed for
making further changes — day-to-day use should go through the deployed
website above.

## How it works

- **Sunday check-in**: asks how many Pilates days you're doing that week —
  3 days → upper/lower/full-body strength, 4 days → upper/lower only.
- **Progressive overload**: every 4th week, a second check-in step asks
  separately whether to add 5 lbs to upper and lower working weights.
- **Workout logging**: exercises are grouped into supersets of 2 by shared
  muscle overlap (e.g. bench press + shoulder press are both "push" and
  grouped together, not split across blocks) instead of one long list —
  alternate between the pair, then rest. Each exercise shows a target rep
  range (lower for heavy barbell compounds, higher for isolation/band
  work) as the cue for how heavy to load it: can't hit the bottom of the
  range, drop weight; top of the range is easy, add weight next time.
  Weight per exercise is prefilled from your last session, or a generic
  intermediate-lifter starting suggestion the first time; band-based
  exercises take a text "band level" instead of a weight.
- **History and Progress tabs**: a log of past sessions and a simple bar
  trend per lifted exercise.
- **Exercise substitution**: tap the swap icon on any exercise during a
  workout to replace it with another from the library, or add a brand-new
  one (name, muscle group, equipment, and whether it's tracked by weight or
  band level). Swaps stick for that day type going forward.
- **Sunday reminder**: a local notification fires every Sunday at 9am
  prompting the check-in. Scheduled automatically on first launch (after
  you grant notification permission) — no backend involved.

## Project structure

```
App.tsx                    # top-level state, check-in/data flow, screen routing
src/
  data/exercises.ts         # built-in exercise library + default day exercise lists
  notifications.ts           # schedules the weekly Sunday check-in reminder
  screens/                   # Checkin, Home, WorkoutLog, History, Progress, ExerciseSwapModal
  storage.ts                 # AsyncStorage persistence
  theme.ts                   # color palette
  types.ts                   # data model
  utils/date.ts              # week/date helpers (weeks run Sunday–Saturday)
  utils/exercises.ts         # merges built-in + custom exercises and per-day overrides
```

## Customizing exercises

You don't need to touch code — tap the swap icon next to any exercise in a
workout to pick a different one from the library, or add a custom exercise
on the fly. To change the built-in library, the superset groupings, or the
suggested starting weights, edit `src/data/exercises.ts` (`EXERCISE_INFO` /
`DAY_BLOCKS`).

## About the suggested weights

`EXERCISE_INFO[...].defaultWeight` in `src/data/exercises.ts` holds generic
starting-weight suggestions for an intermediate lifter, used only until you
log a real session (after that, it prefills from your last actual weight).
These are rough guesses, not a personalized program — adjust freely, and
especially reconsider them alongside whatever your care provider or trainer
recommends given trimester-to-trimester changes.

## Sunday reminder notes

- Local notifications work fine in Expo Go (native), but **not** in the
  deployed website — `expo-notifications` is a native module and silently
  no-ops on web (see `src/notifications.ts`). If you want the Sunday
  reminder back on the website, it'd need to be rebuilt as a web push
  notification, which is a separate, not-yet-built feature.
- The reminder time (Sunday, 9:00am, device-local time) is hardcoded in
  `src/notifications.ts` — change `REMINDER_HOUR/REMINDER_MINUTE` there if
  you want a different time.
- If you ever run `npx expo prebuild` / build with EAS, the
  `expo-notifications` config plugin in `app.json` is already wired up so
  the required Android permission gets added.

## How the web deploy works

- `npx expo export -p web` produces a static bundle in `dist/` — no server
  code, it's just HTML/JS/CSS, so any static host works.
- `scripts/patch-web-export.js` runs right after that export and rewrites
  the two root-absolute asset URLs Expo generates (the JS bundle and
  favicon) into relative ones, so the site works when hosted under a
  subpath like GitHub Pages project sites (`/Fitness-App/...`) instead of
  domain root. It also injects the PWA tags (`manifest.json` link,
  `apple-touch-icon`, `apple-mobile-web-app-capable`) that this Expo
  version's export doesn't generate on its own, since there's no
  expo-router here to hook a custom HTML template into.
- `public/` (manifest.json, apple-touch-icon.png) is copied verbatim into
  every export by Expo automatically.

## Not yet built

- Cross-device sync (data is local to whichever phone/browser you use).
- Web push notifications (the Sunday reminder is native-only right now).
