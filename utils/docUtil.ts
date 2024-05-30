import * as Crypto from "expo-crypto";
import { EditorBridge } from "@10play/tentap-editor";
import { isEqual } from "lodash";

export const UUID = () => Crypto.randomUUID();

export const tiptapExtractTitle = (obj: any) => {
  let title;
  if (obj.content && obj.content[0].type === "heading") {
    const heading = obj.content[0];
    if (heading.content) {
      title = heading.content[0].text || "Untitled";
    }
  }
  return title;
};

export const save_or_create = async (
  pouch: PouchDB.Database<{
    title: string;
    content: any;
    text: string;
    type: string;
  }>,
  editor: EditorBridge,
  docID?: string,
) => {
  try {
    // Manually make images in the doc logical tree "close" before saving
    editor.setMyImageShown(false);

    const res = await editor.getJSON();
    const text = await editor.getText();
    if (docID) {
      const record = await pouch.get(docID);
      // diff record.content and res:
      const diff = !isEqual(record.content, res);
      if (diff) {
        pouch.put({
          _id: record._id,
          _rev: record._rev,
          title: tiptapExtractTitle(res),
          text: text,
          content: res,
          type: "note",
        });
        console.debug("save");
      }
    } else {
      pouch.put({
        _id: UUID(),
        title: tiptapExtractTitle(res),
        text: text,
        content: res,
        type: "note",
      });
      console.debug("create");
    }
  } catch (e) {
    console.error(e);
  }
};
