import {
  ListItem,
  Text,
  View,
  H4,
  Avatar,
  Button,
  ScrollView,
  Input,
  XStack,
  Label,
  Theme,
} from "tamagui";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import pb, { logout, useAuthRefresh, useUserModel } from "../../pb";
import { useEffect, useMemo, useState } from "react";
import { RefreshControl, useColorScheme } from "react-native";
import { FlatList } from "react-native";
import {
  AvailableSystemColors,
  AvailableTamaguiColors,
  useColorStore,
} from "../../zustand/color";
import { cleanNotebookContext } from "../../zustand/notebookCtx";

export default function TabTwoScreen() {
  const { refetch, isLoading } = useAuthRefresh();
  return (
    <ScrollView
      bg="$background"
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }
    >
      <View f={1} gap="$2" px="$4">
        <H4 mt="$4">Profile</H4>
        <View ai="center" mb="$2" gap="$2">
          <AvatarPicker />
          <NameEditor />
          <Text fos="$2">{pb.authStore.model?.email}</Text>
        </View>
        <H4 mt="$4">Appearance</H4>
        <Label>Theme Color</Label>
        <TamaguiColorSwitcher />
        <Label>System Color</Label>
        <SystemColorSwitcher />
        <H4 mt="$4">App Control</H4>
        <ListItem
          br="$4"
          theme="red"
          title="Sign out"
          onPress={() => {
            logout()
            cleanNotebookContext()
          }}
          icon={<Ionicons name="log-out" size={16} />}
        ></ListItem>
      </View>
    </ScrollView>
  );
}

function SystemColorSwitcher() {
  const setTheme = useColorStore((s) => s.setSystemColor);
  const systemColor = useColorStore((s) => s.systemColor);
  const color = useColorScheme();
  const inverse = (c: any) => {
    if (c === "system") {
      return systemColor !== c && color !== systemColor;
    } else {
      if (systemColor === "system") return c !== color;
      else return c !== systemColor;
    }
  };
  return (
    <FlatList
      data={AvailableSystemColors}
      horizontal
      renderItem={({ item }) => {
        return (
          <ListItem
            br="$8"
            w="auto"
            h="$4"
            mx="$2"
            themeInverse={inverse(item)}
            bc={item === systemColor ? "$color8" : "$background"}
            borderWidth={1}
            title={item}
            onPress={() => setTheme(item)}
          />
        );
      }}
    />
  );
}

function TamaguiColorSwitcher() {
  const setTheme = useColorStore((s) => s.setTamaguiColor);
  const tamaguiColor = useColorStore((s) => s.tamaguiColor);
  return (
    <FlatList
      data={AvailableTamaguiColors}
      horizontal
      renderItem={({ item }) => {
        return (
          <Theme name={item}>
            <ListItem
              circular
              h="$4"
              w="$4"
              mx="$1"
              bg="$color4"
              bc={item === tamaguiColor ? "$color8" : "$background"}
              borderWidth={1}
              onPress={() => setTheme(item)}
            />
          </Theme>
        );
      }}
    />
  );
}

function AvatarPicker() {
  const userModel = useUserModel();
  const avatarUrl = useMemo(
    () => pb.files.getUrl(userModel as any, userModel?.avatar as string),
    [userModel],
  );

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (result.canceled) {
      return;
    }
    const asset = result.assets[0];

    const updateData = new FormData();
    updateData.append("avatar", {
      uri: asset.uri,
      name: asset.uri.split("/").pop() || "avatar",
      type: asset.mimeType,
    } as any);
    try {
      await pb.collection("users").update(pb.authStore.model?.id, updateData);
    } catch (e) {
      console.log("e", JSON.stringify(e, null, 2));
    }
  };

  return (
    <Avatar circular size="$8" borderWidth="$1" borderColor="$color6">
      <Avatar.Image src={avatarUrl} onPress={pickImage} />
      <Avatar.Fallback backgroundColor="$shadowColorFocus" />
    </Avatar>
  );
}

function NameEditor() {
  const userModel = useUserModel();
  const [name, setName] = useState<string>();
  const [editable, setEditable] = useState<boolean>(false);

  const updateName = async () => {
    if (!editable) {
      setName(userModel.name);
      setEditable(true);
      return;
    } else {
      await pb.from("users").update(userModel?.id, { name: name });
      setEditable(false);
    }
  };

  useEffect(() => setName(userModel.name), [userModel]);

  return (
    <XStack gap="$2" ai="center" h="$4" jc="space-between">
      <Input
        bg={editable ? "$background" : "$colorTransparent"}
        editable={editable}
        autoFocus
        minWidth="$2"
        bw={editable ? 1 : 0}
        value={name}
        maxLength={20}
        onChangeText={setName}
        placeholder="Set your name"
      ></Input>
      <Button
        circular
        size="$3"
        onPress={updateName}
        icon={
          editable ? (
            <MaterialIcons name="done" size={16} />
          ) : (
            <MaterialIcons name="edit" size={16} />
          )
        }
      />
    </XStack>
  );
}
