import type { OnStoreChangeFunc } from 'pocketbase'
import React, { useState, useEffect } from 'react'
import { Provider } from 'use-pouchdb'

import pouchdbExpoSqlite from './pouchdb-expo-sqlite'
import pb from '../pb'

function openLocalPouchDB(name?: string) {
  return new pouchdbExpoSqlite(name || 'local', {
    adapter: 'react-native-sqlite',
    auto_compaction: true
  })
}

export default function AutoPouchProvider(props: {
  children: React.ReactNode
}) {
  const [db, setDB] = useState(() => openLocalPouchDB(pb.authStore.model?.id))

  useEffect(() => {
    const callback: OnStoreChangeFunc = (_, model) => {
      setDB(openLocalPouchDB(model?.id))
    }
    const unsubscribe = pb.authStore.onChange(callback)
    return () => {
      unsubscribe()
    }
  }, [])

  return <Provider pouchdb={db}>{props.children}</Provider>
}
