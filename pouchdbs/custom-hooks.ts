import { useCallback, useEffect } from "react";
import { useFind, usePouch } from "use-pouchdb";

import { remoteattachmentdb, remotedb } from ".";
import { useAttachmentPouch } from "./attachment";

export function usePouchSync(shouldDisable?: boolean) {
  const localDb = usePouch();
  const attachmentDb = useAttachmentPouch();

  useEffect(() => {
    if (!shouldDisable) {
      const syncHandler = localDb.sync(remotedb, {
        live: true,
        retry: true,
      });
      const attachmentSyncHandler = attachmentDb.sync(remoteattachmentdb, {
        live: true,
        retry: true,
      });

      return () => {
        syncHandler.cancel();
        attachmentSyncHandler.cancel();
      };
    }
  }, [attachmentDb, localDb, shouldDisable]);
}

export function usePouchDelete(errorCallback?: (e: any) => void) {
  const db = usePouch();

  return useCallback(
    async (id: string) => {
      try {
        const doc = await db.get(id);
        await db.remove(doc);
      } catch (error) {
        if (errorCallback) {
          errorCallback(error);
        }
      }
    },
    [db, errorCallback],
  );
}

export function useNoteEntries(notebookID?: string) {
  return useFind<{ title: string; updateAt: number; createAt: number }>({
    index: {
      fields: ["_id", "type"],
      ddoc: "main-index",
    },
    selector: {
      _id: { $gt: null },
      type: "note",
      notebookID: notebookID,
    },
    fields: ["_id", "title", "updateAt", "creteAt"],
  });
}

export function useNoteBooks() {
  return useFind<{ title: string; createAt: number }>({
    index: {
      fields: ["_id", "type"],
      ddoc: "main-index",
    },
    selector: {
      _id: { $gt: null },
      type: "notebook",
    },
    fields: ["_id", "title", "createAt"],
  });
}
