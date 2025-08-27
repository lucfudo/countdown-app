import React, { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Pressable,
  Share,
  Alert,
} from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { colors } from "@/theme";
import { Item } from "@/types";
import { load, save } from "@/storage/db";
import EventCard from "@/components/EventCard";
import FabMenu from "@/components/FabMenu";
import { newId } from "@/utils/date";

export default function HomeScreen({
  nav,
}: {
  nav: (route: string, params?: any) => void;
}) {
  const { showActionSheetWithOptions } = useActionSheet();
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    (async () => setItems(await load()))();
  }, []);

  // persistance
  useEffect(() => {
    save(items);
  }, [items]);

  // tri: pinned en haut, puis ancien -> récent (à ajuster si besoin)
  const ordered = useMemo(
    () =>
      [...items]
        .filter((i) => !i.archived)
        .sort(
          (a, b) =>
            (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || a.createdAt - b.createdAt
        ),
    [items]
  );

  function togglePin(target: Item) {
    setItems((prev) => {
      const copy = prev.map((x) =>
        x.id === target.id ? { ...x, pinned: !x.pinned } : x
      );
      return copy;
    });
  }

  function archiveItem(target: Item) {
    setItems((prev) =>
      prev.map((x) => (x.id === target.id ? { ...x, archived: true } : x))
    );
  }

  function deleteItem(target: Item) {
    Alert.alert("Supprimer", `Supprimer « ${target.title} » ?`, [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: () =>
          setItems((prev) => prev.filter((x) => x.id !== target.id)),
      },
    ]);
  }

  function duplicateItem(target: Item) {
    const clone: Item = {
      ...target,
      id: newId(),
      createdAt: Date.now(),
      pinned: false,
      archived: false,
    };
    setItems((prev) => [clone, ...prev]);
  }

  function shareItem(target: Item) {
    const text = `📅 ${target.title} — ${target.dateISO}`;
    Share.share({ message: text });
  }

  function openMenu(item: Item) {
    const options = [
      item.pinned ? "Désépingler" : "Épingler",
      "Éditer",
      "Archiver",
      "Dupliquer",
      "Partager",
      "Supprimer",
      "Annuler",
    ];
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: 6,
        destructiveButtonIndex: 5,
      },
      (i) => {
        if (i === 0) togglePin(item);
        if (i === 1) nav("edit", { id: item.id });
        if (i === 2) archiveItem(item);
        if (i === 3) duplicateItem(item);
        if (i === 4) shareItem(item);
        if (i === 5) deleteItem(item);
      }
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ padding: 16, paddingBottom: 6 }}>
        <Text
          style={{
            color: colors.text,
            fontSize: 18,
            fontWeight: "700",
            textAlign: "center",
          }}
        >
          Compte à rebours
        </Text>
      </View>

      <FlatList
        contentContainerStyle={{ padding: 16, gap: 12 }}
        data={ordered}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <Pressable
            onLongPress={() => openMenu(item)}
            onPress={() => nav("edit", { id: item.id })}
          >
            <EventCard item={item} />
          </Pressable>
        )}
        ListEmptyComponent={
          <Text
            style={{ color: colors.sub, textAlign: "center", marginTop: 40 }}
          >
            Ajoute ton premier événement avec +
          </Text>
        }
      />

      <FabMenu
        actions={[
          {
            label: "Fête",
            icon: "🎉",
            onPress: () => nav("edit", { type: "event" }),
          },
          {
            label: "Anniversaire",
            icon: "🎂",
            onPress: () => nav("edit", { type: "birthday" }),
          },
          {
            label: "Compte à rebours",
            icon: "⏳",
            onPress: () => nav("edit", { type: "countdown" }),
          },
        ]}
      />
    </SafeAreaView>
  );
}
