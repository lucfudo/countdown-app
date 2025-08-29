import type { CountdownType } from "@/types";
import { loadTypes } from "@/storage/types";

// NOTE: comme c’est consommé par un formulaire,
// on expose un helper async pour récupérer les options à l’ouverture.
export async function getTypeOptions(): Promise<
  { key: CountdownType; label: string }[]
> {
  const types = await loadTypes();
  return types.map((t) => ({ key: t.key, label: t.label }));
}

export const RECURRENCE_OPTIONS = [
  { key: "none", label: "Aucun" },
  { key: "yearly", label: "Annuel" },
] as const;

export const REMINDER_OPTIONS = [
  { key: "J0", label: "Le jour même" },
  { key: "J-3", label: "3 jours avant" },
] as const;
