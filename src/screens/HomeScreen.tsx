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
import { TYPE_META } from "@/config/types";
import FilterChips, { Filter } from "@/components/FilterChips";

export default function HomeScreen({
  nav,
}: {
  nav: (route: RouteName, params?: any) => void;
}) {
  const { showActionSheetWithOptions } = useActionSheet();
  const [items, setItems] = useState<Item[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showSections, setShowSections] = useState<boolean>(true);

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

  // sections (par type) avec filtre
  const sections = useMemo(() => {
    const source = items.filter((i) => !i.archived);

    const byType: Record<CountdownType, Item[]> = {
      event: [],
      birthday: [],
      countdown: [],
      anniversary: [],
    };
    for (const it of source) byType[it.type].push(it);

    // tri “croissant” par date (puis createdAt)
    const normalize = (list: Item[]) => [...list].sort(sortAscWithPinned);

    if (filter === "all") {
      return (Object.keys(TYPE_META) as CountdownType[])
        .map((t) => ({
          key: t,
          title: TYPE_META[t].label,
          icon: TYPE_META[t].icon,
          data: normalize(byType[t]),
        }))
        .filter((s) => s.data.length > 0);
    } else {
      return [
        {
          key: filter,
          title: TYPE_META[filter].label,
          icon: TYPE_META[filter].icon,
          data: normalize(byType[filter]),
        },
      ];
    }
  }, [items, filter]);

  // counts of non-archived items per type
  const counts = useMemo(() => {
    const src = items.filter((i) => !i.archived);
    const c: Record<"all" | CountdownType, number> = {
      all: src.length,
      event: 0,
      birthday: 0,
      countdown: 0,
      anniversary: 0,
    };
    for (const it of src) c[it.type] += 1;
    return c;
  }, [items]);

  // menu ⋯ : toggle filtres + archive
  function openTopMenu() {
    const opts: string[] = [
      showFilters ? "Masquer les filtres" : "Afficher les filtres",
    ];

    // 👉 n’ajouter que si filtre = all
    if (filter === "all") {
      opts.push(showSections ? "Afficher en liste" : "Afficher par catégorie");
    }

    opts.push("Archivé");
    opts.push("Annuler");

    const cancelButtonIndex = opts.length - 1;

    showActionSheetWithOptions({ options: opts, cancelButtonIndex }, (i) => {
      if (i == null || i === cancelButtonIndex) return;
      if (i === 0) setShowFilters((v) => !v);

      // si filter=all, alors l’option toggle est présente à l’index 1
      if (filter === "all") {
        if (i === 1) setShowSections((v) => !v);
        if (i === 2) nav("archive");
      } else {
        // sinon l’archive est directement à l’index 1
        if (i === 1) nav("archive");
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
          <FilterChips value={filter} onChange={setFilter} counts={counts} />
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

      <FabMenu actions={fabMenuActions(nav)} />
    </SafeAreaView>
  );
}
