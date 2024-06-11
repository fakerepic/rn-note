import { View, SizableText, Card, Separator, Paragraph, XStack } from "tamagui";
import { TouchableOpacity } from "react-native";
import React from "react";
import { type TChatMessage, type SourceModel } from "../zustand/chat";
import { Link } from "expo-router";

export const ChatMessage = ({ item }: { item: TChatMessage }) => {
  const isUser = item.role === "user";
  return (
    <XStack
      mb={isUser ? "$2" : "$4"}
      mt="$2"
      jc={isUser ? "flex-end" : "flex-start"}
      ml={isUser ? "$6" : "$3"}
      mr={isUser ? "$3" : "$6"}
    >
      <Card
        p="$3"
        maw={500}
        animation="bouncy"
        enterStyle={{ o: 0 }}
        bg={isUser ? "$color5" : "$color2"}
        bc="$color5"
        bw={1}
        borderBottomLeftRadius={isUser ? "$4" : 0}
        borderBottomRightRadius={isUser ? 0 : "$4"}
      >
        <Paragraph selectable>{item.content}</Paragraph>
        {item.sources && item.sources.length > 0 && (
          <SourceLinks sources={item.sources} />
        )}
      </Card>
    </XStack>
  );
};

const SourceLinks = (props: { sources: SourceModel[] }) => {
  const processedSources = props.sources.reduce((acc, source) => {
    const existing = acc.find((s) => s.id === source.id);
    if (!existing) {
      acc.push(source);
    }
    return acc;
  }, [] as SourceModel[]);

  return (
    <View>
      <Separator my="$3" />
      <SizableText size="$2" color="$color10">
        {processedSources.length > 1 ? "Related sources:" : "Related source:"}
      </SizableText>
      {processedSources.map((source, index) => (
        <Link
          href={{ pathname: "/edit", params: { doc: source.id as string } }}
          asChild
          key={index}
        >
          <TouchableOpacity>
            <View key={index} ml="$1" mt="$1">
              <SizableText
                size="$2"
                color="$color8"
                textDecorationLine="underline"
              >
                # {source.title}
              </SizableText>
            </View>
          </TouchableOpacity>
        </Link>
      ))}
    </View>
  );
};

export default ChatMessage;
