# Strength Tracker

A mobile strength training tracker built with Expo / React Native. Handles a
Sunday Pilates check-in, upper/lower/full-body workout logging, progressive
overload prompts every 4 weeks, and history/progress views. Data is stored
on-device with AsyncStorage — no backend, no account.

## Getting started

```bash
npm install
npx expo start
```

Scan the QR code with the Expo Go app (iOS/Android) to run it on your phone,
or press `a` / `i` in the terminal to launch an Android/iOS simulator. `npm
run web` also works for a quick browser preview.

## How it works

- **Sunday check-in**: asks how many Pilates days you're doing that week —
  3 days → upper/lower/full-body strength, 4 days → upper/lower only.
- **Progressive overload**: every 4th week, a second check-in step asks
  separately whether to add 5 lbs to upper and lower working weights.
- **Workout logging**: exercises are grouped into supersets of 2, paired by
  body part (e.g. Chest & Back, Quads & Hamstrings) instead of one long
  list — alternate between the pair, then rest. Weight per exercise is
  prefilled from your last session, or a generic intermediate-lifter
  starting suggestion the first time; 3 sets of reps; band-based exercises
  take a text "band level" instead of a weight.
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

- Local notifications work fine in Expo Go, but you do need to test on a
  real device or simulator (not the web preview) to see the permission
  prompt and confirm delivery.
- The reminder time (Sunday, 9:00am, device-local time) is hardcoded in
  `src/notifications.ts` — change `REMINDER_HOUR/REMINDER_MINUTE` there if
  you want a different time.
- If you ever run `npx expo prebuild` / build with EAS, the
  `expo-notifications` config plugin in `app.json` is already wired up so
  the required Android permission gets added.

## Not yet built

- Cross-device sync (data is local to whichever phone you use).
