import React from "react";
import { View, Text, TextInput } from "react-native";
import { colors } from "@/theme";
import Chip from "@/components/ui/Chip";
import Toggle from "@/components/ui/Toggle";
import DateField from "@/components/DateField";
import { TYPE_OPTIONS, RECURRENCE_OPTIONS } from "@/config/editOptions";

export function Section({ children }: any) {
  return (
    <View
      style={{ backgroundColor: colors.card, margin: 16, borderRadius: 14 }}
    >
      {children}
    </View>
  );
}

export function Row({
  children,
  last = false,
}: {
  children: any;
  last?: boolean;
}) {
  return (
    <View
      style={{
        padding: 14,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: colors.line,
      }}
    >
      {children}
    </View>
  );
}

export default function EditForm({
  title,
  setTitle,
  dateISO,
  setDate,
  recurrence,
  setRecurrence,
  type,
  setType,
  remJ0,
  setJ0,
  remJ3,
  setJ3,
}: any) {
  return (
    <Section>
      <Row>
        <Text style={{ color: colors.sub, marginBottom: 6 }}>Nom</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Nom"
          placeholderTextColor="#888"
          style={{ color: colors.text, fontSize: 16 }}
        />
      </Row>

      <Row>
        <DateField label="Date" value={dateISO} onChange={setDate} />
      </Row>

      <Row>
        <Text style={{ color: colors.sub, marginBottom: 6 }}>Rappel</Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Toggle label="Le jour même" value={remJ0} onChange={setJ0} />
          <Toggle label="3 jours avant" value={remJ3} onChange={setJ3} />
        </View>
      </Row>

      <Row>
        <Text style={{ color: colors.sub, marginBottom: 6 }}>Récurrence</Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          {RECURRENCE_OPTIONS.map((opt) => (
            <Chip
              key={opt.key}
              active={recurrence === opt.key}
              onPress={() => setRecurrence(opt.key)}
            >
              {opt.label}
            </Chip>
          ))}
        </View>
      </Row>

      <Row last>
        <Text style={{ color: colors.sub, marginBottom: 6 }}>Type</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {TYPE_OPTIONS.map((opt) => (
            <Chip
              key={opt.key}
              active={type === opt.key}
              onPress={() => setType(opt.key)}
            >
              {opt.label}
            </Chip>
          ))}
        </View>
      </Row>
    </Section>
  );
}
