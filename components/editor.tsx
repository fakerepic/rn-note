import {
  RichText,
  Toolbar,
  useEditorBridge,
  EditorBridge,
  darkEditorTheme,
  TenTapStartKit,
  CoreBridge,
} from "@10play/tentap-editor";
import { useEffect, useMemo } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "tamagui";

type EditorProps = {
  editor: EditorBridge;
  saveAction: () => Promise<void>;
};

export default function Editor(props: EditorProps) {
  return (
    <SafeAreaView style={{ flex: 1, height: 300 }}>
      <RichText
        setBuiltInZoomControls={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled={false}
        scalesPageToFit={false}
        scrollEnabled={false}
        onError={console.error}
        editor={props.editor}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          position: "absolute",
          width: "100%",
          height: "auto",
          bottom: 0,
        }}
      >
        <Toolbar editor={props.editor} hidden={false} />
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
    () => `
  * {
    background-color: ${$background};
    color: ${$text};
    caret-color: ${$cursor};
    // margin-left: 3px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  }
  .tiptap {
    margin-left: 15px;
    margin-right: 3px;
  }
  blockquote {
    border-left: 3px solid ${$quote};
    padding-left: 1rem;
  }
`,
    [$background, $cursor, $quote, $text],
  );

  const editor = useEditorBridge({
    bridgeExtensions: [
      ...TenTapStartKit,
      CoreBridge.configureCSS(DynamicEditorCss).extendExtension({
        content: "heading block+",
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
    editor.injectCSS(DynamicEditorCss, CoreBridge.name);
  }, [DynamicEditorCss, editor]);

  return editor;
}