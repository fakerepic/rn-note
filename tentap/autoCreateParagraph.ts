import { Editor } from "@tiptap/core";
export function autoCreateParagraph(editor: Editor, pos: number) {
  const nextnode = editor.state.doc.nodeAt(pos + 1);
  if (!nextnode || nextnode.type.name !== "paragraph") {
    editor.commands.createParagraphNear();
  }
}
