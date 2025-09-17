import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
//   Award,
//   Calendar,
//   Clock,
//   Crown,
//   Target,
//   TrendingUp,
//   Trophy,
//   Users,

export default function history() {
  const [games, setGames] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    // loadData();
    setLoading(false);
  }, []);

  const loadData = async () => {};

  // const completedGames = Array.isArray(games)
  //   ? games.filter((g) => g.status === "completed")
  //   : [];
  // const activeGames = Array.isArray(games)
  //   ? games.filter((g) => g.status === "active")
  //   : [];

  // if (loading) {
  //   return (
  //     <LinearGradient
  //       colors={["#faf5ff", "#eff6ff"]} // purple-50 to blue-50
  //       start={{ x: 0, y: 0 }}
  //       end={{ x: 1, y: 1 }}
  //       style={{
  //         flex: 1,
  //         padding: 32,
  //         justifyContent: "center",
  //         alignItems: "center",
  //       }}
  //     >
  //       <View className="text-center">
  //         <ActivityIndicator
  //           size="large"
  //           color="#9333ea"
  //           style={{ marginBottom: 16 }}
  //         />

  //         <Text className="text-gray-600">Loading game history...</Text>
  //       </View>
  //     </LinearGradient>
  //   );
  // }

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <LinearGradient
        colors={["#faf5ff", "#ffffff", "#eff6ff"]} // purple-50, white, blue-50
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        // className="flex-1 p-8"
      >
        {/* <View className="flex-1 p-4">
          <View className="flex-1 justify-center items-center">
            <Text className="text-3xl font-bold text-gray-900 mb-4">
              Game History
            </Text>
            <Text className="text-lg text-gray-600 text-center">
              Track your Hand & Foot achievements and statistics
            </Text>
          </View>

          {/* Stats Overview 
          <View className="flex flex-col md:flex-row gap-6 mb-8">
            <LinearGradient
              colors={["#f0fdf4", "#dcfce7"]} // green-50 to green-100
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderWidth: 1,
                borderColor: "#bbf7d0", // green-200
                borderRadius: 8,
                padding: 16,
              }}
            >
              <View className="flex flex-row items-center justify-between">
                <CardTitle className="text-green-800 text-sm">
                  <Text>Total Games</Text>
                </CardTitle>
                {/* Trophy  
              </View>
              <View>
                <View className="text-2xl font-bold text-green-900">
                  <Text>{games.length}</Text>
                </View>
              </View>
            </LinearGradient>

            <View className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <View className="flex flex-row items-center justify-between">
                <CardTitle className="text-blue-800 text-sm">
                  <Text>Completed</Text>
                </CardTitle>
                {/* Target  
              </View>
              <View>
                <View className="text-2xl font-bold text-blue-900">
                  <Text>{completedGames.length}</Text>
                </View>
              </View>
            </View>

            <View className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <View className="flex flex-row items-center justify-between">
                <CardTitle className="text-orange-800 text-sm">
                  <Text>Active Games</Text>
                </CardTitle>
                {/* Clock 
              </View>
              <View>
                <View className="text-2xl font-bold text-orange-900">
                  <Text>{activeGames.length}</Text>
                </View>
              </View>
            </View>

            <View className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <View className="flex flex-row items-center justify-between">
                <CardTitle className="text-purple-800 text-sm">
                  <Text>Total Players</Text>
                </CardTitle>
                {/* Users  /> 
              </View>
              <View>
                <View className="text-2xl font-bold text-purple-900">
                  <Text>{players.length}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* ************************************************ 
        </View> */}
      </LinearGradient>
    </ScrollView>
  );
}
