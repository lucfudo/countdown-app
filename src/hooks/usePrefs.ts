import { useEffect, useState, useCallback } from "react";
import { loadPrefs, savePrefs, type Prefs } from "@/storage/prefs";

export function usePrefs() {
  const [prefs, setPrefs] = useState<Prefs>({
    showSections: true,
    showFilters: false,
    lastFilter: "all",
  });

  const refresh = useCallback(async () => {
    setPrefs(await loadPrefs());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const setShowSections = async (v: boolean) =>
    setPrefs(await savePrefs({ showSections: v }));

  const setShowFilters = async (v: boolean) =>
    setPrefs(await savePrefs({ showFilters: v }));

  const setLastFilter = async (v: string) =>
    setPrefs(await savePrefs({ lastFilter: v }));

  return { prefs, refresh, setShowSections, setShowFilters, setLastFilter };
}
