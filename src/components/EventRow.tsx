import React from "react";
import { Platform, Pressable, Text, View } from "react-native";
import ContextMenu from "react-native-context-menu-view";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { colors } from "@/theme";
import { Item } from "@/types";

type Props = {
  item: Item;
  onEdit: (item: Item) => void;
  onTogglePin: (item: Item) => void;
  onArchive: (item: Item) => void;
  onDelete: (item: Item) => void;
  onDuplicate?: (item: Item) => void;
  onShare?: (item: Item) => void;
};

export default function EventRow({
  item,
  onEdit,
  onTogglePin,
  onArchive,
  onDelete,
  onDuplicate,
  onShare,
}: Props) {
  const { showActionSheetWithOptions } = useActionSheet();

  const content = (
    <View
      style={{
        backgroundColor: colors.card,
        padding: 14,
        borderRadius: 12,
        marginHorizontal: 16,
        marginVertical: 6,
      }}
    >
      <Text style={{ color: colors.text, fontWeight: "600" }}>
        {item.title}
      </Text>
      {/* …ton contenu/compteur */}
    </View>
  );

  // iOS: vrai menu contextuel
  if (Platform.OS === "ios") {
    return (
      <ContextMenu
        previewBackgroundColor="transparent"
        actions={[
          {
            title: item.pinned ? "Désépingler" : "Épingler",
            systemIcon: "pin",
          },
          { title: "Éditer", systemIcon: "pencil" },
          { title: "Archiver", systemIcon: "archivebox" },
          { title: "Dupliquer", systemIcon: "plus.square.on.square" },
          { title: "Partager", systemIcon: "square.and.arrow.up" },
          { title: "Supprimer", systemIcon: "trash", destructive: true },
        ]}
        onPress={(e) => {
          const idx = e.nativeEvent.index;
          if (idx === 0) onTogglePin(item);
          if (idx === 1) onEdit(item);
          if (idx === 2) onArchive(item);
          if (idx === 3 && onDuplicate) onDuplicate(item);
          if (idx === 4 && onShare) onShare(item);
          if (idx === 5) onDelete(item);
        }}
      >
        {content}
      </ContextMenu>
    );
  }

  // Android: ActionSheet au long-press
  return (
    <Pressable
      onLongPress={() => {
        const options = [
          item.pinned ? "Désépingler" : "Épingler",
          "Éditer",
          "Archiver",
          "Dupliquer",
          "Partager",
          "Supprimer",
          "Annuler",
        ];
        showActionSheetWithOptions(
          { options, cancelButtonIndex: 6, destructiveButtonIndex: 5 },
          (i) => {
            if (i === 0) onTogglePin(item);
            if (i === 1) onEdit(item);
            if (i === 2) onArchive(item);
            if (i === 3 && onDuplicate) onDuplicate(item);
            if (i === 4 && onShare) onShare(item);
            if (i === 5) onDelete(item);
          }
        );
      }}
    >
      {content}
    </Pressable>
  );
}
