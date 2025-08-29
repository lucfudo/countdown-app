import { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  Alert,
} from "react-native";
import { colors } from "@/theme";
import { useTypes } from "@/hooks/useTypes";
import { TypeDef } from "@/types";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { RouteName } from "@/navigation/routes";

export default function TypesScreen({
  nav,
}: {
  nav: (r: RouteName, p?: any) => void;
}) {
  const { types, addType, updateType, removeType } = useTypes();

  const [label, setLabel] = useState("");
  const [icon, setIcon] = useState("✨");
  const [key, setKey] = useState("");

  function resetForm() {
    setLabel("");
    setIcon("✨");
    setKey("");
  }

  async function onAdd() {
    const k = key.trim() || label.trim().toLowerCase().replace(/\s+/g, "-");
    if (!k || !label.trim()) {
      Alert.alert("Erreur", "Clé et libellé requis.");
      return;
    }
    if (types.some((t) => t.key === k)) {
      Alert.alert("Conflit", "Cette clé existe déjà.");
      return;
    }
    const t: TypeDef = { key: k, label: label.trim(), icon: icon || "✨" };
    await addType(t);
    resetForm();
  }

  function Row({ t }: { t: TypeDef }) {
    const { showActionSheetWithOptions } = useActionSheet();
    return (
      <Pressable
        onLongPress={() => {
          const options = [
            "Renommer",
            "Changer l’emoji",
            "Supprimer",
            "Annuler",
          ];
          showActionSheetWithOptions(
            { options, cancelButtonIndex: 3, destructiveButtonIndex: 2 },
            async (i) => {
              if (i === 0) {
                // Renommer
                // (ici, rapide : on réutilise inputs en haut comme “buffer”)
                setKey(t.key);
                setLabel(t.label);
                setIcon(t.icon);
              }
              if (i === 1) {
                setKey(t.key);
                setLabel(t.label);
                setIcon(t.icon);
                Alert.alert(
                  "Emoji",
                  "Entre un emoji dans le champ Emoji puis appuie sur Enregistrer."
                );
              }
              if (i === 2) {
                Alert.alert("Supprimer", `Supprimer « ${t.label} » ?`, [
                  { text: "Annuler", style: "cancel" },
                  {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: async () => removeType(t.key),
                  },
                ]);
              }
            }
          );
        }}
        style={{
          backgroundColor: colors.card,
          padding: 14,
          borderRadius: 12,
          marginVertical: 6,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Text style={{ fontSize: 22 }}>{t.icon}</Text>
          <Text style={{ color: colors.text, fontWeight: "600" }}>
            {t.label}
          </Text>
        </View>
        <Text style={{ color: colors.sub }}>{t.key}</Text>
      </Pressable>
    );
  }

  async function onSaveEdit() {
    if (!key) return;
    const labelTrim = label.trim();
    if (!labelTrim) {
      Alert.alert("Erreur", "Libellé requis.");
      return;
    }
    await updateType(key, { label: labelTrim, icon: icon || "✨" });
    resetForm();
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Top bar */}
      <View
        style={{
          padding: 16,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Pressable onPress={() => nav("home")}>
          <Text style={{ color: colors.accent }}>Retour</Text>
        </Pressable>
        <Text style={{ color: colors.text, fontWeight: "700" }}>
          Gérer les types
        </Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Formulaire simple */}
      <View style={{ padding: 16, gap: 10 }}>
        <Text style={{ color: colors.sub }}>
          Ajoute ou modifie un type. Utilise un emoji comme icône.
        </Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <TextInput
            placeholder="Emoji"
            placeholderTextColor={colors.sub}
            value={icon}
            onChangeText={setIcon}
            style={{
              flexBasis: 70,
              backgroundColor: colors.card,
              color: colors.text,
              padding: 12,
              borderRadius: 10,
              textAlign: "center",
              fontSize: 20,
            }}
          />
          <TextInput
            placeholder="Libellé (ex: Fête)"
            placeholderTextColor={colors.sub}
            value={label}
            onChangeText={setLabel}
            style={{
              flex: 1,
              backgroundColor: colors.card,
              color: colors.text,
              padding: 12,
              borderRadius: 10,
            }}
          />
        </View>
        {/* si key vide => ajout ; sinon => édition */}
        {key ? (
          <View style={{ flexDirection: "row", gap: 12 }}>
            <Pressable
              onPress={onSaveEdit}
              style={{
                backgroundColor: colors.accent,
                paddingVertical: 10,
                paddingHorizontal: 16,
                borderRadius: 10,
              }}
            >
              <Text style={{ color: "#111", fontWeight: "700" }}>
                Enregistrer
              </Text>
            </Pressable>
            <Pressable
              onPress={resetForm}
              style={{
                backgroundColor: "#2a2b2f",
                paddingVertical: 10,
                paddingHorizontal: 16,
                borderRadius: 10,
              }}
            >
              <Text style={{ color: colors.text }}>Annuler</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            onPress={onAdd}
            style={{
              backgroundColor: colors.accent,
              paddingVertical: 10,
              paddingHorizontal: 16,
              borderRadius: 10,
              alignSelf: "flex-start",
            }}
          >
            <Text style={{ color: "#111", fontWeight: "700" }}>Ajouter</Text>
          </Pressable>
        )}
      </View>

      {/* Liste */}
      <FlatList
        data={types}
        keyExtractor={(t) => t.key}
        contentContainerStyle={{ padding: 16, paddingTop: 0 }}
        renderItem={({ item }) => <Row t={item} />}
        ListEmptyComponent={
          <Text
            style={{ color: colors.sub, textAlign: "center", marginTop: 40 }}
          >
            Aucun type.
          </Text>
        }
      />
    </SafeAreaView>
  );
}
