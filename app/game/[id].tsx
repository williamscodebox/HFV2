import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function GamePage() {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <Text>Game ID: {id}</Text>
      {/* Load game data with this ID */}
    </View>
  );
}
