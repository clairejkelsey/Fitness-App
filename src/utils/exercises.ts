import { DAY_BLOCKS, EXERCISE_INFO } from "../data/exercises";
import type { AppData, DayType, ExerciseBlock, ExerciseInfo } from "../types";

export function getAllExerciseInfo(data: AppData): Record<string, ExerciseInfo> {
  return { ...EXERCISE_INFO, ...(data.customExercises ?? {}) };
}

export function getDayBlocks(data: AppData, dayType: DayType): ExerciseBlock[] {
  return data.dayExercises?.[dayType] ?? DAY_BLOCKS[dayType];
}

export function getDayExerciseIds(data: AppData, dayType: DayType): string[] {
  return getDayBlocks(data, dayType).flatMap((block) => block.exerciseIds);
}

export function makeExerciseId(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return `custom_${slug || "exercise"}_${Date.now().toString(36)}`;
}
