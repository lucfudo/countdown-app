import { useActionSheet } from "@expo/react-native-action-sheet";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Pressable,
  Alert,
} from "react-native";
import { colors } from "@/theme";
import { Item } from "@/types";
import { load, save } from "@/storage/db";
import EventCard from "@/components/EventCard";
import { RouteName } from "@/navigation/routes";
import { buildActionSheetForItem } from "@/config/contextualMenu";

export default function ArchiveScreen({
  nav,
}: {
  nav: (route: RouteName, params?: any) => void;
}) {
  const { showActionSheetWithOptions } = useActionSheet();
  const [items, setItems] = useState<Item[]>([]);

  const refresh = useCallback(async () => setItems(await load()), []);
  useEffect(() => {
    refresh();
  }, [refresh]);

  const archived = useMemo(
    () =>
      items.filter((i) => i.archived).sort((a, b) => b.createdAt - a.createdAt),
    [items]
  );

  function openMenu(item: Item) {
    const { actions, options, destructiveIndex, cancelIndex } =
      buildActionSheetForItem(item, "archive"); // 👈 contexte "archive"

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: cancelIndex,
        destructiveButtonIndex: destructiveIndex,
      },
      (i) => {
        if (i == null || i === cancelIndex) return;
        actions[i].handler(item, nav, refresh);
      }
    );
  }

  async function clearAll() {
    Alert.alert(
      "Vider l'archive",
      "Supprimer définitivement tous les éléments archivés ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            const list = await load();
            await save(list.filter((x) => !x.archived));
            refresh();
          },
        },
      ]
    );
  }

  async function restoreAll() {
    const list = await load();
    list.forEach((x) => (x.archived = false));
    await save(list);
    refresh();
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 6,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Pressable onPress={() => nav("home")}>
          <Text style={{ color: colors.accent }}>‹ Retour</Text>
        </Pressable>
        <Text
          style={{
            color: colors.text,
            fontSize: 18,
            fontWeight: "700",
          }}
        >
          Archive
        </Text>
        <Pressable onPress={restoreAll}>
          <Text style={{ color: colors.accent }}>Tout restaurer</Text>
        </Pressable>
      </View>

      <FlatList
        contentContainerStyle={{ padding: 16, gap: 12 }}
        data={archived}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <Pressable onLongPress={() => openMenu(item)}>
            {/* On garde un EventCard "non épinglé" ici */}
            <EventCard item={{ ...item, pinned: false }} />
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={{ paddingTop: 48 }}>
            <Text style={{ color: colors.sub, textAlign: "center" }}>
              Rien dans l’archive pour le moment.
            </Text>
          </View>
        }
      />

      {archived.length > 0 && (
        <View style={{ padding: 16 }}>
          <Pressable
            onPress={clearAll}
            style={{
              backgroundColor: "#2a1010",
              borderColor: "#472424",
              borderWidth: 1,
              paddingVertical: 12,
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                color: "#ff6b6b",
                textAlign: "center",
                fontWeight: "600",
              }}
            >
              Vider l’archive
            </Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}
