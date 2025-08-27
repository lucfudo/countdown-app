import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Modal,
  Pressable,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { colors } from "@/theme";

type Props = {
  label?: string;
  value: string; // "YYYY-MM-DD"
  onChange: (nextISO: string) => void;
  minimumDate?: Date;
  maximumDate?: Date;
  disabled?: boolean;
};

function toISO(date: Date) {
  // retourne YYYY-MM-DD en local timezone
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function fromISO(iso: string) {
  // tolère "YYYY-MM-DD" ; si invalide -> aujourd’hui
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return new Date();
  const dt = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return isNaN(dt.getTime()) ? new Date() : dt;
}

export default function DateField({
  label = "Date",
  value,
  onChange,
  minimumDate,
  maximumDate,
  disabled,
}: Props) {
  const [open, setOpen] = useState(false);
  const dateObj = useMemo(() => fromISO(value), [value]);

  const handleChange = (e: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === "android") setOpen(false); // auto-fermeture Android
    if (selected) onChange(toISO(selected));
  };

  return (
    <View style={{ padding: 14 }}>
      <Text style={{ color: "#b7b7c2", marginBottom: 6 }}>{label}</Text>

      <TouchableOpacity
        onPress={() => !disabled && setOpen(true)}
        activeOpacity={0.7}
        style={{
          paddingVertical: 8,
          borderBottomWidth: 1,
          borderBottomColor: "#2e2f33",
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <Text style={{ color: "#e9e9ee", fontSize: 16 }}>{value}</Text>
      </TouchableOpacity>

      {/* ANDROID : inline modal du système */}
      {open && Platform.OS === "android" && (
        <DateTimePicker
          value={dateObj}
          mode="date"
          display="default"
          onChange={handleChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}

      {/* iOS : petit modal avec boutons */}
      {Platform.OS === "ios" && (
        <Modal
          visible={open}
          transparent
          animationType="fade"
          onRequestClose={() => setOpen(false)}
        >
          <Pressable
            style={{ flex: 1, backgroundColor: "#0008" }}
            onPress={() => setOpen(false)}
          />
          <View
            style={{
              backgroundColor: "#222326",
              padding: 12,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            <View style={{ alignItems: "flex-end", marginBottom: 6 }}>
              <TouchableOpacity onPress={() => setOpen(false)}>
                <Text style={{ color: "#ff8a00", fontWeight: "600" }}>OK</Text>
              </TouchableOpacity>
            </View>

            <DateTimePicker
              textColor={colors.accent}
              value={dateObj}
              mode="date"
              display="spinner"
              onChange={(e, d) => {
                if (d) onChange(toISO(d));
              }}
              minimumDate={minimumDate}
              maximumDate={maximumDate}
              style={{ backgroundColor: "#222326" }}
            />
          </View>
        </Modal>
      )}
    </View>
  );
}
