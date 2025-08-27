import { useEffect, useRef } from "react";
import { View, Animated, Easing } from "react-native";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { routes } from "@/navigation/routes";
import { useNav } from "@/navigation/nav";

export default function App() {
  const { route, nav } = useNav();
  const Screen = routes[route.name];

  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // reset opacity à chaque changement de route
    opacity.setValue(0);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [route.name]);

  return (
    <ActionSheetProvider>
      <Animated.View style={{ flex: 1, opacity }}>
        <Screen route={route.params} nav={nav} />
      </Animated.View>
    </ActionSheetProvider>
  );
}
