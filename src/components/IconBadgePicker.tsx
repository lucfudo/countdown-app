import { View, Text, Pressable, Alert } from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { colors } from "@/theme";
import type { CountdownType, TypeDef } from "@/types";

export default function IconBadgePicker({
  type,
  onSelectType,
  types, // 👈 dynamique
  size = 84,
}: {
  type: CountdownType;
  onSelectType: (t: CountdownType) => void;
  types: TypeDef[]; // [{ key, label, icon }]
  size?: number;
}) {
  const { showActionSheetWithOptions } = useActionSheet();

  const current = types.find((t) => t.key === type);
  const currentIcon = current?.icon ?? "🏷️";

  function openPicker() {
    if (!types || types.length === 0) {
      Alert.alert("Aucun type disponible", "Ajoute d’abord un type.");
      return;
    }

    const options = types.map((t) => `${t.icon}  ${t.label}`).concat("Annuler");
    const cancelButtonIndex = options.length - 1;

    showActionSheetWithOptions({ options, cancelButtonIndex }, (i) => {
      if (i == null || i === cancelButtonIndex) return;
      const selected = types[i];
      if (selected) onSelectType(selected.key);
    });
  }

  return (
    <View style={{ alignItems: "center", marginVertical: 14 }}>
      <Pressable onPress={openPicker}>
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: "#2b2c30",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: Math.round(size * 0.5) }}>
            {currentIcon}
          </Text>

          {/* badge crayon */}
          <View
            style={{
              position: "absolute",
              right: 6,
              bottom: 6,
              backgroundColor: colors.card,
              borderRadius: 12,
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderWidth: 1,
              borderColor: "#3a3b40",
            }}
          >
            <Text style={{ fontSize: 12, color: "#cfcfd6" }}>✏️</Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}
