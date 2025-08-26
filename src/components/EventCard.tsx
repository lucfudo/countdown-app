import React from "react";
import { View, Text } from "react-native";
import { colors } from "@/theme";
import { Item } from "@/types";
import { daysUntil } from "@/utils/date";

const iconFor = (t: Item["type"]) =>
  t === "birthday"
    ? "🎂"
    : t === "anniversary"
    ? "💞"
    : t === "event"
    ? "🎉"
    : "⏳";

export default function EventCard({ item }: { item: Item }) {
  const d = daysUntil(item.dateISO, item.type, item.recurrence ?? "none");
  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 14,
        padding: 14,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ fontSize: 24 }}>{iconFor(item.type)}</Text>
        <Text style={{ color: colors.text, fontSize: 16, fontWeight: "600" }}>
          {item.title}
        </Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text style={{ color: colors.accent, fontSize: 24, fontWeight: "800" }}>
          {d}
        </Text>
        <Text style={{ color: colors.sub, fontSize: 12 }}>Jours avant</Text>
      </View>
    </View>
  );
}
