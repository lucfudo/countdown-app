import type { CountdownType } from "@/types";

export const TYPE_META: Record<CountdownType, { label: string; icon: string }> =
  {
    event: { label: "Fête", icon: "🎉" },
    birthday: { label: "Anniversaire", icon: "🎂" },
    countdown: { label: "Compte à rebours", icon: "⏳" },
    anniversary: { label: "Anniversaire de mariage", icon: "💞" },
  };
