// import { TypedPocketBase } from "@fakerepic/typed-pocketbase";
import HttpPouch from "pouchdb-adapter-http";
import replication from "pouchdb-replication";

import pouchdbExpoSqlite from "./pouchdb-expo-sqlite";
import pb from "../pb";
import { TypedPocketBase } from "@fakerepic/typed-pocketbase";

pouchdbExpoSqlite.plugin(HttpPouch).plugin(replication);

const PB_URL = process.env.EXPO_PUBLIC_PB_URL as string;

export const remotedb = createRemoteDB(pb, "userdb");
export const remoteattachmentdb = createRemoteDB(pb, "userattachment");

export function createRemoteDB(pb: TypedPocketBase<any>, prefix: string) {
  return new pouchdbExpoSqlite(PB_URL, {
    adapter: "http",
    skip_setup: true,
    fetch: (_url, opts) => {
      const url = (_url as string).slice(PB_URL.length);
      return fetch(`${PB_URL}/${prefix}-${pb.authStore.model?.id}${url}`, {
        ...opts,
        headers: {
          ...opts?.headers,
          authorization: pb.authStore.token,
          "Content-type": "application/json",
        },
      });
    },
  });
}
