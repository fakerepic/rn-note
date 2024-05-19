import { Theme } from "@react-navigation/native";
import { useColorScheme } from "react-native";
import { useTheme } from "tamagui";

export function useNavigationTheme() {
  const theme = useTheme();
  const systemColor = useColorScheme();
  return {
    dark: systemColor === "dark",
    colors: {
      primary: theme.color11.get(),
      background: theme.background.get(),
      card: theme.background.get(),
      text: theme.color12.get(),
      border: theme.color4.get(),
      notification: theme.color6.get(),
    },
  } as Theme;
}
