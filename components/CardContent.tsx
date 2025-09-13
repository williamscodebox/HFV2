import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

interface CardContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function CardContent({ children, style }: CardContentProps) {
  return <View style={style}>{children}</View>;
}

const styles = StyleSheet.create({});
