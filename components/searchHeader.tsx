import { Input, Switch, Text, View, XStack } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

import { usePlatte } from "../themes/usePlatte";
import { useSearchStore } from "../zustand/search";

export const SearchHeader = () => {
  const { $text } = usePlatte();
  const { top } = useSafeAreaInsets();

  const [searchKey, setSearchKey] = useSearchStore((state) => [
    state.searchKey,
    state.setSearchKey,
  ]);
  const [useAI, setUseAI] = useSearchStore((state) => [
    state.useAI,
    state.setUseAI,
  ]);

  return (
    <View bg="$background">
      <XStack px="$4" pt="$4" mt={top} jc="space-between" ai="center" gap="$4">
        <TouchableOpacity onPress={router.back}>
          <MaterialIcons name="arrow-back" size={24} color={$text} />
        </TouchableOpacity>
        <Input
          br="$8"
          autoFocus
          flexGrow={1}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Search your note..."
          value={searchKey}
          onChangeText={setSearchKey}
        />
        <XStack jc="space-between" ai="center" gap="$2">
          <Text animation="slow" color={useAI ? "$color11" : "$color6"}>
            AI
          </Text>
          <Switch size="$2" defaultChecked={useAI} onCheckedChange={setUseAI}>
            <Switch.Thumb animation="quick" />
          </Switch>
        </XStack>
      </XStack>
    </View>
  );
};
