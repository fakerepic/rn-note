import { BottomSheetView } from "@gorhom/bottom-sheet";
import { H4, Text } from "tamagui";

import styles from "./styles";
import { useDocID } from "../../zustand/editor";
import { useDoc } from "use-pouchdb";

export type NoteDetailSheetProps = {};

export const NoteDetailSheet = (props: NoteDetailSheetProps) => {
  const { docID } = useDocID();

  const { doc } = useDoc<{ title: string; content: any; text: string }>(
    docID as string,
  );

  return (
    <BottomSheetView style={styles.sheetView}>
      <H4 selectable={false}>Note Detail</H4>
      <Text>ID: {doc?._id}</Text>
      <Text>Title: {doc?.title}</Text>
      <Text>Create at: </Text>
    </BottomSheetView>
  );
};
