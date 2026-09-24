import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Check, ChevronRight, ClipboardList, Dumbbell, TrendingUp } from "lucide-react-native";
import { colors } from "../theme";
import { DAY_META } from "../data/exercises";
import type { AppData, DayType } from "../types";
import { formatDateRange } from "../utils/date";
import { getDayExerciseIds } from "../utils/exercises";

interface Props {
  data: AppData;
  saving: boolean;
  onStart: (dayType: DayType) => void;
  onHistory: () => void;
  onProgress: () => void;
}

export default function HomeScreen({ data, saving, onStart, onHistory, onProgress }: Props) {
  const currentWeek = data.currentWeek!;
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={styles.headerRow}>
        <Text style={styles.weekTitle}>Week {currentWeek.weekIndex}</Text>
        <Text style={styles.dateRange}>{formatDateRange(currentWeek.weekStart)}</Text>
      </View>
      <Text style={styles.summary}>
        {currentWeek.pilatesDays} Pilates days this week · {currentWeek.dayTypes.length} strength days
      </Text>

      {currentWeek.dayTypes.map((dt) => {
        const done = currentWeek.completedDayTypes.includes(dt);
        const meta = DAY_META[dt];
        return (
          <TouchableOpacity key={dt} onPress={() => onStart(dt)} style={styles.dayCard}>
            <View style={[styles.dayIcon, { backgroundColor: meta.accent }]}>
              {done ? <Check color={colors.white} size={20} /> : <Dumbbell color={colors.white} size={20} />}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.dayLabel}>{meta.label}</Text>
              <Text style={styles.daySubtitle}>
                {done ? "Completed this week" : `${getDayExerciseIds(data, dt).length} exercises · ~30–40 min`}
              </Text>
            </View>
            <ChevronRight color={colors.inkSoft} size={18} />
          </TouchableOpacity>
        );
      })}

      <View style={styles.navRow}>
        <NavCard icon={<ClipboardList size={18} color={colors.ink} />} label="History" onPress={onHistory} />
        <NavCard icon={<TrendingUp size={18} color={colors.ink} />} label="Progress" onPress={onProgress} />
      </View>
      <Text style={styles.savingLabel}>{saving ? "Saving…" : " "}</Text>
    </ScrollView>
  );
}

function NavCard({ icon, label, onPress }: { icon: React.ReactNode; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.navCard}>
      {icon}
      <Text style={styles.navCardLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  page: { padding: 24, paddingTop: 32, paddingBottom: 40 },
  headerRow: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between" },
  weekTitle: { fontSize: 26, fontWeight: "700", color: colors.ink },
  dateRange: { fontSize: 13, color: colors.inkSoft },
  summary: { color: colors.inkSoft, marginTop: 4, marginBottom: 24, fontSize: 14 },
  dayCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceMuted,
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
  },
  dayIcon: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  dayLabel: { fontWeight: "600", color: colors.ink, fontSize: 15 },
  daySubtitle: { fontSize: 13, color: colors.inkSoft, marginTop: 2 },
  navRow: { flexDirection: "row", gap: 12, marginTop: 24 },
  navCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.surfaceMuted,
    backgroundColor: colors.surface,
  },
  navCardLabel: { fontSize: 14, fontWeight: "500", color: colors.ink },
  savingLabel: { textAlign: "center", fontSize: 11, color: colors.inkSoft, marginTop: 20 },
});
