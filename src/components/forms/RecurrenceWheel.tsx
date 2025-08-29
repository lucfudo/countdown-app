import React, { useMemo, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Picker } from "@react-native-picker/picker";
import WheelModal from "@/components/ui/WheelModal";
import { colors } from "@/theme";

type Unit = "day" | "week" | "month" | "quarter" | "year";

const UNIT_LABEL_SING: Record<Unit, string> = {
  day: "Jour",
  week: "Semaine",
  month: "Mois",
  quarter: "Trimestre",
  year: "An",
};
const UNIT_LABEL_PLUR: Record<Unit, string> = {
  day: "Jours",
  week: "Semaines",
  month: "Mois",
  quarter: "Trimestres",
  year: "Ans",
};

export default function RecurrenceWheel({
  value, // "none" | "yearly"
  onChange,
  eventMonthDayText,
}: {
  value: "none" | "yearly";
  onChange: (v: "none" | "yearly") => void;
  eventMonthDayText: string; // ex: "le 28 sept."
}) {
  const [open, setOpen] = useState(false);

  // état local de la roue (par défaut: 1 An si yearly, sinon 1 Mois)
  const [n, setN] = useState(value === "yearly" ? 1 : 1);
  const [unit, setUnit] = useState<Unit>(value === "yearly" ? "year" : "month");

  const wheelText = { color: colors.text };

  const preview = useMemo(() => {
    if (value === "yearly") return `Annuellement ${eventMonthDayText}`;
    return "Aucun";
  }, [value, eventMonthDayText]);

  return (
    <View style={{ gap: 10 }}>
      <Pressable
        onPress={() => setOpen(true)}
        style={{
          backgroundColor: "#1c1d20",
          borderWidth: 1,
          borderColor: "#2b2c30",
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 12,
        }}
      >
        <Text style={{ color: colors.text }}>{preview}</Text>
      </Pressable>

      <WheelModal
        open={open}
        title="Récurrence"
        onCancel={() => setOpen(false)}
        onDone={() => {
          // mapping minimal vers le modèle actuel
          if (n === 1 && unit === "year") onChange("yearly");
          else onChange("none");
          setOpen(false);
        }}
      >
        {/* Colonne 1: libellé fixe */}
        <View style={{ flex: 1 }}>
          <Picker
            enabled={false}
            selectedValue={"tous"}
            style={wheelText}
            itemStyle={wheelText}
          >
            <Picker.Item label="Tous les" value="tous" />
          </Picker>
        </View>

        {/* Colonne 2: N (1..36) */}
        <View style={{ flex: 1 }}>
          <Picker
            selectedValue={n}
            onValueChange={(v) => setN(v)}
            style={wheelText}
            itemStyle={wheelText}
          >
            {Array.from({ length: 36 }, (_, i) => i + 1).map((x) => (
              <Picker.Item key={x} label={`${x}`} value={x} />
            ))}
          </Picker>
        </View>

        {/* Colonne 3: unité */}
        <View style={{ flex: 1 }}>
          <Picker
            selectedValue={unit}
            onValueChange={(v) => setUnit(v)}
            style={wheelText}
            itemStyle={wheelText}
          >
            {(["day", "week", "month", "quarter", "year"] as Unit[]).map(
              (u) => (
                <Picker.Item
                  key={u}
                  label={n > 1 ? UNIT_LABEL_PLUR[u] : UNIT_LABEL_SING[u]}
                  value={u}
                />
              )
            )}
          </Picker>
        </View>
      </WheelModal>
    </View>
  );
}
