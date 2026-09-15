import { colors } from "../theme";
import type { DayType, ExerciseBlock, ExerciseInfo } from "../types";

/**
 * Starting weights below are generic intermediate-lifter suggestions (roughly
 * calibrated for an experienced ~130 lb, 5'8" woman doing 8-12 rep hypertrophy
 * sets) — a reasonable first guess, not a personalized prescription. Adjust
 * up or down based on how the first set actually feels.
 */
export const EXERCISE_INFO: Record<string, ExerciseInfo> = {
  bench_press: { name: "Barbell Bench Press", muscle: "Chest", equipment: "Barbell + Bench", category: "upper", unit: "lbs", defaultWeight: 55 },
  db_row: { name: "Single-Arm Dumbbell Row", muscle: "Back", equipment: "Dumbbell + Bench", category: "upper", unit: "lbs", defaultWeight: 20 },
  cable_lat_pulldown: { name: "Lat Pulldown", muscle: "Back", equipment: "Functional Trainer", category: "upper", unit: "lbs", defaultWeight: 50 },
  db_shoulder_press: { name: "Dumbbell Shoulder Press", muscle: "Shoulders", equipment: "Dumbbell", category: "upper", unit: "lbs", defaultWeight: 15 },
  db_bicep_curl: { name: "Dumbbell Bicep Curl", muscle: "Biceps", equipment: "Dumbbell", category: "upper", unit: "lbs", defaultWeight: 12 },
  band_face_pull: { name: "Band Face Pull", muscle: "Rear Delts", equipment: "Resistance Band", category: "upper", unit: "band" },
  back_squat: { name: "Barbell Back Squat", muscle: "Quads & Glutes", equipment: "Barbell", category: "lower", unit: "lbs", defaultWeight: 65 },
  barbell_rdl: { name: "Barbell Romanian Deadlift", muscle: "Hamstrings & Glutes", equipment: "Barbell", category: "lower", unit: "lbs", defaultWeight: 65 },
  db_walking_lunge: { name: "Dumbbell Walking Lunge", muscle: "Quads & Glutes", equipment: "Dumbbell", category: "lower", unit: "lbs", defaultWeight: 15 },
  cable_glute_kickback: { name: "Cable Glute Kickback", muscle: "Glutes", equipment: "Functional Trainer", category: "lower", unit: "lbs", defaultWeight: 20 },
  db_step_up: { name: "Dumbbell Step-Up", muscle: "Quads & Glutes", equipment: "Dumbbell + Bench", category: "lower", unit: "lbs", defaultWeight: 15 },
  band_lateral_walk: { name: "Band Lateral Walk", muscle: "Hip Stability", equipment: "Resistance Band", category: "lower", unit: "band" },
  goblet_squat: { name: "Dumbbell Goblet Squat", muscle: "Quads & Glutes", equipment: "Dumbbell", category: "lower", unit: "lbs", defaultWeight: 25 },
  db_bench_press: { name: "Dumbbell Bench Press", muscle: "Chest", equipment: "Dumbbell + Bench", category: "upper", unit: "lbs", defaultWeight: 20 },
  cable_seated_row: { name: "Seated Cable Row", muscle: "Back", equipment: "Functional Trainer", category: "upper", unit: "lbs", defaultWeight: 50 },
  band_pull_apart: { name: "Band Pull-Apart", muscle: "Rear Delts", equipment: "Resistance Band", category: "upper", unit: "band" },
};

/**
 * Each day is organized into supersets (blocks) of 2 exercises, paired by
 * body part so the two moves in a block complement each other (e.g. a push
 * paired with a pull) rather than just running through six exercises in a row.
 */
export const DAY_BLOCKS: Record<DayType, ExerciseBlock[]> = {
  upper: [
    { label: "Chest & Back", exerciseIds: ["bench_press", "db_row"] },
    { label: "Shoulders & Lats", exerciseIds: ["db_shoulder_press", "cable_lat_pulldown"] },
    { label: "Arms & Rear Delts", exerciseIds: ["db_bicep_curl", "band_face_pull"] },
  ],
  lower: [
    { label: "Quads & Hamstrings", exerciseIds: ["back_squat", "barbell_rdl"] },
    { label: "Glutes & Unilateral", exerciseIds: ["db_walking_lunge", "cable_glute_kickback"] },
    { label: "Stability & Finishers", exerciseIds: ["db_step_up", "band_lateral_walk"] },
  ],
  full: [
    { label: "Lower Body Push & Pull", exerciseIds: ["goblet_squat", "barbell_rdl"] },
    { label: "Upper Body Push & Pull", exerciseIds: ["db_bench_press", "cable_seated_row"] },
    { label: "Shoulders & Rear Delts", exerciseIds: ["db_shoulder_press", "band_pull_apart"] },
  ],
};

export const DAY_META: Record<DayType, { label: string; accent: string }> = {
  upper: { label: "Upper Body", accent: colors.moss },
  lower: { label: "Lower Body", accent: colors.clay },
  full: { label: "Full Body", accent: colors.inkSoft },
};
