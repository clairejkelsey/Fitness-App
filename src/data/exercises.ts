import { colors } from "../theme";
import type { DayType, ExerciseBlock, ExerciseInfo } from "../types";

/**
 * Starting weights are generic intermediate-lifter suggestions (roughly
 * calibrated for an experienced ~130 lb, 5'8" woman) — a reasonable first
 * guess, not a personalized prescription. Adjust based on how the first set
 * feels. Rep ranges are lower for heavy barbell compounds, higher for
 * isolation/accessory, bodyweight, and band work — the range itself is the
 * intensity cue: if you can't hit the bottom of it, drop weight; if the top
 * is easy, add weight next time.
 */
export const EXERCISE_INFO: Record<string, ExerciseInfo> = {
  bench_press: { name: "Barbell Bench Press", muscle: "Chest", equipment: "Barbell + Bench", category: "upper", unit: "lbs", defaultWeight: 55, repLow: 6, repHigh: 10 },
  db_chest_fly: { name: "Dumbbell Chest Fly", muscle: "Chest", equipment: "Dumbbell + Bench", category: "upper", unit: "lbs", defaultWeight: 12, repLow: 10, repHigh: 15 },
  pushups: { name: "Push-Ups", muscle: "Chest", equipment: "Bodyweight", category: "upper", unit: "bodyweight", repLow: 10, repHigh: 20 },
  db_row: { name: "Single-Arm Dumbbell Row", muscle: "Back", equipment: "Dumbbell + Bench", category: "upper", unit: "lbs", defaultWeight: 20, repLow: 8, repHigh: 12 },
  cable_lat_pulldown: { name: "Lat Pulldown", muscle: "Back", equipment: "Functional Trainer", category: "upper", unit: "lbs", defaultWeight: 50, repLow: 8, repHigh: 12 },
  db_shoulder_press: { name: "Dumbbell Shoulder Press", muscle: "Shoulders", equipment: "Dumbbell", category: "upper", unit: "lbs", defaultWeight: 15, repLow: 8, repHigh: 12 },
  db_lateral_raise: { name: "Dumbbell Lateral Raise", muscle: "Shoulders", equipment: "Dumbbell", category: "upper", unit: "lbs", defaultWeight: 8, repLow: 12, repHigh: 15 },
  db_bicep_curl: { name: "Dumbbell Bicep Curl", muscle: "Biceps", equipment: "Dumbbell", category: "upper", unit: "lbs", defaultWeight: 12, repLow: 10, repHigh: 15 },
  cable_triceps_pushdown: { name: "Cable Triceps Pushdown", muscle: "Triceps", equipment: "Functional Trainer", category: "upper", unit: "lbs", defaultWeight: 30, repLow: 10, repHigh: 15 },
  band_face_pull: { name: "Band Face Pull", muscle: "Rear Delts", equipment: "Resistance Band", category: "upper", unit: "band", repLow: 15, repHigh: 20 },
  back_squat: { name: "Barbell Back Squat", muscle: "Quads & Glutes", equipment: "Barbell", category: "lower", unit: "lbs", defaultWeight: 65, repLow: 6, repHigh: 10 },
  barbell_rdl: { name: "Barbell Romanian Deadlift", muscle: "Hamstrings & Glutes", equipment: "Barbell", category: "lower", unit: "lbs", defaultWeight: 65, repLow: 6, repHigh: 10 },
  db_walking_lunge: { name: "Dumbbell Walking Lunge", muscle: "Quads & Glutes", equipment: "Dumbbell", category: "lower", unit: "lbs", defaultWeight: 15, repLow: 8, repHigh: 12 },
  cable_glute_kickback: { name: "Cable Glute Kickback", muscle: "Glutes", equipment: "Functional Trainer", category: "lower", unit: "lbs", defaultWeight: 20, repLow: 12, repHigh: 15 },
  db_step_up: { name: "Dumbbell Step-Up", muscle: "Quads & Glutes", equipment: "Dumbbell + Bench", category: "lower", unit: "lbs", defaultWeight: 15, repLow: 8, repHigh: 12 },
  band_lateral_walk: { name: "Band Lateral Walk", muscle: "Hip Stability", equipment: "Resistance Band", category: "lower", unit: "band", repLow: 15, repHigh: 20 },
  goblet_squat: { name: "Dumbbell Goblet Squat", muscle: "Quads & Glutes", equipment: "Dumbbell", category: "lower", unit: "lbs", defaultWeight: 25, repLow: 8, repHigh: 12 },
  db_bench_press: { name: "Dumbbell Bench Press", muscle: "Chest", equipment: "Dumbbell + Bench", category: "upper", unit: "lbs", defaultWeight: 20, repLow: 8, repHigh: 12 },
  cable_seated_row: { name: "Seated Cable Row", muscle: "Back", equipment: "Functional Trainer", category: "upper", unit: "lbs", defaultWeight: 50, repLow: 8, repHigh: 12 },
  band_pull_apart: { name: "Band Pull-Apart", muscle: "Rear Delts", equipment: "Resistance Band", category: "upper", unit: "band", repLow: 15, repHigh: 20 },
};

/**
 * Blocks are organized by single muscle group — a Peloton-strength-class
 * style (think Sandy Brockman / Adrian Williams / Tunde Oyeneyin): 2-3
 * exercises that all load the same muscle, done as a circuit (cycle through
 * all of them, then rest), so that muscle gets real volume in one place
 * instead of being split one-exercise-at-a-time across antagonist pairs.
 */
export const DAY_BLOCKS: Record<DayType, ExerciseBlock[]> = {
  upper: [
    { label: "Chest", exerciseIds: ["bench_press", "db_chest_fly", "pushups"] },
    { label: "Back", exerciseIds: ["db_row", "cable_lat_pulldown", "cable_seated_row"] },
    { label: "Shoulders", exerciseIds: ["db_shoulder_press", "db_lateral_raise"] },
    { label: "Arms & Rear Delts", exerciseIds: ["db_bicep_curl", "cable_triceps_pushdown", "band_face_pull"] },
  ],
  lower: [
    { label: "Quads & Hamstrings", exerciseIds: ["back_squat", "barbell_rdl"] },
    { label: "Glutes & Unilateral", exerciseIds: ["db_walking_lunge", "cable_glute_kickback"] },
    { label: "Stability & Finishers", exerciseIds: ["db_step_up", "band_lateral_walk"] },
  ],
  full: [
    { label: "Legs", exerciseIds: ["goblet_squat", "barbell_rdl"] },
    { label: "Chest", exerciseIds: ["db_bench_press", "pushups"] },
    { label: "Shoulders & Legs", exerciseIds: ["db_shoulder_press", "db_lateral_raise", "db_walking_lunge"] },
    { label: "Back", exerciseIds: ["cable_seated_row", "band_pull_apart"] },
  ],
};

export const DAY_META: Record<DayType, { label: string; accent: string }> = {
  upper: { label: "Upper Body", accent: colors.moss },
  lower: { label: "Lower Body", accent: colors.clay },
  full: { label: "Full Body", accent: colors.inkSoft },
};
