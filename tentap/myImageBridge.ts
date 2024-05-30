/**
 * @module The bridge extension built for the 'myimage' tiptap extension.
 */
import { BridgeExtension } from "@10play/tentap-editor";
import { Editor } from "@tiptap/core";

import { asyncMessages } from "./AsyncMessages";
import { MyImage } from "./myimage";

type MyImageEditorState = {
  activeMyImage: string | null;
};

type MyImageEditorInstance = {
  setMyImage: (id: string) => void;
  addBase64: (item: { id: string; base64: string }) => void;
  setBase64Jpeg: (item: { id: string; base64: string }) => void;
  getMyImageIDs: () => Promise<string[]>;
  setMyImageShown: (shown: boolean) => void;
  setSpecificMyImageShown: (item: { id: string; shown: boolean }) => void;
};

declare module "@10play/tentap-editor" {
  interface BridgeState extends MyImageEditorState {}
  interface EditorBridge extends MyImageEditorInstance {}
}

export enum MyImageEditorActionType {
  SetMyImage = "set-myimage",
  AddBase64 = "add-base64",
  SetBase64Jpeg = "set-base64",
  GetIDs = "get-ids",
  GetIDsBack = "get-ids-back",
  Testing = "testing",
  Refresh = "refresh-all",
  RefreshID = "refresh-id",
}

type MyImageMessage = {
  type: MyImageEditorActionType;
  payload?: any;
};

export const MyImageBridge = new BridgeExtension<
  MyImageEditorState,
  MyImageEditorInstance,
  MyImageMessage
>({
  tiptapExtension: MyImage,
  onBridgeMessage: (editor, message, sendMessageBack) => {
    if (message.type === MyImageEditorActionType.SetMyImage) {
      editor
        .chain()
        .focus()
        .setMyImage({ id: message.payload })
        .setTextSelection(editor.state.selection.to + 1)
        .run();
    }

    if (message.type === MyImageEditorActionType.AddBase64) {
      editor
        .chain()
        .addBase64({ id: message.payload.id, base64: message.payload.base64 })
        .run();
    }

    if (message.type === MyImageEditorActionType.SetBase64Jpeg) {
      editor
        .chain()
        .setBase64Jpeg({
          id: message.payload.id,
          base64: message.payload.base64,
        })
        .run();
    }

    if (message.type === MyImageEditorActionType.GetIDs) {
      sendMessageBack({
        type: MyImageEditorActionType.GetIDsBack,
        payload: {
          content: getMyImageIDs(editor),
          messageId: message.payload.messageId,
        },
      });
    }

    if (message.type === MyImageEditorActionType.Refresh) {
      editor.state.doc.descendants((node, pos) => {
        if (node.type.name === "myimage") {
          const tr = editor.state.tr;
          tr.setMeta("addToHistory", false);
          tr.setNodeAttribute(pos, "show", message.payload);
          editor.view.dispatch(tr);
        }
      });
    }

    if (message.type === MyImageEditorActionType.RefreshID) {
      editor.state.doc.descendants((node, pos) => {
        if (node.type.name === "myimage") {
          if (node.attrs.id === message.payload.id) {
            const tr = editor.state.tr;
            tr.setMeta("addToHistory", false);
            tr.setNodeAttribute(pos, "show", message.payload);
            editor.view.dispatch(tr);
            return false;
          }
        }
      });
    }

    return false;
  },
  onEditorMessage(message, _editorBridge) {
    if (message.type === MyImageEditorActionType.GetIDsBack) {
      asyncMessages.onMessage(
        message.payload.messageId,
        message.payload.content,
      );
      return true;
    }

    if (message.type === MyImageEditorActionType.Testing) {
      console.log("Testing", message.payload);
      return true;
    }
    return false;
  },
  extendEditorInstance: (sendBridgeMessage) => {
    return {
      setMyImage: (payload) => {
        sendBridgeMessage({
          type: MyImageEditorActionType.SetMyImage,
          payload,
        });
      },
      addBase64: (payload) => {
        sendBridgeMessage({
          type: MyImageEditorActionType.AddBase64,
          payload,
        });
      },
      setBase64Jpeg: (payload) => {
        sendBridgeMessage({
          type: MyImageEditorActionType.SetBase64Jpeg,
          payload,
        });
      },
      getMyImageIDs: async () => {
        const res = await asyncMessages.sendAsyncMessage<object>(
          {
            type: MyImageEditorActionType.GetIDs,
          },
          sendBridgeMessage,
        );
        return res as any;
      },
      setMyImageShown: (payload) => {
        sendBridgeMessage({
          type: MyImageEditorActionType.Refresh,
          payload,
        });
      },
      setSpecificMyImageShown: (payload) => {
        sendBridgeMessage({
          type: MyImageEditorActionType.RefreshID,
          payload,
        });
      },
    };
  },
  extendEditorState: (editor) => {
    return {
      activeMyImage: editor.getAttributes("myimage").id,
    };
  },
});

function getMyImageIDs(editor: Editor) {
  const myimageIDs: string[] = [];

  editor.state.doc.descendants((node, _) => {
    if (node.type.name === "myimage") {
      const { id } = node.attrs;
      myimageIDs.push(id);
    }
  });

  return myimageIDs;
}

type MyImageComponentProps = {
  $quote: string;
};

export const DynamicMyImageCSS = (props: MyImageComponentProps) => `
.myimage {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2px solid transparent;
  border-radius: 10px;
  margin: 30px;
  transition: border-color 0.3s ease-in-out;
}
.myimage:hover {
  border: 2px solid ${props.$quote};
}

.myimage-img {
  max-width: 100%;
  border-radius: 8px;
}
.myimage-loading {
  margin: 10px;
}
`;
