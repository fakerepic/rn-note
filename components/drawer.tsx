import React, { useMemo } from "react";
import {
  DrawerContentComponentProps,
  DrawerItemList,
} from "@react-navigation/drawer";
import {
  Avatar,
  Text,
  ListItem,
  Separator,
  View,
  XStack,
  YStack,
} from "tamagui";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNoteBooks } from "../pouchdbs/custom-hooks";
import { FlatList } from "react-native";
import { usePlatte } from "../themes/usePlatte";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import pb, { useUserModel } from "../pb";
import { SheetGroup } from "./bottom-sheets";
import { useNotebookContext } from "../zustand/notebookCtx";
import { router } from "expo-router";

type Props = DrawerContentComponentProps & {};

const DrawerComponent = (props: Props) => {
  const { bottom } = useSafeAreaInsets();
  return (
    <View f={1} fg={1} jc="space-between" bg="$background">
      <View f={1} overflow="scroll">
        <AvatarPreview />
        <View f={1}>
          <NoteBookSelectorWidget {...props} />
        </View>
      </View>
      <View mt="$2" mb={bottom}>
        <DrawerItemList {...props} />
      </View>
    </View>
  );
};

const AvatarPreview = () => {
  const userModel = useUserModel();
  const avatarUrl = useMemo(
    () => pb.files.getUrl(userModel as any, userModel?.avatar as string),
    [userModel],
  );
  const { top } = useSafeAreaInsets();

  return (
    <XStack pl="$4" pb="$2" pt={top} ai="flex-start" bg="$color2">
      <YStack ai="center" gap="$1">
        <Avatar circular size="$6" borderWidth="$1" borderColor="$color6">
          <Avatar.Image src={avatarUrl} />
          <Avatar.Fallback backgroundColor="$shadowColorFocus" />
        </Avatar>
        <Text>{userModel?.name || userModel?.email || "Anonymous"}</Text>
      </YStack>
    </XStack>
  );
};

const NoteBookSelectorWidget = (props: DrawerContentComponentProps & {}) => {
  const { docs } = useNoteBooks();
  const notebooks = useMemo(
    () => docs.sort((a, b) => a.title.localeCompare(b.title)),
    [docs],
  );
  const currentNotebookID = useNotebookContext((s) => s.notebookID);

  return (
    <>
      <NoteBookAll currentNotebookID={currentNotebookID} />
      <FlatList
        data={notebooks}
        keyExtractor={(doc) => doc._id}
        renderItem={({ item }) => {
          return (
            <NoteBookJumpItem
              item={{ _id: item._id, title: item.title }}
              currentNotebookID={currentNotebookID}
            />
          );
        }}
      />
    </>
  );
};

function NoteBookJumpItem({
  item,
  currentNotebookID,
}: {
  item: { _id: string | undefined; title: string };
  currentNotebookID?: string;
}) {
  const isSelected = currentNotebookID === item._id;
  const { $text } = usePlatte();

  return (
    <ListItem
      animation="quick"
      bg={isSelected ? "$color4" : "$color1"}
      icon={() => (
        <MaterialCommunityIcons name="notebook" color={$text} size={24} />
      )}
    >
      <ListItem.Text
        onPress={() => {
          useNotebookContext.setState((p) => ({ ...p, notebookID: item._id }));
          router.navigate("/(tabs)");
        }}
      >
        {item.title}
      </ListItem.Text>
      <TouchableOpacity
        onPressIn={() => {
          SheetGroup.open("notebookDetail", item._id);
        }}
      >
        <MaterialCommunityIcons
          name="dots-horizontal"
          color={$text}
          size={16}
        />
      </TouchableOpacity>
    </ListItem>
  );
}

function NoteBookAll({
  currentNotebookID,
}: {
  currentNotebookID: string | undefined;
}) {
  const isSelected = currentNotebookID === undefined;
  const { $text } = usePlatte();

  return (
    <ListItem
      animation="quick"
      bg={isSelected ? "$color4" : "$color1"}
      icon={() => (
        <MaterialCommunityIcons name="note-text" color={$text} size={24} />
      )}
    >
      <ListItem.Text
        onPress={() => {
          useNotebookContext.setState((p) => ({ ...p, notebookID: undefined }));
          router.navigate("/(tabs)");
        }}
      >
        All notes
      </ListItem.Text>
      <TouchableOpacity
        onPressIn={() => {
          SheetGroup.open("newNotebook");
        }}
      >
        <MaterialCommunityIcons name="plus" color={$text} size={16} />
      </TouchableOpacity>
    </ListItem>
  );
}

export default DrawerComponent;
