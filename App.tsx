import { View } from "react-native";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { routes } from "@/navigation/routes";
import { useNav } from "@/navigation/nav";

export default function App() {
  const { route, nav } = useNav();
  const Screen = routes[route.name];

  return (
    <ActionSheetProvider>
      <View style={{ flex: 1 }}>
        <Screen route={route.params} nav={nav} />
      </View>
    </ActionSheetProvider>
  );
}
