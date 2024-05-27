import { View } from "tamagui";
import { usePouch } from "use-pouchdb";
import { Stack, router } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { MaterialIcons } from "@expo/vector-icons";

import { save_or_create } from "../utils/docUtil";
import Editor, { useThemedEditorInstance } from "../components/editor";
import { usePlatte } from "../themes/usePlatte";
import { TouchableOpacity } from "react-native";

export default function ModalScreen() {
  const pouch = usePouch<any>();

  const { $text } = usePlatte();

  const editor = useThemedEditorInstance({
    initialContent: "Untitled",
    autoFocus: true,
  });

  const createNote = () => save_or_create(pouch, editor);

  return (
    <View f={1} jc="center" bg="$background">
      <Stack.Screen
        options={{
          title: "New Note",
          headerRight: () => (
            <TouchableOpacity
              onPress={() =>
                createNote().catch(console.error).finally(router.back)
              }
            >
              <MaterialIcons name="check" size={24} color={$text} />
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
