// import { TypedPocketBase } from "@fakerepic/typed-pocketbase";
import HttpPouch from "pouchdb-adapter-http";
import replication from "pouchdb-replication";

import pouchdbExpoSqlite from "./pouchdb-expo-sqlite";
import pb from "../pb";

pouchdbExpoSqlite.plugin(HttpPouch).plugin(replication);

const PB_URL = process.env.EXPO_PUBLIC_PB_URL as string;

export const remotedb = new pouchdbExpoSqlite(PB_URL, {
  adapter: "http",
  skip_setup: true,
  fetch: (_url, opts) => {
    const url = (_url as string).slice(PB_URL.length);
    return fetch(`${PB_URL}/userdb-${pb.authStore.model?.id}${url}`, {
      ...opts,
      headers: {
        ...opts?.headers,
        authorization: pb.authStore.token,
        "Content-type": "application/json",
      },
    });
  },
});

// export function createRemoteDB(pb: TypedPocketBase<{}>) {
//   return new pouchdbExpoSqlite(PB_URL, {
//     adapter: "http",
//     skip_setup: true,
//     fetch: (_url: string, opts: RequestInit) => {
//       const url = (_url as string).slice(PB_URL.length);
//       return fetch(`${PB_URL}/userdb-${pb.authStore.model.id}${url}`, {
//         ...opts,
//         headers: {
//           ...opts.headers,
//           authorization: pb.authStore.token,
//           "Content-type": "application/json",
//         },
//       });
//     },
//   });
// }
