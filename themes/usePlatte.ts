import { useTheme } from "tamagui";

export function usePlatte() {
  const theme = useTheme();
  return {
    $background: theme.background.get(),
    $activecolor: theme.color11.get(),
    $inactivecolor: theme.shadowColor.get(),
    $text: theme.color12.get(),
    $toolbar: theme.color3.get(),
  };
}
