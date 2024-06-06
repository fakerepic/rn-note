import React, { useEffect, useMemo, useState } from "react";
import type { CardProps } from "tamagui";
import { Button, Card, H2, H6, Text, View, XStack } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";
import { useNoteEntries } from "../../pouchdbs/custom-hooks";
import Animated, { FadeIn } from "react-native-reanimated";
import { Link, router } from "expo-router";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import IoniIcons from "@expo/vector-icons/Ionicons";
import { MasonryFlashList, FlashList } from "@shopify/flash-list";
import { LayoutAnimation, Platform, TouchableOpacity } from "react-native";
import { useDocID } from "../../zustand/editor";
import { SheetGroup } from "../../components/bottom-sheets";
import { usePlatte } from "../../themes/usePlatte";
import { useNotebookContext } from "../../zustand/notebookCtx";
import { neatTime } from "../../utils/timeConvert";

export default function CardDemo() {
  const ctxNotebookID = useNotebookContext((s) => s.notebookID);
  const isAllNotes = ctxNotebookID === undefined;
  const title = useMemo(
    () => (ctxNotebookID ? ctxNotebookID.substring(9) : "all notes"),
    [ctxNotebookID],
  );
  const { docs } = useNoteEntries(ctxNotebookID);
  const isEmpty = docs.length === 0;
  const { sortMode, sortOrder } = useNotebookContext((s) => ({
    sortMode: s.sortMode,
    sortOrder: s.sortOrder,
  }));
  const sortedDocs = useMemo(() => {
    if (sortMode === "update") {
      return [...docs].sort((a, b) => {
        return sortOrder === "asc"
          ? a.updateAt - b.updateAt
          : b.updateAt - a.updateAt;
      });
    } else {
      return [...docs].sort((a, b) => {
        return sortOrder === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      });
    }
  }, [docs, sortMode, sortOrder]);

  const [numColumns, setNumColumns] = useState(2);

  // enable layout animation on ios
  const list = React.useRef<FlashList<any>>(null);
  useEffect(() => {
    if (Platform.OS === "ios") {
      if (__DEV__) {
        const _warn = console.warn;
        console.warn = () => {};
        list.current?.prepareForLayoutAnimationRender();
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        console.warn = _warn;
      } else {
        list.current?.prepareForLayoutAnimationRender();
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      }
    }
  }, [sortedDocs]);

  return (
    <View f={1} bg="$background">
      <LinearGradient
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        height="$14"
        colors={["$color1", "$color3"]}
        start={[0, 1]}
        end={[0, 0]}
      />
      <XStack mx="$3" my="$4" gap="$2" jc="space-between" ai="center">
        <Text numberOfLines={1} ellipsizeMode="tail">
          <MaterialCommunityIcons
            name={isAllNotes ? "note-text" : "notebook"}
            size={36}
          />
          <H2> {title}</H2>
        </Text>
      </XStack>

      <XStack mx="$3" mb="$4" ai="center" gap="$2">
        <Button
          onPress={() => setNumColumns((prev) => (prev === 1 ? 2 : 1))}
          animation="quick"
          circular
          bw={0}
          icon={() => (
            <Text>
              <MaterialIcons
                name={numColumns === 2 ? "auto-awesome-mosaic" : "table-rows"}
                size={16}
              />
            </Text>
          )}
        />
        <XStack ai="center">
          <Button
            onPress={() =>
              useNotebookContext.setState((prev) => ({
                ...prev,
                sortMode: prev.sortMode === "title" ? "update" : "title",
              }))
            }
            animation="quick"
            bw={0}
            br={0}
            pr="$2"
            borderTopLeftRadius="$8"
            borderBottomLeftRadius="$8"
            iconAfter={() => (
              <Text>
                <MaterialCommunityIcons
                  name={
                    sortMode === "title"
                      ? "sort-alphabetical-variant"
                      : "update"
                  }
                  size={16}
                />
              </Text>
            )}
          >
            sort by
          </Button>
          <Button
            onPress={() =>
              useNotebookContext.setState((prev) => ({
                ...prev,
                sortOrder: prev.sortOrder === "asc" ? "desc" : "asc",
              }))
            }
            animation="quick"
            bw={0}
            br={0}
            pl="$2"
            borderTopRightRadius="$8"
            borderBottomRightRadius="$8"
            iconAfter={() => (
              <Text>
                <MaterialCommunityIcons
                  name={sortOrder === "asc" ? "arrow-up" : "arrow-down"}
                  size={16}
                />
              </Text>
            )}
          />
        </XStack>
      </XStack>
      {isEmpty ? (
        <View f={1} jc="center" mx="$6" mb="$20">
          <Text color="$color6">
            No notes found, try to create a new note by clicking the "+" button
          </Text>
        </View>
      ) : (
        <View f={1} px="$2">
          {numColumns === 2 ? (
            <MasonryFlashList
              data={sortedDocs}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              estimatedItemSize={138}
              keyExtractor={(item) => item._id}
              ref={list}
              renderItem={({ item, index }) => {
                return (
                  <>
                    {RenderItem({ item, index })}
                    {index === sortedDocs.length - 1 && <View h="$12" />}
                  </>
                );
              }}
            />
          ) : (
            <FlashList
              data={sortedDocs}
              showsVerticalScrollIndicator={false}
              estimatedItemSize={105}
              keyExtractor={(item) => item._id}
              ref={list}
              renderItem={({ item, index }) => {
                return (
                  <>
                    {RenderItem({ item, index })}
                    {index === sortedDocs.length - 1 && <View h="$12" />}
                  </>
                );
              }}
            />
          )}
          <Link
            asChild
            href={{
              pathname: "/new_note",
              params: ctxNotebookID
                ? {
                    ctxNotebookID,
                  }
                : undefined,
            }}
          >
            <Button
              w="$6"
              h="$6"
              br="$12"
              bw={0}
              bottom="$4"
              right="$6"
              pos="absolute"
              elevate
              elevation={4}
              icon={<IoniIcons name="add" size={24} />}
            />
          </Link>
        </View>
      )}
    </View>
  );
}

