import { Redirect, Tabs } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useSession } from "../../pb";
import { usePlatte } from "../../themes/usePlatte";
import { elevationHiddenStyle } from "../../utils/elevationHiddenStyle";
import HomeHeader from "../../components/homeHeader";

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
        tabBarLabel: () => null,
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
            <MaterialIcons name="home-filled" size={32} color={color} />
          ),
          header: (props) => <HomeHeader {...props} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="settings" size={32} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
