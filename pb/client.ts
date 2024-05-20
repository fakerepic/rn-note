import { TypedPocketBase } from "@fakerepic/typed-pocketbase";
import { Schema } from "../__generated__/schema";
import { pbAuthStore } from "../zustand/authStore";

const PB_URL = process.env.EXPO_PUBLIC_PB_URL;

const pb = new TypedPocketBase<Schema>(PB_URL, pbAuthStore);

export default pb;
