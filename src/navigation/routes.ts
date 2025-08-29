import HomeScreen from "@/screens/HomeScreen";
import EditScreen from "@/screens/EditScreen";
import ArchiveScreen from "@/screens/ArchiveScreen";
import TypesScreen from "@/screens/TypesScreen";
import EventDetailScreen from "@/screens/EventDetailScreen"; // 👈 NEW

export const routes = {
  home: HomeScreen,
  edit: EditScreen,
  archive: ArchiveScreen,
  types: TypesScreen,
  detail: EventDetailScreen,
} as const;

export type RouteName = keyof typeof routes;
