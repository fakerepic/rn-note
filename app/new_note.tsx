import { View } from "tamagui";
import { Stack } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";

import Editor, { useThemedEditorInstance } from "../components/editor";
import { useSubscriptionEffect } from "../zustand/editor";

export default function ModalScreen() {
  const editor = useThemedEditorInstance({
    initialContent: "Untitled",
    autoFocus: true,
  });
  useSubscriptionEffect(editor);

  return (
    <View f={1} jc="center" bg="$background">
      <Stack.Screen options={{ title: "New Note" }} />
      <Animated.View
        style={{ flex: 1 }}
        entering={FadeInDown.springify().duration(1000).delay(500)}
      >
        <Editor editor={editor} />
      </Animated.View>
    </View>
  );
}
