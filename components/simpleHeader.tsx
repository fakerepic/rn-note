import { View } from "tamagui";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { usePlatte } from "../themes/usePlatte";

export const SimpleHeader = () => {
  const { $text } = usePlatte();
  const { top } = useSafeAreaInsets();
  return (
    <View bg="$background">
      <View px="$4" py="$4" mt={top}>
        <TouchableOpacity onPress={router.back}>
          <MaterialIcons name="arrow-back" size={24} color={$text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
