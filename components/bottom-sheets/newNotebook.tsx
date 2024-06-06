import { BottomSheetTextInput, BottomSheetView } from "@gorhom/bottom-sheet";
import { Button, Text, View } from "tamagui";

import { usePouch } from "use-pouchdb";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import styles from "./styles";
import { BottomSheetsRef } from "./ref";
import { addNoteBook } from "../../utils/docUtil";
import { usePlatte } from "../../themes/usePlatte";

export type NewNotebookSheetProps = {};

export const NewNotebookSheet = (props: NewNotebookSheetProps) => {
  const pouch = usePouch();
  const [title, setTitle] = useState("");
  const { $text, $activecolor } = usePlatte();
  const { top } = useSafeAreaInsets();
  return (
    <BottomSheetView style={styles.sheetView}>
      <View mb="$4" mt={top}>
        <BottomSheetTextInput
          placeholder="New notebook name"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor={$activecolor}
          style={{
            borderWidth: 1,
            padding: 8,
            borderRadius: 8,
            color: $text,
            borderColor: $activecolor,
          }}
        />
      </View>
      <Button
        mb="$20"
        br="$4"
        theme="active"
        fg={1}
        icon={(props: any) => (
          <Text>
            <Ionicons {...props} name="add" />
          </Text>
        )}
        onPress={async () => {
          BottomSheetsRef.current?.dismiss();
          await addNoteBook(pouch, title);
        }}
      />
    </BottomSheetView>
  );
};
