import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, FlatList, Pressable } from "react-native";
import { colors } from "@/theme";
import { Item } from "@/types";
import { load, save } from "@/storage/db";
import EventCard from "@/components/EventCard";
import FabMenu from "@/components/FabMenu";

export default function HomeScreen({
  nav,
}: {
  nav: (route: string, params?: any) => void;
}) {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    (async () => setItems(await load()))();
  }, []);
  useEffect(() => {
    save(items);
  }, [items]);

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
        data={items}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <Pressable
            onLongPress={() =>
              setItems((prev) => prev.filter((p) => p.id !== item.id))
            }
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
