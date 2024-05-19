import { TypedPocketBase } from "@fakerepic/typed-pocketbase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncAuthStore } from "pocketbase";

import { Schema } from "../__generated__/schema";

const PB_URL = process.env.EXPO_PUBLIC_PB_URL;

const _store = new AsyncAuthStore({
  save: async (serialized) => AsyncStorage.setItem("pb_auth", serialized),
  initial: AsyncStorage.getItem("pb_auth"),
  clear: async () => AsyncStorage.setItem("pb_auth", ""),
});

const pb = new TypedPocketBase<Schema>(PB_URL, _store);

export default pb;
