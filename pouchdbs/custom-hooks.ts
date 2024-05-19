import { useCallback, useEffect } from 'react'
import { usePouch } from 'use-pouchdb'

import { remotedb } from '.'

export function usePouchSync(shouldDisable?: boolean) {
  const localDb = usePouch()

  useEffect(() => {
    if (!shouldDisable) {
      const syncHandler = localDb.sync(remotedb, {
        live: true,
        retry: true,
      })

      return () => {
        syncHandler.cancel()
      }
    }
  }, [localDb, shouldDisable])
}

export function usePouchDelete(errorCallback?: (e: any) => void) {
  const db = usePouch()

  return useCallback(
    async (id: string) => {
      try {
        const doc = await db.get(id)
        await db.remove(doc)
      } catch (error) {
        if (errorCallback) {
          errorCallback(error)
        }
      }
    },
    [db, errorCallback],
  )
}
