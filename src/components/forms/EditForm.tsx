import React from "react";
import { View, Text, TextInput } from "react-native";
import { colors } from "@/theme";
import Chip from "@/components/ui/Chip";
import ReminderWheelPicker from "@/components/forms/ReminderWheelPicker";
import RecurrenceWheel from "@/components/forms/RecurrenceWheel";
import DateField from "@/components/DateField";
import type { CountdownType } from "@/types";

/* ---------- UI helpers ---------- */

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
        (props as any).style,
      ]}
    />
  );
}

/* ---------- EditForm ---------- */

export default function EditForm({
  title,
  setTitle,
  dateISO,
  setDate,
  recurrence,
  setRecurrence,
  type,
  setType,
  // NEW reminders (offsets en jours, ex: -3, 0, +1)
  remOffsets,
  addOffset,
  removeOffset,
  // Types dynamiques
  typeOptions,
}: {
  title: string;
  setTitle: (v: string) => void;
  dateISO: string;
  setDate: (v: string) => void;
  recurrence: "none" | "yearly";
  setRecurrence: (v: "none" | "yearly") => void;
  type: CountdownType;
  setType: (v: CountdownType) => void;

  // ⬇️ nouveaux props pour le sélecteur de rappels
  remOffsets: number[];
  addOffset: (n: number) => void;
  removeOffset: (n: number) => void;

  // ⬇️ types dynamiques
  typeOptions: { key: CountdownType; label: string; icon?: string }[];
}) {
  const sortedTypes = [...(typeOptions ?? [])].sort((a, b) =>
    a.label.localeCompare(b.label)
  );

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
      <Row>
        <FieldLabel>Rappel</FieldLabel>
        <ReminderWheelPicker
          values={remOffsets}
          onChange={(next) => {
            // expose add/remove si tu préfères, mais le plus simple :
            // set via add/remove existants
            const current = new Set(remOffsets);
            // retire ceux absents
            remOffsets.forEach((o) => {
              if (!next.includes(o)) removeOffset(o);
            });
            // ajoute les nouveaux
            next.forEach((o) => {
              if (!current.has(o)) addOffset(o);
            });
          }}
        />
      </Row>
      <Row>
        <FieldLabel>Récurrence</FieldLabel>
        <RecurrenceWheel
          value={recurrence}
          onChange={setRecurrence}
          eventMonthDayText={new Date(dateISO).toLocaleDateString(undefined, {
            day: "2-digit",
            month: "short",
          })}
        />
      </Row>
      {/* Type (dynamique) */}
      <Row last>
        <FieldLabel>Type</FieldLabel>
        {sortedTypes.length === 0 ? (
          <Text style={{ color: colors.sub }}>
            Aucun type disponible. Va dans “⋯ → Gérer les types” pour en créer.
          </Text>
        ) : (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {sortedTypes.map((opt) => (
              <Chip
                key={opt.key as string}
                active={type === opt.key}
                onPress={() => setType(opt.key)}
              >
                {opt.icon ? `${opt.icon}  ${opt.label}` : opt.label}
              </Chip>
            ))}
          </View>
        )}
      </Row>
    </Section>
  );
}
