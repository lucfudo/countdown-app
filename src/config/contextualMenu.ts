import { Item } from "@/types";
import { RouteName } from "@/navigation/routes";
import { newId } from "@/utils/date";
import { Share, Alert } from "react-native";
import { load, save } from "@/storage/db";

export type MenuAction = {
  label: string;
  destructive?: boolean;
  handler: (
    item: Item,
    nav: (r: RouteName, p?: any) => void,
    refresh: () => void
  ) => void;
};

export const contextualMenu: MenuAction[] = [
  {
    label: "Épingler",
    handler: async (item, _nav, refresh) => {
      const list = await load();
      const idx = list.findIndex((x) => x.id === item.id);
      if (idx >= 0) list[idx].pinned = !list[idx].pinned;
      await save(list);
      refresh();
    },
  },
  {
    label: "Éditer",
    handler: (item, nav) => nav("edit", { id: item.id }),
  },
  {
    label: "Archiver",
    handler: async (item, _nav, refresh) => {
      const list = await load();
      const idx = list.findIndex((x) => x.id === item.id);
      if (idx >= 0) list[idx].archived = true;
      await save(list);
      refresh();
    },
  },
  {
    label: "Dupliquer",
    handler: async (item, _nav, refresh) => {
      const list = await load();
      const copy: Item = {
        ...item,
        id: newId(),
        createdAt: Date.now(),
        pinned: false,
        archived: false,
      };
      list.unshift(copy);
      await save(list);
      refresh();
    },
  },
  {
    label: "Partager",
    handler: (item) => {
      const text = `📅 ${item.title} — ${item.dateISO}`;
      Share.share({ message: text });
    },
  },
  {
    label: "Supprimer",
    destructive: true,
    handler: (item, _nav, refresh) => {
      Alert.alert("Supprimer", `Supprimer « ${item.title} » ?`, [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            const list = await load();
            await save(list.filter((x) => x.id !== item.id));
            refresh();
          },
        },
      ]);
    },
  },
];
