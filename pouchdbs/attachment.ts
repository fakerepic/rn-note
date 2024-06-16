import { EditorBridge } from "@10play/tentap-editor";
import { useCallback } from "react";
import { usePouch } from "use-pouchdb";
import * as ImagePicker from "expo-image-picker";
import { randomUUID } from "expo-crypto";
import { useMutation } from "@tanstack/react-query";

export function useAttachmentPouch() {
  return usePouch("attachment");
}

export function usePouchBase64() {
  const attachment_pouch = useAttachmentPouch();

  const saveBase64 = useCallback(
    async (attachmentID: string, base64: string) => {
      await attachment_pouch.put({
        _id: attachmentID,
        base64: base64,
      });
    },
    [attachment_pouch],
  );

  const getBase64 = useCallback(
    async (attachmentID: string) => {
      const doc = await attachment_pouch.get<{ base64: string }>(attachmentID);
      return doc.base64;
    },
    [attachment_pouch],
  );

  const deleteBase64 = useCallback(
    async (attachementID: string) => {
      const doc = await attachment_pouch.get<{ base64: string }>(attachementID);
      return attachment_pouch.remove(doc);
    },
    [attachment_pouch],
  );

  return {
    saveBase64,
    getBase64,
    deleteBase64,
  };
}

export function useImageInjection(editor?: EditorBridge) {
  const { saveBase64, getBase64 } = usePouchBase64();
  const [, requestCameraPermission] = ImagePicker.useCameraPermissions();

  const injectImageByID = useCallback(
    async (id: string) => {
      const base64 = await getBase64(id);
      editor?.addBase64({ id, base64 });
      editor?.setSpecificMyImageShown({ id, shown: true });
    },
    [editor, getBase64],
  );

  const injectImagesByIDs = useCallback(
    async (ids: string[]) => {
      await Promise.all(ids.map(injectImageByID));
    },
    [injectImageByID],
  );

  const PickAndInjectImage = useCallback(
    async (camera?: boolean) => {
      try {
        const options: ImagePicker.ImagePickerOptions = {
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.2,
          base64: true,
        };

        let res;
        if (camera) {
          await requestCameraPermission();
          res = await ImagePicker.launchCameraAsync(options);
        } else {
          res = await ImagePicker.launchImageLibraryAsync(options);
        }

        if (res.canceled) {
          return;
        }

        const { assets } = res;
        if (!assets || assets.length === 0 || !assets[0].base64) {
          return;
        }

        const id = `img:${randomUUID().substring(0, 10)}`;

        await saveBase64(id, assets[0].base64);
        editor?.setBase64Jpeg({ id, base64: assets[0].base64 });
      } catch (error) {
        console.error("Error in test function: ", error);
      }
    },
    [saveBase64, editor, requestCameraPermission],
  );

  return {
    PickAndInjectImage,
    injectImageByID,
    injectImagesByIDs,
  };
}

export function useCleanUnusedBase64() {
  const notedb = usePouch<{ resIDs?: string[] }>();
  const attachment_db = useAttachmentPouch();
  const { deleteBase64 } = usePouchBase64();

  const { mutate, status } = useMutation({
    mutationKey: ["cleanBase64", notedb.name, attachment_db.name],
    mutationFn: async () => {
      const { docs } = await notedb.find({
        use_index: "main-index",
        selector: {
          _id: { $gt: null },
          type: "note",
        },
        fields: ["_id", "resIDs"],
      });
      const usedResIDs = new Set<string>();
      docs.forEach((doc) => {
        if (doc.resIDs) {
          doc.resIDs.forEach((id) => usedResIDs.add(id));
        }
      });
      const allBase64Docs = await attachment_db.allDocs();
      const unusedBase64Docs = allBase64Docs.rows.filter(
        (row) => !usedResIDs.has(row.id),
      );
      await Promise.all(unusedBase64Docs.map((doc) => deleteBase64(doc.id)));
    },
  });
  return {
    cleanup: mutate,
    isCleaning: status === "pending",
  };
}
