import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/theme";
import { Item } from "@/types";
import { daysUntil } from "@/utils/date";
import { useTypes } from "@/hooks/useTypes";

const success = "#34C759";

export default function EventCard({ item }: { item: Item }) {
  const { types } = useTypes();
  const meta = useMemo(
    () => types.find((t) => t.key === item.type),
    [types, item.type]
  );
  const icon = meta?.icon ?? "🏷️";

  const d = daysUntil(item.dateISO, item.type, item.recurrence ?? "none", {
    signed: true,
  });
  const isPast = d < 0 && (item.recurrence ?? "none") === "none";
  const abs = Math.abs(d);

  if (item.pinned) {
    return (
      <View
        style={[
          styles.cardPinned,
          { borderColor: isPast ? success : colors.accent },
        ]}
      >
        <View style={styles.left}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={{ marginTop: "auto" }}>
            <Text
              style={[
                styles.count,
                { color: isPast ? success : colors.accent },
              ]}
            >
              {abs}
            </Text>
            <Text style={styles.sublabel}>
              {isPast ? "Jours depuis" : "Jours avant"}
            </Text>
          </View>
        </View>
        <View style={styles.right}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.cardNormal}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ fontSize: 24 }}>{icon}</Text>
        <Text style={styles.title}>{item.title}</Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text
          style={[styles.count, { color: isPast ? success : colors.accent }]}
        >
          {abs}
        </Text>
        <Text style={styles.sublabel}>
          {isPast ? "Jours depuis" : "Jours avant"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Normal
  cardNormal: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  // Épinglé
  cardPinned: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    minHeight: 90,
    borderWidth: 2, // accentuée
  },
  left: { flex: 1, justifyContent: "space-between" },
  right: { justifyContent: "center", alignItems: "center", marginLeft: 12 },
  title: { color: colors.text, fontSize: 16, fontWeight: "600" },
  count: { fontSize: 24, fontWeight: "800" },
  sublabel: { color: colors.sub, fontSize: 12 },
  icon: { fontSize: 28 },
});
