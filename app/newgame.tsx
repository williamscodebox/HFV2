import { Player } from "@/entities/all";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
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
    {
      id: "4",
      name: "Alice",
      total_score: 1200,
      games_played: 15,
      games_won: 5,
    },
    {
      id: "5",
      name: "Bob",
      total_score: 950,
      games_played: 12,
      games_won: 3,
    },
    {
      id: "6",
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
    <LinearGradient
      colors={["#f0fdf4", "#ffffff", "#eff6ff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.screen}
    >
      <FlatList
        data={existingPlayers}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View style={styles.container}>
            <Text style={styles.title}>Start New Game</Text>

            {/* Game Name Input */}
            <Text style={styles.label}>Game Name</Text>
            <TextInput
              style={styles.input}
              value={gameName}
              onChangeText={setGameName}
              placeholder="Enter game name"
            />

            {/* Selected Players */}
            <Text style={styles.label}>
              Selected Players ({selectedPlayers.length})
            </Text>
            {selectedPlayers.length === 0 ? (
              <Text style={styles.empty}>No players selected yet</Text>
            ) : (
              selectedPlayers.map((player) => (
                <View key={player.id} style={styles.selectedPlayer}>
                  <Text style={styles.playerName}>{player.name}</Text>
                  <TouchableOpacity
                    onPress={() => removeSelectedPlayer(player.id)}
                  >
                    <Feather name="trash-2" size={20} color="#DC2626" />
                  </TouchableOpacity>
                </View>
              ))
            )}
            {selectedPlayers.length < 2 && (
              <Text style={styles.warning}>
                You need at least 2 players to start a game
              </Text>
            )}

            {/* Add New Player */}
            <Text style={styles.label}>Create New Player</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={newPlayerName}
                onChangeText={setNewPlayerName}
                placeholder="Enter player name"
                onSubmitEditing={addNewPlayer}
              />
              <TouchableOpacity
                onPress={addNewPlayer}
                disabled={!newPlayerName.trim()}
                style={styles.addButton}
              >
                <Feather name="user-plus" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Choose Existing Players</Text>
          </View>
        }
        renderItem={({ item }) => {
          const isSelected = selectedPlayers.some((p) => p.id === item.id);
          return (
            <TouchableOpacity
              onPress={() => togglePlayerSelection(item)}
              style={[
                styles.playerCard,
                isSelected
                  ? styles.playerCardSelected
                  : styles.playerCardDefault,
              ]}
            >
              <Text style={styles.playerName}>{item.name}</Text>
              <Text style={styles.badge}>{item.games_played || 0} games</Text>
              <Text style={styles.badge}>{item.games_won || 0} wins</Text>
              {isSelected && <Text style={styles.selected}>Selected</Text>}
            </TouchableOpacity>
          );
        }}
        ListFooterComponent={
          <TouchableOpacity
            onPress={startGame}
            disabled={!gameName.trim() || selectedPlayers.length < 2 || loading}
            style={[
              styles.startButton,
              {
                backgroundColor:
                  !gameName.trim() || selectedPlayers.length < 2 || loading
                    ? "#A7F3D0"
                    : "#059669",
              },
            ]}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.startButtonText}>Start Game</Text>
            )}
          </TouchableOpacity>
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text>No existing players</Text>
            <Text>Create your first player above</Text>
          </View>
        }
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    // minHeight: "100%",
    // padding: 26,
  },
  container: {
    padding: 16,
    backgroundColor: "#F0FDF4",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  addButton: {
    backgroundColor: "#2563EB",
    padding: 12,
    borderRadius: 8,
  },
  selectedPlayer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#ECFDF5",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  warning: {
    color: "#EA580C",
    fontSize: 12,
    marginTop: 8,
  },
  playerCard: {
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 4,
  },
  playerCardDefault: {
    backgroundColor: "#fff",
    borderColor: "#E5E7EB",
    borderWidth: 1,
  },
  playerCardSelected: {
    backgroundColor: "#D1FAE5",
    borderColor: "#86EFAC",
    borderWidth: 1,
  },
  playerName: {
    fontWeight: "600",
    fontSize: 16,
  },
  badge: {
    fontSize: 12,
    color: "#6B7280",
  },
  selected: {
    fontSize: 12,
    color: "#059669",
    fontWeight: "bold",
  },
  startButton: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  startButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  emptyBox: {
    padding: 24,
    alignItems: "center",
  },
  empty: {
    color: "#6B7280",
    marginTop: 8,
  },
});
