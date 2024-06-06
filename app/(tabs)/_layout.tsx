import { Redirect } from "expo-router";
import { Drawer } from "expo-router/drawer";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useSession, useUserModel } from "../../pb";
import { usePlatte } from "../../themes/usePlatte";
import { elevationHiddenStyle } from "../../utils/elevationHiddenStyle";
import { Link } from "expo-router";
import { View } from "tamagui";
import { DrawerToggleButton } from "@react-navigation/drawer";
import DrawerComponent from "../../components/drawer";
import { usePouchSync } from "../../pouchdbs/custom-hooks";
import { useWindowDimensions } from "react-native";

export default function TabLayout() {
  const { loggedIn, verified } = useSession();
  const { $background, $toolbar, $text } = usePlatte();
  const { name } = useUserModel();
  const dimensions = useWindowDimensions()

  usePouchSync();

  if (!loggedIn || !verified) {
    return <Redirect href={"/unlogged"} />;
  }

  return (
    <Drawer
      drawerContent={(props) => <DrawerComponent {...props} />}
      screenOptions={{
        drawerType: dimensions.width >= 768 ? "permanent" : "front",
        drawerStyle: { width: 240 },
        headerStyle: {
          ...elevationHiddenStyle,
          backgroundColor: $background,
        },
        headerTintColor: $text,
        headerLeftContainerStyle: {
          marginLeft: 16,
        },
        headerLeft: (props) => (
          <View ml="$1">
            <DrawerToggleButton tintColor={props.tintColor} />
          </View>
        ),
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: "Notes",
          headerTitle: `${name}'s notes`,
          headerStyle: {
            ...elevationHiddenStyle,
            backgroundColor: $toolbar,
          },
          drawerIcon: (props) => (
            <MaterialIcons name="library-books" size={24} color={props.color} />
          ),
          headerRight: (props) => (
            <Link href={"/search"} asChild>
              <View mr="$3">
                <MaterialIcons
                  name="search"
                  size={24}
                  color={props.tintColor}
                />
              </View>
            </Link>
          ),
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          title: "Settings",
          drawerIcon: (props) => (
            <MaterialIcons name="settings" size={24} color={props.color} />
          ),
        }}
      />
    </Drawer>
  );
}
