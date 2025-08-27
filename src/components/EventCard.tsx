import React from "react";
import { View, Text, StyleSheet } from "react-native";
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

  if (item.pinned) {
    // STYLE ÉPINGLÉ
    return (
      <View style={[styles.cardPinned, { borderColor: colors.accent }]}>
        <View style={styles.left}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={{ marginTop: "auto" }}>
            <Text style={styles.count}>{d}</Text>
            <Text style={styles.sublabel}>Jours avant</Text>
          </View>
        </View>

        <View style={styles.right}>
          <Text style={styles.icon}>{iconFor(item.type)}</Text>
        </View>
      </View>
    );
  }

  // STYLE NORMAL
  return (
    <View style={styles.cardNormal}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ fontSize: 24 }}>{iconFor(item.type)}</Text>
        <Text style={styles.title}>{item.title}</Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text style={styles.count}>{d}</Text>
        <Text style={styles.sublabel}>Jours avant</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // 🔹 Normal
  cardNormal: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  // 🔹 Épinglé
  cardPinned: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    minHeight: 90,
    borderWidth: 2, // épaisseur visible
  },

  left: {
    flex: 1,
    justifyContent: "space-between",
  },
  right: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },

  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  count: {
    color: colors.accent,
    fontSize: 24,
    fontWeight: "800",
  },
  sublabel: {
    color: colors.sub,
    fontSize: 12,
  },
  icon: {
    fontSize: 28,
  },
});
