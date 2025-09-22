import { Game, GamePlayer, Player } from "@/entities/all";
import { EvilIcons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const [games, setGames] = useState<Game[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const activeGames = games.filter((game) => game.status === "active");
  const completedGames = games.filter((game) => game.status === "completed");
  const topPlayer = players[0];
  const db = useSQLiteContext();

  // const loadData = async () => {
  //   try {
  //     const [playersResult, gamesResult] = await Promise.all([
  //       db.getAllAsync<Player>("SELECT * FROM players ORDER BY name"),
  //       db.getAllAsync<Game>("SELECT * FROM games ORDER BY name"),
  //     ]);
  //     setPlayers(playersResult);
  //     setGames(gamesResult);
  //     console.log("Players from DB:", playersResult);
  //     console.log("Games from DB:", gamesResult);
  //   } catch (error) {
  //     console.error("Error loading data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  //
  const loadGamesWithPlayers = async () => {
    setLoading(true);
    try {
      // Step 1: Get all games
      const rawGames = await db.getAllAsync<Game>(
        "SELECT * FROM games ORDER BY created_at DESC"
      );

      // Step 2: Get all players
      const players = await db.getAllAsync<Player>(
        "SELECT * FROM players ORDER BY name"
      );
      setPlayers(players);

      // Step 3: Get all gameplayers
      const rawGamePlayers = await db.getAllAsync<GamePlayer>(
        "SELECT * FROM gameplayers"
      );

      // Step 4: Attach players to their respective games
      const gamesWithPlayers = rawGames.map((game) => {
        const players = rawGamePlayers.filter((gp) => gp.game_id === game.id);
        return { ...game, players };
      });

      setGames(gamesWithPlayers);
      setPlayers(players);

      console.log("Loaded games with players:", gamesWithPlayers);
    } catch (error) {
      console.error("Error loading games:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // loadData();
      loadGamesWithPlayers();
    }, [])
  );

  console.log(activeGames.length);

  const deleteGame = async (gameId: string) => {
    try {
      await db.runAsync("DELETE FROM games WHERE id = ?", gameId);
      setGames((prev) => prev.filter((p) => p.id !== gameId));
    } catch (error) {
      console.error("Error deleting game:", error);
    }
  };

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
        <View style={styles.screen}>
          <View style={styles.heroContainer}>
            <LinearGradient
              colors={["#DC2626", "#2563EB"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconWrapper}
            >
              <View style={styles.iconBackground}>
                <MaterialCommunityIcons
                  name="cards-spade-outline"
                  size={50}
                  color="white"
                />
              </View>
            </LinearGradient>

            <Text style={styles.title}>Hand & Foot</Text>
            <Text style={styles.subtitle}>
              Learn the classic card game and keep perfect scores with friends
              and family
            </Text>

            <View style={styles.buttonGroup}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push("/newgame")}
              >
                <LinearGradient
                  colors={["#DC2626", "#B91C1C"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.button, styles.buttonGradient]}
                >
                  <Feather
                    name="play"
                    size={20}
                    color="white"
                    style={styles.iconSpacing}
                  />
                  <Text style={styles.buttonText}>Start New Game</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push("/tutorial")}
                style={[styles.button2, styles.buttonOutline]}
              >
                <Feather
                  name="book-open"
                  size={20}
                  color="black"
                  style={styles.iconSpacing}
                />
                <Text style={styles.buttonAltText}>Learn the Rules</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.grid}>
            <LinearGradient
              colors={["#f0fdf4", "#dcfce7"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.card, styles.greenBorder]}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.greenTitle}>Total Games</Text>
                <EvilIcons
                  name="trophy"
                  size={50}
                  fontWeight="bold"
                  color="green"
                  marginBottom={8}
                />
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.greenCount}>{games.length}</Text>
                <Text style={styles.greenSubtext}>
                  {completedGames.length} completed, {activeGames.length} active
                </Text>
              </View>
            </LinearGradient>

            <LinearGradient
              colors={["#eff6ff", "#dbeafe"]} // blue-50 to blue-100
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.card, styles.blueBorder]}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.blueTitle}>Players</Text>
                <Feather
                  name="users"
                  size={32}
                  fontWeight="bold"
                  color="#3B82F6"
                  marginRight={6}
                />
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.blueCount}>{players.length}</Text>
                <Text style={styles.blueSubtext}>Registered players</Text>
              </View>
            </LinearGradient>

            <LinearGradient
              colors={["#faf5ff", "#f3e8ff"]} // purple-50 to purple-100
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.card, styles.purpleBorder]}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.purpleTitle}>Champion</Text>
                <MaterialCommunityIcons
                  name="crown-outline"
                  size={48}
                  // fontWeight="bold"
                  color="#9333ea"
                  marginBottom={6}
                />
              </View>

              {/* Content */}
              {topPlayer ? (
                <View style={{ marginTop: 16, marginBottom: 10 }}>
                  <Text
                    style={{
                      fontSize: 28,
                      fontWeight: "bold",
                      color: "#9333ea", // purple-500
                    }}
                  >
                    {topPlayer.name}
                  </Text>
                  <Text style={{ color: "#9F7AEA", fontSize: 14 }}>
                    {topPlayer.games_won} wins
                  </Text>
                </View>
              ) : (
                <View style={{ marginTop: 16, marginBottom: 10 }}>
                  <Text style={{ color: "#9F7AEA", fontSize: 16 }}>
                    No games yet
                  </Text>
                </View>
              )}
            </LinearGradient>
          </View>

          {/* Recent Games */}

          <View style={styles.dashboardContainer}>
            {/* Active Games Card */}
            <View style={styles.dashboardCard}>
              <View style={styles.dashboardCardHeader}>
                <Feather name="clock" size={24} color="#B7791F" />
                <Text style={styles.cardTitle}>Active Games</Text>
              </View>
              {activeGames.length > 0 ? (
                <View style={styles.gameList}>
                  {activeGames.map((game) => {
                    const leader =
                      Array.isArray(game.players) && game.players.length > 0
                        ? game.players.reduce((prev, current) =>
                            (current.total_score ?? 0) > (prev.total_score ?? 0)
                              ? current
                              : prev
                          )
                        : null;

                    return (
                      <View key={game.id} style={styles.activeGameCard}>
                        <View>
                          <Text style={styles.gameName}>
                            {game.name || "Untitled Game"}
                          </Text>
                          <Text style={styles.gameMeta}>
                            Round {game.current_round ?? "?"} •{" "}
                            {game.players?.length ?? 0} players
                          </Text>
                          {leader && (
                            <Text style={styles.leaderText}>
                              Leader: {leader.name} ({leader.total_score} pts)
                            </Text>
                          )}
                        </View>
                        <View style={styles.statusContainer}>
                          <View style={styles.statusBadge}>
                            <Text style={styles.statusText}>In Progress</Text>
                          </View>
                          <TouchableOpacity
                            style={styles.continueButton}
                            activeOpacity={0.8}
                            onPress={() => router.push(`/game/${game.id}`)}
                          >
                            <Text style={styles.continueText}>Continue</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.continueButton,
                              { backgroundColor: "#fef2f2" },
                            ]}
                            activeOpacity={0.8}
                            onPress={() => deleteGame(game.id)}
                          >
                            <Text style={styles.continueText}>Delete</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })}
                </View>
              ) : (
                <View style={styles.emptyState}>
                  <Feather name="clock" size={62} color="#9CA3AF" />
                  <Text style={styles.emptyText}>No active games</Text>
                  <TouchableOpacity
                    style={styles.startButton}
                    activeOpacity={0.8}
                    onPress={() => router.push("/newgame")}
                  >
                    <Text style={styles.startText}>Start a Game</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Recent Results Card */}
            <View style={styles.dashboardCard}>
              <View style={styles.dashboardCardHeader}>
                <Feather name="trending-up" size={24} color="#2B6CB0" />
                <Text style={styles.cardTitle}>Recent Results</Text>
              </View>
              {completedGames.length > 0 ? (
                <View style={styles.resultList}>
                  {completedGames.map((game) => {
                    const winner = game.players?.find(
                      (p) => p.id === game.winner_id
                    );
                    return (
                      <View key={game.id} style={styles.resultCard}>
                        <View>
                          <Text style={styles.gameName}>
                            {game.name || "Untitled Game"}
                          </Text>
                          {game.created_at && (
                            <Text style={styles.gameMeta}>
                              {format(new Date(game.created_at), "MMM d, yyyy")}
                            </Text>
                          )}
                        </View>
                        <View style={{ alignItems: "flex-end" }}>
                          <View style={styles.completedBadge}>
                            <Text style={styles.completedText}>Completed</Text>
                          </View>
                          {winner && (
                            <Text style={styles.winnerText}>
                              Winner: {winner.name}
                            </Text>
                          )}
                        </View>
                      </View>
                    );
                  })}
                </View>
              ) : (
                <View style={styles.emptyState}>
                  <EvilIcons name="trophy" size={82} color="#9CA3AF" />
                  <Text style={styles.emptyText}>No completed games yet</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  screen: {
    minHeight: Dimensions.get("window").height,
    padding: 16,
  },
  heroContainer: {
    alignItems: "center",
    marginTop: 16,
    marginBottom: 48,
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
  iconBackground: {
    width: 64,
    height: 64,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  title: {
    marginTop: 12,
    fontSize: 48,
    fontWeight: "bold",
    color: "#1f2937", // gray-800
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 22,
    color: "#4B5563", // gray-600
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 28,
  },
  buttonGroup: {
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
  },
  buttonGradient: {
    backgroundColor: "#DC2626",
  },
  buttonOutline: {
    backgroundColor: "#F8FAFC", // slate-50
  },
  buttonAltText: {
    fontSize: 20,
    color: "black",
    fontWeight: "bold",
  },
  iconSpacing: {
    marginRight: 12,
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
  grid: {
    flexDirection: "column",
    gap: 28,
    marginBottom: 36,
  },
  card: {
    borderRadius: 12,
    padding: 32,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardBody: {
    marginTop: 16,
    marginBottom: 10,
  },
  greenBorder: {
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  blueBorder: {
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  purpleBorder: {
    borderWidth: 1,
    borderColor: "#e9d5ff",
  },
  greenTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#065f46",
  },
  greenCount: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#064e3b",
  },
  greenSubtext: {
    fontSize: 14,
    color: "#047857",
  },
  blueTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#2563eb",
    marginTop: 10,
  },
  blueCount: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2563eb",
    marginTop: 6,
  },
  blueSubtext: {
    fontSize: 14,
    color: "#3B82F6",
  },
  purpleTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#9333ea",
  },
  dashboardContainer: {
    flexDirection: "column",
    gap: 32,
    marginBottom: 42,
  },
  dashboardCard: {
    backgroundColor: "#F8FAFC", // slate-50
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#E5E7EB", // gray-200
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  dashboardCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  gameList: {
    flexDirection: "column",
    gap: 12,
    marginTop: 16,
  },
  activeGameCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF7ED", // orange-50
    borderColor: "#FED7AA", // orange-200
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  gameName: {
    fontWeight: "600",
    fontSize: 16,
  },
  gameMeta: {
    fontSize: 14,
    color: "#4B5563", // gray-600
  },
  leaderText: {
    fontSize: 12,
    color: "#6B7280", // gray-500
    marginTop: 4,
  },
  statusContainer: {
    alignItems: "flex-end",
  },
  statusBadge: {
    backgroundColor: "#FFEDD5", // orange-100
    borderColor: "#FDBA74", // orange-300
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 12,
    color: "#C2410C", // orange-800
  },
  continueButton: {
    marginTop: 12,
    backgroundColor: "#FED7AA",
    borderColor: "#FDBA74",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  continueText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#C2410C",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 18,
    color: "#9CA3AF",
    marginTop: 12,
    fontWeight: "bold",
  },
  startButton: {
    marginTop: 16,
    backgroundColor: "#F8FAFC",
    borderColor: "#D1D5DB",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  startText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  resultList: {
    flexDirection: "column",
    gap: 16,
    paddingBottom: 24,
  },
  resultCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#EFF6FF", // blue-50
    borderColor: "#BFDBFE", // blue-200
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  completedBadge: {
    backgroundColor: "#DBEAFE",
    borderColor: "#93C5FD",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  completedText: {
    fontSize: 12,
    color: "#1D4ED8",
  },
  winnerText: {
    fontSize: 14,
    color: "#4B5563",
    marginTop: 4,
  },
});
