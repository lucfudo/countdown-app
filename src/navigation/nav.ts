import { useState } from "react";
import { RouteName } from "./routes";

export function useNav(initial: RouteName = "home") {
  const [route, setRoute] = useState<{ name: RouteName; params?: any }>({
    name: initial,
  });

  const nav = (name: RouteName, params?: any) => setRoute({ name, params });
  const back = () => setRoute({ name: "home" }); // minimal (ou gérer une stack)

  return { route, nav, back };
}
