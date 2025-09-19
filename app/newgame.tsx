import { Player } from "@/entities/all";
import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
// import { createPageUrl } from "@/utils";

// Plus,
// UserPlus,

export default function newgame() {
  const router = useRouter();
  const [gameName, setGameName] = useState("");
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [existingPlayers, setExistingPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);

  const players: Player[] = [
    {
      id: "1",
      name: "Alice",
      total_score: 1200,
      games_played: 15,
      games_won: 5,
    },
    {
      id: "2",
      name: "Bob",
      total_score: 950,
      games_played: 12,
      games_won: 3,
    },
    {
      id: "3",
      name: "Charlie",
      total_score: 800,
      games_played: 10,
      games_won: 2,
    },
  ];

  useEffect(() => {
    loadExistingPlayers();
  }, []);

  const loadExistingPlayers = async () => {
    try {
      // const players = await Player.list("name");
      const playerNames = players.map((player) => player);
      setExistingPlayers(playerNames);
    } catch (error) {
      console.error("Error loading players:", error);
    }
  };

  const addNewPlayer = async () => {
    if (!newPlayerName.trim()) return;

    try {
      // const player = await Player.create({ name: newPlayerName.trim() });
      // setExistingPlayers([...existingPlayers, player]);
      // setSelectedPlayers([...selectedPlayers, player]);
      // setNewPlayerName("");
    } catch (error) {
      console.error("Error creating player:", error);
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
    // if (!gameName.trim() || selectedPlayers.length < 2) return;
    // setLoading(true);
    // try {
    //   const gameData = {
    //     name: gameName,
    //     players: selectedPlayers.map((player) => ({
    //       player_id: player.id,
    //       name: player.name,
    //       total_score: 0,
    //       rounds: [],
    //     })),
    //     current_round: 1,
    //     status: "active",
    //   };
    //   const game = await Game.create(gameData);
    //   navigate(createPageUrl(`Game?id=${game.id}`));
    // } catch (error) {
    //   console.error("Error starting game:", error);
    // } finally {
    //   setLoading(false);
    // }
  };

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
                  <Text style={styles.cardTitle2}>Add Players</Text>
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
                      {/* <UserPlus width={16} height={16} color="#fff" /> */}
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Existing Players */}
                <View>
                  <Text style={styles.label2}>Choose Existing Players</Text>
                  <ScrollView style={styles.playerList2}>
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
                  </ScrollView>
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
    fontSize: 14,
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
    gap: 8,
  },
  cardTitle2: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2563eb",
  },
  cardContent2: {
    gap: 24,
  },
  label2: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  inputRow2: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
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
    maxHeight: 320,
  },
  emptyBox2: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
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
