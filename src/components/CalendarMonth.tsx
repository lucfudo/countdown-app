import React, { useMemo } from "react";
import { View, Text } from "react-native";
import { colors } from "@/theme";

type Props = {
  dateISO: string; // ex: "2025-09-28" → mois affiché = septembre 2025
  highlightDate?: string; // jour à cercler (par défaut = dateISO)
};

function toDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export default function CalendarMonth({ dateISO, highlightDate }: Props) {
  const target = toDate(dateISO);
  const y = target.getFullYear();
  const m = target.getMonth();

  const selected = toDate(highlightDate || dateISO);
  const selectedDay = selected.getDate();

  const firstDay = new Date(y, m, 1);
  const startWeekday = (firstDay.getDay() + 6) % 7; // L(0)..D(6) — lundi first
  const daysInMonth = new Date(y, m + 1, 0).getDate();

  const weeks = useMemo(() => {
    const cells: Array<{ day: number | null }> = [];
    for (let i = 0; i < startWeekday; i++) cells.push({ day: null });
    for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d });
    while (cells.length % 7 !== 0) cells.push({ day: null });

    const rows: Array<Array<{ day: number | null }>> = [];
    for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
    return rows;
  }, [startWeekday, daysInMonth]);

  const monthLabel = target.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#2b2c30",
        overflow: "hidden",
      }}
    >
      {/* header mois */}
      <View style={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8 }}>
        <Text
          style={{
            color: colors.text,
            fontSize: 18,
            fontWeight: "700",
            textTransform: "capitalize",
          }}
        >
          {monthLabel}
        </Text>
      </View>

      {/* lignes pointillées */}
      <View style={{ height: 1, backgroundColor: "#2b2c30" }} />

      {/* en-têtes (L M M J V S D) */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingVertical: 10,
          paddingHorizontal: 16,
        }}
      >
        {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
          <Text
            key={i}
            style={{
              color: colors.sub,
              width: 28,
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            {d}
          </Text>
        ))}
      </View>

      {/* grille */}
      <View style={{ paddingHorizontal: 16, paddingBottom: 12, gap: 8 }}>
        {weeks.map((row, i) => (
          <View
            key={i}
            style={{
              flexDirection: "row",
              gap: 8,
              justifyContent: "space-between",
            }}
          >
            {row.map((c, j) => {
              const isSelected = c.day === selectedDay;
              return (
                <View
                  key={j}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: isSelected ? 2 : 0,
                    borderColor: isSelected ? "#ff5e00" : "transparent",
                    backgroundColor: "transparent",
                  }}
                >
                  <Text
                    style={{
                      color: c.day ? colors.text : "#4a4b50",
                      fontWeight: isSelected ? ("800" as const) : "500",
                    }}
                  >
                    {c.day ?? ""}
                  </Text>
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}
