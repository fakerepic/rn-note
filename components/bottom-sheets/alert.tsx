import { BottomSheetView } from "@gorhom/bottom-sheet";
import { H4, Paragraph, View, XStack, Text } from "tamagui";
import { MaterialIcons } from "@expo/vector-icons";

import styles from "./styles";

type AlertSheetProps = {
  message: string;
};

export const AlertSheet = (props: AlertSheetProps) => {
  return (
    <BottomSheetView style={styles.sheetView}>
      <XStack gap="$4" ai="center">
        <Text>
          <MaterialIcons name="warning" size={24} />
        </Text>
        <H4 selectable={false}>Warning</H4>
      </XStack>
      <View jc="center" ai="center" my="$4" br="$10" gap="$2">
        <Paragraph selectable={false}>{props.message}</Paragraph>
      </View>
    </BottomSheetView>
  );
};
