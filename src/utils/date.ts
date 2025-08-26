export function daysUntil(
  dateISO: string,
  type: "countdown" | "birthday" | "anniversary" | "event",
  recurrence?: "none" | "yearly"
) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let target = new Date(dateISO);
  target.setHours(0, 0, 0, 0);

  if (recurrence === "yearly") {
    const thisYear = new Date(
      today.getFullYear(),
      target.getMonth(),
      target.getDate()
    );
    target =
      thisYear < today
        ? new Date(today.getFullYear() + 1, target.getMonth(), target.getDate())
        : thisYear;
  }
  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
export const fmtDate = (iso: string) => new Date(iso).toLocaleDateString();
export const newId = () => Math.random().toString(36).slice(2);
