import { create } from "zustand";
import createSelectors from "./selectorFactory";

interface Context {
  voiceID?: string;
}

interface Action {
  setVoice: (voiceID?: string) => void;
}

const initialState: Context = {
  voiceID: undefined,
};

const Store = create<Context & Action>()((set, get) => ({
  ...initialState,
  setVoice: (voiceID) => set({ voiceID }),
}));

export const useVoice = createSelectors(Store);
export const setVoice = (voiceID: string) => Store.setState({ voiceID });
export const clearVoice = () => Store.setState({ voiceID: undefined });
