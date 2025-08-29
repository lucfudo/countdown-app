import { View, Text, Pressable, ScrollView } from "react-native";
import { colors } from "@/theme";
import type { CountdownType, TypeDef } from "@/types";

// 🔁 Pour rester flexible avec des types dynamiques possibles :
export type Filter = "all" | "untagged" | CountdownType;

export default function FilterChips({
  value,
  onChange,
  counts,
  types, // 👈 NOUVEAU
}: {
  value: Filter;
  onChange: (f: Filter) => void;
  counts?: Partial<Record<Filter, number>>;
  types: TypeDef[]; // 👈 liste dynamique: [{ key, label, icon }]
}) {
  const chips: { key: Filter; label: string; icon?: string }[] = [
    { key: "all", label: "Tout" },
    ...[...types]
      .sort((a, b) => a.label.localeCompare(b.label))
      .map((t) => ({ key: t.key as Filter, label: t.label, icon: t.icon })),
    { key: "untagged", label: "Sans étiquette", icon: "🏷️" },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 16,
        gap: 10,
        paddingBottom: 8,
      }}
    >
      {chips.map((c) => {
        const active = value === c.key;
        const count = counts?.[c.key];
        return (
          <Pressable
            key={c.key}
            onPress={() => onChange(c.key)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 999,
              backgroundColor: active ? "#33363a" : "#1a1b1e",
              borderWidth: 1,
              borderColor: active ? "#3f444a" : "#2b2c30",
            }}
          >
            {!!c.icon && <Text style={{ fontSize: 14 }}>{c.icon}</Text>}
            <Text style={{ color: "#e9e9ee" }}>{c.label}</Text>

            {typeof count === "number" && (
              <View
                style={{
                  marginLeft: 4,
                  backgroundColor: colors.accent,
                  borderRadius: 10,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  minWidth: 20,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}
                >
                  {count}
                </Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
