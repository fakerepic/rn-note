import { View } from "tamagui";
import { useDoc, usePouch } from "use-pouchdb";
import { useLocalSearchParams, Stack, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import Editor, { useThemedEditorInstance } from "../components/editor";
import { EditorBridge } from "@10play/tentap-editor";
import Animated, { FadeInDown } from "react-native-reanimated";
import { MaterialIcons } from "@expo/vector-icons";
import { usePlatte } from "../themes/usePlatte";
import { router } from "expo-router";
import { useNavigation } from "expo-router";
import { TouchableOpacity } from "react-native";
import { save_or_create } from "../utils/docUtil";

export default function ModalScreen() {
  const pouch = usePouch<any>();

  const { $text } = usePlatte();

  const { doc: docID } = useLocalSearchParams<{ doc: string }>();

  const { doc } = useDoc<{ title: string; content: any }>(docID);

  const editor = useThemedEditorInstance();

  const save = useCallback(async () => {
    await save_or_create(pouch, editor, docID);
  }, [docID, editor, pouch]);

  useEditerInitEffect(editor, doc?.content);

  const navigation = useNavigation();
  useFocusEffect(() =>
    navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      save()
        .catch(console.error)
        .finally(() => navigation.dispatch(e.data.action));
    }),
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
        <Editor editor={editor} />
      </Animated.View>
    </View>
  );
}

function useEditerInitEffect(editor: EditorBridge, content: any) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const unsubscribe = editor._subscribeToEditorStateUpdate((state) => {
      if (!ready && state.isReady && content) {
        editor.setContent(content);
        setReady(true);
        unsubscribe();
      }
    });
    return () => {
      unsubscribe();
    };
  }, [editor, content, ready]);
}
