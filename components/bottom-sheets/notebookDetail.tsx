import { BottomSheetView } from "@gorhom/bottom-sheet";
import {
  AlertDialog,
  Button,
  H4,
  Separator,
  Text,
  XStack,
  YStack,
} from "tamagui";

import styles from "./styles";
import { useDoc, usePouch } from "use-pouchdb";
import { useCallback, useMemo, useState } from "react";
import { InteractionManager } from "react-native";
import { BottomSheetsRef } from "./ref";
import { deleteNoteBook } from "../../utils/docUtil";
import { useNotebookContext } from "../../zustand/notebookCtx";

export type NotebookDetailSheetProps = {
  notebookID: string;
};

export const NotebookDetailSheet = (props: NotebookDetailSheetProps) => {
  const { notebookID: docID } = props;

  const pouch = usePouch();

  const { doc } = useDoc<{ createAt: number }>(docID as string);

  const Item = useCallback((item: { label: string; text?: string }) => {
    return (
      <Text color={item.text && "$color10"}>
        <Text>{item.label} </Text>
        {item.text ?? "N/A"}
      </Text>
    );
  }, []);

  const createAt = useMemo(() => {
    return doc ? new Date(doc?.createAt).toLocaleString() : undefined;
  }, [doc?.createAt]);

  const [confirming, setConfirming] = useState(false);

  return (
    <BottomSheetView style={styles.sheetView}>
      <H4 selectable={false}>Notebook Detail</H4>
      <Separator />
      <Item label="ID" text={doc?._id} />
      <Item label="Create at" text={createAt} />
      <Separator />
      {confirming ? (
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
                useNotebookContext.getState().notifyDeleted(docID);
                deleteNoteBook(pouch, docID);
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
          delete notebook
        </Button>
      )}
    </BottomSheetView>
  );
};
