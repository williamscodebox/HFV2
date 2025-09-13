import { StyleSheet, Text, View } from "react-native";

interface BadgeProps {
  value: string | number;
  size: number;
  height: number;
  width: number;
  color: string;
  textColor: string;
}

const Badge = ({
  value,
  size = 20,
  height = 20,
  width = 60,
  color = "#EF4444",
  textColor = "#fff",
}: BadgeProps) => {
  if (!value) return null;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: color,
          height: height,
          width: width,
          borderRadius: size / 2,
        },
      ]}
    >
      <Text style={[styles.text, { color: textColor, fontSize: size * 0.65 }]}>
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    // position: "absolute",
    top: -4,
    right: -4,
    paddingHorizontal: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontWeight: "bold",
  },
});

export default Badge;
