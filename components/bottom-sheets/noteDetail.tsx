import { BottomSheetView } from "@gorhom/bottom-sheet";
import { Button, H4, Separator, Text, XStack } from "tamagui";

import styles from "./styles";
import { useDocID } from "../../zustand/editor";
import { useDoc } from "use-pouchdb";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { usePouchDelete } from "../../pouchdbs/custom-hooks";
import { BottomSheetsRef } from "./ref";
import { InteractionManager } from "react-native";

export type NoteDetailSheetProps = {
  allowDelete?: boolean;
};

export const NoteDetailSheet = (props: NoteDetailSheetProps) => {
  const { docID } = useDocID();

  const deleteAction = usePouchDelete();

  const { doc } = useDoc<{
    content: any;
    text: string;
    notebookID: string;
    createAt: number;
    updateAt: number;
  }>(docID as string);

  const createAt = useMemo(() => {
    return doc ? new Date(doc?.createAt).toLocaleString() : undefined;
  }, [doc?.createAt]);

  const updateAt = useMemo(() => {
    return doc ? new Date(doc?.updateAt).toLocaleString() : undefined;
  }, [doc?.updateAt]);

  const Item = useCallback((item: { label: string; text?: string }) => {
    return (
      <Text color={item.text && "$color10"}>
        <Text>{item.label} </Text>
        {item.text ?? "N/A"}
      </Text>
    );
  }, []);

  const [confirming, setConfirming] = useState(false);

  return (
    <BottomSheetView style={styles.sheetView}>
      <H4 selectable={false}>Note Detail</H4>
      <Separator />
      <Item label="ID" text={doc?._id} />
      <Item label="Belong to" text={doc?.notebookID} />
      <Item label="Create at" text={createAt} />
      <Item label="Update at" text={updateAt} />
      <Separator />
      <Button onPress={() => router.setParams({ sheetname: "moveNote" })}>
        Move note
      </Button>
      {props.allowDelete &&
        (confirming ? (
          <XStack
            animation="quick"
            enterStyle={{ opacity: 0 }}
            jc="space-evenly"
            gap="$2"
          >
            <Button fg={1} onPress={() => setConfirming(false)}>
              cancel delete
            </Button>
            <Button
              theme="red"
              fg={1}
              onPress={async () => {
                BottomSheetsRef.current?.dismiss();
                InteractionManager.runAfterInteractions(() => {
                  docID && deleteAction(docID);
                });
              }}
            >
              confirm delete
            </Button>
          </XStack>
        ) : (
          <Button
            animation="quick"
            enterStyle={{ opacity: 0 }}
            onPress={() => setConfirming(true)}
          >
            delete note
          </Button>
        ))}
    </BottomSheetView>
  );
};
