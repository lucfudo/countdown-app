export type CountdownType = "countdown" | "birthday" | "anniversary" | "event";

export type Reminder = "J0" | "J-1" | "J-3" | "J-7";

export type Item = {
  id: string;
  title: string;
  type: CountdownType;
  dateISO: string; // 2025-12-31
  recurrence?: "none" | "yearly";
  reminder?: Reminder[]; // ex: ['J0','J-3']
  createdAt: number;
  pinned?: boolean;
  archived?: boolean;
};
