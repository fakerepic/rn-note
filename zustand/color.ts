import { create } from "zustand";

import AsyncStorage from "@react-native-async-storage/async-storage";
import createSelectors from "./selectorFactory";
import { createJSONStorage, persist } from "zustand/middleware";

export const AvailableTamaguiColors = [
  "blue",
  "gray",
  "pink",
  "purple",
  "orange",
  "yellow",
  "green",
] as const;
export const AvailableSystemColors = ["system", "light", "dark"] as const;

export type TamaguiColor = (typeof AvailableTamaguiColors)[number];
export type SystemColor = (typeof AvailableSystemColors)[number];

interface State {
  tamaguiColor: TamaguiColor;
  systemColor: SystemColor;
}

const initialState: State = {
  tamaguiColor: "blue",
  systemColor: "system",
};

interface Action {
  setTamaguiColor: (color: TamaguiColor) => void;
  setSystemColor: (color: SystemColor) => void;
}

const Store = create<State & Action>()(
  persist(
    (set) => ({
      ...initialState,
      setTamaguiColor: (tamaguiColor) => {
        set((state) => ({ ...state, tamaguiColor }));
      },
      setSystemColor: (systemColor) => {
        set((state) => ({ ...state, systemColor }));
      },
    }),
    {
      name: "colorStore",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export const useColorStore = createSelectors(Store);
