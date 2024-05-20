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
} from "tamagui";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import pb, { logout, useAuthRefresh, useUserModel } from "../../pb";
import { useMemo, useRef, useState } from "react";
import { RefreshControl } from "react-native";

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
        <H4 mt="$4">Setting Group Test</H4>
        <ListItem br="$4">Moon</ListItem>
        <ListItem br="$4">Sun</ListItem>
        <H4 mt="$4">App Control</H4>
        <ListItem br="$4" title="Dummy test" />
        <ListItem
          br="$4"
          theme="red"
          title="Sign out"
          onPress={logout}
          icon={<Ionicons name="log-out" size={16} />}
        ></ListItem>
      </View>
    </ScrollView>
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
  const [name, setName] = useState<string>("");
  const inputRef = useRef<Input>(null);

  const updateName = async () => {
    if (!name) {
      setName(userModel.name);
      inputRef.current?.focus();
      return;
    } else {
      await pb.from("users").update(userModel?.id, { name: name });
      setName("");
    }
  };

  return (
    <XStack gap="$2" ai="center" h="$4" jc="space-between">
      {name ? (
        <Input
          editable={name !== ""}
          ref={inputRef}
          borderWidth={0}
          value={name}
          autoFocus
          maxLength={20}
          onChangeText={setName}
        ></Input>
      ) : (
        <Text fos="$4">
          {userModel?.name || <Text color="$color6">Set your name</Text>}
        </Text>
      )}
      <Button
        circular
        size="$3"
        onPress={updateName}
        icon={
          name !== "" ? (
            <MaterialIcons name="done" size={16} />
          ) : (
            <MaterialIcons name="edit" size={16} />
          )
        }
      />
    </XStack>
  );
}
