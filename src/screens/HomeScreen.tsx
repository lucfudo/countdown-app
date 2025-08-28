import { useEffect, useMemo, useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Pressable,
  RefreshControl,
} from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { colors } from "@/theme";
import { Item } from "@/types";
import { load } from "@/storage/db";
import EventCard from "@/components/EventCard";
import FabMenu from "@/components/FabMenu";
import { RouteName } from "@/navigation/routes";
import { fabMenuActions } from "@/config/menu";
import { buildActionSheetForItem } from "@/config/contextualMenu";
import { daysUntil } from "@/utils/date";

export default function HomeScreen({
  nav,
}: {
  nav: (route: RouteName, params?: any) => void;
}) {
  const { showActionSheetWithOptions } = useActionSheet();
  const [items, setItems] = useState<Item[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const loadingMoreRef = useRef(false); // anti double-appel en bas

  async function refresh() {
    const data = await load();
    setItems(data);
  }

  // initial load
  useEffect(() => {
    refresh();
  }, []);

  // pull-to-refresh
  const onRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      await refresh();
    } finally {
      setRefreshing(false);
    }
  };

  // auto-refresh quand on atteint le bas
  const onEndReached = async () => {
    if (loadingMoreRef.current) return;
    loadingMoreRef.current = true;
    try {
      await refresh();
    } finally {
      // petit délai pour éviter le spam d'événements en fin de scroll
      setTimeout(() => (loadingMoreRef.current = false), 400);
    }
  };

  const d = (it: Item) =>
    daysUntil(it.dateISO, it.type, it.recurrence ?? "none");

  // tri: épinglés d’abord, puis non épinglés, chacun en date croissante
  const ordered = useMemo(() => {
    return [...items]
      .filter((i) => !i.archived)
      .sort((a, b) => {
        // 1) Épinglés en haut
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;

        // 2) À venir avant passés
        const da = d(a);
        const db = d(b);
        const aPast = da < 0;
        const bPast = db < 0;
        if (aPast !== bPast) return aPast ? 1 : -1;

        // 3) Ordre croissant à l’intérieur de chaque groupe
        //    (pour les passés, on compare l’écart absolu)
        return aPast ? Math.abs(da) - Math.abs(db) : da - db;
      });
  }, [items]);

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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
            titleColor={colors.accent}
          />
        }
        onEndReached={onEndReached}
        onEndReachedThreshold={0.15}
      />

      <FabMenu actions={fabMenuActions(nav)} />
    </SafeAreaView>
  );
}
