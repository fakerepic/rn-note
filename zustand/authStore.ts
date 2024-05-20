/**
 * @module Add zustand layer between the persist layer and the pocketbase auth store
 */
import { create } from "zustand";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthModel, BaseAuthStore, OnStoreChangeFunc } from "pocketbase";
import createSelectors from "./selectorFactory";
import { createJSONStorage, persist } from "zustand/middleware";
import { unstable_batchedUpdates } from "react-native";

interface State {
  token: string;
  model: AuthModel;
}

const initialState: State = {
  token: "",
  model: {},
};

interface Action {
  save: (token: string, model?: AuthModel) => void;
  clear: () => void;
}

const Store = create<State & Action>()(
  persist(
    (set) => ({
      ...initialState,
      save: (token, model) => {
        set({ token, model: model ?? {} });
      },
      clear: () => {
        set(initialState);
      },
    }),
    {
      name: "authStore",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export const useAuthStore = createSelectors(Store);

class ReactiveAuthStore extends BaseAuthStore {
  constructor() {
    super();
    Store.subscribe((state) => {
      this._callbacks.forEach((cb) => {
        cb(state.token, state.model);
      });
    });
  }
  save(token: string, model?: AuthModel | undefined): void {
    unstable_batchedUpdates(() => {
      Store.getState().save(token, model);
    });
  }
  clear(): void {
    unstable_batchedUpdates(() => {
      Store.getState().clear();
    });
  }
  /**
   * @deprecated - use useSession hook instead
   * @param callback -
   * @param fireImmediately - if true, fire the callback immediately
   * @returns - a function to unsubscribe the callback
   */
  onChange(
    callback: OnStoreChangeFunc,
    fireImmediately?: boolean | undefined,
  ): () => void {
    this._callbacks.push(callback);
    if (fireImmediately) {
      callback(Store.getState().token, Store.getState().model);
    }
    return () => {
      const index = this._callbacks.indexOf(callback);
      if (index > -1) {
        this._callbacks.splice(index, 1);
      }
    };
  }
  get model(): AuthModel {
    return Store.getState().model;
  }
  get token(): string {
    return Store.getState().token;
  }
  get isValid(): boolean {
    return Store.getState().token !== "";
  }

  protected _callbacks: OnStoreChangeFunc[] = [];
}

export const pbAuthStore = new ReactiveAuthStore();
