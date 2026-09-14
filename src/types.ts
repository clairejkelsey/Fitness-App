export type Unit = "lbs" | "band";
export type Category = "upper" | "lower";
export type DayType = "upper" | "lower" | "full";

export interface ExerciseInfo {
  name: string;
  muscle: string;
  equipment: string;
  category: Category;
  unit: Unit;
}

export interface ExerciseState {
  weight: number;
  repLow: number;
  repHigh: number;
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
  weight: number;
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
  /** Per-day-type exercise lists, when the user has swapped away from the defaults. */
  dayExercises?: Partial<Record<DayType, string[]>>;
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
