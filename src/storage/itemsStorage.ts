import AsyncStorage from "@react-native-async-storage/async-storage";
import { FilterStatus } from "@/types/FilterStatus";

const ITEM_STORAGE_KEY = "@comprar:items";

export type ItemStorage = {
  id: string;
  status: FilterStatus;
  description: string;
};

async function get(): Promise<ItemStorage[]> {
  try {
    const storage = await AsyncStorage.getItem(ITEM_STORAGE_KEY);

    return storage ? JSON.parse(storage) : [];
  } catch (e) {
    throw new Error("ITEMS_GET: " + e);
  }
}

async function getByStatus(status: FilterStatus): Promise<ItemStorage[]> {
  const items = await get();
  return items.filter((item) => item.status === status);
}

async function save(items: ItemStorage[]): Promise<void> {
  try {
    await AsyncStorage.setItem(ITEM_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    throw new Error("ITEMS_SAVE: " + e);
  }
}

async function add(newItem: ItemStorage): Promise<ItemStorage[]> {
  const items = await get();
  const updatedItems = [...items, newItem];

  await save(updatedItems);

  return updatedItems;
}

async function remove(id: string): Promise<void> {
  const items = await get();
  const updated = items.filter((item) => item.id !== id);
  await save(updated);
}

async function clear(): Promise<void> {
  try {
    await AsyncStorage.removeItem(ITEM_STORAGE_KEY);
  } catch (e) {
    throw new Error("ITEMS_CLEAR: " + e);
  }
}

async function toggleStatus(id: string): Promise<void> {
  const items = await get();

  const updated = items.map((item) =>
    item.id === id
      ? {
          ...item,
          status:
            item.status === FilterStatus.PENDING
              ? FilterStatus.DONE
              : FilterStatus.PENDING,
        }
      : item
  );

  await save(updated);
}

export const itemsStorage = {
  get,
  getByStatus,
  add,
  remove,
  clear,
  toggleStatus,
};
