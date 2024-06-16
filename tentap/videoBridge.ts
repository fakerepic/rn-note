/**
 * @module The bridge extension built for the 'myvideo' tiptap extension.
 */
import { BridgeExtension } from "@10play/tentap-editor";
import { Editor } from "@tiptap/core";

import { asyncMessages } from "./AsyncMessages";
import { Video } from "./video";
import { setVoice } from "../zustand/voice";

type VideoEditorState = {
  activeVideo: string | null;
};

type VideoEditorInstance = {
  setVideo: (opts: { id: string; src?: string }) => void;
  completeVideo: (opts: { id: string; src: string }) => void;
  getPendingVideos: () => Promise<string[]>;
};

declare module "@10play/tentap-editor" {
  interface BridgeState extends VideoEditorState {}
  interface EditorBridge extends VideoEditorInstance {}
}

export enum VideoEditorActionType {
  SetVideo = "set-myvideo",
  GetIDs = "get-video-ids",
  Play = "play-video",
  GetIDsBack = "get-video-ids-back",
  CompleteVideo = "complete-video",
}

type VideoMessage = {
  type: VideoEditorActionType;
  payload?: any;
};

export const VideoBridge = new BridgeExtension<
  VideoEditorState,
  VideoEditorInstance,
  VideoMessage
>({
  tiptapExtension: Video,
  onBridgeMessage: (editor, message, sendMessageBack) => {
    if (message.type === VideoEditorActionType.SetVideo) {
      editor
        .chain()
        .focus()
        .setVideo({ id: message.payload.id, src: message.payload.src })
        .setTextSelection(editor.state.selection.to + 1)
        .run();
    }

    if (message.type === VideoEditorActionType.GetIDs) {
      sendMessageBack({
        type: VideoEditorActionType.GetIDsBack,
        payload: {
          content: getPendingVideoIDs(editor),
          messageId: message.payload.messageId,
        },
      });
    }

    if (message.type === VideoEditorActionType.CompleteVideo) {
      editor
        .chain()
        .completeSrc({ id: message.payload.id, src: message.payload.src })
        .run();
    }

    return false;
  },
  onEditorMessage(message, _editorBridge) {
    if (message.type === VideoEditorActionType.GetIDsBack) {
      asyncMessages.onMessage(
        message.payload.messageId,
        message.payload.content,
      );
      return true;
    }

    if (message.type === VideoEditorActionType.Play) {
      setVoice(message.payload.id);
      return true;
    }

    return false;
  },
  extendEditorInstance: (sendBridgeMessage) => {
    return {
      setVideo: (payload) => {
        sendBridgeMessage({
          type: VideoEditorActionType.SetVideo,
          payload,
        });
      },
      getPendingVideos: async () => {
        const res = await asyncMessages.sendAsyncMessage<object>(
          {
            type: VideoEditorActionType.GetIDs,
          },
          sendBridgeMessage,
        );
        return res as any;
      },
      completeVideo: (payload) => {
        sendBridgeMessage({
          type: VideoEditorActionType.CompleteVideo,
          payload,
        });
      },
    };
  },
  extendEditorState: (editor) => {
    return {
      activeVideo: editor.getAttributes("myvideo").id,
    };
  },
});

function getPendingVideoIDs(editor: Editor) {
  const myvideoIDs: string[] = [];
  editor.state.doc.descendants((node, _) => {
    if (node.type.name === "myvideo") {
      const { id, src } = node.attrs;
      if (!src) {
        myvideoIDs.push(id);
      }
    }
  });

  return myvideoIDs;
}

type VideoComponentProps = {
  $quote: string;
  $toolbar: string;
  $text: string;
};
export const DynamicVideoCSS = (props: VideoComponentProps) => `
.myvideo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  margin: 10px 0;
  border: 2px solid transparent;
  border-radius: 8px;
  background: ${props.$toolbar};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s ease-in-out;
}
.myvideo-container:hover {
  border: 2px solid ${props.$quote};
}

.myvideo-video {
  width: 100%;
  height: auto;
  background:none;
}

.myvideo-loading {
  flex-grow: 1;
  margin: 0 10px;
  background: none;
  font-size: 14px;
  text-align: center;
}

.myvideo-controls {
  background: none;
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-top: 10px;
}

.myvideo-button {
  padding: 5px 10px;
  border: none;
  border-radius: 12px;
  background-color: ${props.$text};
  color: ${props.$quote};
  cursor: pointer;
  transition: background-color 0.3s ease;
}
`;
