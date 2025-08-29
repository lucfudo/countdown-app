import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView, View, Text, Pressable, Share } from "react-native";
import { colors } from "@/theme";
import { RouteName } from "@/navigation/routes";
import { Item } from "@/types";
import { getItem } from "@/services/items";
import CalendarMonth from "@/components/CalendarMonth";
import { daysUntil } from "@/utils/date";
import { useTypes } from "@/hooks/useTypes";

export default function EventDetailScreen({
  route,
  nav,
}: {
  route: any;
  nav: (r: RouteName, p?: any) => void;
}) {
  const id: string | undefined = route?.id;
  const [item, setItem] = useState<Item | null>(null);
  const { types } = useTypes();

  useEffect(() => {
    (async () => {
      if (!id) return;
      const it = await getItem(id);
      if (it) setItem(it);
    })();
  }, [id]);

  const meta = useMemo(
    () => types.find((t) => t.key === item?.type),
    [types, item?.type]
  );
  const icon = meta?.icon ?? "🏷️";

  const d = useMemo(
    () =>
      item
        ? daysUntil(item.dateISO, item.type, item.recurrence ?? "none", {
            signed: true,
          })
        : 0,
    [item]
  );
  const abs = Math.abs(d);
  const isPast = d < 0 && (item?.recurrence ?? "none") === "none";

  const subtitle = useMemo(() => {
    if (!item) return "";
    const dt = new Date(item.dateISO).toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    return `${isPast ? "Jours depuis" : "Jours jusqu'à"} ${dt}`;
  }, [item, isPast]);

  if (!item) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.bg,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: colors.sub }}>Chargement…</Text>
      </SafeAreaView>
    );
  }

  async function share() {
    await Share.share({ message: `📅 ${item?.title} — ${item?.dateISO}` });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Top bar */}
      <View
        style={{
          padding: 16,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Pressable onPress={() => nav("home")} hitSlop={10}>
          <Text style={{ color: colors.text, fontSize: 18 }}>‹</Text>
        </Pressable>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={{ color: colors.text, fontWeight: "700" }}>
            {item.title}
          </Text>
        </View>
        <View style={{ width: 18 }} />
      </View>

      {/* Carte calendrier + compteur */}
      <View style={{ paddingHorizontal: 16 }}>
        <CalendarMonth dateISO={item.dateISO} />
        <View
          style={{
            backgroundColor: colors.card,
            marginTop: 12,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: "#2b2c30",
            paddingVertical: 24,
            alignItems: "center",
          }}
        >
          {/* petit “logo” */}
          <Text style={{ color: colors.sub, marginBottom: 8, fontSize: 18 }}>
            {icon}
          </Text>

          {/* grand compteur */}
          <Text
            style={{
              fontSize: 64,
              fontWeight: "900",
              color: isPast ? "#34C759" : colors.accent,
              lineHeight: 68,
            }}
          >
            {abs}
          </Text>

          {/* sous-titre */}
          <Text
            style={{
              color: colors.sub,
              marginTop: 6,
              fontSize: 14,
              fontWeight: "600",
            }}
          >
            {subtitle}
          </Text>
        </View>
      </View>

      {/* Actions flottantes bas */}
      <View
        style={{
          position: "absolute",
          bottom: 24,
          width: "100%",
          alignItems: "center",
          gap: 16,
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        {/* Éditer */}
        <Pressable
          onPress={() => nav("edit", { id: item.id })}
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: "#2b2c30",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: colors.text, fontSize: 18 }}>✏️</Text>
        </Pressable>

        {/* Partager */}
        <Pressable
          onPress={share}
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: "#2b2c30",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: colors.text, fontSize: 18 }}>↗️</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
