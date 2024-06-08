import { View, SizableText, Card, Separator, Paragraph } from "tamagui";
import { TouchableOpacity } from "react-native";
import React from "react";
import { type TChatMessage, type SourceModel } from "../zustand/chat";
import Animated, { FadeIn } from "react-native-reanimated";
import { Link } from "expo-router";

export const ChatMessage = ({
  item,
}: {
  item: TChatMessage;
  index: number;
}) => {
  return (
    <View
      mb={item.role === "user" ? "$2" : "$4"}
      mt="$2"
      ml={item.role === "user" ? "16%" : "$3"}
      mr={item.role === "user" ? "$3" : "16%"}
    >
      <Animated.View entering={FadeIn.delay(30)}>
        <Card
          p="$3"
          bg={item.role === "user" ? "$color5" : "$color2"}
          bc="$color5"
          bw={1}
          borderBottomLeftRadius={item.role === "user" ? "$4" : 0}
          borderBottomRightRadius={item.role === "user" ? 0 : "$4"}
        >
          <Paragraph selectable>{item.content}</Paragraph>
          {item.sources && item.sources.length > 0 && (
            <SourceLinks sources={item.sources} />
          )}
        </Card>
      </Animated.View>
    </View>
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
