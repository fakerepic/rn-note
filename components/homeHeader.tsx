import { View, XStack } from "tamagui";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabHeaderProps } from "@react-navigation/bottom-tabs";
type Props = BottomTabHeaderProps;

export default function HomeHeader(props: Props) {
  const { top } = useSafeAreaInsets();
  return (
    <View mt={top}>
      <XStack px="$4" my="$4" justifyContent="space-between">
        <TouchableOpacity>
          <Ionicons
            name="menu"
            size={28}
            color={props.options.tabBarActiveTintColor}
          />
        </TouchableOpacity>
        <Link href="/search" asChild>
          <TouchableOpacity>
            <Ionicons
              name="search"
              size={28}
              color={props.options.tabBarActiveTintColor}
            />
          </TouchableOpacity>
        </Link>
      </XStack>
    </View>
  );
}
