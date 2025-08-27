import type { CountdownType } from "@/types";
import { TYPE_META } from "@/config/types";

export const TYPE_OPTIONS: { key: CountdownType; label: string }[] = (
  Object.keys(TYPE_META) as CountdownType[]
).map((k) => ({
  key: k,
  label: TYPE_META[k].label,
}));

export const RECURRENCE_OPTIONS = [
  { key: "none", label: "Aucun" },
  { key: "yearly", label: "Annuel" },
] as const;

export const REMINDER_OPTIONS = [
  { key: "J0", label: "Le jour même" },
  { key: "J-3", label: "3 jours avant" },
] as const;
