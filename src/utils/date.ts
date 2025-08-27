import { CountdownType } from "@/types";

const MS_DAY = 24 * 60 * 60 * 1000;
const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());
const parseISO = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
};

export function daysUntil(
  dateISO: string,
  _type?: CountdownType,
  recurrence: "none" | "yearly" = "none",
  opts: { signed?: boolean } = { signed: true }
) {
  const signed = opts.signed ?? true;
  const today = startOfDay(new Date());
  const target = startOfDay(parseISO(dateISO));

  if (recurrence === "yearly") {
    const next = new Date(
      today.getFullYear(),
      target.getMonth(),
      target.getDate()
    );
    if (next.getTime() < today.getTime())
      next.setFullYear(next.getFullYear() + 1);
    const diff = Math.ceil((next.getTime() - today.getTime()) / MS_DAY);
    return signed ? diff : Math.max(0, diff);
  }

  // Non récurrent -> diff signé
  const diff = Math.ceil((target.getTime() - today.getTime()) / MS_DAY);
  return signed ? diff : Math.max(0, diff);
}
export const fmtDate = (iso: string) => new Date(iso).toLocaleDateString();
export const newId = () => Math.random().toString(36).slice(2);
