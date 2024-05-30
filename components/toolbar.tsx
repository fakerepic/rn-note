import {
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
} from "react-native";
import {
  EditorBridge,
  useKeyboard,
  Images,
  BridgeState,
} from "@10play/tentap-editor";
import React from "react";
import { useBridgeState } from "../zustand/editor";
import { SheetGroup } from "./bottom-sheets";

type ArgsToolbarCB = {
  editor: EditorBridge;
  editorState: BridgeState;
  setToolbarContext: (
    ToolbarContext: ToolbarContext | ((prev: ToolbarContext) => ToolbarContext),
  ) => void;
  toolbarContext: ToolbarContext;
};
export interface ToolbarItem {
  onPress: ({ editor, editorState }: ArgsToolbarCB) => () => void;
  active: ({ editor, editorState }: ArgsToolbarCB) => boolean;
  disabled: ({ editor, editorState }: ArgsToolbarCB) => boolean;
  image: ({ editor, editorState }: ArgsToolbarCB) => any;
}

interface ToolbarProps {
  editor: EditorBridge;
  hidden?: boolean;
  items?: ToolbarItem[];
}

export const toolbarStyles = StyleSheet.create({});

export enum ToolbarContext {
  Main,
  Heading,
}

export function Toolbar({
  editor,
  hidden = undefined,
  items = DEFAULT_TOOLBAR_ITEMS,
}: ToolbarProps) {
  const editorState = useBridgeState();
  const { isKeyboardUp } = useKeyboard();
  const [toolbarContext, setToolbarContext] = React.useState<ToolbarContext>(
    ToolbarContext.Main,
  );

  const hideToolbar =
    hidden === undefined ? !isKeyboardUp || !editorState?.isFocused : hidden;

  if (!editorState) return null;

  const args = {
    editor,
    editorState,
    setToolbarContext,
    toolbarContext,
  };

  switch (toolbarContext) {
    case ToolbarContext.Main:
    case ToolbarContext.Heading:
      return (
        <FlatList
          data={toolbarContext === ToolbarContext.Main ? items : HEADING_ITEMS}
          style={[
            editor.theme.toolbar.toolbarBody,
            hideToolbar ? editor.theme.toolbar.hidden : undefined,
          ]}
          renderItem={({ item: { onPress, disabled, active, image } }) => {
            return (
              <TouchableOpacity
                onPress={onPress(args)}
                disabled={disabled(args)}
                style={[editor.theme.toolbar.toolbarButton]}
              >
                <View
                  style={[
                    editor.theme.toolbar.iconWrapper,
                    active(args)
                      ? editor.theme.toolbar.iconWrapperActive
                      : undefined,
                    disabled(args)
                      ? editor.theme.toolbar.iconWrapperDisabled
                      : undefined,
                  ]}
                >
                  <Image
                    source={image(args)}
                    style={[
                      editor.theme.toolbar.icon,
                      active(args)
                        ? editor.theme.toolbar.iconActive
                        : undefined,
                      disabled(args)
                        ? editor.theme.toolbar.iconDisabled
                        : undefined,
                    ]}
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>
            );
          }}
          horizontal
        />
      );
  }
}

export const customToolbars: ToolbarItem[] = [
  {
    onPress: () => () => {
      SheetGroup.open("addAttachmnt");
    },
    active: ({ editorState }) => false,
    disabled: ({ editorState }) => false,
    image: () => require("../assets/images/attach_icon.png"),
  },
];

