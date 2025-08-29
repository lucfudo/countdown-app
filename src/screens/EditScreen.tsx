import { SafeAreaView } from "react-native";
import { colors } from "@/theme";
import { RouteName } from "@/navigation/routes";
import EditForm from "@/components/forms/EditForm";
import { useEditItem } from "@/hooks/useEditItem";
import IconBadgePicker from "@/components/IconBadgePicker";
import { useTypes } from "@/hooks/useTypes";
import TopBar from "@/components/ui/TopBar";
import { Text } from "react-native";

export default function EditScreen({
  route,
  nav,
}: {
  route: any;
  nav: (r: RouteName, p?: any) => void;
}) {
  const { types } = useTypes();
  const typeOptions = types.map((t) => ({
    key: t.key,
    label: t.label,
    icon: t.icon,
  }));

  const editId: string | undefined = route?.id;
  const initialType = (route?.type ?? "countdown") as any;

  const {
    isEdit,
    model,
    setType,
    setTitle,
    setDate,
    setRecurrence,
    remOffsets,
    addOffset,
    removeOffset,
    submit,
  } = useEditItem(editId, initialType);

  async function onSave() {
    await submit();
    nav("home");
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <TopBar
        title={isEdit ? "Modifier" : "Ajouter"}
        left={
          <Text
            onPress={() => nav("home")}
            style={{ color: colors.accent, fontWeight: "600" }}
          >
            Annuler
          </Text>
        }
        right={
          <Text
            onPress={onSave}
            style={{ color: colors.accent, fontWeight: "600" }}
          >
            {isEdit ? "Terminé" : "Suivant"}
          </Text>
        }
      />

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
        remOffsets={remOffsets}
        addOffset={addOffset}
        removeOffset={removeOffset}
        typeOptions={typeOptions}
      />
    </SafeAreaView>
  );
}
