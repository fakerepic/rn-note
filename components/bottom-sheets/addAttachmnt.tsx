import { BottomSheetView } from "@gorhom/bottom-sheet";
import { useCallback } from "react";
import { ListItem, Separator } from "tamagui";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

import styles from "./styles";
import { useCurrentBridge } from "../../zustand/editor";
import { test_insert_attachment } from "../../utils/images";
import { usePlatte } from "../../themes/usePlatte";
import { InteractionManager } from "react-native";

export const AddAttachmentSheet = (props: {}) => {
  const editor = useCurrentBridge();

  const selectPhoto = useCallback(async () => {
    if (editor) {
      await test_insert_attachment(editor);
    }
  }, [editor]);

  return (
    <BottomSheetView style={styles.sheetView}>
      <CustomListItem
        icon={(p) => <MaterialIcons name="photo-library" {...p} />}
        title={"Select photo"}
        onPress={selectPhoto}
      />
      <CustomListItem
        icon={(p) => <MaterialIcons name="camera-alt" {...p} />}
        title={"Capture photo"}
      />
      <Separator />
      <CustomListItem
        icon={(p) => <MaterialIcons name="audiotrack" {...p} />}
        title={"Select Audio"}
      />
      <CustomListItem
        icon={(p) => <MaterialIcons name="keyboard-voice" {...p} />}
        title={"Record Audio"}
      />
      <Separator />
      <CustomListItem
        icon={(p) => <MaterialIcons name="web-asset" {...p} />}
        title={"Insert Video"}
      />
    </BottomSheetView>
  );
};

const CustomListItem = (props: {
  title: string;
  icon: (props: { color: string; size: number }) => JSX.Element;
  onPress?: () => Promise<void>;
}) => {
  const { $text } = usePlatte();
  return (
    <ListItem
      br="$8"
      bg="$color4"
      animation="quick"
      pressStyle={{ bg: "$backgroundPress" }}
      icon={() => props.icon({ color: $text, size: 16 })}
      title={props.title}
      onPress={() => {
        router.back();
        InteractionManager.runAfterInteractions(async () => {
          if (props.onPress) {
            await props.onPress();
          }
        });
      }}
    />
  );
};
