import { View, Spinner, Separator, Text } from "tamagui";
import { FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesome6 } from "@expo/vector-icons";

import pb from "../../pb";
import { type TChatMessage, type BotMessage } from "../../zustand/chat";
import { useChatContext } from "../../zustand/chat";
import ChatMessage from "../../components/chatMessage";
import ChatInput from "../../components/chatInput";

type ChatResponse = Omit<BotMessage, "role">;

async function chatWithNote(query: string, history?: TChatMessage[]) {
  return (await pb.send("ai/chat", {
    body: {
      query: query,
      similarity_top_k: 4,
      history: history,
    },
    query: {
      user_id: pb.authStore.model?.id,
    },
    method: "POST",
  })) as ChatResponse;
}

async function refresh() {
  return pb.send("ai/refresh", {
    query: { user_id: pb.authStore.model?.id },
    method: "POST",
  });
}

export default function ChatWithNote() {
  const messages = useChatContext.use.messages();
  const appendMessage = useChatContext.use.apendMessage();
  const [loading, setLoading] = useState(false);

  // send chat message to LLM
  const onSend = useCallback(
    async (input: string) => {
      setLoading(true);
      appendMessage({ role: "user", content: input });
      const res = await chatWithNote(input, messages);
      appendMessage({
        role: "chatbot",
        content: res.content,
        sources: res.sources,
      });
      setLoading(false);
    },
    [messages, appendMessage],
  );

  // refresh knowledge base
  useEffect(() => {
    if (messages.length === 0) {
      (async () => {
        setLoading(true);
        await refresh();
        setLoading(false);
      })();
    }
  }, [messages]);

  // for UI:
  const { top, bottom } = useSafeAreaInsets();
  const messages_reversed = useMemo(() => [...messages].reverse(), [messages]);

  return (
    <View f={1} bg="$background" jc="center">
      {messages.length === 0 && <ChatWelcome refreshing={loading} />}
      <FlatList
        inverted
        data={messages_reversed}
        keyExtractor={(_item, index) => messages.length - index + ""}
        renderItem={ChatMessage}
      />
      {messages.length > 0 && loading && <ChatLoadingIndicator />}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? top + 45 - bottom : 0}
      >
        <View mb={bottom}>
          <Separator />
          <ChatInput onSend={onSend} disabled={loading} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const ChatWelcome = (props: { refreshing: boolean }) => (
  <View fg={1} jc="flex-end" ai="center">
    {!props.refreshing ? (
      <View animation="slow" ai="center" enterStyle={{ o: 0 }}>
        <Text color="$color6" mb="$4">
          <FontAwesome6 name="wand-magic-sparkles" size={32} />
        </Text>
        <Text color="$color6">Ask me anything about your notes...</Text>
      </View>
    ) : (
      <Spinner size="large" color="$color6" />
    )}
  </View>
);

const ChatLoadingIndicator = () => (
  <Spinner jc="center" color="$color6" my="$4" />
);
