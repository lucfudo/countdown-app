import React from "react";
import { View } from "react-native";
import HomeScreen from "@/screens/HomeScreen";
import EditScreen from "@/screens/EditScreen";

// mini nav sans lib, suffisant pour MVP
export default function App() {
  const [route, setRoute] = React.useState<{
    name: "home" | "edit";
    params?: any;
  }>({ name: "home" });
  const nav = (name: string, params?: any) =>
    setRoute({ name: name as any, params });
  return (
    <View style={{ flex: 1 }}>
      {route.name === "home" && <HomeScreen nav={(n, p) => nav(n, p)} />}
      {route.name === "edit" && (
        <EditScreen route={route.params} nav={(n, p) => nav(n as any, p)} />
      )}
    </View>
  );
}
