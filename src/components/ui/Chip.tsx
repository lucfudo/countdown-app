import React from "react";
import { Pressable, View, Text } from "react-native";

type Props = {
  active?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
  style?: any;
  textStyle?: any;
};

export default function Chip({
  active,
  onPress,
  children,
  style,
  textStyle,
}: Props) {
  const base = (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: 999,
          backgroundColor: active ? "#33363a" : "#1a1b1e",
          borderWidth: 1,
          borderColor: active ? "#3f444a" : "#2b2c30",
        },
        style,
      ]}
    >
      {typeof children === "string" || typeof children === "number" ? (
        <Text
          style={[
            {
              color: "#e9e9ee",
              fontSize: 14,
              fontWeight: active ? "700" : "500",
            },
            textStyle,
          ]}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );

  if (!onPress) return base;
  return <Pressable onPress={onPress}>{base}</Pressable>;
}
