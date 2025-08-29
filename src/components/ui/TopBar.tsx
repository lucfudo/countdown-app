import React from "react";
import { View, Text } from "react-native";
import { colors } from "@/theme";

export default function TopBar({
  title,
  left,
  right,
  height = 48,
}: {
  title: string;
  left?: React.ReactNode; // ex: <Pressable><Text>Annuler</Text></Pressable>
  right?: React.ReactNode; // ex: <Pressable><Text>Terminé</Text></Pressable>
  height?: number;
}) {
  return (
    <View
      style={{
        height,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 0,
      }}
    >
      {/* Titre réellement centré */}
      <Text
        numberOfLines={1}
        style={{
          position: "absolute",
          left: 16,
          right: 16,
          textAlign: "center",
          color: colors.text,
          fontWeight: "700",
          fontSize: 16,
        }}
      >
        {title}
      </Text>

      {/* Actions gauche/droite indépendantes */}
      <View style={{ position: "absolute", left: 16 }}>{left}</View>
      <View style={{ position: "absolute", right: 16 }}>{right}</View>
    </View>
  );
}
