import { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  SectionList,
  Pressable,
  FlatList,
} from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { colors } from "@/theme";
import { Item, CountdownType } from "@/types";
import { load } from "@/storage/db";
import EventCard from "@/components/EventCard";
import FabMenu from "@/components/FabMenu";
import { RouteName } from "@/navigation/routes";
import { fabMenuActions } from "@/config/menu";
import { buildActionSheetForItem } from "@/config/contextualMenu";
import FilterChips, { Filter } from "@/components/FilterChips";
import { usePrefs } from "@/hooks/usePrefs";
import { useTypes } from "@/hooks/useTypes";

export default function HomeScreen({
  nav,
}: {
  nav: (route: RouteName, params?: any) => void;
}) {
  const { showActionSheetWithOptions } = useActionSheet();
  const [items, setItems] = useState<Item[]>([]);

  const { types } = useTypes(); // { key, label, icon }

  // 🔧 préférences persistantes
  const { prefs, setShowFilters, setShowSections, setLastFilter } = usePrefs();
  const showFilters = prefs.showFilters;
  const showSections = prefs.showSections;

  // filtre courant (persisté)
  const [filter, _setFilter] = useState<Filter>(
    (prefs.lastFilter as Filter) ?? "all"
  );
  useEffect(() => {
    // si prefs changent (premier load), synchroniser l’état local
    _setFilter((prefs.lastFilter as Filter) ?? "all");
  }, [prefs.lastFilter]);

  const setFilter = (f: Filter) => {
    _setFilter(f);
    setLastFilter(f); // ← persiste
  };

  useEffect(() => {
    if (filter !== "all" && !types.some((t) => t.key === filter)) {
      setFilter("all");
    }
  }, [types, filter]);

  const sortAscWithPinned = (a: Item, b: Item) =>
    (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || // épinglés en haut
    a.dateISO.localeCompare(b.dateISO) || // dates croissantes
    a.createdAt - b.createdAt;

  const flatData = useMemo(() => {
    const base = items.filter((i) => !i.archived);
    const filtered =
      filter === "all" ? base : base.filter((i) => i.type === filter);
    return [...filtered].sort(sortAscWithPinned);
  }, [items, filter]);

  async function refresh() {
    setItems(await load());
  }
  useEffect(() => {
    refresh();
  }, []);

  // sections par type (dyn)
  const sections = useMemo(() => {
    const src = items.filter((i) => !i.archived);
    const byType: Record<string, Item[]> = {};
    for (const t of types) byType[t.key] = [];
    // s'assure que des items "anciens" avec un type supprimé ne disparaissent pas :
    for (const it of src) {
      if (!byType[it.type]) byType[it.type] = [];
      byType[it.type].push(it);
    }
    const normalize = (list: Item[]) => [...list].sort(sortAscWithPinned);

    if (filter === "all") {
      return types
        .map((t) => ({
          key: t.key,
          title: t.label,
          icon: t.icon,
          data: normalize(byType[t.key] || []),
        }))
        .filter((s) => s.data.length > 0);
    } else {
      const t = types.find((x) => x.key === filter);
      return [
        {
          key: filter,
          title: t?.label ?? filter,
          icon: t?.icon ?? "🏷️",
          data: normalize(byType[filter] || []),
        },
      ];
    }
  }, [items, filter, types]);

  // counts dyn
  const counts = useMemo(() => {
    const src = items.filter((i) => !i.archived);
    const c: Record<"all" | string, number> = { all: src.length };
    for (const t of types) c[t.key] = 0;
    for (const it of src) c[it.type] = (c[it.type] ?? 0) + 1;
    return c;
  }, [items, types]);

  // menu ⋯ : + “Gérer les types”
  function openTopMenu() {
    const opts: string[] = [
      showFilters ? "Masquer les filtres" : "Afficher les filtres",
    ];
    if (filter === "all") {
      opts.push(showSections ? "Afficher en liste" : "Afficher par catégorie");
    }
    opts.push("Archivé");
    opts.push("Gérer les types");
    opts.push("Annuler");

    const cancelButtonIndex = opts.length - 1;

    showActionSheetWithOptions({ options: opts, cancelButtonIndex }, (i) => {
      if (i == null || i === cancelButtonIndex) return;

      if (i === 0) setShowFilters(!showFilters);

      if (filter === "all") {
        if (i === 1) setShowSections(!showSections);
        if (i === 2) nav("archive");
        if (i === 3) nav("types");
      } else {
        if (i === 1) nav("archive");
        if (i === 2) nav("types");
      }
    });
  }

  function openItemMenu(item: Item) {
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

  function Header() {
    return (
      <View>
        {/* Top bar */}
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
            onPress={openTopMenu}
            hitSlop={10}
            style={{ width: 60, alignItems: "flex-end" }}
          >
            <Text style={{ fontSize: 20, color: colors.accent }}>⋯</Text>
          </Pressable>
        </View>
        {/* Filtres (optionnels) */}
        {showFilters && (
          <FilterChips
            value={filter}
            onChange={setFilter}
            counts={counts}
            types={types}
          />
        )}
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      {showSections ? (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              onLongPress={() => openItemMenu(item)}
              onPress={() => nav("edit", { id: item.id })}
            >
              <EventCard item={item} />
            </Pressable>
          )}
          renderSectionHeader={({ section }) =>
            filter === "all" ? (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 12,
                  marginBottom: 6,
                  paddingHorizontal: 16,
                }}
              >
                {/* Icône + label */}
                <View
                  style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
                >
                  <Text style={{ fontSize: 16 }}>{section.icon}</Text>
                  <Text
                    style={{
                      color: colors.sub,
                      fontSize: 14,
                      fontWeight: "600",
                    }}
                  >
                    {section.title}
                  </Text>
                </View>

                {/* Pastille compteur */}
                <View
                  style={{
                    backgroundColor: colors.accent,
                    borderRadius: 12,
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    minWidth: 24,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: "700",
                    }}
                  >
                    {section.data.length}
                  </Text>
                </View>
              </View>
            ) : null
          }
          stickySectionHeadersEnabled={false}
          ListHeaderComponent={<Header />}
          contentContainerStyle={{
            paddingBottom: 16,
            paddingHorizontal: 16,
            gap: 12,
          }}
          ListEmptyComponent={
            <Text
              style={{ color: colors.sub, textAlign: "center", marginTop: 40 }}
            >
              Ajoute ton premier événement avec +
            </Text>
          }
        />
      ) : (
        <FlatList
          data={flatData}
          keyExtractor={(i) => i.id}
          ListHeaderComponent={<Header />}
          contentContainerStyle={{
            paddingBottom: 16,
            paddingHorizontal: 16,
            gap: 12,
          }}
          renderItem={({ item }) => (
            <Pressable
              onLongPress={() => openItemMenu(item)}
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
      )}

      <FabMenu actions={fabMenuActions(nav, types)} />
    </SafeAreaView>
  );
}
