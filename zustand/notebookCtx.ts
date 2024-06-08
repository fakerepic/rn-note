import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type TSortMode = "update" | "title";
export type TSortOrder = "asc" | "desc";

interface Context {
  notebookID: string | undefined;
  sortMode: TSortMode;
  sortOrder: TSortOrder;
}

interface Action {
  notifyDeleted: (notebookID: string) => void;
}

const initialState: Context = {
  notebookID: undefined,
  sortMode: "update",
  sortOrder: "desc",
};

const Store = create<Context & Action>()(
  persist(
    (set, get) => ({
      ...initialState,
      notifyDeleted: (notebookID) => {
        if (get().notebookID === notebookID) {
          set({ notebookID: undefined });
        }
      },
    }),
    {
      name: "notebook-context",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export const useNotebookContext = Store;
export const cleanNotebookContext = () => Store.setState(initialState);
