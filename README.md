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
- **Workout logging**: weight per exercise (prefilled from your last
  session), 3 sets of reps; band-based exercises take a text "band level"
  instead of a weight.
- **History and Progress tabs**: a log of past sessions and a simple bar
  trend per lifted exercise.

## Project structure

```
App.tsx                 # top-level state, check-in/data flow, screen routing
src/
  data/exercises.ts      # exercise library + which exercises belong to each day
  screens/                # Checkin, Home, WorkoutLog, History, Progress
  storage.ts              # AsyncStorage persistence
  theme.ts                # color palette
  types.ts                # data model
  utils/date.ts           # week/date helpers (weeks run Sunday–Saturday)
```

## Customizing exercises

Swap or add exercises by editing `src/data/exercises.ts` — add an entry to
`EXERCISE_INFO` and reference its id in `DAY_EXERCISES`. There's no in-app
exercise-swap UI yet.

## Not yet built

- Push notification for the Sunday check-in (currently only appears when you
  open the app after a new week has started).
- Cross-device sync (data is local to whichever phone you use).
- In-app exercise substitution UI.
