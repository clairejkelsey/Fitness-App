import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ArrowLeft, RefreshCw } from "lucide-react-native";
import { colors } from "../theme";
import { DAY_META } from "../data/exercises";
import type { Category, DayType, ExerciseBlock, ExerciseInfo, ExerciseState, HistoryEntry } from "../types";
import ExerciseSwapModal from "./ExerciseSwapModal";

interface Props {
  dayType: DayType;
  blocks: ExerciseBlock[];
  exerciseInfo: Record<string, ExerciseInfo>;
  existingExercises: Record<string, ExerciseState>;
  onCancel: () => void;
  onFinish: (entries: HistoryEntry[]) => void;
  onSwapExercise: (oldId: string, newId: string) => void;
  onAddCustomExercise: (oldId: string, info: ExerciseInfo) => void;
}

interface FormRow {
  weight: string;
  reps: [string, string, string];
}

function initialRow(id: string, info: ExerciseInfo | undefined, existingExercises: Record<string, ExerciseState>): FormRow {
  const existing = existingExercises[id];
  let weight = "";
  if (info?.unit === "band") {
    weight = existing?.bandLevel ?? "";
  } else if (existing?.weight != null) {
    weight = String(existing.weight);
  } else if (info?.defaultWeight != null) {
    weight = String(info.defaultWeight);
  }
  return { weight, reps: ["", "", ""] };
}

