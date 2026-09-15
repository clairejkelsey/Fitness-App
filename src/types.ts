export type Unit = "lbs" | "band";
export type Category = "upper" | "lower";
export type DayType = "upper" | "lower" | "full";

export interface ExerciseInfo {
  name: string;
  muscle: string;
  equipment: string;
  category: Category;
  unit: Unit;
  /** Suggested starting weight (lbs) for an intermediate lifter, used to prefill before any history exists. */
  defaultWeight?: number;
}

export interface ExerciseState {
  /** null for band-based exercises, which are tracked by bandLevel instead. */
  weight: number | null;
  bandLevel?: string;
  repLow: number;
  repHigh: number;
}

/** A small group of exercises performed as a superset (back-to-back, then rest). */
export interface ExerciseBlock {
  label: string;
  exerciseIds: string[];
}

export interface CurrentWeek {
  weekStart: string;
  pilatesDays: number;
  dayTypes: DayType[];
  completedDayTypes: DayType[];
  weekIndex: number;
}

export interface HistoryEntry {
  id: string;
  name: string;
  weight: number | null;
  bandLevel?: string;
  unit: Unit;
  sets: number[];
}

export interface HistoryRecord {
  date: string;
  weekIndex: number;
  dayType: DayType;
  entries: HistoryEntry[];
}

export interface ProgressionRecord {
  weekIndex: number;
  date: string;
  upper: boolean;
  lower: boolean;
}

export interface AppData {
  programStartDate: string | null;
  currentWeek: CurrentWeek | null;
  exercises: Record<string, ExerciseState>;
  history: HistoryRecord[];
  progressionHistory: ProgressionRecord[];
  /** Per-day-type exercise blocks, when the user has swapped away from the defaults. */
  dayExercises?: Partial<Record<DayType, ExerciseBlock[]>>;
  /** User-added exercises, keyed by generated id, merged with the built-in library. */
  customExercises?: Record<string, ExerciseInfo>;
}

export const emptyData = (): AppData => ({
  programStartDate: null,
  currentWeek: null,
  exercises: {},
  history: [],
  progressionHistory: [],
});
