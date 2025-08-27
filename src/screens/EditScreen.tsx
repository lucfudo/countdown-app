import { useEffect, useState } from "react";
import { SafeAreaView, View, Text, TextInput, Pressable } from "react-native";
import { colors } from "@/theme";
import { Item, CountdownType, Reminder } from "@/types";
import { newId } from "@/utils/date";
import { scheduleReminders } from "@/notifications";
import { load, save } from "@/storage/db";
import DateField from "@/components/DateField";
import { RouteName } from "@/navigation/routes";

export default function EditScreen({
  route,
  nav,
}: {
  route: any;
  nav: (r: RouteName, p?: any) => void;
}) {
  const editId: string | undefined = route?.id;
  const isEdit = !!editId;

  const initialType: CountdownType = route?.type ?? "countdown";
  const [type, setType] = useState<CountdownType>(initialType);
  const [title, setTitle] = useState("");
  const [dateISO, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [recurrence, setRecurrence] = useState<"none" | "yearly">(
    initialType === "birthday" ? "yearly" : "none"
  );
  const [remJ0, setJ0] = useState(true);
  const [remJ3, setJ3] = useState(true);

  // Hydrate si on édite
  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      const list = await load();
      const it = list.find((x) => x.id === editId);
      if (!it) return;
      setTitle(it.title);
      setType(it.type);
      setDate(it.dateISO);
      setRecurrence(it.recurrence ?? "none");
      setJ0(it.reminder?.includes("J0") ?? false);
      setJ3(it.reminder?.includes("J-3") ?? false);
    })();
  }, [isEdit, editId]);

  async function saveItem() {
    const reminders: Reminder[] = [];
    if (remJ0) reminders.push("J0");
    if (remJ3) reminders.push("J-3");

    const list = await load();

    if (isEdit) {
      const idx = list.findIndex((x) => x.id === editId);
      if (idx >= 0) {
        const updated: Item = {
          ...list[idx],
          title,
          type,
          dateISO,
          recurrence,
          reminder: reminders,
          // on garde createdAt/pinned/archived existants grâce au spread
        };
        list[idx] = updated;
        await save(list);
        await scheduleReminders(updated);
      }
    } else {
      const item: Item = {
        id: newId(),
        title,
        type,
        dateISO,
        recurrence,
        reminder: reminders,
        createdAt: Date.now(),
      };
      list.unshift(item);
      await save(list);
      await scheduleReminders(item);
    }

    nav("home");
  }

  const row = {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  } as const;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View
        style={{
          padding: 16,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Pressable onPress={() => nav("home")}>
          <Text style={{ color: colors.accent }}>Annuler</Text>
        </Pressable>
        <Text style={{ color: colors.text, fontWeight: "700" }}>
          {isEdit ? "Modifier" : "Ajouter"}
        </Text>
        <Pressable onPress={saveItem}>
          <Text style={{ color: colors.accent }}>
            {isEdit ? "Enregistrer" : "Suivant"}
          </Text>
        </Pressable>
      </View>

      <View
        style={{ backgroundColor: colors.card, margin: 16, borderRadius: 14 }}
      >
        <View style={row}>
          <Text style={{ color: colors.sub, marginBottom: 6 }}>Nom</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Nom"
            placeholderTextColor="#888"
            style={{ color: colors.text, fontSize: 16 }}
          />
        </View>

        <View style={row}>
          <DateField label="Date" value={dateISO} onChange={setDate} />
        </View>

        <View style={row}>
          <Text style={{ color: colors.sub, marginBottom: 6 }}>Rappel</Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Toggle label="Le jour même" value={remJ0} onChange={setJ0} />
            <Toggle label="3 jours avant" value={remJ3} onChange={setJ3} />
          </View>
        </View>

        <View style={row}>
          <Text style={{ color: colors.sub, marginBottom: 6 }}>Récurrence</Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Chip
              active={recurrence === "none"}
              onPress={() => setRecurrence("none")}
            >
              Aucun
            </Chip>
            <Chip
              active={recurrence === "yearly"}
              onPress={() => setRecurrence("yearly")}
            >
              Annuel
            </Chip>
          </View>
        </View>

        <View style={[row, { borderBottomWidth: 0 }]}>
          <Text style={{ color: colors.sub, marginBottom: 6 }}>Type</Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Chip
              active={type === "countdown"}
              onPress={() => setType("countdown")}
            >
              Compte à rebours
            </Chip>
            <Chip
              active={type === "birthday"}
              onPress={() => setType("birthday")}
            >
              Anniversaire
            </Chip>
            <Chip active={type === "event"} onPress={() => setType("event")}>
              Fête
            </Chip>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function Chip({ children, active = false, onPress }: any) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 999,
        backgroundColor: active ? "#33363a" : "#1a1b1e",
        borderWidth: 1,
        borderColor: "#2b2c30",
      }}
    >
      <Text style={{ color: "#e9e9ee" }}>{children}</Text>
    </Pressable>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <Pressable
      onPress={() => onChange(!value)}
      style={{
        backgroundColor: value ? "#2e2f33" : "#1a1b1e",
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 12,
      }}
    >
      <Text style={{ color: "#e9e9ee" }}>{label}</Text>
    </Pressable>
  );
}
