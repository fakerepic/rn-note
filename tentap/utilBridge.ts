/**
 * @module A bridge extension for the editor that provides utility functions.
 */
import { BridgeExtension } from "@10play/tentap-editor";
import { history } from "@tiptap/pm/history";

type UtilEditorState = {};

type UtilEditorInstance = {
  // This is a method that the editor can call to initialize the content
  // of the editor. (The only difference between this and the `setContent`
  // method is that this method does not emit the `update` event so that the
  // content is not saved to the undo stack.)
  initContent: (content: string) => void;
};

declare module "@10play/tentap-editor" {
  interface BridgeState extends UtilEditorState {}
  interface EditorBridge extends UtilEditorInstance {}
}

export enum UtilEditorActionType {
  InitContent = "init-content",
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
    return false;
  },
  onEditorMessage(message, _editorBridge) {
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
    };
  },
  extendEditorState: (editor) => {
    return {};
  },
});
