import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

interface CardHeaderProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function CardHeader({ children, style }: CardHeaderProps) {
  return <View style={[styles.header, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 8, // equivalent to Tailwind's mb-2
  },
});
