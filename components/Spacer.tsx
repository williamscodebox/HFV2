import React from "react";
import { View, ViewStyle } from "react-native";

interface SpacerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  spacing?: number;
}

export function VerticalStack({ children, spacing = 24 }: SpacerProps) {
  const childrenArray = React.Children.toArray(children);

  return (
    <>
      {childrenArray.map((child, index) => (
        <View
          key={index}
          style={{
            marginBottom: index === childrenArray.length - 1 ? 0 : spacing,
          }}
        >
          {child}
        </View>
      ))}
    </>
  );
}
