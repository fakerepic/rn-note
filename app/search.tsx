import { FlatList } from "react-native";
import { H4, Separator, View } from "tamagui";
import { useFind } from "use-pouchdb";
import Animated, { FadeIn } from "react-native-reanimated";

import NoteItem from "../components/noteItem";
import { useSearchStore } from "../zustand/search";

export default function SearchDemo() {
  const searchKey = useSearchStore((state) => state.searchKey);
  const { docs } = useFind<{ title: string }>({
    index: {
      fields: ["_id", "type"],
    },
    selector: {
      _id: { $gt: null },
      type: "note",
      text: { $regex: searchKey ? searchKey : undefined },
    },
    fields: ["_id", "title"],
  });

  return (
    <View f={1} jc="center" bg="$background">
      <H4 px="$4" py="$2">
        Results:
      </H4>
      <FlatList
        data={docs}
        ItemSeparatorComponent={() => <Separator />}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeIn.delay(30 * index)}>
            <NoteItem {...item} />
          </Animated.View>
        )}
      />
    </View>
  );
}
