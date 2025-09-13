import React from "react";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

interface CardHeaderProps {
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function CardHeader({
  children,
  style,
  textStyle,
}: CardHeaderProps) {
  return (
    <View style={[styles.header, style]}>
      <Text style={textStyle}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 8, // equivalent to Tailwind's mb-2
  },
});
