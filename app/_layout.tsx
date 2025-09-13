import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import { SafeAreaProvider } from "react-native-safe-area-context";

type DrawerIconProps = { color: string; size: number };

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Drawer
        screenOptions={{
          headerTitleAlign: "center",
          headerTintColor: "#010000",
          headerTitleStyle: { fontSize: 25, fontWeight: "bold" },
          headerStyle: { backgroundColor: "#f8f8f8" },
          drawerActiveTintColor: "#b91c1c", // red-700
          drawerInactiveTintColor: "#374151", // gray-700
          drawerStyle: { backgroundColor: "#fff7f7" }, // red-50
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            title: "Home",
            drawerLabel: "Home",
            drawerIcon: ({ color, size }: DrawerIconProps) => (
              <MaterialCommunityIcons name="home" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="tutorial"
          options={{
            title: "Tutorial",
            drawerLabel: "Tutorial",
            drawerIcon: ({ color, size }: DrawerIconProps) => (
              <MaterialCommunityIcons
                name="book-open-page-variant"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="newgame"
          options={{
            title: "New Game",
            drawerLabel: "New Game",
            drawerIcon: ({ color, size }: DrawerIconProps) => (
              <MaterialCommunityIcons
                name="play-circle-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="history"
          options={{
            title: "Game History",
            drawerLabel: "History",
            drawerIcon: ({ color, size }: DrawerIconProps) => (
              <MaterialCommunityIcons
                name="trophy-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />
      </Drawer>
    </SafeAreaProvider>
  );
}
