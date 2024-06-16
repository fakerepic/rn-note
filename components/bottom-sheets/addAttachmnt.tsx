import { BottomSheetView } from "@gorhom/bottom-sheet";
import { ListItem, ListItemProps, Separator, Text } from "tamagui";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

import styles from "./styles";
import { useCurrentBridge } from "../../zustand/editor";
import { InteractionManager } from "react-native";
import { useImageInjection } from "../../pouchdbs/attachment";
import { useVideoPicker } from "../../components/videoQueueProvider";

export const AddAttachmentSheet = (props: {}) => {
  const editor = useCurrentBridge();
  const { PickAndInjectImage: selectPhoto } = useImageInjection(editor);
  const { addVideo } = useVideoPicker(editor);

  const withRouterSafelyBack = (fn: () => Promise<any>) => async () => {
    const shouldNotBack = await fn();
    InteractionManager.runAfterInteractions(() => {
      if (!shouldNotBack) router.back();
    });
  };

  return (
    <BottomSheetView style={styles.sheetView}>
      <CustomListItem
        itemIcon={(p) => <MaterialIcons name="photo-library" {...p} />}
        title={"Select photo"}
        onPress={withRouterSafelyBack(selectPhoto)}
      />
      <CustomListItem
        itemIcon={(p) => <MaterialIcons name="camera-alt" {...p} />}
        title={"Capture photo"}
        onPress={withRouterSafelyBack(() => selectPhoto(true /* use camera */))}
      />
      <Separator />
      <CustomListItem
        itemIcon={(p) => <MaterialIcons name="keyboard-voice" {...p} />}
        title={"Record Audio"}
        onPress={async () => router.setParams({ sheetname: "recording" })}
      />
      <Separator />
      <CustomListItem
        itemIcon={(p) => <MaterialIcons name="web-asset" {...p} />}
        title={"Insert Video"}
        onPress={withRouterSafelyBack(() => addVideo({ useCamera: false }))}
      />
      <CustomListItem
        itemIcon={(p) => <MaterialIcons name="camera-roll" {...p} />}
        title={"Capture Video"}
        onPress={withRouterSafelyBack(() => addVideo({ useCamera: true }))}
      />
    </BottomSheetView>
  );
};

const CustomListItem = (
  props: {
    itemIcon: (props: { size: number }) => JSX.Element;
  } & ListItemProps,
) => (
  <ListItem
    {...props}
    br="$8"
    bg="$color4"
    animation="quick"
    pressStyle={{ bg: "$backgroundPress" }}
    icon={() => <Text>{props.itemIcon({ size: 16 })}</Text>}
  />
);
