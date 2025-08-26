import AsyncStorage from "@react-native-async-storage/async-storage";
import { Item } from "@/types";
const KEY = "countdowns:v1";

export async function load(): Promise<Item[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as Item[]) : [];
}
export async function save(items: Item[]) {
  await AsyncStorage.setItem(KEY, JSON.stringify(items));
}
