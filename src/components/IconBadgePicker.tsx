import { View, Text, Pressable } from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { colors } from "@/theme";
import type { CountdownType } from "@/types";
import { TYPE_META } from "@/config/types";

export default function IconBadgePicker({
  type,
  onSelectType,
  size = 84,
}: {
  type: CountdownType;
  onSelectType: (t: CountdownType) => void;
  size?: number;
}) {
  const { showActionSheetWithOptions } = useActionSheet();

  function openPicker() {
    // 🔥 Dynamique: dérive les types de TYPE_META
    const entries = Object.keys(TYPE_META) as CountdownType[];

    const options = entries
      .map((t) => `${TYPE_META[t].icon}  ${TYPE_META[t].label}`)
      .concat("Annuler");

    const cancelButtonIndex = options.length - 1;

    showActionSheetWithOptions({ options, cancelButtonIndex }, (i) => {
      if (i == null || i === cancelButtonIndex) return;
      onSelectType(entries[i]);
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
            {TYPE_META[type].icon}
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
