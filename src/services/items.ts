import { Item, Reminder } from "@/types";
import { load, save } from "@/storage/db";
import { newId } from "@/utils/date";
import { scheduleReminders } from "@/notifications";

export async function getItem(id?: string) {
  const list = await load();
  return id ? list.find((i) => i.id === id) : undefined;
}

export async function upsertItem(
  data: Omit<Item, "id" | "createdAt"> & Partial<Pick<Item, "id" | "createdAt">>
) {
  const list = await load();
  let item: Item;

  if (data.id) {
    const idx = list.findIndex((i) => i.id === data.id);
    if (idx >= 0) {
      item = { ...list[idx], ...data } as Item;
      list[idx] = item;
    } else {
      item = {
        ...(data as Item),
        id: data.id,
        createdAt: data.createdAt ?? Date.now(),
      };
      list.unshift(item);
    }
  } else {
    item = {
      ...(data as Item),
      id: newId(),
      createdAt: Date.now(),
    };
    list.unshift(item);
  }

  await save(list);
  await scheduleReminders(item);
  return item;
}

export async function togglePinned(id: string) {
  const list = await load();
  const idx = list.findIndex((i) => i.id === id);
  if (idx >= 0) list[idx].pinned = !list[idx].pinned;
  await save(list);
}

export async function archiveItem(id: string) {
  const list = await load();
  const idx = list.findIndex((i) => i.id === id);
  if (idx >= 0) list[idx].archived = true;
  await save(list);
}

export async function deleteItem(id: string) {
  const list = await load();
  await save(list.filter((i) => i.id !== id));
}

export async function duplicateItem(src: Item) {
  const list = await load();
  const copy: Item = {
    ...src,
    id: newId(),
    createdAt: Date.now(),
    pinned: false,
    archived: false,
  };
  list.unshift(copy);
  await save(list);
  return copy;
}

// util pour construire les reminders à partir des booléens UI
export function buildReminders(j0: boolean, j3: boolean): Reminder[] {
  const r: Reminder[] = [];
  if (j0) r.push("J0");
  if (j3) r.push("J-3");
  return r;
}
