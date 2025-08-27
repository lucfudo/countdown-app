import HomeScreen from "@/screens/HomeScreen";
import EditScreen from "@/screens/EditScreen";
import ArchiveScreen from "@/screens/ArchiveScreen";

export const routes = {
  home: HomeScreen,
  edit: EditScreen,
  archive: ArchiveScreen,
  // settings: SettingsScreen, etc. archive?
} as const;

export type RouteName = keyof typeof routes;
