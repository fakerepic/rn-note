import React, { useMemo } from "react";
import { Provider } from "use-pouchdb";

import pouchdbExpoSqlite from "./pouchdb-expo-sqlite";
import { useAuthStore } from "../zustand/authStore";

function openLocalPouchDB(name?: string) {
  return new pouchdbExpoSqlite(name || "local", {
    adapter: "react-native-sqlite",
    auto_compaction: true,
  });
}

export default function AutoPouchProvider(props: {
  children: React.ReactNode;
}) {
  const id = useAuthStore((state) => state.model?.id as string);
  const db = useMemo(() => openLocalPouchDB(id), [id]);

  return <Provider pouchdb={db}>{props.children}</Provider>;
}
