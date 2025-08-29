import React, { useMemo, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Picker } from "@react-native-picker/picker";
import WheelModal from "@/components/ui/WheelModal";
import { colors } from "@/theme";

function fmt(o: number) {
  if (o === 0) return "Le jour même";
  if (o < 0) return `${Math.abs(o)} j avant`;
  return `${o} j après`;
}

export default function ReminderWheelPicker({
  values,
  onChange,
}: {
  values: number[];
  onChange: (next: number[]) => void;
}) {
  const sorted = useMemo(
    () => Array.from(new Set(values)).sort((a, b) => a - b),
    [values]
  );

  const [open, setOpen] = useState(false);
  const [sign, setSign] = useState<"-" | "+" | "0">(
    values.includes(0) ? "0" : "-"
  );
  const [days, setDays] = useState(3);

  function addOffset() {
    let n = 0;
    if (sign === "-") n = -Math.max(0, Math.trunc(days));
    else if (sign === "+") n = Math.max(0, Math.trunc(days));
    else n = 0;

    const next = Array.from(new Set([...sorted, n])).sort((a, b) => a - b);
    onChange(next);
  }

  function removeOffset(n: number) {
    onChange(sorted.filter((x) => x !== n));
  }

  const wheelText = { color: colors.text };

  return (
    <View style={{ gap: 10 }}>
      {/* tags existants */}
      {sorted.length > 0 ? (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {sorted.map((o) => (
            <Pressable
              key={o}
              onPress={() => removeOffset(o)}
              style={{
                backgroundColor: "#1c1d20",
                borderWidth: 1,
                borderColor: "#2b2c30",
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 999,
              }}
            >
              <Text style={{ color: colors.text, fontWeight: "600" }}>
                {fmt(o)} ✕
              </Text>
            </Pressable>
          ))}
        </View>
      ) : (
        <Text style={{ color: colors.sub }}>Aucun rappel.</Text>
      )}

      <Pressable
        onPress={() => setOpen(true)}
        style={{
          alignSelf: "flex-start",
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: "#2b2c30",
          paddingVertical: 10,
          paddingHorizontal: 12,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: colors.text, fontWeight: "600" }}>
          Ajouter un rappel…
        </Text>
      </Pressable>

      <WheelModal
        open={open}
        title="Rappel"
        onCancel={() => setOpen(false)}
        onDone={() => {
          addOffset();
          setOpen(false);
        }}
      >
        {/* Colonne 1 */}
        <View style={{ flex: 1 }}>
          <Picker
            selectedValue={sign}
            onValueChange={(v) => setSign(v)}
            style={wheelText}
            itemStyle={wheelText}
          >
            <Picker.Item label="Avant" value="-" />
            <Picker.Item label="Le jour même" value="0" />
            <Picker.Item label="Après" value="+" />
          </Picker>
        </View>

        {/* Colonne 2 (grisée si “jour même”) */}
        <View style={{ flex: 1, opacity: sign === "0" ? 0.35 : 1 }}>
          <Picker
            enabled={sign !== "0"}
            selectedValue={days}
            onValueChange={(v) => setDays(v)}
            style={wheelText}
            itemStyle={wheelText}
          >
            {Array.from({ length: 366 }, (_, i) => i).map((n) => (
              <Picker.Item
                key={n}
                label={`${n} jour${n > 1 ? "s" : ""}`}
                value={n}
              />
            ))}
          </Picker>
        </View>
      </WheelModal>
    </View>
  );
}
