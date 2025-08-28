import { View, Text, Pressable, ScrollView } from "react-native";
import { colors } from "@/theme";
import { TYPE_META } from "@/config/types";
import type { CountdownType } from "@/types";

export type Filter = "all" | CountdownType;

export default function FilterChips({
  value,
  onChange,
  counts, // 👈 new
}: {
  value: Filter;
  onChange: (f: Filter) => void;
  counts?: Partial<Record<Filter, number>>;
}) {
  const chips: { key: Filter; label: string; icon?: string }[] = [
    { key: "all", label: "Tout" },
    ...(Object.keys(TYPE_META) as CountdownType[]).map((t) => ({
      key: t,
      label: TYPE_META[t].label,
      icon: TYPE_META[t].icon,
    })),
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
