import { Item } from "@/types";
import { RouteName } from "@/navigation/routes";
import { newId } from "@/utils/date";
import { Share, Alert } from "react-native";
import { load, save } from "@/storage/db";

export type MenuAction = {
  key: string;
  label: string | ((item: Item) => string);
  destructive?: boolean;
  visible?: (item: Item) => boolean;
  handler: (
    item: Item,
    nav: (r: RouteName, p?: any) => void,
    refresh: () => void
  ) => void | Promise<void>;
};

export const contextualMenu: MenuAction[] = [
  {
    key: "pin",
    label: (it) => (it.pinned ? "Désépingler" : "Épingler"),
    handler: async (item, _nav, refresh) => {
      const list = await load();
      const idx = list.findIndex((x) => x.id === item.id);
      if (idx >= 0) list[idx].pinned = !list[idx].pinned;
      await save(list);
      refresh();
    },
  },
  {
    key: "edit",
    label: "Éditer",
    handler: (item, nav) => nav("edit", { id: item.id }),
  },
  {
    key: "archive",
    label: "Archiver",
    visible: (it) => !it.archived,
    handler: async (item, _nav, refresh) => {
      const list = await load();
      const idx = list.findIndex((x) => x.id === item.id);
      if (idx >= 0) list[idx].archived = true;
      await save(list);
      refresh();
    },
  },
  {
    key: "duplicate",
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
    key: "share",
    label: "Partager",
    handler: (item) => {
      const text = `📅 ${item.title} — ${item.dateISO}`;
      Share.share({ message: text });
    },
  },
  {
    key: "delete",
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

// Petit builder pour ActionSheet
export function buildActionSheetForItem(item: Item) {
  const actions = contextualMenu.filter((a) =>
    a.visible ? a.visible(item) : true
  );
  const labels = actions.map((a) =>
    typeof a.label === "function" ? a.label(item) : a.label
  );
  const destructiveIndex = actions.findIndex((a) => !!a.destructive);
  // on ajoute "Annuler" à la fin
  const options = [...labels, "Annuler"];
  const cancelIndex = options.length - 1;
  return { actions, options, destructiveIndex, cancelIndex };
}
