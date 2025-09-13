import React from "react";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

interface CardContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function CardContent({
  children,
  style,
  textStyle,
}: CardContentProps) {
  return (
    <View style={style}>
      <Text style={[styles.text, textStyle]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 14, // text-sm
    color: "#4B5563", // gray-600
    textAlign: "center",
  },
});
