import { Text, Input, XStack } from "tamagui";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

type Props = {
  onSend: (input: string) => Promise<void>;
  disabled: boolean;
};

const ChatInput = (props: Props) => {
  const [input, setInput] = useState("");
  return (
    <XStack flexDirection="row-reverse" gap="$2" px="$3" py="$3">
      <TouchableOpacity
        onPress={() => {
          props.onSend(input);
          setInput("");
        }}
        disabled={props.disabled}
      >
        <Text my="auto">
          <Ionicons name="arrow-up-circle" size={40} />
        </Text>
      </TouchableOpacity>
      <Input
        fg={1}
        br="$8"
        placeholder="Ask to your notes..."
        value={input}
        onChangeText={(text) => setInput(text)}
      />
    </XStack>
  );
};

export default ChatInput;
