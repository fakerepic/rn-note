import { ThemeProvider } from "@react-navigation/native";
import { SplashScreen, Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { TamaguiProvider } from "tamagui";

import "../tamagui-web.css";

import { config } from "../tamagui.config";
import { useFonts } from "expo-font";
import { useEffect } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import PouchProvider from "../pouchdbs/provider";
import { useNavigationTheme } from "../themes/useNavigationTheme";
import { useColorStore } from "../zustand/color";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const [interLoaded, interError] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  useEffect(() => {
    if (interLoaded || interError) {
      // Hide the splash screen after the fonts have loaded (or an error was returned) and the UI is ready.
      SplashScreen.hideAsync();
    }
  }, [interLoaded, interError]);

  if (!interLoaded && !interError) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <CustomTamaguiProvider>
        <CustomThemeProvider>
          <PouchProvider>
            <RootLayoutNav />
          </PouchProvider>
        </CustomThemeProvider>
      </CustomTamaguiProvider>
    </QueryClientProvider>
  );
}

function RootLayoutNav() {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false, headerBlurEffect: "regular" }}
      />
      <Stack.Screen name="unlogged" options={{ headerShown: false }} />
      <Stack.Screen
        name="edit"
        options={{ headerShown: true, gestureEnabled: false }}
      />
      <Stack.Screen name="new_note" options={{ presentation: "formSheet" }} />
    </Stack>
  );
}

function CustomTamaguiProvider({ children }: { children: any }) {
  const colorScheme = useColorScheme();
  const systemColor = useColorStore((s) => s.systemColor);
  const tamaguiColor = useColorStore((s) => s.tamaguiColor);
  return (
    <TamaguiProvider
      config={config}
      defaultTheme={`${systemColor === "system" ? colorScheme : systemColor}_${tamaguiColor}`}
    >
      {children}
    </TamaguiProvider>
  );
}

function CustomThemeProvider({ children }: { children: any }) {
  const navTheme = useNavigationTheme();
  return <ThemeProvider value={navTheme}>{children}</ThemeProvider>;
}