export default function WorkoutLogScreen({
  dayType,
  blocks,
  exerciseInfo,
  existingExercises,
  onCancel,
  onFinish,
  onSwapExercise,
  onAddCustomExercise,
}: Props) {
  const ids = blocks.flatMap((b) => b.exerciseIds);
  const idsKey = ids.join(",");
  const [form, setForm] = useState<Record<string, FormRow>>(() =>
    Object.fromEntries(ids.map((id) => [id, initialRow(id, exerciseInfo[id], existingExercises)]))
  );
  const [swapTargetId, setSwapTargetId] = useState<string | null>(null);

  useEffect(() => {
    setForm((prev) => {
      const sameKeys = ids.length === Object.keys(prev).length && ids.every((id) => id in prev);
      if (sameKeys) return prev;
      const next: Record<string, FormRow> = {};
      ids.forEach((id) => {
        next[id] = prev[id] ?? initialRow(id, exerciseInfo[id], existingExercises);
      });
      return next;
    });
    // Only re-sync when the set of exercise ids for this day changes (e.g. after a swap).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey]);

  function updateWeight(id: string, val: string) {
    setForm((f) => ({ ...f, [id]: { ...f[id], weight: val } }));
  }
  function updateReps(id: string, idx: number, val: string) {
    setForm((f) => {
      const reps = [...f[id].reps] as [string, string, string];
      reps[idx] = val;
      return { ...f, [id]: { ...f[id], reps } };
    });
  }

  function handleFinish() {
    const entries: HistoryEntry[] = [];
    ids.forEach((id) => {
      const info = exerciseInfo[id];
      const row = form[id];
      if (!info || !row) return;
      const raw = row.weight.trim();
      if (raw === "") return;
      const sets = row.reps.filter((r) => r !== "").map((r) => parseInt(r, 10));
      if (info.unit === "lbs") {
        const num = parseFloat(raw);
        if (isNaN(num)) return;
        entries.push({ id, name: info.name, weight: num, unit: info.unit, sets });
      } else {
        entries.push({ id, name: info.name, weight: null, bandLevel: raw, unit: info.unit, sets });
      }
    });
    onFinish(entries);
  }

  const meta = DAY_META[dayType];
  const defaultCategory: Category | null = dayType === "full" ? null : dayType;
  const swapTargetInfo = swapTargetId ? exerciseInfo[swapTargetId] ?? null : null;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={onCancel} style={styles.backRow}>
          <ArrowLeft size={16} color={colors.inkSoft} />
          <Text style={styles.backLabel}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: meta.accent }]}>{meta.label}</Text>
        <Text style={styles.subtitle}>Suggested weights are a starting point — adjust to what feels right</Text>

        {blocks.map((block, blockIndex) => (
          <View key={block.label + blockIndex} style={styles.block}>
            <View style={styles.blockHeader}>
              <Text style={[styles.blockLabel, { color: meta.accent }]}>{block.label}</Text>
              <Text style={styles.blockHint}>Superset · alternate, rest after both</Text>
            </View>

            {block.exerciseIds.map((id) => {
              const info = exerciseInfo[id];
              const row = form[id];
              if (!info || !row) return null;
              return (
                <View key={id} style={styles.exerciseCard}>
                  <View style={styles.exerciseHeaderRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.exerciseName}>{info.name}</Text>
                      <Text style={styles.exerciseMeta}>
                        {info.muscle} · {info.equipment}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => setSwapTargetId(id)} style={styles.swapButton} hitSlop={8}>
                      <RefreshCw size={16} color={colors.inkSoft} />
                    </TouchableOpacity>
                  </View>

                  {info.unit === "lbs" ? (
                    <View style={styles.weightRow}>
                      <TextInput
                        keyboardType="decimal-pad"
                        placeholder="Weight"
                        placeholderTextColor={colors.placeholder}
                        value={row.weight}
                        onChangeText={(v) => updateWeight(id, v)}
                        style={styles.input}
                      />
                      <Text style={styles.unitLabel}>lbs</Text>
                    </View>
                  ) : (
                    <TextInput
                      placeholder="Band level (e.g. medium / blue)"
                      placeholderTextColor={colors.placeholder}
                      value={row.weight}
                      onChangeText={(v) => updateWeight(id, v)}
                      style={[styles.input, styles.fullWidthInput]}
                    />
                  )}

                  <View style={styles.repsRow}>
                    {[0, 1, 2].map((i) => (
                      <TextInput
                        key={i}
                        keyboardType="number-pad"
                        placeholder={`Set ${i + 1} reps`}
                        placeholderTextColor={colors.placeholder}
                        value={row.reps[i]}
                        onChangeText={(v) => updateReps(id, i, v)}
                        style={[styles.input, styles.repInput]}
                      />
                    ))}
                  </View>
                </View>
              );
            })}
          </View>
        ))}

        <TouchableOpacity onPress={handleFinish} style={styles.finishButton}>
          <Text style={styles.finishButtonText}>Finish workout</Text>
        </TouchableOpacity>
      </ScrollView>

      <ExerciseSwapModal
        visible={swapTargetId !== null}
        currentId={swapTargetId}
        currentInfo={swapTargetInfo}
        excludeIds={ids}
        exerciseInfo={exerciseInfo}
        defaultCategory={defaultCategory}
        onSelect={(newId) => {
          if (swapTargetId) onSwapExercise(swapTargetId, newId);
          setSwapTargetId(null);
        }}
        onAddCustom={(info) => {
          if (swapTargetId) onAddCustomExercise(swapTargetId, info);
          setSwapTargetId(null);
        }}
        onClose={() => setSwapTargetId(null)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 24, paddingTop: 28, paddingBottom: 100 },
  backRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16 },
  backLabel: { fontSize: 14, color: colors.inkSoft },
  title: { fontSize: 24, fontWeight: "700" },
  subtitle: { color: colors.inkSoft, fontSize: 14, marginBottom: 20 },
  block: { marginBottom: 10 },
  blockHeader: { marginBottom: 10 },
  blockLabel: { fontSize: 15, fontWeight: "700" },
  blockHint: { fontSize: 12, color: colors.inkSoft, marginTop: 1 },
  exerciseCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceMuted,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  exerciseHeaderRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 12 },
  exerciseName: { fontWeight: "600", color: colors.ink, fontSize: 15 },
  exerciseMeta: { fontSize: 12, color: colors.inkSoft, marginTop: 2 },
  swapButton: { padding: 4 },
  weightRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  unitLabel: { fontSize: 13, color: colors.inkSoft },
  repsRow: { flexDirection: "row", gap: 8 },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.surfaceMuted,
    backgroundColor: colors.bg,
    fontSize: 14,
    color: colors.ink,
    width: 80,
  },
  fullWidthInput: { width: "100%", marginBottom: 12 },
  repInput: { flex: 1, width: undefined },
  finishButton: {
    marginTop: 8,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: colors.ink,
    alignItems: "center",
  },
  finishButtonText: { color: colors.white, fontWeight: "600", fontSize: 15 },
});
