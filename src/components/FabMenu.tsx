import React from "react";
import { View, Pressable, Text } from "react-native";
import { colors } from "@/theme";
type Item = { label: string; icon: string; onPress: () => void };

export default function FabMenu({ actions }: { actions: Item[] }) {
  const [open, setOpen] = React.useState(false);
  return (
    <View
      style={{
        position: "absolute",
        right: 20,
        bottom: 30,
        alignItems: "flex-end",
        gap: 10,
      }}
    >
      {open &&
        actions.map((a, i) => (
          <Pressable
            key={i}
            onPress={() => {
              setOpen(false);
              a.onPress();
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              marginBottom: 6,
            }}
          >
            <Text style={{ color: colors.text }}>{a.label}</Text>
            <View
              style={{
                width: 46,
                height: 46,
                borderRadius: 23,
                backgroundColor: "#2a2b2f",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 20 }}>{a.icon}</Text>
            </View>
          </Pressable>
        ))}
      <Pressable
        onPress={() => setOpen(!open)}
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: colors.accent,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 28, color: "#111" }}>{open ? "×" : "+"}</Text>
      </Pressable>
    </View>
  );
}
