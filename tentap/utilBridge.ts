/**
 * @module A bridge extension for the editor that provides utility functions.
 */
import { BridgeExtension } from "@10play/tentap-editor";
import { Editor } from "@tiptap/core";
import { history } from "@tiptap/pm/history";
import { asyncMessages } from "./AsyncMessages";

type UtilEditorState = {};

type UtilEditorInstance = {
  // This is a method that the editor can call to initialize the content
  // of the editor. (The only difference between this and the `setContent`
  // method is that this method does not emit the `update` event so that the
  // content is not saved to the undo stack.)
  initContent: (content: string) => void;
  getResIDs: () => Promise<string[]>;
};

declare module "@10play/tentap-editor" {
  interface BridgeState extends UtilEditorState {}
  interface EditorBridge extends UtilEditorInstance {}
}

export enum UtilEditorActionType {
  InitContent = "init-content",
  GetRes = "get-res",
  GetResBack = "get-res-back",
}

type UtilMessage = {
  type: UtilEditorActionType;
  payload?: any;
};

export const UtilBridge = new BridgeExtension<
  UtilEditorState,
  UtilEditorInstance,
  UtilMessage
>({
  onBridgeMessage: (editor, message, sendMessageBack) => {
    if (message.type === UtilEditorActionType.InitContent) {
      editor.commands.setContent(message.payload, false /* emit update */);
      editor.unregisterPlugin("history");
      editor.registerPlugin(history());
      return true;
    }
    if (message.type === UtilEditorActionType.GetRes) {
      sendMessageBack({
        type: UtilEditorActionType.GetResBack,
        payload: {
          content: _getResIDs(editor),
          messageId: message.payload.messageId,
        },
      });
    }

    return false;
  },
  onEditorMessage(message, _editorBridge) {
    if (message.type === UtilEditorActionType.GetResBack) {
      asyncMessages.onMessage(
        message.payload.messageId,
        message.payload.content,
      );
      return true;
    }

    return false;
  },
  extendEditorInstance: (sendBridgeMessage) => {
    return {
      initContent(payload) {
        sendBridgeMessage({
          type: UtilEditorActionType.InitContent,
          payload,
        });
      },
      getResIDs: async () => {
        const res = await asyncMessages.sendAsyncMessage<object>(
          {
            type: UtilEditorActionType.GetRes,
          },
          sendBridgeMessage,
        );
        return res as any;
      },
    };
  },
  extendEditorState: (editor) => {
    return {};
  },
});

function _getResIDs(editor: Editor) {
  const resIDs: string[] = [];

  editor.state.doc.descendants((node, _) => {
    if (node.type.name === "myimage" || node.type.name === "audio") {
      const { id } = node.attrs;
      resIDs.push(id);
    }
  });

  return resIDs;
}
