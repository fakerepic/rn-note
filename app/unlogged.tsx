import { Input as TextInput, TextArea, Spinner, H2, Text } from "tamagui";
import { useForm, Controller } from "react-hook-form";
import { FormState } from "../utils/FormStateRuducer";
import pb, { useSession } from "../pb";
import { Redirect } from "expo-router";

import { View, H3, Button, XStack } from "tamagui";
import React, { useEffect } from "react";

export default function UnLogged() {
  const { loggedIn, verified } = useSession();
  if (loggedIn && verified) {
    return <Redirect href="/(tabs)" />;
  }
  return loggedIn ? <WaitForVerification /> : <SignInOrSignUp />;
}

function SignInOrSignUp() {
  const { control, handleSubmit, setError } = useForm<{
    email: string;
    password: string;
  }>();

  const onPress = handleSubmit(async (formData) => {
    try {
      await pb.from("users").authWithPassword(
        formData.email, //
        formData.password,
      );
    } catch (error: any) {
      setError("root", { message: error.response.message });
    }
  });

  const register = handleSubmit(async (formData) => {
    try {
      await pb.from("users").create({
        email: formData.email,
        password: formData.password,
        passwordConfirm: formData.password,
      });
      await pb.from("users").authWithPassword(
        formData.email, //
        formData.password,
      );
    } catch (error: any) {
      setError("root", { message: error.response.message });
    }
  });

  return (
    <View
      flex={1}
      justifyContent="center"
      alignItems="center"
      gap="$4"
      bg="$background"
    >
      <H2>NOTEBOOK</H2>
      <Controller
        control={control}
        rules={{ required: true }}
        name="email"
        render={({ field }) => (
          <TextInput
            value={field.value}
            onChangeText={field.onChange}
            placeholder="Email"
            autoCapitalize="none"
            autoCorrect={false}
            w="80%"
            maw="$20"
          />
        )}
      />
      <Controller
        control={control}
        rules={{ required: true, minLength: 9 }}
        name="password"
        render={({ field }) => (
          <TextInput
            value={field.value}
            onChangeText={field.onChange}
            placeholder="Password"
            secureTextEntry
            w="80%"
            maw="$20"
          />
        )}
      />
      <FormState control={control}>
        {(formState) => (
          <>
            <XStack gap="$4">
              <Button
                icon={formState.isSubmitting ? <Spinner /> : undefined}
                onPress={onPress}
                animation="medium"
                animateOnly={["opacity"]}
                disabledStyle={{ opacity: 0.3 }}
                disabled={!formState.isValid || formState.isSubmitting}
                chromeless
                w="$10"
              >
                sign in
              </Button>
              <Button
                onPress={register}
                animation="medium"
                animateOnly={["opacity"]}
                disabledStyle={{ opacity: 0.3 }}
                disabled={!formState.isValid || formState.isSubmitting}
                chromeless
                w="$10"
              >
                sign up
              </Button>
            </XStack>

            {formState.isSubmitSuccessful && (
              <TextArea theme="green" mx="$2" editable={false}>
                {pb.authStore.token}
              </TextArea>
            )}

            {formState.errors.root && (
              <TextArea theme="red" mx="$2" editable={false}>
                {formState.errors.root.message}
              </TextArea>
            )}
          </>
        )}
      </FormState>
    </View>
  );
}

function WaitForVerification() {
  useEffect(() => {
    pb.from("users").requestVerification(pb.authStore.model?.email);
  }, []);
  return (
    <View
      flex={1}
      justifyContent="center"
      alignItems="center"
      gap="$4"
      bg="$background"
    >
      <H3>Please verify your email</H3>
      <Text>
        A verification email has been sent to{" "}
        {pb.authStore.model?.email ?? "your email"}
      </Text>
      <XStack gap="$4">
        <Button theme="active" onPress={() => pb.from("users").authRefresh()}>
          I have verified
        </Button>
        <Button onPress={() => pb.authStore.clear()}>back</Button>
      </XStack>
    </View>
  );
}
