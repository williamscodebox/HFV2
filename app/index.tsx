import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface Player {
  id: number;
  name: string;
  games_won: number;
}

interface GamePlayer {
  player_id: number;
  name: string;
  total_score: number;
}

interface Game {
  id: number;
  name: string;
  status: "active" | "completed";
  current_round: number;
  created_date: string;
  winner_id?: number;
  players: GamePlayer[];
}

export default function HomeScreen() {
  const [games, setGames] = useState<Game[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const activeGames = games.filter((game) => game.status === "active");
  const completedGames = games.filter((game) => game.status === "completed");
  const topPlayer = players[0];
  console.log(activeGames.length);

  const loadData = async () => {
    // try {
    //   const [gamesData, playersData] = await Promise.all([
    //     Game.list("-created_date", 5),
    //     Player.list("-games_won", 5),
    //   ]);
    //   setGames(gamesData);
    //   setPlayers(playersData);
    // } catch (error) {
    //   console.error("Error loading data:", error);
    // } finally {
    // setLoading(false);
    // }

    // Simulate API delay
    setTimeout(() => {
      const mockGames: Game[] = [
        {
          id: 1,
          name: "Game 1",
          status: "active",
          current_round: 2,
          created_date: "2025-09-01T10:00:00Z",
          players: [
            { player_id: 1, name: "Alice", total_score: 120 },
            { player_id: 2, name: "Bob", total_score: 95 },
          ],
        },
        {
          id: 2,
          name: "Game 2",
          status: "completed",
          current_round: 4,
          created_date: "2025-08-28T14:30:00Z",
          winner_id: 3,
          players: [
            { player_id: 3, name: "Charlie", total_score: 200 },
            { player_id: 4, name: "Dana", total_score: 180 },
          ],
        },
        {
          id: 3,
          name: "Game 3",
          status: "completed",
          current_round: 3,
          created_date: "2025-08-20T09:15:00Z",
          winner_id: 5,
          players: [
            { player_id: 5, name: "Eve", total_score: 150 },
            { player_id: 6, name: "Frank", total_score: 140 },
          ],
        },
      ];

      const mockPlayers: Player[] = [
        { id: 1, name: "Alice", games_won: 10 },
        { id: 2, name: "Bob", games_won: 8 },
        { id: 3, name: "Charlie", games_won: 12 },
        { id: 4, name: "Dana", games_won: 7 },
        { id: 5, name: "Eve", games_won: 15 },
        { id: 6, name: "Frank", games_won: 5 },
      ];

      setGames(mockGames);
      setPlayers(mockPlayers);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    loadData();
    // setLoading(false);
  }, []);

  if (loading) {
    return (
      <LinearGradient
        colors={["#faf5ff", "#eff6ff"]} // purple-50 to blue-50
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          flex: 1,
          padding: 32,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View className="text-center">
          <ActivityIndicator
            size="large"
            color="#9333ea"
            style={{ marginBottom: 16 }}
          />

          <Text className="text-gray-600">Loading game history...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <LinearGradient
        // pointerEvents={"none"}
        style={styles.container}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        colors={["#fef2f2", "#eff6ff"]}
      >
        <View>
          <Text>Welcome</Text>
        </View>
        {/* <View className="min-h-screen p-4 md:p-8">
          <View className="">
            {/* Hero Section *
            <View className="text-center">
              <View style={styles.heroSection}>
                <LinearGradient
                  colors={["#DC2626", "#2563EB"]} // from-red-600 to-blue-600
                  start={{ x: 0, y: 0 }} // top-left
                  end={{ x: 1, y: 1 }} // bottom-right
                  style={styles.iconWrapper}
                >
                  <View className="w-16 h-16 bg-gradient-to-br from-red-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <MaterialCommunityIcons
                      name="cards-spade-outline"
                      size={50}
                      color="white"
                    />
                  </View>
                </LinearGradient>
              </View>
              <Text className="text-center text-5xl md:text-5xl font-bold text-gray-900 mb-6">
                Hand & Foot
              </Text>
              <Text className="text-center text-2xl text-gray-600 mb-8 leading-relaxed">
                Learn the classic card game and keep perfect scores with friends
                and family
              </Text>

              <View className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-12">
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    console.log("test");
                    navigation.navigate("newgame");
                  }} // 👈 matches Drawer.Screen name
                >
                  <LinearGradient
                    colors={["#DC2626", "#B91C1C"]} // red-600 to red-700
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.button}
                    className="border border-gray-400"
                  >
                    <Feather
                      name="play"
                      size={20}
                      color="white"
                      style={{ marginRight: 12 }}
                    />
                    <Text style={styles.buttonText}>Start New Game</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    console.log("test");
                    navigation.navigate("tutorial");
                  }} // 👈 matches Drawer.Screen name
                  style={styles.button2}
                  className="border border-gray-400 bg-slate-50"
                >
                  <Feather
                    name="book-open"
                    size={20}
                    color="black"
                    style={{ marginRight: 14 }}
                  />

                  <Text className="text-2xl text-black font-bold">
                    Learn the Rules
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Stats Grid 
            <View className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
              <LinearGradient
                colors={["#f0fdf4", "#dcfce7"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: 12,
                  padding: 32,
                  paddingBottom: 30,
                  shadowColor: "#000",
                  shadowOpacity: 0.1,
                  shadowRadius: 6,
                  elevation: 3,
                }}
                className="border border-green-200"
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 30,
                      fontWeight: "bold",
                      color: "#065f46",
                    }}
                  >
                    Total Games
                  </Text>
                  <EvilIcons
                    name="trophy"
                    size={50}
                    fontWeight="bold"
                    color="green"
                    marginBottom={8}
                  />
                </View>

                <View style={{ marginTop: 16, marginBottom: 6, gap: 5 }}>
                  <Text
                    style={{
                      fontSize: 28,
                      fontWeight: "bold",
                      color: "#064e3b",
                    }}
                  >
                    {games.length}
                  </Text>
                  <Text style={{ color: "#047857", fontSize: 14 }}>
                    {completedGames.length} completed, {activeGames.length}{" "}
                    active
                  </Text>
                </View>
              </LinearGradient>

              <LinearGradient
                colors={["#eff6ff", "#dbeafe"]} // blue-50 to blue-100
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: 12,
                  padding: 36,
                  shadowColor: "#000",
                  shadowOpacity: 0.1,
                  shadowRadius: 6,
                  elevation: 3,
                }}
                className="border border-blue-200"
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 30,
                      fontWeight: "bold",
                      color: "#2563eb",
                    }}
                  >
                    Players
                  </Text>
                  <Feather
                    name="users"
                    size={32}
                    fontWeight="bold"
                    color="#3B82F6"
                    marginRight={6}
                  />
                </View>

                <View style={{ marginTop: 16, marginBottom: 10, gap: 5 }}>
                  <Text
                    style={{
                      fontSize: 28,
                      fontWeight: "bold",
                      color: "#2563eb",
                    }}
                  >
                    {players.length}
                  </Text>
                  <Text style={{ color: "#3B82F6", fontSize: 14 }}>
                    Registered players
                  </Text>
                </View>
              </LinearGradient>

              <LinearGradient
                colors={["#faf5ff", "#f3e8ff"]} // purple-50 to purple-100
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: 12,
                  padding: 36,
                  shadowColor: "#000",
                  shadowOpacity: 0.1,
                  shadowRadius: 6,
                  elevation: 3,
                }}
                className="border border-purple-200"
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 30,
                      fontWeight: "bold",
                      color: "#9333ea",
                    }}
                  >
                    Champion
                  </Text>
                  <MaterialCommunityIcons
                    name="crown-outline"
                    size={48}
                    // fontWeight="bold"
                    color="#9333ea"
                    marginBottom={6}
                  />
                </View>

                {/* Content 
                {topPlayer ? (
                  <View style={{ marginTop: 16, marginBottom: 10, gap: 5 }}>
                    <Text
                      style={{
                        fontSize: 28,
                        fontWeight: "bold",
                      }}
                      className="text-purple-500"
                    >
                      {topPlayer.name}
                    </Text>
                    <Text style={{ color: "#9F7AEA", fontSize: 14 }}>
                      {topPlayer.games_won} wins
                    </Text>
                  </View>
                ) : (
                  <View style={{ marginTop: 16, marginBottom: 10, gap: 5 }}>
                    <Text style={{ color: "#9F7AEA", fontSize: 16 }}>
                      No games yet
                    </Text>
                  </View>
                )}
              </LinearGradient>
            </View>

            {/* Recent Games 

            <View className="flex flex-col gap-8 mb-8">
              <View className="shadow-xl border-2 border-gray-200 rounded-xl bg-slate-50 p-10 pb-2">
                <View>
                  <CardTitle className="flex flex-row items-center gap-4 text-lg font-bold">
                    <Feather
                      name="clock"
                      size={24}
                      color="#B7791F"
                      marginBottom={4}
                    />
                    <Text className="text-3xl font-bold">Active Games</Text>
                  </CardTitle>
                </View>
                <View className="mb-8">
                  {activeGames.length > 0 ? (
                    <View className="flex flex-col gap-3 mt-6">
                      {activeGames.map((game) => {
                        // Safely get leader if players exist
                        const leader =
                          Array.isArray(game.players) && game.players.length > 0
                            ? game.players.reduce((prev, current) =>
                                current.total_score > prev.total_score
                                  ? current
                                  : prev
                              )
                            : null;
                        return (
                          <View
                            key={game.id}
                            className="flex flex-row justify-between items-center p-4 bg-orange-50 rounded-lg border border-orange-200"
                          >
                            <View>
                              <Text className="font-semibold">
                                {game.name || "Untitled Game"}
                              </Text>
                              <Text className="text-sm text-gray-600">
                                Round {game.current_round ?? "?"} •{" "}
                                {Array.isArray(game.players)
                                  ? game.players.length
                                  : 0}{" "}
                                players
                              </Text>
                              {leader && (
                                <Text className="text-xs text-gray-500 mt-2">
                                  Leader: {leader.name} ({leader.total_score}{" "}
                                  pts)
                                </Text>
                              )}
                            </View>
                            <View>
                              <View className="bg-orange-100 border border-orange-300 rounded px-2 py-1">
                                <Text className="text-orange-800 text-xs">
                                  In Progress
                                </Text>
                              </View>
                              <View className="mt-4">
                                <TouchableOpacity
                                  className="border border-orange-300 bg-orange-200 flex-row items-center justify-center py-[6px] px-[12px] rounded-[10px] shadow-lg"
                                  activeOpacity={0.8}
                                  onPress={() => navigation.navigate("newgame")}
                                >
                                  <Text className="text-xs text-orange-800 font-bold">
                                    Continue
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  ) : (
                    <View className="items-center pt-16 pb-12">
                      <Feather name="clock" size={62} color="#9CA3AF" />
                      <Text className="text-xl text-gray-400 mt-6">
                        No active games
                      </Text>
                      <View className="mt-4">
                        <TouchableOpacity
                          style={styles.button3}
                          className="border border-gray-400 bg-slate-50"
                          activeOpacity={0.8}
                          onPress={() => navigation.navigate("newgame")}
                        >
                          <Text className="text-xl text-black font-bold">
                            Start a Game
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </View>

            <View className="shadow-xl border-2 border-gray-200 rounded-xl bg-slate-50 p-10 pb-2 mb-8">
              <View className="mb-4">
                <CardTitle className="flex flex-row items-center gap-4 text-lg font-bold">
                  <Feather
                    name="trending-up"
                    size={24}
                    color="#2B6CB0"
                    marginBottom={4}
                  />
                  <Text className="text-3xl font-bold">Recent Results</Text>
                </CardTitle>
              </View>

              <View>
                {completedGames.length > 0 ? (
                  <View className="flex flex-col gap-6 mt-3 pb-8">
                    {completedGames.map((game) => {
                      const winner = Array.isArray(game.players)
                        ? game.players.find(
                            (p) => p.player_id === game.winner_id
                          )
                        : null;

                      return (
                        <View
                          key={game.id}
                          className="flex flex-row justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200"
                        >
                          <View>
                            <Text className="font-semibold mb-1">
                              {game.name || "Untitled Game"}
                            </Text>
                            {game.created_date && (
                              <Text className="text-sm text-gray-600 mt-1">
                                {format(
                                  new Date(game.created_date),
                                  "MMM d, yyyy"
                                )}
                              </Text>
                            )}
                          </View>

                          <View className="items-end">
                            <View className="bg-blue-100 border border-blue-300 rounded px-2 py-1">
                              <Text className="text-blue-800 text-xs">
                                Completed
                              </Text>
                            </View>
                            {winner && (
                              <Text className="text-sm text-gray-600 mt-1">
                                Winner: {winner.name}
                              </Text>
                            )}
                          </View>
                        </View>
                      );
                    })}
                  </View>
                ) : (
                  <View className="items-center py-4 mb-4">
                    <EvilIcons
                      name="trophy"
                      size={82}
                      fontWeight="bold"
                      color="#9CA3AF"
                      marginBottom={18}
                    />
                    <Text className="text-gray-300 text-center text-xl font-bold">
                      No completed games yet
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View> */}
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 38,
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937", // gray-800
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  button: {
    width: 240,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  button2: {
    width: 220,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  button3: {
    width: 140,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
