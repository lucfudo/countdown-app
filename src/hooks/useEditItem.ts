import { useEffect, useState, useMemo } from "react";
import { Item, CountdownType, Reminder } from "@/types";
import { getItem, upsertItem, buildReminders } from "@/services/items";

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
  const [remJ0, setJ0] = useState(true);
  const [remJ3, setJ3] = useState(true);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      const it = await getItem(editId);
      if (!it) return;
      setTitle(it.title);
      setType(it.type);
      setDate(it.dateISO);
      setRecurrence(it.recurrence ?? "none");
      setJ0(it.reminder?.includes("J0") ?? false);
      setJ3(it.reminder?.includes("J-3") ?? false);
    })();
  }, [isEdit, editId]);

  const model = useMemo(
    () => ({ type, title, dateISO, recurrence, remJ0, remJ3 }),
    [type, title, dateISO, recurrence, remJ0, remJ3]
  );

  async function submit() {
    const reminder: Reminder[] = buildReminders(remJ0, remJ3);
    await upsertItem({
      id: editId,
      title,
      type,
      dateISO,
      recurrence,
      reminder,
    } as any);
  }

  return {
    isEdit,
    model,
    // setters
    setType,
    setTitle,
    setDate,
    setRecurrence,
    setJ0,
    setJ3,
    submit,
  };
}
