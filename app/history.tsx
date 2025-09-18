import CardHeader from "@/components/CardHeader";
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
  TouchableOpacity,
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
  name: string;
  status: "active" | "completed" | "pending";
  players: Player[];
  current_round: number;
  created_date: string;
  winner_id?: string;
  // other fields...
};
type Player = {
  player_id: string;
  name: string;
  total_score?: number;
  games_played?: number;
  games_won?: number;
};

export default function history() {
  const [games, setGames] = useState<Game[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [completedGames, activeGames] = Array.isArray(games)
    ? [
        games.filter((g) => g.status === "completed"),
        games.filter((g) => g.status === "active"),
      ]
    : [[], []];

  const loadData = async () => {
    setTimeout(() => {
      const mockGames: Game[] = [
        {
          id: "1",
          name: "Game 1",
          status: "active",
          current_round: 2,
          created_date: "2025-09-01T10:00:00Z",
          players: [
            { player_id: "1", name: "Alice", total_score: 120 },
            { player_id: "2", name: "Bob", total_score: 95 },
          ],
        },
        {
          id: "2",
          name: "Game 2",
          status: "completed",
          current_round: 4,
          created_date: "2025-08-28T14:30:00Z",
          winner_id: "3",
          players: [
            { player_id: "3", name: "Charlie", total_score: 200 },
            { player_id: "4", name: "Dana", total_score: 180 },
          ],
        },
        {
          id: "3",
          name: "Game 3",
          status: "completed",
          current_round: 3,
          created_date: "2025-08-20T09:15:00Z",
          winner_id: "5",
          players: [
            { player_id: "5", name: "Eve", total_score: 150 },
            { player_id: "6", name: "Frank", total_score: 140 },
          ],
        },
      ];

      const mockPlayers: Player[] = [
        { player_id: "1", name: "Alice", games_won: 10 },
        { player_id: "2", name: "Bob", games_won: 8 },
        { player_id: "3", name: "Charlie", games_won: 12 },
        { player_id: "4", name: "Dana", games_won: 7 },
        { player_id: "5", name: "Eve", games_won: 15 },
        { player_id: "6", name: "Frank", games_won: 5 },
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
                  size={44}
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

          <View style={styles.grid2}>
            {/* Recent Games */}
            {/* Games List */}
            <View style={styles.gamesList}>
              <View style={styles.card2}>
                <View style={styles.cardHeader2}>
                  <Feather name="calendar" size={24} color="#3B82F6" />
                  <Text style={styles.cardTitle}>Recent Games</Text>
                </View>
                <View style={styles.cardContent}>
                  {games.length === 0 ? (
                    <View style={styles.emptyState}>
                      <Text style={styles.emptyTitle}>No Games Yet</Text>
                      <Text style={styles.emptySubtitle}>
                        Start your first Hand & Foot game to see history here!
                      </Text>
                    </View>
                  ) : (
                    games.map((game) => (
                      <TouchableOpacity
                        key={game.id}
                        style={styles.gameCard}
                        activeOpacity={0.8}
                        onPress={() => {
                          setSelectedGame(game);
                          console.log("gameSelected", game);
                        }}
                      >
                        <View style={styles.gameHeader}>
                          <Text style={styles.gameName}>{game.name}</Text>
                          <Text
                            style={
                              game.status === "completed"
                                ? styles.badgeCompleted
                                : styles.badgeActive
                            }
                          >
                            {game.status === "completed"
                              ? "Completed"
                              : "Active"}
                          </Text>
                        </View>
                        <View style={styles.gameMeta}>
                          <Feather name="users" size={18} color="#676d77ff" />
                          <Text>{game.players.length} players</Text>
                          <Text>Round {game.current_round}</Text>
                          <Text>
                            {format(new Date(game.created_date), "MMM d, yyyy")}
                          </Text>
                        </View>
                        {game.status === "completed" && game.winner_id && (
                          <View style={styles.winnerRow}>
                            <Text style={styles.winnerIcon}>
                              <MaterialCommunityIcons
                                name="crown-outline"
                                size={24}
                                color="#CA8A04"
                                style={{ marginRight: 14, marginTop: -18 }}
                              />
                            </Text>
                            <Text style={styles.winnerText}>
                              Winner:{" "}
                              {
                                game.players.find(
                                  (p) => p.player_id === game.winner_id
                                )?.name
                              }
                            </Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    ))
                  )}
                </View>
              </View>
            </View>

            {/* Player Leaderboard */}
            <View style={{ flex: 1, marginTop: -16, marginBottom: 32 }}>
              <View style={styles.leaderboardContainer}>
                <CardHeader>
                  <View style={styles.cardTitleContainer}>
                    <Feather name="trending-up" size={24} color="#000000ff" />
                    <Text style={styles.cardTitleText}>Player Leaderboard</Text>
                  </View>
                </CardHeader>
                {players.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No players yet</Text>
                  </View>
                ) : (
                  players.slice(0, 10).map((player, index) => {
                    const badgeStyle =
                      index === 0
                        ? styles.badgeGold
                        : index === 1
                        ? styles.badgeSilver
                        : index === 2
                        ? styles.badgeBronze
                        : styles.badgeDefault;

                    return (
                      <View key={player.player_id} style={styles.playerRow}>
                        <View style={styles.playerInfo}>
                          <View style={[styles.rankBadge, badgeStyle]}>
                            <Text style={styles.rankText}>{index + 1}</Text>
                          </View>
                          <View>
                            <Text style={styles.playerName}>{player.name}</Text>
                            <View style={styles.playerStats}>
                              <Text style={styles.statText}>
                                {player.games_played || 0} games
                              </Text>
                              <Text style={styles.statText}>
                                {player.games_won || 0} wins
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View style={styles.scoreBlock}>
                          <Text style={styles.scoreText}>
                            {player.total_score || 0}
                          </Text>
                          <Text style={styles.statText}>points</Text>
                        </View>
                      </View>
                    );
                  })
                )}
              </View>

              {/* Work from below here .....  ************************************************  ---> Work from below here */}
            {/* Game Details Modal-like section needs to be finished */}

              {/* Game Details Modal-like section */}
               {selectedGame && (
                <Card className="shadow-lg mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <Text>Game Details</Text>
                       <Button
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
            </View>
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
    marginBottom: 32,
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
    padding: 26,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 32,
  },
  cardHeader2: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
    marginTop: 6,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginTop: -5,
  },
  cardContent: {
    gap: 12,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4B5563",
    marginTop: 32,
    marginBottom: 38,
  },
  emptySubtitle: {
    textAlign: "center",
    fontSize: 18,
    color: "#6B7280",
    marginTop: 24,
  },
  gameCard: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 18,
    gap: 6,
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
    // marginRight: 12,
  },
  gameMeta: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 12,
    color: "#6B7280",
  },
  winnerRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  winnerIcon: {
    marginRight: 2,
    marginLeft: -4,
  },
  winnerText: {
    fontSize: 16,
    color: "#CA8A04",
  },
  leaderboardContainer: {
    padding: 26,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  emptyState2: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
  },
  playerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  playerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  rankText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  badgeGold: {
    backgroundColor: "#FEF3C7",
  },
  badgeSilver: {
    backgroundColor: "#F3F4F6",
  },
  badgeBronze: {
    backgroundColor: "#FFE4B5",
  },
  badgeDefault: {
    backgroundColor: "#EFF6FF",
  },
  playerName: {
    fontWeight: "600",
    fontSize: 16,
  },
  playerStats: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  statText: {
    fontSize: 12,
    color: "#6B7280",
  },
  scoreBlock: {
    alignItems: "flex-end",
  },
  scoreText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  cardTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12, // If gap doesn't work, use marginRight on the icon
    marginTop: 5,
    marginBottom: 22,
  },
  cardTitleText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937", // Tailwind's gray-900
  },
  card3: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardHeader3: {
    marginBottom: 12,
  },
  cardTitleRow3: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle3: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton3: {
    fontSize: 18,
    color: '#6B7280',
  },
  cardContent3: {
    gap: 16,
  },
  section3: {
    marginBottom: 16,
  },
  sectionTitle3: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  metaBlock3: {
    gap: 4,
  },
  metaText3: {
    fontSize: 14,
    color: '#4B5563',
  },
  scoreRow3: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  playerInfo3: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  crown3: {
    fontSize: 16,
    color: '#CA8A04', // yellow-600
    marginRight: 4,
  },
  scoreText3: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
