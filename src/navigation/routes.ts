import HomeScreen from "@/screens/HomeScreen";
import EditScreen from "@/screens/EditScreen";

export const routes = {
  home: HomeScreen,
  edit: EditScreen,
  // settings: SettingsScreen, etc. archive?
} as const;

export type RouteName = keyof typeof routes;
