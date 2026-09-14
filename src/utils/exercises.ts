import { DAY_EXERCISES, EXERCISE_INFO } from "../data/exercises";
import type { AppData, DayType, ExerciseInfo } from "../types";

export function getAllExerciseInfo(data: AppData): Record<string, ExerciseInfo> {
  return { ...EXERCISE_INFO, ...(data.customExercises ?? {}) };
}

export function getDayExerciseIds(data: AppData, dayType: DayType): string[] {
  return data.dayExercises?.[dayType] ?? DAY_EXERCISES[dayType];
}

export function makeExerciseId(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return `custom_${slug || "exercise"}_${Date.now().toString(36)}`;
}
