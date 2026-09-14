import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme";
import { DAY_META } from "../data/exercises";
import type { HistoryRecord } from "../types";
import { formatDate } from "../utils/date";
import BackHeader from "./BackHeader";

interface Props {
  history: HistoryRecord[];
  onBack: () => void;
}

export default function HistoryScreen({ history, onBack }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <BackHeader onBack={onBack} title="History" />
      {history.length === 0 && <Text style={styles.empty}>No workouts logged yet.</Text>}
      {history.map((h, i) => {
        const meta = DAY_META[h.dayType];
        return (
          <View key={i} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: meta.accent }]}>{meta.label}</Text>
              <Text style={styles.cardDate}>
                {formatDate(h.date)} · Week {h.weekIndex}
              </Text>
            </View>
            {h.entries.map((e) => (
              <Text key={e.id} style={styles.entryLine}>
                {e.name}: {e.weight}
                {e.unit === "lbs" ? " lbs" : ""} × [{e.sets.join(", ")}] reps
              </Text>
            ))}
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
  cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  cardTitle: { fontWeight: "600" },
  cardDate: { fontSize: 12, color: colors.inkSoft },
  entryLine: { fontSize: 13, color: colors.inkSoft, marginBottom: 2 },
});
