import { useTheme } from "tamagui";

export function usePlatte() {
  const theme = useTheme();
  return {
    $background: theme.background.get(),
    $activecolor: theme.color11.get(),
    $text: theme.color12.get(),
  };
}
