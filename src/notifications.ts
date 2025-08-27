import * as Notifications from "expo-notifications";
import { Item } from "@/types";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function ensurePerms() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function scheduleReminders(item: Item) {
  const ok = await ensurePerms();
  if (!ok) return;
  if (!item.reminder || item.reminder.length === 0) return;

  const base = new Date(item.dateISO);
  base.setHours(9, 0, 0, 0); // 9h
  for (const r of item.reminder) {
    const d = new Date(base);
    if (r === "J-1") d.setDate(d.getDate() - 1);
    if (r === "J-3") d.setDate(d.getDate() - 3);
    if (r === "J-7") d.setDate(d.getDate() - 7);
    await Notifications.scheduleNotificationAsync({
      content: { title: item.title, body: "⏳ C'est bientôt !" },
      trigger: d.getTime() <= Date.now() ? null : d,
    });
  }
}
