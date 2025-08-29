import { SafeAreaView, View, Text, Pressable } from "react-native";
import { colors } from "@/theme";
import { RouteName } from "@/navigation/routes";
import EditForm from "@/components/forms/EditForm";
import { useEditItem } from "@/hooks/useEditItem";
import IconBadgePicker from "@/components/IconBadgePicker";
import { useTypes } from "@/hooks/useTypes";

export default function EditScreen({
  route,
  nav,
}: {
  route: any;
  nav: (r: RouteName, p?: any) => void;
}) {
  const { types } = useTypes();

  const editId: string | undefined = route?.id;
  const initialType = (route?.type ?? "countdown") as any;

  const {
    isEdit,
    model,
    setType,
    setTitle,
    setDate,
    setRecurrence,
    setJ0,
    setJ3,
    submit,
  } = useEditItem(editId, initialType);

  async function onSave() {
    await submit();
    nav("home");
  }

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
        <Pressable onPress={onSave}>
          <Text style={{ color: colors.accent }}>
            {isEdit ? "Enregistrer" : "Suivant"}
          </Text>
        </Pressable>
      </View>
      <IconBadgePicker type={model.type} onSelectType={setType} types={types} />

      <EditForm
        title={model.title}
        setTitle={setTitle}
        dateISO={model.dateISO}
        setDate={setDate}
        recurrence={model.recurrence}
        setRecurrence={setRecurrence}
        type={model.type}
        setType={setType}
        remJ0={model.remJ0}
        setJ0={setJ0}
        remJ3={model.remJ3}
        setJ3={setJ3}
      />
    </SafeAreaView>
  );
}
