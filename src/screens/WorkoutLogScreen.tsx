import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { colors } from "../theme";
import { DAY_EXERCISES, DAY_META, EXERCISE_INFO } from "../data/exercises";
import type { DayType, ExerciseState, HistoryEntry } from "../types";

interface Props {
  dayType: DayType;
  existingExercises: Record<string, ExerciseState>;
  onCancel: () => void;
  onFinish: (entries: HistoryEntry[]) => void;
}

interface FormRow {
  weight: string;
  reps: [string, string, string];
}

export default function WorkoutLogScreen({ dayType, existingExercises, onCancel, onFinish }: Props) {
  const ids = DAY_EXERCISES[dayType];
  const [form, setForm] = useState<Record<string, FormRow>>(() =>
    Object.fromEntries(
      ids.map((id) => [
        id,
        {
          weight: existingExercises[id]?.weight ? String(existingExercises[id].weight) : "",
          reps: ["", "", ""] as [string, string, string],
        },
      ])
    )
  );

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
      const info = EXERCISE_INFO[id];
      const raw = form[id].weight;
      const num = parseFloat(raw);
      if (raw !== "" && !isNaN(num)) {
        entries.push({
          id,
          name: info.name,
          weight: num,
          unit: info.unit,
          sets: form[id].reps.filter((r) => r !== "").map((r) => parseInt(r, 10)),
        });
      }
    });
    onFinish(entries);
  }

  const meta = DAY_META[dayType];

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={onCancel} style={styles.backRow}>
          <ArrowLeft size={16} color={colors.inkSoft} />
          <Text style={styles.backLabel}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: meta.accent }]}>{meta.label}</Text>
        <Text style={styles.subtitle}>3 sets · 8–12 reps · pick a challenging weight</Text>

        {ids.map((id) => {
          const info = EXERCISE_INFO[id];
          return (
            <View key={id} style={styles.exerciseCard}>
              <Text style={styles.exerciseName}>{info.name}</Text>
              <Text style={styles.exerciseMeta}>
                {info.muscle} · {info.equipment}
              </Text>

              {info.unit === "lbs" ? (
                <View style={styles.weightRow}>
                  <TextInput
                    keyboardType="decimal-pad"
                    placeholder="Weight"
                    placeholderTextColor={colors.placeholder}
                    value={form[id].weight}
                    onChangeText={(v) => updateWeight(id, v)}
                    style={styles.input}
                  />
                  <Text style={styles.unitLabel}>lbs</Text>
                </View>
              ) : (
                <TextInput
                  placeholder="Band level (e.g. medium / blue)"
                  placeholderTextColor={colors.placeholder}
                  value={form[id].weight}
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
                    value={form[id].reps[i]}
                    onChangeText={(v) => updateReps(id, i, v)}
                    style={[styles.input, styles.repInput]}
                  />
                ))}
              </View>
            </View>
          );
        })}

        <TouchableOpacity onPress={handleFinish} style={styles.finishButton}>
          <Text style={styles.finishButtonText}>Finish workout</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 24, paddingTop: 28, paddingBottom: 100 },
  backRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16 },
  backLabel: { fontSize: 14, color: colors.inkSoft },
  title: { fontSize: 24, fontWeight: "700" },
  subtitle: { color: colors.inkSoft, fontSize: 14, marginBottom: 24 },
  exerciseCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceMuted,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  exerciseName: { fontWeight: "600", color: colors.ink, fontSize: 15 },
  exerciseMeta: { fontSize: 12, color: colors.inkSoft, marginBottom: 12 },
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
