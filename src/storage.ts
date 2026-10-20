import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AppData } from "./types";

const STORAGE_KEY = "strength-app-data";

export async function loadData(): Promise<AppData | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AppData;
  } catch (e) {
    console.error("Failed to load saved data", e);
    return null;
  }
}

export async function saveData(data: AppData): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save data", e);
  }
}
