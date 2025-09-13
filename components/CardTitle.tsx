import React from "react";
import { StyleSheet, Text, TextStyle } from "react-native";

interface CardTitleProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export default function CardTitle({ children, style }: CardTitleProps) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18, // Tailwind's text-lg
    fontWeight: "600", // Tailwind's font-semibold
    color: "#1F2937", // Tailwind's gray-800
  },
});
