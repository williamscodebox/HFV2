import { Game, Player } from "@/entities/all";
import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

export default function newgame() {
  const router = useRouter();
  const [gameName, setGameName] = useState("");
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [existingPlayers, setExistingPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  const db = useSQLiteContext();

  useEffect(() => {
    loadExistingPlayers();
    loadExistingGames();
  }, []);

  const loadExistingPlayers = async () => {
    try {
      const players: Player[] = await db.getAllAsync(
        "SELECT * FROM players ORDER BY name"
      );
      setExistingPlayers(players);
      console.log("Players from DB:", players);
    } catch (error) {
      console.error("Error loading players:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadExistingGames = async () => {
    setLoading(true);
    try {
      const games: Game[] = await db.getAllAsync(
        "SELECT * FROM games ORDER BY name"
      );
      console.log("Gamess from DB:", games);
    } catch (error) {
      console.error("Error loading players:", error);
    } finally {
      setLoading(false);
    }
  };

  const addNewPlayer = async () => {
    const name = newPlayerName.trim();
    if (!name) return;

    const isDuplicate = existingPlayers.some(
      (p) => p.name.toLowerCase() === name.toLowerCase()
    );
    if (isDuplicate) {
      console.warn("Player with this name already exists");
      return;
    }

    try {
      const player: Player = {
        id: uuidv4(),
        name,
      };

      await db.runAsync(
        "INSERT INTO players (id, name, total_score, games_played, games_won) VALUES (?, ?, ?, ?, ?)",
        player.id,
        player.name,
        0,
        0,
        0
      );

      setExistingPlayers([...existingPlayers, player]);
      setSelectedPlayers([...selectedPlayers, player]);
      setNewPlayerName("");
    } catch (error) {
      console.error("Error creating player:", error);
    }
  };

  const deletePlayer = async (playerId: string) => {
    try {
      await db.runAsync("DELETE FROM players WHERE id = ?", playerId);
      setExistingPlayers((prev) => prev.filter((p) => p.id !== playerId));
      setSelectedPlayers((prev) => prev.filter((p) => p.id !== playerId));
    } catch (error) {
      console.error("Error deleting player:", error);
    }
  };

  const togglePlayerSelection = (player: Player) => {
    if (selectedPlayers.find((p) => p.id === player.id)) {
      setSelectedPlayers(selectedPlayers.filter((p) => p.id !== player.id));
    } else {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  const removeSelectedPlayer = (playerId: string) => {
    setSelectedPlayers(selectedPlayers.filter((p) => p.id !== playerId));
  };

  const startGame = async () => {
    if (!gameName.trim() || selectedPlayers.length < 2) return;
    setLoading(true);
    try {
      const gameId = uuidv4();
      const timestamp = new Date().toISOString();

      const gameData: Game = {
        id: gameId,
        name: gameName,
        players: selectedPlayers.map((player) => ({
          id: player.id,
          game_id: gameId,
          name: player.name,
          total_score: 0,
          rounds: [],
          games_played: player.games_played,
          games_won: player.games_won,
        })),
        current_round: 1,
        status: "active",
        created_at: timestamp,
        updated_at: timestamp,
      };
      // const game = await Game.create(gameData);
      await db.runAsync(
        `INSERT INTO games (id, name, current_round, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`,
        gameData.id,
        gameData.name,
        gameData.current_round ?? 1,
        gameData.status ?? "active",
        gameData.created_at ?? new Date().toISOString(),
        gameData.updated_at ?? new Date().toISOString()
      );

      for (const player of gameData.players) {
        await db.runAsync(
          `INSERT INTO gameplayers (id, game_id, player_id, total_score, games_played, games_won) VALUES (?, ?, ?, ?, ?, ?)`,
          uuidv4(),
          gameData.id,
          player.id,
          0,
          player.games_played ?? 0,
          player.games_won ?? 0
        );
      }
      console.log("Game created with ID:", gameData.id);
      router.push({
        pathname: "/game/[id]",
        params: { id: gameData.id },
      });
    } catch (error) {
      console.error("Error starting game:", error);
    } finally {
      setLoading(false);
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

          <Text className="text-gray-600">Loading...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <LinearGradient
        colors={["#f0fdf4", "#ffffff", "#eff6ff"]} // green-50 → white → blue-50
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.screen}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.iconWrapper}>
              <LinearGradient
                colors={["#059669", "#2563eb"]} // green-600 → blue-600
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.iconBackground}
              >
                <Ionicons
                  name="game-controller-outline"
                  size={32}
                  color="#fff"
                />
              </LinearGradient>
            </View>

            <Text style={styles.title}>Start New Game</Text>
            <Text style={styles.subtitle}>
              Set up your Hand & Foot game with players and begin scoring
            </Text>
          </View>

          <View style={styles.grid}>
            {/* Game Setup */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleRow}>
                  <Feather name="play" size={24} color="#059669" />
                  <Text style={styles.cardTitle}>Game Details</Text>
                </View>
              </View>

              <View style={styles.cardContent}>
                {/* Game Name Input */}
                <View>
                  <Text style={styles.label}>Game Name</Text>
                  <TextInput
                    style={styles.input}
                    value={gameName}
                    onChangeText={(text) => setGameName(text)}
                    placeholder="Enter game name (e.g., 'Friday Night Game')"
                  />
                </View>

                {/* Selected Players */}
                <View>
                  <Text style={styles.playerLabel}>
                    Selected Players ({selectedPlayers.length})
                  </Text>
                  <View style={styles.playerList}>
                    {selectedPlayers.length === 0 ? (
                      <View style={styles.emptyPlayerBox}>
                        <Text style={styles.emptyPlayerText}>
                          No players selected yet
                        </Text>
                      </View>
                    ) : (
                      selectedPlayers.map((player) => (
                        <View key={player.id} style={styles.playerCard}>
                          <Text style={styles.playerName}>{player.name}</Text>
                          <TouchableOpacity
                            onPress={() => deletePlayer(player.id)}
                          >
                            <Feather name="trash-2" size={24} color="black" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => removeSelectedPlayer(player.id)}
                          >
                            <Feather name="trash-2" size={24} color="#DC2626" />
                          </TouchableOpacity>
                        </View>
                      ))
                    )}
                  </View>

                  {selectedPlayers.length < 2 && (
                    <Text style={styles.warningText}>
                      You need at least 2 players to start a game
                    </Text>
                  )}
                </View>

                {/* Start Game Button */}
                <TouchableOpacity
                  style={[
                    styles.startButton,
                    {
                      backgroundColor:
                        !gameName.trim() ||
                        selectedPlayers.length < 2 ||
                        loading
                          ? "#A7F3D0"
                          : "#059669",
                    },
                  ]}
                  disabled={
                    !gameName.trim() || selectedPlayers.length < 2 || loading
                  }
                  onPress={startGame}
                >
                  <Feather name="play" size={24} color="white" />
                  <Text style={styles.startButtonText}>
                    {loading ? "Starting Game..." : "Start Game"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Player Selection */}

            {/* ************************************Working on this part***************************************** */}

            <View style={styles.card2}>
              <View style={styles.cardHeader2}>
                <View style={styles.cardTitleRow2}>
                  <Feather name="users" size={24} color="#2563eb" />
                  <Text style={styles.cardTitle}>Add Players</Text>
                </View>
              </View>

              <View style={styles.cardContent2}>
                {/* Add New Player */}
                <View>
                  <Text style={styles.label2}>Create New Player</Text>
                  <View style={styles.inputRow2}>
                    <TextInput
                      style={styles.input2}
                      value={newPlayerName}
                      onChangeText={setNewPlayerName}
                      placeholder="Enter player name"
                      onSubmitEditing={addNewPlayer}
                    />
                    <TouchableOpacity
                      onPress={addNewPlayer}
                      disabled={!newPlayerName.trim()}
                      style={styles.addButton2}
                    >
                      <Feather name="user-plus" size={24} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Existing Players */}
                <View>
                  <Text style={styles.label2}>Choose Existing Players</Text>
                  <View style={styles.playerList2}>
                    {existingPlayers.length === 0 ? (
                      <View style={styles.emptyBox2}>
                        <Feather name="users" size={24} color="#9CA3AF" />
                        <Text style={styles.emptyText2}>
                          No existing players
                        </Text>
                        <Text style={styles.emptySubtext2}>
                          Create your first player above
                        </Text>
                      </View>
                    ) : (
                      existingPlayers.map((player) => {
                        const isSelected = selectedPlayers.some(
                          (p) => p.id === player.id
                        );
                        return (
                          <TouchableOpacity
                            key={player.id}
                            onPress={() => togglePlayerSelection(player)}
                            style={[
                              styles.playerCard2,
                              isSelected
                                ? styles.playerCardSelected2
                                : styles.playerCardDefault2,
                            ]}
                          >
                            <View style={styles.playerRow2}>
                              <View>
                                <Text style={styles.playerName2}>
                                  {player.name}
                                </Text>
                                <View style={styles.badgeRow2}>
                                  <Text style={styles.badge2}>
                                    {player.games_played || 0} games
                                  </Text>
                                  <Text style={styles.badge2}>
                                    {player.games_won || 0} wins
                                  </Text>
                                </View>
                              </View>
                              {isSelected && (
                                <View style={styles.selectedBadge2}>
                                  <Text style={styles.selectedBadgeText2}>
                                    Selected
                                  </Text>
                                </View>
                              )}
                            </View>
                          </TouchableOpacity>
                        );
                      })
                    )}
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    minHeight: "100%",
    padding: 26,
  },
  container: {
    maxWidth: 768,
    alignSelf: "center",
    marginBottom: 36,
  },
  header: {
    marginTop: 18,
    alignItems: "center",
    marginBottom: 32,
  },
  iconWrapper: {
    marginBottom: 16,
  },
  iconBackground: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#111827", // gray-900
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: "#4B5563", // gray-600
    textAlign: "center",
    lineHeight: 28,
  },
  grid: {
    flexDirection: "column",
    gap: 32,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardHeader: {
    marginBottom: 12,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "black",
    marginTop: 8,
    marginBottom: 12,
  },
  cardContent: {
    gap: 28,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  input: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  playerLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  playerList: {
    gap: 12,
  },
  emptyPlayerBox: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  emptyPlayerText: {
    color: "#6B7280",
    fontSize: 16,
  },
  playerCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
  },
  playerName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#065F46",
  },
  warningText: {
    fontSize: 12,
    color: "#EA580C",
    marginTop: 8,
  },
  startButton: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  startButtonText: {
    marginLeft: 16,
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
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
  cardTitleRow2: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardContent2: {
    gap: 24,
  },
  label2: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  inputRow2: {
    flexDirection: "row",
    gap: 8,
    marginTop: 0,
    marginBottom: 12,
  },
  input2: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  addButton2: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  playerList2: {
    // maxHeight: 320,
  },
  emptyBox2: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
  },
  emptyText2: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 8,
  },
  emptySubtext2: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  playerCard2: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  playerCardDefault2: {
    backgroundColor: "#fff",
    borderColor: "#E5E7EB",
    borderWidth: 1,
  },
  playerCardSelected2: {
    backgroundColor: "#D1FAE5",
    borderColor: "#86EFAC",
    borderWidth: 1,
  },
  playerRow2: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  playerName2: {
    fontWeight: "500",
    fontSize: 16,
    color: "#065F46",
  },
  badgeRow2: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  badge2: {
    fontSize: 12,
    color: "#6B7280",
  },
  selectedBadge2: {
    backgroundColor: "#059669",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  selectedBadgeText2: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
