import { Link, Redirect, Tabs } from "expo-router";
import { TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSession } from "../../pb";
import { usePlatte } from "../../themes/usePlatte";
import { elevationHiddenStyle } from "../../utils/elevationHiddenStyle";

export default function TabLayout() {
  const { loggedIn, verified } = useSession();
  const { $background, $activecolor } = usePlatte();

  if (!loggedIn || !verified) {
    return <Redirect href={"/unlogged"} />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: $activecolor,
        tabBarStyle: {
          ...elevationHiddenStyle,
          borderTopWidth: 0,
          backgroundColor: $background,
          borderTopColor: $background,
          paddingBottom: 8,
          minHeight: 70,
        },
        headerStyle: {
          ...elevationHiddenStyle,
          backgroundColor: $background,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerTitle: "",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-sharp" size={32} color={color} />
          ),
          headerRight: () => (
            <Link href="/new_note" asChild>
              <TouchableOpacity style={{ marginRight: 12 }}>
                <Ionicons name="add" size={32} color={$activecolor} />
              </TouchableOpacity>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings-sharp" size={32} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
