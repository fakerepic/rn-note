import {
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useRef } from "react";
import { usePlatte } from "../../themes/usePlatte";
import { NoteDetailSheet } from "./noteDetail";
import { AddAttachmentSheet } from "./addAttachmnt";
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import { InteractionManager, Keyboard } from "react-native";

const SheetMap = {
  addAttachmnt: (p: any) => <AddAttachmentSheet {...p} />,
  noteDetail: (p: any) => <NoteDetailSheet {...p} />,
};

export class SheetGroup {
  static open(name: keyof typeof SheetMap, sheetProps?: any) {
    Keyboard.dismiss();
    InteractionManager.runAfterInteractions(() => {
      router.push({
        pathname: "/bottom_sheets",
        params: { sheetname: name, sheetprops: sheetProps },
      });
    });
  }
}

export type SheetCommonProps = {
  backgroundStyle?: any;
  handleIndicatorStyle?: any;
};
export function BottomSheetGroup() {
  const { $toolbar, $text } = usePlatte();

  const { sheetname, sheetprops } = useLocalSearchParams<{
    sheetname: keyof typeof SheetMap;
    sheetprops: any;
  }>();

  const ref = useRef<BottomSheetModal>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.present();
    }
  }, [ref]);

  // Perform animation of the sheet closing before navigating back.
  const navigation = useNavigation();
  useFocusEffect(() =>
    navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      ref.current?.dismiss();
      setTimeout(() => {
        navigation.dispatch(e.data.action);
      }, 100);
    }),
  );

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={2}
      />
    ),
    [],
  );

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        stackBehavior="push"
        backgroundStyle={{ backgroundColor: $toolbar }}
        handleIndicatorStyle={{ backgroundColor: $text, opacity: 0.5 }}
        backdropComponent={renderBackdrop}
        ref={ref}
        enableDynamicSizing
        onDismiss={router.back}
      >
        {SheetMap[sheetname](sheetprops)}
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
}
