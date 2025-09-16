// components/CustomDrawer.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function CustomDrawer(props: any) {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View style={styles.logoContainer}>
        <LinearGradient
          colors={["#DC2626", "#2563EB"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconWrapper}
        >
          <View style={styles.iconBackground}>
            <MaterialCommunityIcons
              name="cards-spade-outline"
              size={50}
              color="white"
            />
          </View>
        </LinearGradient>
        <Text style={styles.title}>Hand & Foot</Text>
      </View>

      <View style={{ flex: 1 }}>
        <DrawerItemList {...props} />
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: "center",
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#f4f4f4",
  },
  iconWrapper: {
    width: 78,
    height: 78,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  iconBackground: {
    width: 64,
    height: 64,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#b91c1c",
  },
});
