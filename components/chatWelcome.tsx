import { View, Text } from "tamagui";
import { FontAwesome6 } from "@expo/vector-icons";

export const ChatWelcome = () => (
  <View fg={1} jc="flex-end" ai="center">
    <Text color="$color6" mb="$4">
      <FontAwesome6 name="wand-magic-sparkles" size={32} />
    </Text>
    <Text color="$color6">Ask me anything about your notes...</Text>
  </View>
);
