import { View } from "tamagui";
import { useDoc, usePouch } from "use-pouchdb";
import { useLocalSearchParams, Stack } from "expo-router";
import { useCallback, useEffect } from "react";
import Editor, { useThemedEditorInstance } from "../components/editor";
import type { JSONContent } from "@tiptap/core";
import { EditorBridge } from "@10play/tentap-editor";
import Animated, { FadeInDown } from "react-native-reanimated";
import { tiptapExtractTitle } from "../utils/docUtil";
import { MaterialIcons } from "@expo/vector-icons";
import { usePlatte } from "../themes/usePlatte";
import { router } from "expo-router";
import { useNavigation } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function ModalScreen() {
  const pouch = usePouch();

  const { $text } = usePlatte();

  const { doc: docID } = useLocalSearchParams<{ doc: string }>();

  const { doc } = useDoc<{ title: string; content: any }>(docID);

  const editor = useThemedEditorInstance();

  const save = useCallback(async () => {
    try {
      const res = (await editor.getJSON()) as JSONContent;
      const record = await pouch.get(docID);
      await pouch.put({
        _id: record._id,
        _rev: record._rev,
        title: tiptapExtractTitle(res),
        content: res,
      });
    } catch (e) {
      console.error(e);
    }
  }, [docID, editor, pouch]);

  useEditerInitEffect(editor, doc?.content);

  const navigation = useNavigation();
  useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        e.preventDefault();
        save()
          .catch(console.error)
          .finally(() => navigation.dispatch(e.data.action));
      }),
    [navigation, save],
  );

  return (
    <View f={1} jc="center" bg="$background" gap="$4">
      <Stack.Screen
        options={{
          title: "",
          headerLeft: () => (
            <TouchableOpacity onPress={router.back}>
              <MaterialIcons name="arrow-back" size={24} color={$text} />
            </TouchableOpacity>
          ),
        }}
      />
      <Animated.View
        style={{ flex: 1 }}
        entering={FadeInDown.springify().duration(1000).delay(500)}
      >
        <Editor editor={editor} saveAction={save} />
      </Animated.View>
    </View>
  );
}

function useEditerInitEffect(editor: EditorBridge, content: any) {
  // const [ready, setReady] = useState(false);
  useEffect(() => {
    const unsubscribe = editor._subscribeToEditorStateUpdate((state) => {
      if (state.isReady && content) {
        editor.setContent(content);
        // setReady(true);
        unsubscribe();
      }
    });
    return () => {
      unsubscribe();
    };
  }, [editor, content]);
}
