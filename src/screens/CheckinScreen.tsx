import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Calendar, Sparkles } from "lucide-react-native";
import { colors } from "../theme";

type Step = "pilates" | "progression";

interface Props {
  step: Step;
  isFirstWeek: boolean;
  onPilates: (n: number) => void;
  onProgression: (decisions: { upper: boolean; lower: boolean }) => void;
}

export default function CheckinScreen({ step, isFirstWeek, onPilates, onProgression }: Props) {
  const [upper, setUpper] = useState<boolean | null>(null);
  const [lower, setLower] = useState<boolean | null>(null);

  if (step === "pilates") {
    return (
      <ScrollView contentContainerStyle={styles.page}>
        <Calendar size={28} color={colors.moss} />
        <Text style={styles.title}>
          {isFirstWeek ? "Let's set up your first week" : "New week, quick check-in"}
        </Text>
        <Text style={styles.subtitle}>How many days are you doing Pilates this week?</Text>
        <View style={styles.row}>
          {[3, 4].map((n) => (
            <TouchableOpacity key={n} onPress={() => onPilates(n)} style={styles.pilatesButton}>
              <Text style={styles.pilatesNumber}>{n}</Text>
              <Text style={styles.pilatesLabel}>days of Pilates</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.hint}>
          3 days of Pilates → upper, lower, and full-body strength. 4 days of Pilates → upper and
          lower only.
        </Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Sparkles size={28} color={colors.brass} />
      <Text style={styles.title}>Four weeks in — ready to push?</Text>
      <Text style={styles.subtitle}>
        You've had four weeks with your current weights. Where do you want to add load? This
        bumps working weights up by 5 lbs — you can say yes to one and no to the other.
      </Text>
      <ProgressionChoice label="Upper body" value={upper} onChange={setUpper} accent={colors.moss} />
      <View style={{ height: 16 }} />
      <ProgressionChoice label="Lower body" value={lower} onChange={setLower} accent={colors.clay} />
      <TouchableOpacity
        disabled={upper === null || lower === null}
        onPress={() => onProgression({ upper: upper as boolean, lower: lower as boolean })}
        style={[
          styles.continueButton,
          { backgroundColor: upper === null || lower === null ? colors.surfaceMuted : colors.ink },
        ]}
      >
        <Text
          style={[
            styles.continueButtonText,
            { color: upper === null || lower === null ? colors.inkSoft : colors.white },
          ]}
        >
          Continue to this week's plan
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function ProgressionChoice({
  label,
  value,
  onChange,
  accent,
}: {
  label: string;
  value: boolean | null;
  onChange: (v: boolean) => void;
  accent: string;
}) {
  return (
    <View style={styles.choiceCard}>
      <Text style={styles.choiceLabel}>{label}</Text>
      <View style={styles.row}>
        <ChoiceButton active={value === true} onPress={() => onChange(true)} accent={accent}>
          Ready — add 5 lbs
        </ChoiceButton>
        <ChoiceButton active={value === false} onPress={() => onChange(false)} accent={accent}>
          Not yet
        </ChoiceButton>
      </View>
    </View>
  );
}

function ChoiceButton({
  active,
  onPress,
  accent,
  children,
}: {
  active: boolean;
  onPress: () => void;
  accent: string;
  children: string;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.choiceButton,
        { borderColor: active ? accent : colors.surfaceMuted, backgroundColor: active ? accent : "transparent" },
      ]}
    >
      <Text style={[styles.choiceButtonText, { color: active ? colors.white : colors.ink }]}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  page: { padding: 24, paddingTop: 40, paddingBottom: 60 },
  title: { fontSize: 24, fontWeight: "700", color: colors.ink, marginTop: 16, marginBottom: 6 },
  subtitle: { color: colors.inkSoft, lineHeight: 21, marginBottom: 28, fontSize: 15 },
  row: { flexDirection: "row", gap: 12 },
  pilatesButton: {
    flex: 1,
    paddingVertical: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.surfaceMuted,
    backgroundColor: colors.surface,
    alignItems: "center",
  },
  pilatesNumber: { fontSize: 28, fontWeight: "700", color: colors.moss },
  pilatesLabel: { fontSize: 13, color: colors.inkSoft, marginTop: 4 },
  hint: { fontSize: 12, color: colors.inkSoft, marginTop: 20, lineHeight: 18 },
  choiceCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.surfaceMuted,
  },
  choiceLabel: { fontWeight: "600", marginBottom: 10, color: colors.ink, fontSize: 15 },
  choiceButton: { flex: 1, paddingVertical: 10, paddingHorizontal: 8, borderRadius: 10, borderWidth: 1, alignItems: "center" },
  choiceButtonText: { fontSize: 13, fontWeight: "500" },
  continueButton: { marginTop: 28, paddingVertical: 16, borderRadius: 12, alignItems: "center" },
  continueButtonText: { fontWeight: "600", fontSize: 15 },
});
