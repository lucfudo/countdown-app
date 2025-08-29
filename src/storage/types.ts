import AsyncStorage from "@react-native-async-storage/async-storage";
import { TypeDef } from "@/types";

const KEY = "countdowns:types:v1";

export const DEFAULT_TYPES: TypeDef[] = [
  { key: "event", label: "Fête", icon: "🎉" },
  { key: "birthday", label: "Anniversaire", icon: "🎂" },
  { key: "countdown", label: "Compte à rebours", icon: "⏳" },
];

export async function loadTypes(): Promise<TypeDef[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) {
    await AsyncStorage.setItem(KEY, JSON.stringify(DEFAULT_TYPES));
    return DEFAULT_TYPES;
  }
  try {
    const parsed = JSON.parse(raw) as TypeDef[];
    // garde-fous simples
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_TYPES;
    return parsed;
  } catch {
    return DEFAULT_TYPES;
  }
}

export async function saveTypes(list: TypeDef[]) {
  await AsyncStorage.setItem(KEY, JSON.stringify(list));
}
