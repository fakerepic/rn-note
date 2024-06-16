/**
 * @module The bridge extension built for the 'myaudio' tiptap extension.
 */
import { BridgeExtension } from "@10play/tentap-editor";
import { Editor } from "@tiptap/core";

import { asyncMessages } from "./AsyncMessages";
import { Audio } from "./audio";
import { setVoice } from "../zustand/voice";

type AudioEditorState = {
  activeAudio: string | null;
};

type AudioEditorInstance = {
  setAudio: (id: string) => void;
  getAudioIDs: () => Promise<string[]>;
};

declare module "@10play/tentap-editor" {
  interface BridgeState extends AudioEditorState {}
  interface EditorBridge extends AudioEditorInstance {}
}

export enum AudioEditorActionType {
  SetAudio = "set-myaudio",
  GetIDs = "get-audio-ids",
  GetIDsBack = "get-audio-ids-back",
  Play = "play-audio",
}

type AudioMessage = {
  type: AudioEditorActionType;
  payload?: any;
};

export const AudioBridge = new BridgeExtension<
  AudioEditorState,
  AudioEditorInstance,
  AudioMessage
>({
  tiptapExtension: Audio,
  onBridgeMessage: (editor, message, sendMessageBack) => {
    if (message.type === AudioEditorActionType.SetAudio) {
      editor
        .chain()
        .focus()
        .setAudio({ id: message.payload })
        .setTextSelection(editor.state.selection.to + 1)
        .run();
    }

    if (message.type === AudioEditorActionType.GetIDs) {
      sendMessageBack({
        type: AudioEditorActionType.GetIDsBack,
        payload: {
          content: getAudioIDs(editor),
          messageId: message.payload.messageId,
        },
      });
    }

    return false;
  },
  onEditorMessage(message, _editorBridge) {
    if (message.type === AudioEditorActionType.GetIDsBack) {
      asyncMessages.onMessage(
        message.payload.messageId,
        message.payload.content,
      );
      return true;
    }

    if (message.type === AudioEditorActionType.Play) {
      setVoice(message.payload.id);
      return true;
    }

    return false;
  },
  extendEditorInstance: (sendBridgeMessage) => {
    return {
      setAudio: (payload) => {
        sendBridgeMessage({
          type: AudioEditorActionType.SetAudio,
          payload,
        });
      },
      getAudioIDs: async () => {
        const res = await asyncMessages.sendAsyncMessage<object>(
          {
            type: AudioEditorActionType.GetIDs,
          },
          sendBridgeMessage,
        );
        return res as any;
      },
    };
  },
  extendEditorState: (editor) => {
    return {
      activeAudio: editor.getAttributes("myaudio").id,
    };
  },
});

function getAudioIDs(editor: Editor) {
  const myaudioIDs: string[] = [];

  editor.state.doc.descendants((node, _) => {
    if (node.type.name === "myaudio") {
      const { id } = node.attrs;
      myaudioIDs.push(id);
    }
  });

  return myaudioIDs;
}

type AudioComponentProps = {
  $quote: string;
  $toolbar: string;
  $text: string;
};
export const DynamicAudioCSS = (props: AudioComponentProps) => `
.myaudio {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  margin: 10px 0;
  border: 2px solid transparent;
  background: ${props.$toolbar};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s ease-in-out;
}
.myaudio:hover {
  border: 2px solid ${props.$quote};
}

.myaudio-btn,
.myaudio-close {
  width: 30px;
  height: 30px;
  border: none;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.myaudio-loading {
  flex-grow: 1;
  color: ${props.$text};
  background: none;
  margin: 0 10px;
  font-size: 14px;
  text-align: center;
}

.myaudio-btn svg,
.myaudio-close svg {
  background: none;
  width: 100%;
  height: 100%;
}

.myaudio-btn svg circle,
.myaudio-close svg circle {
  fill: ${props.$quote};
}

.myaudio-btn svg circle,
.myaudio-close svg circle {
  transition: fill 0.3s ease;
}

.myaudio-btn:hover svg circle,
.myaudio-close:hover svg circle {
  fill: ${props.$text};
}

.myaudio-btn svg polygon {
  fill: ${props.$toolbar};
}
.myaudio-close svg line {
  stroke: ${props.$toolbar};
}
`;
