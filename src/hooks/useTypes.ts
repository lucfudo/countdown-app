import { useEffect, useState, useCallback } from "react";
import { TypeDef } from "@/types";
import { loadTypes, saveTypes, DEFAULT_TYPES } from "@/storage/types";

export function useTypes() {
  const [types, setTypes] = useState<TypeDef[]>(DEFAULT_TYPES);

  const refresh = useCallback(async () => {
    setTypes(await loadTypes());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function addType(t: TypeDef) {
    const next = [t, ...types];
    setTypes(next);
    await saveTypes(next);
  }

  async function updateType(key: string, patch: Partial<TypeDef>) {
    const next = types.map((t) => (t.key === key ? { ...t, ...patch } : t));
    setTypes(next);
    await saveTypes(next);
  }

  async function removeType(key: string) {
    // protection: empêcher de supprimer tous les types → au moins 1
    if (types.length <= 1) return;
    const next = types.filter((t) => t.key !== key);
    setTypes(next);
    await saveTypes(next);
  }

  return { types, refresh, addType, updateType, removeType };
}
