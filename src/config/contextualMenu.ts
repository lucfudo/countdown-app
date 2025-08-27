import { Item } from "@/types";
import { RouteName } from "@/navigation/routes";

export type MenuAction = {
  label: string;
  destructive?: boolean;
  handler: (item: Item, nav: (r: RouteName, p?: any) => void) => void;
};

export const contextualMenu: MenuAction[] = [
  {
    label: "Épingler",
    handler: (item, _nav) => {
      item.pinned = !item.pinned;
    },
  },
  {
    label: "Éditer",
    handler: (item, nav) => nav("edit", { id: item.id }),
  },
  {
    label: "Archiver",
    handler: (item) => {
      item.archived = true;
    },
  },
  {
    label: "Dupliquer",
    handler: (item) => {
      // clone logique
    },
  },
  {
    label: "Partager",
    handler: (item) => {
      // share logique
    },
  },
  {
    label: "Supprimer",
    destructive: true,
    handler: (item) => {
      // delete logique
    },
  },
];
