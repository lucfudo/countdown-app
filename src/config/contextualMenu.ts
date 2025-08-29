import { Item } from "@/types";
import { RouteName } from "@/navigation/routes";
import { newId } from "@/utils/date";
import { Share, Alert } from "react-native";
import { load, save } from "@/storage/db";

export type MenuAction = {
  key: string;
  label: string | ((item: Item) => string);
  destructive?: boolean;
  visible?: (item: Item, ctx: "home" | "archive") => boolean;
  handler: (
    item: Item,
    nav: (r: RouteName, p?: any) => void,
    refresh: () => void
  ) => void | Promise<void>;
};

export const contextualMenu: MenuAction[] = [
  // ——— Liste principale
  {
    key: "pin",
    label: (it) => (it.pinned ? "Désépingler" : "Épingler"),
    visible: (_it, ctx) => ctx === "home",
    handler: async (item, _nav, refresh) => {
      const list = await load();
      const i = list.findIndex((x) => x.id === item.id);
      if (i >= 0) list[i].pinned = !list[i].pinned;
      await save(list);
      refresh();
    },
  },
  {
    key: "edit",
    label: "Éditer",
    visible: (_it, ctx) => ctx === "home", // (tu peux autoriser en archive si tu veux)
    handler: (item, nav) => nav("edit", { id: item.id }),
  },
  {
    key: "archive",
    label: "Archiver",
    visible: (it, ctx) => ctx === "home" && !it.archived,
    handler: async (item, _nav, refresh) => {
      const list = await load();
      const i = list.findIndex((x) => x.id === item.id);
      if (i >= 0) list[i].archived = true;
      await save(list);
      refresh();
    },
  },

  // ——— Commun
  {
    key: "duplicate",
    label: "Dupliquer",
    visible: (_it, ctx) => ctx === "home",
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
    handler: async (item) => {
      const text = `📅 ${item.title} — ${item.dateISO}`;
      await Share.share({ message: text }); // ← Promise<void> OK
    },
  },

  // ——— Spécifique Archive
  {
    key: "restore",
    label: "Restaurer",
    visible: (it, ctx) => ctx === "archive" && it.archived,
    handler: async (item, _nav, refresh) => {
      const list = await load();
      const i = list.findIndex((x) => x.id === item.id);
      if (i >= 0) list[i].archived = false;
      await save(list);
      refresh();
    },
  },
  {
    key: "deleteForever",
    label: "Supprimer définitivement",
    destructive: true,
    visible: (_it, ctx) => ctx === "archive",
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

  // ——— Supprimer (liste principale)
  {
    key: "delete",
    label: "Supprimer",
    destructive: true,
    visible: (_it, ctx) => ctx === "home",
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

// Builder pour ActionSheet, avec contexte
export function buildActionSheetForItem(
  item: Item,
  ctx: "home" | "archive" = "home"
) {
  const actions = contextualMenu.filter((a) =>
    a.visible ? a.visible(item, ctx) : true
  );
  const labels = actions.map((a) =>
    typeof a.label === "function" ? a.label(item) : a.label
  );
  const destructiveIndex = actions.findIndex((a) => !!a.destructive);
  const options = [...labels, "Annuler"];
  const cancelIndex = options.length - 1;
  return { actions, options, destructiveIndex, cancelIndex };
}
