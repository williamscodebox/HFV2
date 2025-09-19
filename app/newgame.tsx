// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import { Player } from "@/entities/all";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
// import { createPageUrl } from "@/utils";

// Users,
// Plus,
// Trash2,
// Play,
// UserPlus,
// Gamepad2

export default function newgame() {
  const router = useRouter();
  const [gameName, setGameName] = useState("");
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [existingPlayers, setExistingPlayers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const players: Player[] = [
    {
      name: "Alice",
      total_score: 1200,
      games_played: 15,
      games_won: 5,
    },
    {
      name: "Bob",
      total_score: 950,
      games_played: 12,
      games_won: 3,
    },
    {
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
      const playerNames = players.map((player) => player.name);
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

  // const togglePlayerSelection = (player) => {
  //   if (selectedPlayers.find((p) => p.id === player.id)) {
  //     setSelectedPlayers(selectedPlayers.filter((p) => p.id !== player.id));
  //   } else {
  //     setSelectedPlayers([...selectedPlayers, player]);
  //   }
  // };

  // const removeSelectedPlayer = (playerId) => {
  //   setSelectedPlayers(selectedPlayers.filter((p) => p.id !== playerId));
  // };

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

          {/* <div className="grid lg:grid-cols-2 gap-8">
          {/* Game Setup 
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5 text-green-600" />
                Game Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="gameName">Game Name</Label>
                <Input
                  id="gameName"
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                  placeholder="Enter game name (e.g., 'Friday Night Game')"
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-lg font-semibold">
                  Selected Players ({selectedPlayers.length})
                </Label>
                <div className="mt-3 space-y-2">
                  {selectedPlayers.length === 0 ? (
                    <div className="text-gray-500 text-center py-4 border-2 border-dashed border-gray-200 rounded-lg">
                      No players selected yet
                    </div>
                  ) : (
                    selectedPlayers.map((player) => (
                      <div
                        key={player.id}
                        className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200"
                      >
                        <span className="font-medium text-green-800">
                          {player.name}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSelectedPlayer(player.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>

                {selectedPlayers.length < 2 && (
                  <p className="text-sm text-orange-600 mt-2">
                    You need at least 2 players to start a game
                  </p>
                )}
              </div>

              <Button
                onClick={startGame}
                disabled={
                  !gameName.trim() || selectedPlayers.length < 2 || loading
                }
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-6 text-lg"
                size="lg"
              >
                {loading ? (
                  <>Starting Game...</>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Start Game
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Player Selection 
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Add Players
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add New Player 
              <div>
                <Label htmlFor="newPlayer">Create New Player</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="newPlayer"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    placeholder="Enter player name"
                    onKeyPress={(e) => e.key === "Enter" && addNewPlayer()}
                  />
                  <Button
                    onClick={addNewPlayer}
                    disabled={!newPlayerName.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <UserPlus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Existing Players 
              <div>
                <Label className="text-base font-semibold">
                  Choose Existing Players
                </Label>
                <div className="mt-3 max-h-80 overflow-y-auto space-y-2">
                  {existingPlayers.length === 0 ? (
                    <div className="text-gray-500 text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                      <Users className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p>No existing players</p>
                      <p className="text-sm">Create your first player above</p>
                    </div>
                  ) : (
                    existingPlayers.map((player) => {
                      const isSelected = selectedPlayers.find(
                        (p) => p.id === player.id
                      );
                      return (
                        <div
                          key={player.id}
                          onClick={() => togglePlayerSelection(player)}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            isSelected
                              ? "bg-green-100 border-green-300 text-green-800"
                              : "bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{player.name}</p>
                              <div className="flex gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {player.games_played || 0} games
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {player.games_won || 0} wins
                                </Badge>
                              </div>
                            </div>
                            {isSelected && (
                              <Badge className="bg-green-600">Selected</Badge>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div> */}
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    minHeight: "100%",
    padding: 16,
  },
  container: {
    maxWidth: 768,
    alignSelf: "center",
  },
  header: {
    marginTop: 28,
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
});
