import Card from "@/components/Card";
import CardContent from "@/components/CardContent";
import CardHeader from "@/components/CardHeader";
import CardTitle from "@/components/CardTitle";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
//   Award,
//   Calendar,
//   Clock,
//   Crown,
//   Target,
//   TrendingUp,
//   Trophy,
//   Users,

type Game = {
  id: string;
  status: "active" | "completed" | "pending";
  // other fields...
};

export default function history() {
  const [games, setGames] = useState<Game[]>([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState(null);
  const [completedGames, activeGames] = Array.isArray(games)
    ? [
        games.filter((g) => g.status === "completed"),
        games.filter((g) => g.status === "active"),
      ]
    : [[], []];

  useEffect(() => {
    // loadData();
    setLoading(false);
  }, []);

  const loadData = async () => {};

  if (loading) {
    return (
      <LinearGradient
        colors={["#faf5ff", "#eff6ff"]} // purple-50 to blue-50
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.loadingGradient}
      >
        <View style={styles.centered}>
          <ActivityIndicator
            size="large"
            color="#9333ea"
            style={{ marginBottom: 16 }}
          />
          <Text style={styles.loadingText}>Loading game history...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <LinearGradient
        colors={["#faf5ff", "#ffffff", "#eff6ff"]} // purple-50, white, blue-50
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Game History</Text>
            <Text style={styles.subtitle}>
              Track your Hand & Foot achievements and statistics
            </Text>
          </View>

          {/* Stats Overview  */}

          <View style={styles.grid}>
            <LinearGradient
              colors={["#f0fdf4", "#dcfce7"]} // green-50 to green-100
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.card, styles.greenBorder]}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitleGreen}>Total Games</Text>
                <MaterialCommunityIcons
                  name="trophy-outline"
                  size={24}
                  color="#047857"
                />
              </View>
              <Text style={styles.cardValueGreen}>{games.length}</Text>
            </LinearGradient>

            {/* Completed Games */}
            <LinearGradient
              colors={["#eff6ff", "#dbeafe"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.card, styles.blueBorder]}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitleBlue}>Completed</Text>
                <Feather name="target" size={24} color="#2563eb" />
              </View>
              <Text style={styles.cardValueBlue}>{completedGames.length}</Text>
            </LinearGradient>

            {/* Active Games */}
            <LinearGradient
              colors={["#fff7ed", "#ffedd5"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.card, styles.orangeBorder]}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitleOrange}>Active Games</Text>
                <Feather name="clock" size={24} color="#ea580c" />
              </View>
              <Text style={styles.cardValueOrange}>{activeGames.length}</Text>
            </LinearGradient>

            {/* Total Players */}
            <LinearGradient
              colors={["#faf5ff", "#f3e8ff"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.card, styles.purpleBorder]}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitlePurple}>Total Players</Text>
                <Feather name="users" size={24} color="#9333ea" />
              </View>
              <Text style={styles.cardValuePurple}>{players.length}</Text>
            </LinearGradient>
          </View>

          {/* Work from below here .....  ************************************************  ---> Work from below here */}
          <View className="grid lg:grid-cols-3 gap-8">
            {/* Games List */}
            <View className="lg:col-span-2">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {/* <Calendar className="w-5 h-5 text-blue-600" /> */}
                    Recent Games
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {games.length === 0 ? (
                    <View className="text-center py-12">
                      {/* <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" /> */}
                      <Text className="text-xl font-semibold text-gray-600 mb-2">
                        No Games Yet
                      </Text>
                      <Text className="text-gray-500">
                        Start your first Hand & Foot game to see history here!
                      </Text>
                    </View>
                  ) : (
                    <View className="space-y-4">
                      {games.map((game) => (
                        <View
                          key={game.id}
                          onClick={() => setSelectedGame(game)}
                          className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all"
                        >
                          <View className="flex justify-between items-start mb-2">
                            <Text className="font-semibold text-lg">
                              {game.name}
                            </Text>
                            {/* <Badge
                              className={
                                game.status === "completed"
                                  ? "bg-green-100 text-green-800 border-green-300"
                                  : "bg-orange-100 text-orange-800 border-orange-300"
                              }
                            >
                              {game.status === "completed"
                                ? "Completed"
                                : "Active"}
                            </Badge> */}
                          </View>

                          <View className="flex justify-between items-center text-sm text-gray-600">
                            <View className="flex items-center gap-4">
                              <Text className="flex items-center gap-1">
                                {/* <Users className="w-4 h-4" /> */}
                                {game.players.length} players
                              </Text>
                              <Text>Round {game.current_round}</Text>
                              <Text>
                                {format(
                                  new Date(game.created_date),
                                  "MMM d, yyyy"
                                )}
                              </Text>
                            </View>

                            {game.status === "completed" && game.winner_id && (
                              <View className="flex items-center gap-1 text-yellow-600">
                                {/* <Crown className="w-4 h-4" /> */}
                                <Text className="font-medium">
                                  {
                                    game.players.find(
                                      (p) => p.player_id === game.winner_id
                                    )?.name
                                  }
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
                </CardContent>
              </Card>
            </View>

            {/* Player Leaderboard */}
            {/* <View>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {/* <TrendingUp className="w-5 h-5 text-purple-600" /> 
                    Player Leaderboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {players.length === 0 ? (
                    <View className="text-center py-8">
                      {/* <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" /> 
                      <Text className="text-gray-500">No players yet</Text>
                    </View>
                  ) : (
                    <View className="space-y-4">
                      {players.slice(0, 10).map((player, index) => (
                        <View
                          key={player.id}
                          className="flex items-center justify-between"
                        >
                          <View className="flex items-center gap-3">
                            <View
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                index === 0
                                  ? "bg-yellow-100 text-yellow-800"
                                  : index === 1
                                  ? "bg-gray-100 text-gray-700"
                                  : index === 2
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-blue-50 text-blue-700"
                              }`}
                            >
                              {index + 1}
                            </View>
                            <View>
                              <Text className="font-semibold">{player.name}</Text>
                              <View className="flex gap-2 text-xs text-gray-500">
                                <Text>{player.games_played || 0} games</Text>
                                <Text>{player.games_won || 0} wins</Text>
                              </View>
                            </View>
                          </View>
                          <View className="text-right">
                            <Text className="font-bold">
                              {player.total_score || 0}
                            </Text>
                            <Text className="text-xs text-gray-500">points</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
                </CardContent>
              </Card>

              {/* Game Details Modal-like section 
              {selectedGame && (
                <Card className="shadow-lg mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <Text>Game Details</Text>
                      {/* <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedGame(null)}
                      >
                        ✕
                      </Button> 
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <View className="space-y-4">
                      <View>
                        <Text className="font-semibold mb-2">
                          {selectedGame.name}
                        </Text>
                        <View className="text-sm text-gray-600">
                          <Text>
                            Created:{" "}
                            {format(new Date(selectedGame.created_date), "PPP")}
                          </Text>
                          <Text>Status: {selectedGame.status}</Text>
                          <Text>Current Round: {selectedGame.current_round}</Text>
                        </View>
                      </View>

                      <View>
                        <Text className="font-semibold mb-2">Final Scores</Text>
                        <View className="space-y-2">
                          {selectedGame.players
                            .sort(
                              (a, b) =>
                                (b.total_score || 0) - (a.total_score || 0)
                            )
                            .map((player, index) => (
                              <View
                                key={player.player_id}
                                className="flex justify-between items-center"
                              >
                                <View className="flex items-center gap-2">
                                  {index === 0 &&
                                    selectedGame.status === "completed" && (
                                      // <Crown className="w-4 h-4 text-yellow-500" />
                                    )}
                                  <Text>{player.name}</Text>
                                </View>
                                <Text className="font-semibold">
                                  {player.total_score || 0}
                                </Text>
                              </View>
                            ))}
                        </View>
                      </View>
                    </View>
                  </CardContent>
                </Card>
              )}
            </View> */}
          </View>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    padding: 16,
    minHeight: Dimensions.get("window").height,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#111827", // gray-900
    marginBottom: 22,
    marginTop: 4,
  },
  subtitle: {
    fontSize: 18,
    color: "#4B5563", // gray-600
    textAlign: "center",
    lineHeight: 28,
    marginBottom: 32,
  },
  grid: {
    flexDirection: "column",
    gap: 24,
    marginBottom: 42,
  },
  card: {
    borderRadius: 12,
    padding: 26,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  cardTitleGreen: {
    fontSize: 20,
    color: "#065f46",
    fontWeight: "bold",
  },
  cardValueGreen: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#064e3b",
  },
  greenBorder: {
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  cardTitleBlue: {
    fontSize: 20,
    color: "#2563eb",
    fontWeight: "bold",
  },
  cardValueBlue: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1e3a8a",
  },
  blueBorder: {
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  cardTitleOrange: {
    fontSize: 20,
    color: "#ea580c",
    fontWeight: "bold",
  },
  cardValueOrange: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#c2410c",
  },
  orangeBorder: {
    borderWidth: 1,
    borderColor: "#fdba74",
  },
  cardTitlePurple: {
    fontSize: 20,
    color: "#9333ea",
    fontWeight: "bold",
  },
  cardValuePurple: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#6b21a8",
  },
  purpleBorder: {
    borderWidth: 1,
    borderColor: "#e9d5ff",
  },
  loadingGradient: {
    flex: 1,
    padding: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  centered: {
    alignItems: "center",
  },
  loadingText: {
    color: "#4B5563", // Tailwind's gray-600
    fontSize: 16,
  },
  grid2: {
    flexDirection: "column",
    gap: 24,
  },
  gamesList: {
    flex: 2,
  },
  card2: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardHeader2: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E3A8A",
  },
  cardContent: {
    gap: 12,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4B5563",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  gameCard: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#F9FAFB",
  },
  gameHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  gameName: {
    fontSize: 16,
    fontWeight: "600",
  },
  badgeCompleted: {
    fontSize: 12,
    color: "#065F46",
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeActive: {
    fontSize: 12,
    color: "#C2410C",
    backgroundColor: "#FFEDD5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  gameMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 12,
    color: "#6B7280",
  },
  winnerText: {
    marginTop: 6,
    fontSize: 12,
    color: "#CA8A04",
  },
});