const RenderItem = ({
  item,
  index,
}: {
  item: ReturnType<typeof useNoteEntries>["docs"][0];
  index: number;
}) => {
  return (
    <Animated.View entering={FadeIn.delay(30 * index)}>
      <View py="$2" px="$2" gap="$4">
        <DemoCard
          animation="bouncy"
          size="$4"
          hoverStyle={{ scale: 0.98 }}
          pressStyle={{ scale: 0.97, bg: "$color3" }}
          {...item}
        ></DemoCard>
      </View>
    </Animated.View>
  );
};

export function DemoCard(
  props: CardProps & {
    _id?: string;
    title?: string;
    _rev?: string;
    updateAt?: number;
  },
) {
  const { setDocID } = useDocID();
  const { $text } = usePlatte();
  const updateAtString = useMemo(() => {
    return props.updateAt ? neatTime(props.updateAt) : undefined;
  }, [props.updateAt]);
  return (
    <Card
      size="$4"
      bordered
      {...props}
      onPress={() =>
        router.navigate({
          pathname: "/edit",
          params: { doc: props._id as string },
        })
      }
    >
      <Card.Footer padded>
        <XStack flex={1} jc="space-between" gap="$2">
          <View flex={1} flexGrow={1}>
            <H6 selectable={false}>{props.title || "Untitled"}</H6>
          </View>
          <TouchableOpacity
            onPressIn={() => {
              setDocID(props._id);
              SheetGroup.open("noteDetailAllowDel");
            }}
          >
            <MaterialCommunityIcons
              name="dots-horizontal"
              size={20}
              color={$text}
            />
          </TouchableOpacity>
        </XStack>
      </Card.Footer>
      <Text ml="$2" mb="$2" color="$color6">
        {updateAtString}
      </Text>
      <Card.Background></Card.Background>
    </Card>
  );
}
