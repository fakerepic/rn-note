import { BridgeState, EditorBridge } from "@10play/tentap-editor";
import { useEffect } from "react";
import { create } from "zustand";

interface State {
  docID?: string;
  editor?: EditorBridge;
  editorState?: BridgeState;
}

interface Action {
  _setEditor: (editor?: EditorBridge) => void;
  _setEditorState: (editorState?: BridgeState) => void;
  _setDocID: (docID?: string) => void;
}

const Store = create<State & Action>()((set) => ({
  _setEditor: (editor) => set((state) => ({ ...state, editor })),
  _setEditorState: (editorState) => set((state) => ({ ...state, editorState })),
  _setDocID: (docID) => set((state) => ({ ...state, docID })),
}));

export const useSubscriptionEffect = (editor: EditorBridge, docID?: string) => {
  useEffect(() => {
    Store.getState()._setEditor(editor);
    Store.getState()._setEditorState(editor.getEditorState());
    Store.getState()._setDocID(docID);
    const unsubscribe = editor._subscribeToEditorStateUpdate((s) => {
      Store.getState()._setEditorState(s);
    });
    return () => {
      unsubscribe();
      Store.getState()._setEditor(undefined);
      Store.getState()._setEditorState(undefined);
      Store.getState()._setDocID(undefined);
    };
  }, [docID, editor]);
};

export const useCurrentBridge = () => Store((state) => state.editor);
export const useBridgeState = () => Store((state) => state.editorState);
export const useDocID = () =>
  Store((state) => {
    return { docID: state.docID, setDocID: state._setDocID };
  });
