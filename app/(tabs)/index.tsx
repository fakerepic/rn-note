import React from "react";
import { FlatList } from "react-native";
import type { CardProps } from "tamagui";
import { Button, Card, H2, Paragraph, View, XStack } from "tamagui";
import { useAllDocs } from "use-pouchdb";
import { usePouchDelete, usePouchSync } from "../../pouchdbs/custom-hooks";
import { Link } from "expo-router";
import Animated, { FadeIn } from "react-native-reanimated";
import { router } from "expo-router";

export default function CardDemo() {
  const { rows } = useAllDocs<{ title: string }>({ include_docs: true });
  const deleteAction = usePouchDelete();
  usePouchSync();
  return (
    <View f={1} jc="center" bg="$background">
      <FlatList
        data={rows}
        renderItem={({ item, index }) => {
          return (
            <Animated.View entering={FadeIn.delay(30 * index)}>
              <View py="$2" px="$4" gap="$4">
                <DemoCard
                  _id={item.id}
                  animation="bouncy"
                  size="$4"
                  hoverStyle={{ scale: 0.98 }}
                  pressStyle={{ scale: 0.97 }}
                  deleteAction={() => deleteAction(item.id)}
                  title={item.doc?.title}
                ></DemoCard>
              </View>
            </Animated.View>
          );
        }}
      ></FlatList>
    </View>
  );
}

export function DemoCard(
  props: CardProps & {
    _id?: string;
    title?: string;
    _rev?: string;
    deleteAction?: () => void;
  },
) {
  return (
    <Card size="$4" bordered {...props}>
      <Card.Header padded>
        <H2 selectable={false}>{props.title || "Untitled"}</H2>
        <Paragraph theme="alt2" selectable={false}>
          ID: {props._id}
        </Paragraph>
      </Card.Header>
      <Card.Footer padded>
        <XStack flex={1} gap="$4"></XStack>
        <XStack flex={1} gap="$4">
          <Button
            onPress={() =>
              router.push({
                pathname: "/edit",
                params: { doc: props._id as string },
              })
            }
            borderRadius="$10"
          >
            edit
          </Button>
          <Button
            theme="red"
            borderRadius="$10"
            onPress={() => {
              if (props.deleteAction) props.deleteAction();
            }}
          >
            Delete
          </Button>
        </XStack>
      </Card.Footer>
      <Card.Background></Card.Background>
    </Card>
  );
}