export const DEFAULT_TOOLBAR_ITEMS: ToolbarItem[] = [
  {
    onPress:
      ({ editor }) =>
      () =>
        editor.toggleBold(),
    active: ({ editorState }) => editorState.isBoldActive,
    disabled: ({ editorState }) => !editorState.canToggleBold,
    image: () => Images.bold,
  },
  {
    onPress:
      ({ editor }) =>
      () =>
        editor.toggleItalic(),
    active: ({ editorState }) => editorState.isItalicActive,
    disabled: ({ editorState }) => !editorState.canToggleItalic,
    image: () => Images.italic,
  },
  {
    onPress:
      ({ editor }) =>
      () =>
        editor.toggleTaskList(),
    active: ({ editorState }) => editorState.isTaskListActive,
    disabled: ({ editorState }) => !editorState.canToggleTaskList,
    image: () => Images.checkList,
  },
  {
    onPress:
      ({ setToolbarContext }) =>
      () =>
        setToolbarContext(ToolbarContext.Heading),
    active: () => false,
    disabled: ({ editorState }) => !editorState.canToggleHeading,
    image: () => Images.Aa,
  },
  {
    onPress:
      ({ editor }) =>
      () =>
        editor.toggleBlockquote(),
    active: ({ editorState }) => editorState.isBlockquoteActive,
    disabled: ({ editorState }) => !editorState.canToggleBlockquote,
    image: () => Images.quote,
  },
  {
    onPress:
      ({ editor }) =>
      () =>
        editor.toggleCode(),
    active: ({ editorState }) => editorState.isCodeActive,
    disabled: ({ editorState }) => !editorState.canToggleCode,
    image: () => Images.code,
  },
  {
    onPress:
      ({ editor }) =>
      () =>
        editor.toggleUnderline(),
    active: ({ editorState }) => editorState.isUnderlineActive,
    disabled: ({ editorState }) => !editorState.canToggleUnderline,
    image: () => Images.underline,
  },
  {
    onPress:
      ({ editor }) =>
      () =>
        editor.toggleStrike(),
    active: ({ editorState }) => editorState.isStrikeActive,
    disabled: ({ editorState }) => !editorState.canToggleStrike,
    image: () => Images.strikethrough,
  },
  {
    onPress:
      ({ editor }) =>
      () =>
        editor.toggleOrderedList(),
    active: ({ editorState }) => editorState.isOrderedListActive,
    disabled: ({ editorState }) => !editorState.canToggleOrderedList,
    image: () => Images.orderedList,
  },
  {
    onPress:
      ({ editor }) =>
      () =>
        editor.toggleBulletList(),
    active: ({ editorState }) => editorState.isBulletListActive,
    disabled: ({ editorState }) => !editorState.canToggleBulletList,
    image: () => Images.bulletList,
  },
  {
    onPress:
      ({ editor }) =>
      () =>
        editor.sink(),
    active: () => false,
    disabled: ({ editorState }) => !editorState.canSink,
    image: () => Images.indent,
  },
  {
    onPress:
      ({ editor }) =>
      () =>
        editor.lift(),
    active: () => false,
    disabled: ({ editorState }) => !editorState.canLift,
    image: () => Images.outdent,
  },
];

export const HEADING_ITEMS: ToolbarItem[] = [
  {
    onPress:
      ({ setToolbarContext }) =>
      () =>
        setToolbarContext(ToolbarContext.Main),
    active: () => false,
    disabled: () => false,
    image: () => Images.close,
  },
  {
    onPress:
      ({ editor }) =>
      () =>
        editor.toggleHeading(1),
    active: ({ editorState }) => editorState.headingLevel === 1,
    disabled: ({ editorState }) => !editorState.canToggleHeading,
    image: () => Images.h1,
  },
  {
    onPress:
      ({ editor }) =>
      () =>
        editor.toggleHeading(2),
    active: ({ editorState }) => editorState.headingLevel === 2,
    disabled: ({ editorState }) => !editorState.canToggleHeading,
    image: () => Images.h2,
  },
  {
    onPress:
      ({ editor }) =>
      () =>
        editor.toggleHeading(3),
    active: ({ editorState }) => editorState.headingLevel === 3,
    disabled: ({ editorState }) => !editorState.canToggleHeading,
    image: () => Images.h3,
  },
  {
    onPress:
      ({ editor }) =>
      () =>
        editor.toggleHeading(4),
    active: ({ editorState }) => editorState.headingLevel === 4,
    disabled: ({ editorState }) => !editorState.canToggleHeading,
    image: () => Images.h4,
  },
  {
    onPress:
      ({ editor }) =>
      () =>
        editor.toggleHeading(5),
    active: ({ editorState }) => editorState.headingLevel === 5,
    disabled: ({ editorState }) => !editorState.canToggleHeading,
    image: () => Images.h5,
  },
  {
    onPress:
      ({ editor }) =>
      () =>
        editor.toggleHeading(6),
    active: ({ editorState }) => editorState.headingLevel === 6,
    disabled: ({ editorState }) => !editorState.canToggleHeading,
    image: () => Images.h6,
  },
];
