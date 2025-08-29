import { useEffect, useState, useMemo } from "react";
import { Item, CountdownType, ReminderOffset } from "@/types";
import {
  getItem,
  upsertItem,
  normalizeOffsets,
  legacyToOffsets,
} from "@/services/items";

export function useEditItem(
  editId?: string,
  initialType: CountdownType = "countdown"
) {
  const isEdit = !!editId;

  const [type, setType] = useState<CountdownType>(initialType);
  const [title, setTitle] = useState("");
  const [dateISO, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [recurrence, setRecurrence] = useState<"none" | "yearly">(
    initialType === "birthday" ? "yearly" : "none"
  );

  // NEW: offsets dynamiques
  const [remOffsets, setRemOffsets] = useState<ReminderOffset[]>([0, -3]); // défaut: J0 & J-3

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      const it = await getItem(editId);
      if (!it) return;
      setTitle(it.title);
      setType(it.type);
      setDate(it.dateISO);
      setRecurrence(it.recurrence ?? "none");
      setRemOffsets(
        normalizeOffsets(it.reminders ?? legacyToOffsets(it.reminder))
      );
    })();
  }, [isEdit, editId]);

  const model = useMemo(
    () => ({ type, title, dateISO, recurrence, remOffsets }),
    [type, title, dateISO, recurrence, remOffsets]
  );

  function addOffset(n: number) {
    setRemOffsets((prev) => normalizeOffsets([...prev, Math.trunc(n)]));
  }
  function removeOffset(n: number) {
    setRemOffsets((prev) => prev.filter((x) => x !== n));
  }
  function setOffsetAt(index: number, n: number) {
    setRemOffsets((prev) =>
      normalizeOffsets(prev.map((x, i) => (i === index ? Math.trunc(n) : x)))
    );
  }

  async function submit() {
    await upsertItem({
      id: editId,
      title,
      type,
      dateISO,
      recurrence,
      reminders: remOffsets,
    } as any);
  }

  return {
    isEdit,
    model,
    setType,
    setTitle,
    setDate,
    setRecurrence,
    // reminders API
    remOffsets,
    addOffset,
    removeOffset,
    setOffsetAt,
    submit,
  };
}
