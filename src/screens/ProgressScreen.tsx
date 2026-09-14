import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme";
import type { ExerciseInfo, ExerciseState, HistoryRecord } from "../types";
import { formatDate } from "../utils/date";
import BackHeader from "./BackHeader";

interface Props {
  history: HistoryRecord[];
  exercises: Record<string, ExerciseState>;
  exerciseInfo: Record<string, ExerciseInfo>;
  onBack: () => void;
}

export default function ProgressScreen({ history, exercises, exerciseInfo, onBack }: Props) {
  const ids = Object.keys(exercises).filter((id) => exerciseInfo[id]?.unit === "lbs");

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <BackHeader onBack={onBack} title="Progress" />
      {ids.length === 0 && <Text style={styles.empty}>Log a few workouts to see trends here.</Text>}
      {ids.map((id) => {
        const info = exerciseInfo[id];
        const points = history
          .filter((h) => h.entries.some((e) => e.id === id))
          .map((h) => ({ date: h.date, weight: h.entries.find((e) => e.id === id)!.weight }))
          .reverse()
          .slice(-6);
        if (points.length === 0) return null;
        const max = Math.max(...points.map((p) => p.weight));
        return (
          <View key={id} style={styles.card}>
            <Text style={styles.title}>{info.name}</Text>
            <View style={styles.barRow}>
              {points.map((p, i) => (
                <View key={i} style={styles.barColumn}>
                  <View
                    style={{
                      height: Math.max(8, (p.weight / max) * 50),
                      backgroundColor: info.category === "upper" ? colors.moss : colors.clay,
                      borderRadius: 4,
                      width: "100%",
                    }}
                  />
                </View>
              ))}
            </View>
            <View style={styles.footerRow}>
              <Text style={styles.footerDate}>{formatDate(points[0].date)}</Text>
              <Text style={styles.footerWeight}>{points[points.length - 1].weight} lbs</Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 24, paddingTop: 28, paddingBottom: 40 },
  empty: { color: colors.inkSoft },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceMuted,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  title: { fontWeight: "600", marginBottom: 10, color: colors.ink },
  barRow: { flexDirection: "row", alignItems: "flex-end", gap: 6, height: 60 },
  barColumn: { flex: 1, alignItems: "center" },
  footerRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 6 },
  footerDate: { fontSize: 12, color: colors.inkSoft },
  footerWeight: { fontSize: 13, fontWeight: "600", color: colors.ink },
});
