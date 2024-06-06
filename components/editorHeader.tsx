import { View, XStack } from "tamagui";
import React, { useCallback } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { usePlatte } from "../themes/usePlatte";
import { useCurrentBridge, useBridgeState } from "../zustand/editor";
import { usePouch } from "use-pouchdb";
import { save_or_create } from "../utils/docUtil";
import { SheetGroup } from "./bottom-sheets";

export const EditorHeader = (props: { newNote?: boolean }) => {
  const { $text, $inactivecolor } = usePlatte();
  const { top } = useSafeAreaInsets();
  const editor = useCurrentBridge();
  const state = useBridgeState();
  const pouch = usePouch<any>();
  const { ctxNotebookID } = useLocalSearchParams<{
    ctxNotebookID: string;
  }>();
  const create = useCallback(
    () => editor && save_or_create(pouch, editor, undefined, ctxNotebookID),
    [editor, pouch, ctxNotebookID],
  );
  return (
    <View bg="$background">
      <XStack px="$3" py="$4" mt={top} jc="space-between">
        <XStack gap="$4">
          <TouchableOpacity onPress={router.back}>
            <MaterialIcons name="arrow-back" size={24} color={$text} />
          </TouchableOpacity>
        </XStack>
        <XStack gap="$4">
          <TouchableOpacity onPress={editor?.undo} disabled={!state?.canUndo}>
            <MaterialIcons
              name="undo"
              size={24}
              color={state?.canUndo ? $text : $inactivecolor}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={editor?.redo} disabled={!state?.canRedo}>
            <MaterialIcons
              name="redo"
              size={24}
              color={state?.canRedo ? $text : $inactivecolor}
            />
          </TouchableOpacity>
          {props.newNote ? (
            <TouchableOpacity
              onPress={() =>
                create()?.catch(console.error).finally(router.back)
              }
            >
              <MaterialIcons name="check" size={24} color={$text} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                SheetGroup.open("noteDetail");
              }}
            >
              <MaterialCommunityIcons
                name="dots-horizontal"
                size={24}
                color={$text}
              />
            </TouchableOpacity>
          )}
        </XStack>
      </XStack>
    </View>
  );
};
