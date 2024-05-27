import { create } from "zustand";
import createSelectors from "./selectorFactory";

interface State {
  searchKey: string | undefined;
  useAI: boolean;
}

const initialState: State = {
  searchKey: undefined,
  useAI: false,
};

interface Action {
  setSearchKey: (key: string) => void;
  setUseAI: (useAI: boolean) => void;
}

const Store = create<State & Action>()((set) => ({
  ...initialState,
  setSearchKey: (searchKey) => {
    set((state) => ({ ...state, searchKey }));
  },
  setUseAI: (useAI) => {
    set((state) => ({ ...state, useAI }));
  },
}));

export const useSearchStore = createSelectors(Store);
