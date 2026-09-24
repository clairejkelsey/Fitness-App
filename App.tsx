import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { colors } from "./src/theme";
import { loadData, saveData } from "./src/storage";
import { emptyData } from "./src/types";
import type { AppData, CurrentWeek, DayType, ExerciseBlock, ExerciseInfo, HistoryEntry } from "./src/types";
import { mostRecentSunday, toISODate, weekIndexFor } from "./src/utils/date";
import { getAllExerciseInfo, getDayBlocks, makeExerciseId } from "./src/utils/exercises";
import { ensureSundayCheckinReminder } from "./src/notifications";

import CheckinScreen from "./src/screens/CheckinScreen";
import HomeScreen from "./src/screens/HomeScreen";
import WorkoutLogScreen from "./src/screens/WorkoutLogScreen";
import HistoryScreen from "./src/screens/HistoryScreen";
import ProgressScreen from "./src/screens/ProgressScreen";

type ViewName = "home" | "checkin" | "workout" | "history" | "progress";
type CheckinStep = "pilates" | "progression" | null;

interface PendingWeek {
  week: CurrentWeek;
  programStartDate: string;
}

interface ProgressionDecisions {
  upper: boolean;
  lower: boolean;
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AppData>(emptyData());
  const [view, setView] = useState<ViewName>("home");
  const [activeDayType, setActiveDayType] = useState<DayType | null>(null);
  const [checkinStep, setCheckinStep] = useState<CheckinStep>(null);
  const [pendingWeek, setPendingWeek] = useState<PendingWeek | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const loaded = (await loadData()) ?? emptyData();
      setData(loaded);
      const thisWeekStart = mostRecentSunday();
      if (!loaded.currentWeek || loaded.currentWeek.weekStart !== thisWeekStart) {
        setCheckinStep("pilates");
        setView("checkin");
      } else {
        setView("home");
      }
      setLoading(false);
      ensureSundayCheckinReminder();
    })();
  }, []);

  const persist = useCallback(async (next: AppData) => {
    setData(next);
    setSaving(true);
    await saveData(next);
    setSaving(false);
  }, []);

  function choosePilatesDays(n: number) {
    const thisWeekStart = mostRecentSunday();
    const dayTypes: DayType[] = n === 3 ? ["upper", "lower", "full"] : ["upper", "lower"];
    const programStartDate = data.programStartDate || thisWeekStart;
    const idx = weekIndexFor(programStartDate, thisWeekStart);
    const week: CurrentWeek = {
      weekStart: thisWeekStart,
      pilatesDays: n,
      dayTypes,
      completedDayTypes: [],
      weekIndex: idx,
    };
    const progressionDue = idx > 1 && (idx - 1) % 4 === 0;
    if (progressionDue) {
      setPendingWeek({ week, programStartDate });
      setCheckinStep("progression");
    } else {
      finalizeWeek(week, programStartDate, null);
    }
  }

  function finalizeWeek(week: CurrentWeek, programStartDate: string, decisions: ProgressionDecisions | null) {
    const exercises = { ...data.exercises };
    let progressionHistory = data.progressionHistory;
    if (decisions) {
      Object.entries(getAllExerciseInfo(data)).forEach(([id, info]) => {
        if (info.unit !== "lbs") return;
        const wantsIncrease = decisions[info.category];
        const current = exercises[id];
        if (wantsIncrease && current?.weight != null) {
          exercises[id] = { ...current, weight: current.weight + 5 };
        }
      });
      progressionHistory = [
        ...progressionHistory,
        { weekIndex: week.weekIndex, date: toISODate(new Date()), upper: decisions.upper, lower: decisions.lower },
      ];
    }
    const next: AppData = { ...data, programStartDate, currentWeek: week, exercises, progressionHistory };
    persist(next);
    setPendingWeek(null);
    setCheckinStep(null);
    setView("home");
  }

  function submitProgression(decisions: ProgressionDecisions) {
    if (!pendingWeek) return;
    finalizeWeek(pendingWeek.week, pendingWeek.programStartDate, decisions);
  }

  function startWorkout(dayType: DayType) {
    setActiveDayType(dayType);
    setView("workout");
  }

  function finishWorkout(dayType: DayType, entries: HistoryEntry[]) {
    if (!data.currentWeek) return;
    const exercises = { ...data.exercises };
    const exerciseInfo = getAllExerciseInfo(data);
    entries.forEach((e) => {
      const info = exerciseInfo[e.id];
      exercises[e.id] = {
        weight: e.weight,
        bandLevel: e.bandLevel,
        repLow: info?.repLow ?? 8,
        repHigh: info?.repHigh ?? 12,
      };
    });
    const historyEntry = {
      date: toISODate(new Date()),
      weekIndex: data.currentWeek.weekIndex,
      dayType,
      entries,
    };
    const currentWeek: CurrentWeek = {
      ...data.currentWeek,
      completedDayTypes: Array.from(new Set([...data.currentWeek.completedDayTypes, dayType])),
    };
    const next: AppData = { ...data, exercises, history: [historyEntry, ...data.history], currentWeek };
    persist(next);
    setActiveDayType(null);
    setView("home");
  }

  function normalizedDayExercises(d: AppData): Record<DayType, ExerciseBlock[]> {
    return {
      upper: getDayBlocks(d, "upper"),
      lower: getDayBlocks(d, "lower"),
      full: getDayBlocks(d, "full"),
    };
  }

  function replaceInBlocks(blocks: ExerciseBlock[], oldId: string, newId: string): ExerciseBlock[] {
    return blocks.map((block) =>
      block.exerciseIds.includes(oldId)
        ? { ...block, exerciseIds: block.exerciseIds.map((id) => (id === oldId ? newId : id)) }
        : block
    );
  }

  function swapExercise(dayType: DayType, oldId: string, newId: string) {
    const blocks = getDayBlocks(data, dayType);
    const allIds = blocks.flatMap((b) => b.exerciseIds);
    if (!allIds.includes(oldId) || allIds.includes(newId)) return;
    const dayExercises = { ...normalizedDayExercises(data), [dayType]: replaceInBlocks(blocks, oldId, newId) };
    persist({ ...data, dayExercises });
  }

  function addCustomExerciseAndSwap(dayType: DayType, oldId: string, info: ExerciseInfo) {
    const id = makeExerciseId(info.name);
    const customExercises = { ...(data.customExercises ?? {}), [id]: info };
    const blocks = getDayBlocks(data, dayType);
    const dayExercises = { ...normalizedDayExercises(data), [dayType]: replaceInBlocks(blocks, oldId, id) };
    persist({ ...data, customExercises, dayExercises });
  }

  let content: React.ReactNode;

  if (loading) {
    content = (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.moss} />
      </View>
    );
  } else if (view === "checkin" && checkinStep) {
    content = (
      <CheckinScreen
        step={checkinStep}
        isFirstWeek={!data.programStartDate}
        onPilates={choosePilatesDays}
        onProgression={submitProgression}
      />
    );
  } else if (view === "workout" && activeDayType) {
    content = (
      <WorkoutLogScreen
        dayType={activeDayType}
        blocks={getDayBlocks(data, activeDayType)}
        exerciseInfo={getAllExerciseInfo(data)}
        existingExercises={data.exercises}
        onCancel={() => {
          setActiveDayType(null);
          setView("home");
        }}
        onFinish={(entries) => finishWorkout(activeDayType, entries)}
        onSwapExercise={(oldId, newId) => swapExercise(activeDayType, oldId, newId)}
        onAddCustomExercise={(oldId, info) => addCustomExerciseAndSwap(activeDayType, oldId, info)}
      />
    );
  } else if (view === "history") {
    content = <HistoryScreen history={data.history} onBack={() => setView("home")} />;
  } else if (view === "progress") {
    content = (
      <ProgressScreen
        history={data.history}
        exercises={data.exercises}
        exerciseInfo={getAllExerciseInfo(data)}
        onBack={() => setView("home")}
      />
    );
  } else if (data.currentWeek) {
    content = (
      <HomeScreen
        data={data}
        saving={saving}
        onStart={startWorkout}
        onHistory={() => setView("history")}
        onProgress={() => setView("progress")}
      />
    );
  } else {
    content = (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.moss} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
        {content}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
});
