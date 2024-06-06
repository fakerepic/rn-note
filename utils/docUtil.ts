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
    updateAt: number;
    createAt: number;
    notebookID?: string;
  }>,
  editor: EditorBridge,
  docID?: string,
  notebookID?: string,
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
          ...record,
          title: tiptapExtractTitle(res),
          text: text,
          content: res,
          type: "note",
          updateAt: Date.now(),
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
        createAt: Date.now(),
        updateAt: Date.now(),
        notebookID,
      });
      console.debug("create");
    }
  } catch (e) {
    console.error(e);
  }
};

export async function newNote(
  pouch: PouchDB.Database<any>,
  notebookID?: string,
) {
  const _id = UUID();
  const now = Date.now();
  await pouch.put({
    _id,
    type: "note",
    createAt: now,
    updateAt: now,
    notebookID,
  });
  return _id;
}

export async function addNoteBook(pouch: PouchDB.Database<any>, title: string) {
  const now = Date.now();
  return pouch.put({
    _id: `notebook:${title}`,
    title,
    type: "notebook",
    createAt: now,
    updateAt: now,
  });
}

export async function moveNoteToNotebook(
  pouch: PouchDB.Database<any>,
  noteID: string,
  notebookID: string | null,
) {
  return pouch.get(noteID).then((doc) => {
    pouch.put({
      ...doc,
      notebookID,
    });
  });
}

export async function deleteNoteBook(
  pouch: PouchDB.Database<any>,
  notebookID: string,
  deleteNotes = false,
) {
  const notes = await pouch.find({
    use_index: "main-index",
    selector: {
      _id: { $gt: null },
      type: "note",
      notebookID: notebookID,
    },
  });
  if (deleteNotes) {
    notes.docs.forEach((note) => pouch.remove(note));
  } else {
    notes.docs.forEach((note) => {
      pouch.put({
        ...note,
        notebookID: null,
      });
    });
  }
  return pouch.remove(await pouch.get(notebookID));
}
