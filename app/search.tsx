import { FlatList } from "react-native";
import { H4, Separator, View } from "tamagui";
import { useFind } from "use-pouchdb";
import Animated, { FadeIn } from "react-native-reanimated";

import NoteItem from "../components/noteItem";
import { useSearchStore } from "../zustand/search";
import { useQuery } from "@tanstack/react-query";
import pb from "../pb";
import { useEffect, useMemo } from "react";

type AIResult = {
  id: string;
  title: string;
  text: string;
}[];

type MergedAIResult = {
  id: string;
  title: string;
  texts: string[];
}[];

export default function SearchDemo() {
  const searchKey = useSearchStore((state) => state.searchKey);
  const { docs } = useFind<{ title: string }>({
    index: {
      fields: ["_id", "type"],
      name: "main-index"
    },
    selector: {
      _id: { $gt: null },
      type: "note",
      text: { $regex: searchKey ? searchKey : undefined },
    },
    fields: ["_id", "title"],
  });

  const useAI = useSearchStore((state) => state.useAI);
  const { data } = useQuery({
    queryKey: ["search", searchKey],
    enabled: useAI && !!searchKey,
    queryFn: async ({ queryKey }) => {
      const [, searchKey] = queryKey;
      const res = await pb.send("/ai/search", {
        body: {
          similarity_top_k: 4,
          query: searchKey,
        },
        query: {
          user_id: pb.authStore.model?.id,
        },
        method: "POST",
      });
      return res.sources as AIResult;
    },
    staleTime: 10000,
  });

  const mergedAIresp = useMemo(() => {
    // merge the AI results (based on the same note id)
    if (useAI && data) {
      const merged: MergedAIResult = [];
      data.forEach((item) => {
        const existing = merged.find((m) => m.id === item.id);
        if (existing) {
          existing.texts.push(item.text);
        } else {
          merged.push({ id: item.id, title: item.title, texts: [item.text] });
        }
      });
      return merged;
    }
    return [];
  }, [useAI, data]);

  useEffect(() => {
    if (useAI) {
      pb.send("ai/refresh", {
        query: { user_id: pb.authStore.model?.id },
        method: "POST",
      });
    }
  }, [useAI]);

  return (
    <View f={1} jc="center" bg="$background">
      <H4
        px="$4"
        py="$2"
        animation="slow"
        color={useAI ? "$color11" : "$color12"}
      >
        {useAI ? "AI suggested pieces:" : "Text search results:"}
      </H4>
      {!useAI ? (
        <FlatList
          data={docs}
          ItemSeparatorComponent={() => <Separator />}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeIn.delay(30 * index)}>
              <NoteItem {...item} />
            </Animated.View>
          )}
        />
      ) : (
        <FlatList
          data={mergedAIresp}
          keyExtractor={(item, index) => item.id + index}
          ItemSeparatorComponent={() => <Separator />}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeIn.delay(30 * index)}>
              <NoteItem {...{ ...item, _id: item.id, texts: item.texts }} showDetail />
            </Animated.View>
          )}
        />
      )}
    </View>
  );
}
