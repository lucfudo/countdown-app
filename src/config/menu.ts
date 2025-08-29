import type { TypeDef } from "@/types";

export const fabMenuActions = (nav: any, types: TypeDef[]) =>
  types.map((t) => ({
    label: t.label,
    icon: t.icon,
    onPress: () => nav("edit", { type: t.key }),
  }));
