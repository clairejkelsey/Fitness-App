import React, { useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { X } from "lucide-react-native";
import { colors } from "../theme";
import type { Category, ExerciseInfo, Unit } from "../types";

interface Props {
  visible: boolean;
  currentId: string | null;
  currentInfo: ExerciseInfo | null;
  excludeIds: string[];
  exerciseInfo: Record<string, ExerciseInfo>;
  /** null when the day mixes both categories (full-body day) and the user must pick one. */
  defaultCategory: Category | null;
  onSelect: (id: string) => void;
  onAddCustom: (info: ExerciseInfo) => void;
  onClose: () => void;
}

export default function ExerciseSwapModal({
  visible,
  currentId,
  currentInfo,
  excludeIds,
  exerciseInfo,
  defaultCategory,
  onSelect,
  onAddCustom,
  onClose,
}: Props) {
  const [mode, setMode] = useState<"list" | "custom">("list");
  const [name, setName] = useState("");
  const [muscle, setMuscle] = useState("");
  const [equipment, setEquipment] = useState("");
  const [unit, setUnit] = useState<Unit>("lbs");
  const [category, setCategory] = useState<Category>(defaultCategory ?? "upper");

  function reset() {
    setMode("list");
    setName("");
    setMuscle("");
    setEquipment("");
    setUnit("lbs");
    setCategory(defaultCategory ?? "upper");
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleSelect(id: string) {
    reset();
    onSelect(id);
  }

  function handleSaveCustom() {
    if (!name.trim()) return;
    onAddCustom({
      name: name.trim(),
      muscle: muscle.trim() || "Custom",
      equipment: equipment.trim() || "—",
      unit,
      category,
    });
    reset();
  }

  const candidates = Object.entries(exerciseInfo)
    .filter(([id]) => id !== currentId && !excludeIds.includes(id))
    .sort((a, b) => a[1].name.localeCompare(b[1].name));

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{mode === "list" ? "Swap exercise" : "Add a new exercise"}</Text>
            <TouchableOpacity onPress={handleClose} hitSlop={8}>
              <X size={20} color={colors.inkSoft} />
            </TouchableOpacity>
          </View>

          {mode === "list" ? (
            <>
              {currentInfo && <Text style={styles.currentLabel}>Replacing "{currentInfo.name}"</Text>}
              <ScrollView style={styles.list}>
                {candidates.map(([id, info]) => (
                  <TouchableOpacity key={id} style={styles.option} onPress={() => handleSelect(id)}>
                    <Text style={styles.optionName}>{info.name}</Text>
                    <Text style={styles.optionMeta}>
                      {info.muscle} · {info.equipment}
                    </Text>
                  </TouchableOpacity>
                ))}
                {candidates.length === 0 && (
                  <Text style={styles.empty}>No other exercises in the library yet.</Text>
                )}
              </ScrollView>
              <TouchableOpacity style={styles.addCustomButton} onPress={() => setMode("custom")}>
                <Text style={styles.addCustomButtonText}>+ Add a new exercise</Text>
              </TouchableOpacity>
            </>
          ) : (
            <ScrollView style={styles.list}>
              <Text style={styles.fieldLabel}>Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g. Cable Chest Fly"
                placeholderTextColor={colors.placeholder}
                style={styles.input}
              />
              <Text style={styles.fieldLabel}>Muscle group (optional)</Text>
              <TextInput
                value={muscle}
                onChangeText={setMuscle}
                placeholder="e.g. Chest"
                placeholderTextColor={colors.placeholder}
                style={styles.input}
              />
              <Text style={styles.fieldLabel}>Equipment (optional)</Text>
              <TextInput
                value={equipment}
                onChangeText={setEquipment}
                placeholder="e.g. Cable Machine"
                placeholderTextColor={colors.placeholder}
                style={styles.input}
              />
              <Text style={styles.fieldLabel}>Tracked as</Text>
              <View style={styles.toggleRow}>
                <ToggleButton active={unit === "lbs"} onPress={() => setUnit("lbs")} label="Weight (lbs)" />
                <ToggleButton active={unit === "band"} onPress={() => setUnit("band")} label="Band level" />
              </View>
              {defaultCategory === null && (
                <>
                  <Text style={styles.fieldLabel}>Category</Text>
                  <View style={styles.toggleRow}>
                    <ToggleButton active={category === "upper"} onPress={() => setCategory("upper")} label="Upper body" />
                    <ToggleButton active={category === "lower"} onPress={() => setCategory("lower")} label="Lower body" />
                  </View>
                </>
              )}
              <TouchableOpacity
                disabled={!name.trim()}
                onPress={handleSaveCustom}
                style={[styles.saveButton, { opacity: name.trim() ? 1 : 0.5 }]}
              >
                <Text style={styles.saveButtonText}>Add and use this exercise</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setMode("list")} style={styles.backToListButton}>
                <Text style={styles.backToListText}>Back to list</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

function ToggleButton({ active, onPress, label }: { active: boolean; onPress: () => void; label: string }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.toggleButton,
        { borderColor: active ? colors.moss : colors.surfaceMuted, backgroundColor: active ? colors.moss : "transparent" },
      ]}
    >
      <Text style={[styles.toggleButtonText, { color: active ? colors.white : colors.ink }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(30,36,32,0.4)", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 32,
    maxHeight: "80%",
  },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  title: { fontSize: 18, fontWeight: "700", color: colors.ink },
  currentLabel: { fontSize: 13, color: colors.inkSoft, marginBottom: 8 },
  list: { marginTop: 8 },
  option: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.surfaceMuted },
  optionName: { fontSize: 15, fontWeight: "600", color: colors.ink },
  optionMeta: { fontSize: 12, color: colors.inkSoft, marginTop: 2 },
  empty: { color: colors.inkSoft, paddingVertical: 12 },
  addCustomButton: { marginTop: 12, paddingVertical: 14, alignItems: "center" },
  addCustomButtonText: { color: colors.moss, fontWeight: "600", fontSize: 14 },
  fieldLabel: { fontSize: 12, color: colors.inkSoft, marginTop: 14, marginBottom: 6 },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.surfaceMuted,
    backgroundColor: colors.bg,
    fontSize: 14,
    color: colors.ink,
  },
  toggleRow: { flexDirection: "row", gap: 8 },
  toggleButton: { flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1, alignItems: "center" },
  toggleButtonText: { fontSize: 13, fontWeight: "500" },
  saveButton: { marginTop: 20, paddingVertical: 14, borderRadius: 12, backgroundColor: colors.ink, alignItems: "center" },
  saveButtonText: { color: colors.white, fontWeight: "600", fontSize: 14 },
  backToListButton: { marginTop: 10, alignItems: "center", paddingVertical: 8 },
  backToListText: { color: colors.inkSoft, fontSize: 13 },
});
