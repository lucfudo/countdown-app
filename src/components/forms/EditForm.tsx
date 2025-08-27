import React from "react";
import { View, Text, TextInput } from "react-native";
import { colors } from "@/theme";
import Chip from "@/components/ui/Chip";
import Toggle from "@/components/ui/Toggle";
import DateField from "@/components/DateField";
import { TYPE_OPTIONS, RECURRENCE_OPTIONS } from "@/config/editOptions";

export function Section({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        marginHorizontal: 12,
        marginVertical: 8,
        borderRadius: 18,
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: "#2b2c30",
        overflow: "hidden",
      }}
    >
      {children}
    </View>
  );
}

export function Row({
  children,
  last = false,
}: {
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: colors.line,
        gap: 8,
      }}
    >
      {children}
    </View>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text style={{ color: colors.sub, fontSize: 14, fontWeight: "500" }}>
      {children}
    </Text>
  );
}

function FilledInput(props: React.ComponentProps<typeof TextInput>) {
  return (
    <TextInput
      {...props}
      placeholderTextColor="#8b8d93"
      style={[
        {
          backgroundColor: "#1c1d20",
          borderWidth: 1,
          borderColor: "#2b2c30",
          color: colors.text,
          fontSize: 16,
          paddingHorizontal: 14,
          paddingVertical: 10,
          borderRadius: 12,
        },
        // autorise un style custom optionnel via props.style
        (props as any).style,
      ]}
    />
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
}: {
  title: string;
  setTitle: (v: string) => void;
  dateISO: string;
  setDate: (v: string) => void;
  recurrence: "none" | "yearly";
  setRecurrence: (v: "none" | "yearly") => void;
  type: string;
  setType: (v: any) => void;
  remJ0: boolean;
  setJ0: (v: boolean) => void;
  remJ3: boolean;
  setJ3: (v: boolean) => void;
}) {
  return (
    <Section>
      {/* Nom */}
      <Row>
        <FieldLabel>Nom</FieldLabel>
        <FilledInput placeholder="Nom" value={title} onChangeText={setTitle} />
      </Row>

      {/* Date */}
      <Row>
        <FieldLabel>Date</FieldLabel>
        {/* DateField gère l’UI du picker ; on l’encapsule dans le même style rempli */}
        <View
          style={{
            backgroundColor: "#1c1d20",
            borderWidth: 1,
            borderColor: "#2b2c30",
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 8,
          }}
        >
          <DateField
            label={undefined as any}
            value={dateISO}
            onChange={setDate}
          />
        </View>
      </Row>

      {/* Rappel */}
      <Row>
        <FieldLabel>Rappel</FieldLabel>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Toggle label="Le jour même" value={remJ0} onChange={setJ0} />
          <Toggle label="3 jours avant" value={remJ3} onChange={setJ3} />
        </View>
      </Row>

      {/* Récurrence */}
      <Row>
        <FieldLabel>Récurrence</FieldLabel>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
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

      {/* Type */}
      <Row last>
        <FieldLabel>Type</FieldLabel>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {TYPE_OPTIONS.map((opt) => (
            <Chip
              key={opt.key as string}
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
