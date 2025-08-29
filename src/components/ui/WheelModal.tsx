import React from "react";
import { Modal, View, Text, Pressable } from "react-native";
import { colors } from "@/theme";

export default function WheelModal({
  open,
  title,
  onCancel,
  onDone,
  children,
}: {
  open: boolean;
  title: string;
  onCancel: () => void;
  onDone: () => void;
  children: React.ReactNode;
}) {
  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            backgroundColor: colors.card,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            borderWidth: 1,
            borderColor: "#2b2c30",
            paddingBottom: 8,
          }}
        >
          {/* header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingTop: 12,
              paddingBottom: 8,
            }}
          >
            <Pressable onPress={onCancel} hitSlop={10}>
              <Text style={{ color: colors.accent, fontWeight: "600" }}>
                Annuler
              </Text>
            </Pressable>
            <Text style={{ color: colors.text, fontWeight: "700" }}>
              {title}
            </Text>
            <Pressable onPress={onDone} hitSlop={10}>
              <Text style={{ color: colors.accent, fontWeight: "600" }}>
                Terminé
              </Text>
            </Pressable>
          </View>

          {/* wheels */}
          <View
            style={{ height: 220, flexDirection: "row", alignItems: "center" }}
          >
            {children}
          </View>
        </View>
      </View>
    </Modal>
  );
}
