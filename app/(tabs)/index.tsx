import React from "react";
import { FlatList } from "react-native";
import type { CardProps } from "tamagui";
import { Button, Card, H6, View, XStack } from "tamagui";
import { useAllDocs } from "use-pouchdb";
import { usePouchDelete, usePouchSync } from "../../pouchdbs/custom-hooks";
import Animated, { FadeIn } from "react-native-reanimated";
import { Link, router } from "expo-router";
import IoniIcons from "@expo/vector-icons/Ionicons";

export default function CardDemo() {
  const { rows } = useAllDocs<{ title: string; type: string }>({
    include_docs: true,
  });
  const deleteAction = usePouchDelete();
  usePouchSync();
  return (
    <View f={1} jc="center" bg="$background">
      <FlatList
        data={rows}
        renderItem={({ item, index }) => {
          if (item.doc?.type !== "note") return null;
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
      />
      <Link asChild href="/new_note">
        <Button
          theme="active"
          w="$6"
          h="$6"
          br="$12"
          bottom="$4"
          right="$6"
          pos="absolute"
          elevate
          elevation={4}
          icon={<IoniIcons name="add" size={24} />}
        />
      </Link>
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
      <Card.Footer padded>
        <XStack flex={1} gap="$4">
          <H6 selectable={false}>{props.title || "Untitled"}</H6>
        </XStack>
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
