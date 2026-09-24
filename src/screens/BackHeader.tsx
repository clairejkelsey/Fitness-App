import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { colors } from "../theme";

export default function BackHeader({ onBack, title }: { onBack: () => void; title: string }) {
  return (
    <View style={styles.row}>
      <TouchableOpacity onPress={onBack} style={styles.button}>
        <ArrowLeft size={16} color={colors.ink} />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 20 },
  button: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceMuted,
    borderRadius: 10,
    padding: 8,
  },
  title: { fontSize: 22, fontWeight: "700", color: colors.ink },
});
