export type CountdownType = string;

export type ReminderOffset = number;

export type Item = {
  id: string;
  title: string;
  type: CountdownType;
  dateISO: string; // 2025-12-31
  recurrence?: "none" | "yearly";
  // compat: on garde "reminder?" mais on migre vers "reminders?"
  reminder?: ("J0" | "J-1" | "J-3" | "J-7")[]; // legacy
  reminders?: ReminderOffset[]; // nouveau
  createdAt: number;
  pinned?: boolean;
  archived?: boolean;
};

// Définition d’un type configurable par l’utilisateur
export type TypeDef = {
  key: CountdownType; // identifiant interne
  label: string; // libellé affiché
  icon: string; // emoji choisi par l’utilisateur
};
