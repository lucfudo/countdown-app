import { Item, ReminderOffset } from "@/types";
import { load, save } from "@/storage/db";
import { newId } from "@/utils/date";
import { scheduleReminders } from "@/notifications";

// helper: map legacy strings -> offsets
export function legacyToOffsets(rem?: Item["reminder"]): ReminderOffset[] {
  if (!rem) return [];
  const map: Record<string, number> = {
    J0: 0,
    "J-1": -1,
    "J-3": -3,
    "J-7": -7,
  };
  return rem.map((r) => map[r] ?? 0);
}

// nettoyage + tri + unique
export function normalizeOffsets(offsets: ReminderOffset[]): ReminderOffset[] {
  return Array.from(new Set(offsets.map((o) => Math.trunc(o)))).sort(
    (a, b) => a - b
  );
}

export async function getItem(id?: string) {
  const list = await load();
  const it = id ? list.find((i) => i.id === id) : undefined;
  if (!it) return undefined;
  // expose toujours .reminders
  if (!it.reminders) it.reminders = legacyToOffsets(it.reminder);
  return it;
}

export async function upsertItem(
  data: Omit<Item, "id" | "createdAt"> & Partial<Pick<Item, "id" | "createdAt">>
) {
  const list = await load();
  let item: Item;

  // toujours normaliser les offsets
  const reminders = normalizeOffsets(
    data.reminders ?? legacyToOffsets(data.reminder)
  );

  if (data.id) {
    const idx = list.findIndex((i) => i.id === data.id);
    if (idx >= 0) {
      item = { ...list[idx], ...data, reminders } as Item;
      delete (item as any).reminder; // on cesse d’écrire le legacy
      list[idx] = item;
    } else {
      item = {
        ...(data as Item),
        id: data.id,
        createdAt: data.createdAt ?? Date.now(),
        reminders,
      };
      delete (item as any).reminder;
      list.unshift(item);
    }
  } else {
    item = {
      ...(data as Item),
      id: newId(),
      createdAt: Date.now(),
      reminders,
    };
    delete (item as any).reminder;
    list.unshift(item);
  }

  await save(list);
  await scheduleReminders(item); // ← adapte ce tool pour lire item.reminders (offsets en jours)
  return item;
}

// (facultatif) util rapide pour presets en UI
export const REMINDER_PRESETS: ReminderOffset[] = [-7, -3, -1, 0, +1, +3, +7];
