import { BottomSheetTextInput, BottomSheetView } from "@gorhom/bottom-sheet";
import { Button, Form, H4, ListItem, Separator, View, XStack } from "tamagui";
import { useMemo, useState } from "react";
import { useDoc, usePouch } from "use-pouchdb";
import { FlatList } from "react-native-gesture-handler";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import styles from "./styles";
import { useDocID } from "../../zustand/editor";
import { addNoteBook, moveNoteToNotebook } from "../../utils/docUtil";
import { usePlatte } from "../../themes/usePlatte";
import { useNoteBooks } from "../../pouchdbs/custom-hooks";

export type NoteBooksProp = {};

export const MoveToNotebookSheet = (props: NoteBooksProp) => {
  const { docs } = useNoteBooks();
  const notebooks = useMemo(() => docs.sort(
    (a, b) => a.title.localeCompare(b.title)
  ), [docs]);

  const { docID } = useDocID();
  const { doc } = useDoc<{ notebookID: string }>(docID as string);

  return (
    <BottomSheetView style={styles.sheetViewNoGap}>
      <H4 selectable={false} mb="$4">
        Select a notebook to move the note
      </H4>
      <View mah="$20">
        <FlatList
          data={notebooks}
          keyExtractor={(doc) => doc._id}
          renderItem={({ item }) => {
            return (
              <NoteBookMoveItem
                item={{ _id: item._id, title: item.title }}
                currentNotebookID={doc?.notebookID}
              />
            );
          }}
        />
      </View>
      <Separator mb="$2" />
      <CreateNoteBookWidget />
    </BottomSheetView>
  );
};

export function NoteBookMoveItem({
  item,
  currentNotebookID,
}: {
  item: { _id: string; title: string };
  currentNotebookID?: string;
}) {
  const { docID } = useDocID();
  const pouch = usePouch();
  const isSelected = currentNotebookID === item._id;
  const { $text } = usePlatte();

  return (
    <ListItem
      animation="slow"
      br="$8"
      bg={isSelected ? "$color6" : "$color4"}
      mb="$2"
      onPress={() => {
        if (docID) {
          if (isSelected) {
            moveNoteToNotebook(pouch, docID, null);
          } else {
            moveNoteToNotebook(pouch, docID, item._id);
          }
        }
      }}
      iconAfter={(props) =>
        isSelected && <MaterialIcons {...props} name="check" color={$text} />
      }
      pressStyle={{
        bg: "$color6",
      }}
    >
      <ListItem.Text>{item.title}</ListItem.Text>
    </ListItem>
  );
}

export function CreateNoteBookWidget() {
  const pouch = usePouch();
  const [title, setTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { $text, $activecolor } = usePlatte();
  if (!isCreating) {
    return (
      <Button
        bw={0}
        icon={(props: any) => <Ionicons {...props} name="add" color={$text} />}
        onPress={() => setIsCreating(true)}
        animation="quick"
        enterStyle={{ opacity: 0 }}
      >
        New notebook
      </Button>
    );
  }
  return (
    <Form
      onSubmit={() => {
        addNoteBook(pouch, title);
        setTitle("");
        setIsCreating(false);
      }}
      mb="$20"
    >
      <XStack gap="$2" animation="quick" fd="row-reverse" enterStyle={{ opacity: 0 }}>
        <Button
          br="$4"
          icon={(props: any) => (
            <Ionicons {...props} name="close" color={$text} />
          )}
          onPress={() => setIsCreating(false)}
        />
        <Form.Trigger asChild>
          <Button
            br="$4"
            icon={(props: any) => (
              <Ionicons {...props} name="add" color={$text} />
            )}
          />
        </Form.Trigger>
        <BottomSheetTextInput
          placeholder="Notebook title"
          placeholderTextColor={$activecolor}
          value={title}
          onChangeText={setTitle}
          style={{
            borderWidth: 1,
            padding: 8,
            borderRadius: 8,
            flexGrow: 1,
            color: $text,
            borderColor: $activecolor,
          }}
        />
      </XStack>
    </Form>
  );
}
