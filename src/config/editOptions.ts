export const TYPE_OPTIONS = [
  { key: "countdown", label: "Compte à rebours" },
  { key: "birthday", label: "Anniversaire" },
  { key: "event", label: "Fête" },
] as const;

export const RECURRENCE_OPTIONS = [
  { key: "none", label: "Aucun" },
  { key: "yearly", label: "Annuel" },
] as const;

export const REMINDER_OPTIONS = [
  { key: "J0", label: "Le jour même" },
  { key: "J-3", label: "3 jours avant" },
] as const;
