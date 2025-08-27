import { TYPE_META } from "@/config/types";
import type { CountdownType } from "@/types";

export const fabMenuActions = (nav: any) =>
  (Object.keys(TYPE_META) as CountdownType[]).map((t) => ({
    label: TYPE_META[t].label,
    icon: TYPE_META[t].icon,
    onPress: () => nav("edit", { type: t }),
  }));
