import HomeScreen from "@/screens/HomeScreen";
import EditScreen from "@/screens/EditScreen";
import ArchiveScreen from "@/screens/ArchiveScreen";
import TypesScreen from "@/screens/TypesScreen";

export const routes = {
  home: HomeScreen,
  edit: EditScreen,
  archive: ArchiveScreen,
  types: TypesScreen,
  // settings: SettingsScreen, etc. archive?
} as const;

export type RouteName = keyof typeof routes;
