import { useEffect, useMemo, useState } from "react";
import { SafeAreaView, View, Text, FlatList, Pressable } from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { colors } from "@/theme";
import { Item } from "@/types";
import { load } from "@/storage/db";
import EventCard from "@/components/EventCard";
import FabMenu from "@/components/FabMenu";
import { RouteName } from "@/navigation/routes";
import { fabMenuActions } from "@/config/menu";
import { buildActionSheetForItem } from "@/config/contextualMenu";

export default function HomeScreen({
  nav,
}: {
  nav: (route: RouteName, params?: any) => void;
}) {
  const { showActionSheetWithOptions } = useActionSheet();
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    (async () => setItems(await load()))();
  }, []);

  async function refresh() {
    const data = await load();
    setItems(data);
  }

  useEffect(() => {
    refresh(); // charge la liste au mount
  }, []);

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

  function openMenu(item: Item) {
    const { actions, options, destructiveIndex, cancelIndex } =
      buildActionSheetForItem(item);

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: cancelIndex,
        destructiveButtonIndex:
          destructiveIndex >= 0 ? destructiveIndex : undefined,
      },
      (i) => {
        if (i == null || i === cancelIndex) return;
        actions[i].handler(item, nav, refresh);
      }
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View
        style={{
          padding: 16,
          paddingBottom: 6,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ width: 60 }} />
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
        <Pressable
          onPress={() => nav("archive")}
          hitSlop={10}
          style={{ width: 60, alignItems: "flex-end" }}
        >
          <Text style={{ color: colors.accent }}>Archive</Text>
        </Pressable>
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

      <FabMenu actions={fabMenuActions(nav)} />
    </SafeAreaView>
  );
}
