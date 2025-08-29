import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "countdowns:prefs:v1";

export type Prefs = {
  showSections: boolean; // true = par catégorie, false = liste
  showFilters: boolean;
  lastFilter?: string; // "all" | type.key
};

const DEFAULTS: Prefs = {
  showSections: true,
  showFilters: false,
  lastFilter: "all",
};

export async function loadPrefs(): Promise<Prefs> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return DEFAULTS;
  try {
    const parsed = JSON.parse(raw) as Partial<Prefs>;
    return { ...DEFAULTS, ...parsed };
  } catch {
    return DEFAULTS;
  }
}

export async function savePrefs(patch: Partial<Prefs>) {
  const current = await loadPrefs();
  const next = { ...current, ...patch };
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
  return next;
}
