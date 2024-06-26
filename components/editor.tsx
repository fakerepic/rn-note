import {
  RichText,
  useEditorBridge,
  EditorBridge,
  darkEditorTheme,
  TenTapStartKit,
  CoreBridge,
  PlaceholderBridge,
} from "@10play/tentap-editor";
import { useEffect, useMemo } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, useTheme } from "tamagui";

import { editorHtml } from "../tentap/editor-web/build/editorHtml";
import { DynamicMyImageCSS, MyImageBridge } from "../tentap/myImageBridge";
import { AudioBridge, DynamicAudioCSS } from "../tentap/audioBridge";
import { DynamicVideoCSS, VideoBridge } from "../tentap/videoBridge";
import { UtilBridge } from "../tentap/utilBridge";
import { Toolbar, DEFAULT_TOOLBAR_ITEMS, customToolbars } from "./toolbar";

type EditorProps = {
  editor: EditorBridge;
};

export default function Editor(props: EditorProps) {
  const toolbaritems = useMemo(
    () => customToolbars.concat(DEFAULT_TOOLBAR_ITEMS),
    [],
  );

  const { top } = useSafeAreaInsets();
  return (
    <SafeAreaView style={{ flex: 1, height: 300 }}>
      <RichText
        setBuiltInZoomControls={false}
        setDisplayZoomControls={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled={false}
        scalesPageToFit={false}
        scrollEnabled={false}
        onError={console.error}
        editor={props.editor}
      />
      {/* make sure all the text is visible */}
      <View h={Platform.OS === "ios" ? "unset" : "$4"} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? top + 45 : 0}
        style={{
          position: "absolute",
          width: "100%",
          height: "auto",
          bottom: 0,
        }}
      >
        <Toolbar items={toolbaritems} editor={props.editor} hidden={false} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type ThemeEditorProps = {
  initialContent?: string;
  autoFocus?: boolean;
};

export function useThemedEditorInstance(props: ThemeEditorProps = {}) {
  const theme = useTheme();
  const $background = theme.background.get();
  const $text = theme.color12.get();
  const $quote = theme.color8.get();
  const $cursor = theme.color6.get();
  const $toolbar = theme.color3.get();
  const colorScheme = useColorScheme();
  const { bottom } = useSafeAreaInsets();

  const DynamicEditorCss = useMemo(
    () =>
      `
  * {
    background-color: ${$background};
    color: ${$text};
    caret-color: ${$cursor};
    // margin-left: 3px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  }
  .tiptap {
    padding-left: 15px;
    padding-right: 15px;
  }
  blockquote {
    border-left: 3px solid ${$quote};
    padding-left: 1rem;
  }
` +
      DynamicMyImageCSS({ $quote }) +
      DynamicAudioCSS({ $quote, $toolbar, $text }) +
      DynamicVideoCSS({ $quote, $toolbar, $text }),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [colorScheme, theme],
  );

  const editor = useEditorBridge({
    customSource: editorHtml,
    bridgeExtensions: [
      ...TenTapStartKit,
      MyImageBridge,
      AudioBridge,
      VideoBridge,
      UtilBridge,
      PlaceholderBridge.configureExtension({
        showOnlyCurrent: false,
        placeholder: "Add a title...",
      }),
      CoreBridge.configureCSS(DynamicEditorCss).extendExtension({
        content: "heading block*",
      }),
    ],
    initialContent: props.initialContent,
    autofocus: props.autoFocus,
    avoidIosKeyboard: true,
    theme: {
      toolbar: {
        icon: {
          tintColor: $text,
        },
        toolbarBody: {
          borderTopColor: $toolbar,
          borderBottomColor: $toolbar,
          backgroundColor: $toolbar,
          paddingBottom: bottom || 10,
          paddingTop: 10,
          height: "auto",
        },
        toolbarButton: {
          backgroundColor: $toolbar,
        },
        iconWrapper: {
          backgroundColor: $toolbar,
        },
        iconWrapperActive: {
          backgroundColor: $cursor,
        },
      },
      colorKeyboard:
        colorScheme === "dark" ? darkEditorTheme.colorKeyboard : {},
      webview: {
        backgroundColor: $background,
        marginBottom: bottom,
      },
    },
  });

  useEffect(() => {
    if (editor.getEditorState().isReady) {
      editor.injectCSS(DynamicEditorCss, CoreBridge.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DynamicEditorCss]);

  return editor;
}
