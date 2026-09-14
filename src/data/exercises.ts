import { colors } from "../theme";
import type { DayType, ExerciseInfo } from "../types";

export const EXERCISE_INFO: Record<string, ExerciseInfo> = {
  bench_press: { name: "Barbell Bench Press", muscle: "Chest", equipment: "Barbell + Bench", category: "upper", unit: "lbs" },
  db_row: { name: "Single-Arm Dumbbell Row", muscle: "Back", equipment: "Dumbbell + Bench", category: "upper", unit: "lbs" },
  cable_lat_pulldown: { name: "Lat Pulldown", muscle: "Back", equipment: "Functional Trainer", category: "upper", unit: "lbs" },
  db_shoulder_press: { name: "Dumbbell Shoulder Press", muscle: "Shoulders", equipment: "Dumbbell", category: "upper", unit: "lbs" },
  db_bicep_curl: { name: "Dumbbell Bicep Curl", muscle: "Biceps", equipment: "Dumbbell", category: "upper", unit: "lbs" },
  band_face_pull: { name: "Band Face Pull", muscle: "Rear Delts", equipment: "Resistance Band", category: "upper", unit: "band" },
  back_squat: { name: "Barbell Back Squat", muscle: "Quads & Glutes", equipment: "Barbell", category: "lower", unit: "lbs" },
  barbell_rdl: { name: "Barbell Romanian Deadlift", muscle: "Hamstrings & Glutes", equipment: "Barbell", category: "lower", unit: "lbs" },
  db_walking_lunge: { name: "Dumbbell Walking Lunge", muscle: "Quads & Glutes", equipment: "Dumbbell", category: "lower", unit: "lbs" },
  cable_glute_kickback: { name: "Cable Glute Kickback", muscle: "Glutes", equipment: "Functional Trainer", category: "lower", unit: "lbs" },
  db_step_up: { name: "Dumbbell Step-Up", muscle: "Quads & Glutes", equipment: "Dumbbell + Bench", category: "lower", unit: "lbs" },
  band_lateral_walk: { name: "Band Lateral Walk", muscle: "Hip Stability", equipment: "Resistance Band", category: "lower", unit: "band" },
  goblet_squat: { name: "Dumbbell Goblet Squat", muscle: "Quads & Glutes", equipment: "Dumbbell", category: "lower", unit: "lbs" },
  db_bench_press: { name: "Dumbbell Bench Press", muscle: "Chest", equipment: "Dumbbell + Bench", category: "upper", unit: "lbs" },
  cable_seated_row: { name: "Seated Cable Row", muscle: "Back", equipment: "Functional Trainer", category: "upper", unit: "lbs" },
  band_pull_apart: { name: "Band Pull-Apart", muscle: "Rear Delts", equipment: "Resistance Band", category: "upper", unit: "band" },
};

export const DAY_EXERCISES: Record<DayType, string[]> = {
  upper: ["bench_press", "db_row", "cable_lat_pulldown", "db_shoulder_press", "db_bicep_curl", "band_face_pull"],
  lower: ["back_squat", "barbell_rdl", "db_walking_lunge", "cable_glute_kickback", "db_step_up", "band_lateral_walk"],
  full: ["goblet_squat", "db_bench_press", "barbell_rdl", "cable_seated_row", "db_shoulder_press", "band_pull_apart"],
};

export const DAY_META: Record<DayType, { label: string; accent: string }> = {
  upper: { label: "Upper Body", accent: colors.moss },
  lower: { label: "Lower Body", accent: colors.clay },
  full: { label: "Full Body", accent: colors.inkSoft },
};
