import { create } from "zustand";
import { unstable_batchedUpdates } from "react-native";

import createSelectors from "./selectorFactory";

export type BotMessage = {
  role: "chatbot";
  content: string;
  sources: SourceModel[];
};

export type UserMessage = {
  role: "user";
  content: string;
};

type IMessage<T> = T & {
  sources?: T extends BotMessage ? SourceModel[] : never;
};

export type TChatMessage = IMessage<UserMessage | BotMessage>;

export type SourceModel = {
  id: string;
  title?: string;
  score?: number;
};

interface Context {
  messages: TChatMessage[];
}

interface Action {
  clearMessages: () => void;
  apendMessage: (message: TChatMessage) => void;
}

const initialState: Context = {
  messages: [],
};

const Store = create<Context & Action>()((set, get) => ({
  ...initialState,
  clearMessages: () => set({ messages: [] }),
  apendMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
}));

export const useChatContext = createSelectors(Store);

export const clearMessages = () =>
  unstable_batchedUpdates(() => {
    Store.getState().clearMessages();
  });
