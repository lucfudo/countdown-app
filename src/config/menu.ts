export const fabMenuActions = (nav: any) => [
  {
    label: "Fête",
    icon: "🎉",
    onPress: () => nav("edit", { type: "event" }),
  },
  {
    label: "Anniversaire",
    icon: "🎂",
    onPress: () => nav("edit", { type: "birthday" }),
  },
  {
    label: "Compte à rebours",
    icon: "⏳",
    onPress: () => nav("edit", { type: "countdown" }),
  },
];
