import {
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useState } from "react";
import { BottomSheetsRef } from "./ref";
import { usePlatte } from "../../themes/usePlatte";
import { NoteDetailSheet } from "./noteDetail";
import { AddAttachmentSheet } from "./addAttachmnt";
import { MoveToNotebookSheet } from "./moveToNotebook";
import { NotebookDetailSheet } from "./notebookDetail";
import { NewNotebookSheet } from "./newNotebook";
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import { InteractionManager, Keyboard } from "react-native";
import { RecordingSheet } from "./recording";
import { AlertSheet } from "./alert";

const SheetMap = {
  addAttachmnt: (p: any) => <AddAttachmentSheet {...p} />,
  noteDetail: (p: any) => <NoteDetailSheet {...p} />,
  noteDetailAllowDel: (_: any) => <NoteDetailSheet allowDelete />,
  moveNote: (p: any) => <MoveToNotebookSheet {...p} />,
  notebookDetail: (p: string) => <NotebookDetailSheet notebookID={p} />,
  newNotebook: (p: any) => <NewNotebookSheet {...p} />,
  recording: (p: any) => <RecordingSheet {...p} />,
  alert: (p: string) => <AlertSheet message={p} />,
};

export class SheetGroup {
  static open(name: keyof typeof SheetMap, sheetProps?: any) {
    Keyboard.dismiss();
    InteractionManager.runAfterInteractions(() => {
      router.navigate({
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

  const ref = BottomSheetsRef;
  useEffect(() => {
    if (ref.current) {
      ref.current.present();
    }
  }, [ref]);

  // Perform animation of the sheet closing before navigating back.
  const navigation = useNavigation();
  const [fired, setFire] = useState(false);
  useFocusEffect(() =>
    navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      if (fired) {
        return;
      }
      setFire(true);
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
        enableHandlePanningGesture={false}
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
