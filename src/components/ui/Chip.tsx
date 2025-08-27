import React from "react";
import { Pressable, Text } from "react-native";

export default function Chip({ children, active = false, onPress }: any) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 999,
        backgroundColor: active ? "#33363a" : "#1a1b1e",
        borderWidth: 1,
        borderColor: "#2b2c30",
      }}
    >
      <Text style={{ color: "#e9e9ee" }}>{children}</Text>
    </Pressable>
  );
}
