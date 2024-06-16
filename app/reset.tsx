import { View, Text, Input, H3, XStack, Button } from "tamagui";
import { useState } from "react";
import pb from "../pb";
import { router } from "expo-router";
import { useMutation } from "@tanstack/react-query";

type Props = {};

const Reset = (props: Props) => {
  const [email, setEmail] = useState("");
  const mutation = useMutation({
    mutationFn: async () => {
      try {
        return await pb.from("users").requestPasswordReset(email);
      } catch (error) {
        throw error;
      }
    },
  });

  return (
    <View f={1} ai="center" jc="center" gap="$4">
      <H3>Reset your password</H3>
      <Input
        placeholder="Enter your email to reset password"
        w="80%"
        overflow="scroll"
        value={email}
        onChangeText={setEmail}
      />
      <Text color="$color11" theme={mutation.error ? "red" : undefined}>
        {mutation.data === true
          ? "Reset email already sent to this email"
          : mutation.error?.message}
      </Text>
      <XStack gap="$4">
        <Button theme="active" onPress={() => mutation.mutate()}>
          request reset
        </Button>
        <Button onPress={() => router.back()}>back</Button>
      </XStack>
    </View>
  );
};

export default Reset;
