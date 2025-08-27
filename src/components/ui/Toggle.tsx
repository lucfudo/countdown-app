import React from "react";
import { Pressable, Text } from "react-native";

export default function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <Pressable
      onPress={() => onChange(!value)}
      style={{
        backgroundColor: value ? "#2e2f33" : "#1a1b1e",
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 12,
      }}
    >
      <Text style={{ color: "#e9e9ee" }}>{label}</Text>
    </Pressable>
  );
}
