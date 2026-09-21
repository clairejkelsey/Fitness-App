import { DAY_BLOCKS, EXERCISE_INFO } from "../data/exercises";
import type { AppData, DayType, ExerciseBlock, ExerciseInfo } from "../types";

export function getAllExerciseInfo(data: AppData): Record<string, ExerciseInfo> {
  return { ...EXERCISE_INFO, ...(data.customExercises ?? {}) };
}

function isValidBlockList(value: unknown): value is ExerciseBlock[] {
  return (
    Array.isArray(value) &&
    value.every(
      (b) =>
        b &&
        typeof b === "object" &&
        typeof (b as ExerciseBlock).label === "string" &&
        Array.isArray((b as ExerciseBlock).exerciseIds)
    )
  );
}

export function getDayBlocks(data: AppData, dayType: DayType): ExerciseBlock[] {
  const override = data.dayExercises?.[dayType];
  // Guards against data saved by an older build, where dayExercises stored a
  // flat string[] of exercise ids instead of ExerciseBlock[] — without this,
  // stale local data crashes the workout screen instead of just falling
  // back to the current defaults.
  return isValidBlockList(override) ? override : DAY_BLOCKS[dayType];
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
