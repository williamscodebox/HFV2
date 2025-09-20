import { Game, Player } from "@/entities/all";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import "react-native-get-random-values";

// import { createPageUrl } from "@/utils";
// import {
//   Trophy,
//   Plus,
//   Minus,
//   Save,
//   ArrowLeft,
//   Crown,
//   Target,
//   Users,
//   RotateCcw
// } from "lucide-react";
//
interface RoundScore {
  melds_score: number;
  cards_score: number;
  bonus_clean_books: number;
  bonus_dirty_books: number;
  bonus_red_threes: number;
  penalty_cards_left: number;
  went_out: boolean;
}

type NumericScoreField = Exclude<keyof RoundScore, "went_out">;

export default function GamePage() {
  const router = useRouter();
  const { id: gameId } = useLocalSearchParams();

  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [roundScores, setRoundScores] = useState<Record<string, RoundScore>>(
    {}
  );

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

  const gameData: Game = {
    id: gameId as string,
    name: "Test",
    players: players.map((player) => ({
      id: player.id,
      name: player.name,
      total_score: 0,
      rounds: [],
    })),
    current_round: 1,
    status: "active",
  };

  useEffect(() => {
    const loadGame = async () => {
      // try {
      //   const gameData = await Game.filter({ id: gameId });
      //   if (gameData.length > 0) {
      //     const currentGame = gameData[0];
      //     setGame(currentGame);
      //     // Initialize round scores for current round
      //     const scores = {};
      //     currentGame.players.forEach((player) => {
      //       scores[player.player_id] = {
      //         melds_score: 0,
      //         cards_score: 0,
      //         bonus_clean_books: 0,
      //         bonus_dirty_books: 0,
      //         bonus_red_threes: 0,
      //         penalty_cards_left: 0,
      //         went_out: false,
      //       };
      //     });
      //     setRoundScores(scores);
      //   }
      // } catch (error) {
      //   console.error("Error loading game:", error);
      // } finally {
      //   setLoading(false);
      // }
    };

    // if (gameId) {
    //   loadGame();
    // }
    setGame(gameData);
    setLoading(false);
  }, [gameId]); // gameId is the only dependency here, as loadGame is defined inside

  const updateScore = (
    playerId: string,
    field: NumericScoreField,
    value: string
  ) => {
    const parsed = parseInt(value);
    setRoundScores((prev) => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        [field]: isNaN(parsed) ? 0 : parsed,
      },
    }));
  };

  const toggleWentOut = (playerId: string) => {
    setRoundScores((prev) => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        went_out: !prev[playerId].went_out,
      },
    }));
  };

  const calculateRoundTotal = (playerId: string) => {
    const scores = roundScores[playerId] || {};
    const bonuses =
      scores.bonus_clean_books * 500 +
      scores.bonus_dirty_books * 300 +
      scores.bonus_red_threes * 100 +
      (scores.went_out ? 100 : 0);

    return (
      scores.melds_score +
      scores.cards_score +
      bonuses -
      scores.penalty_cards_left
    );
  };

  const saveRound = async () => {
    // setSaving(true);
    // try {
    //   const updatedPlayers = game.players.map((player: Player) => {
    //     const playerScores = roundScores[player.id] || {};
    //     const roundTotal = calculateRoundTotal(player.id);
    //     const newRound = {
    //       round_number: game.current_round,
    //       ...playerScores,
    //       round_total: roundTotal,
    //     };
    //     return {
    //       ...player,
    //       rounds: [...(player.rounds || []), newRound],
    //       total_score: (player.total_score || 0) + roundTotal,
    //     };
    //   });
    //   await Game.update(game.id, {
    //     players: updatedPlayers,
    //     current_round: game.current_round + 1,
    //   });
    //   // Update player stats
    //   for (const player of updatedPlayers) {
    //     const playerData = await Player.filter({ id: player.player_id });
    //     if (playerData.length > 0) {
    //       await Player.update(player.player_id, {
    //         total_score:
    //           (playerData[0].total_score || 0) +
    //           calculateRoundTotal(player.player_id), // Use the latest total_score from DB
    //         games_played:
    //           (playerData[0].games_played || 0) +
    //           (game.current_round === 1 ? 1 : 0),
    //       });
    //     }
    //   }
    //   // Reload game data to get the most updated state for UI and next round scores reset
    //   const gameData = await Game.filter({ id: gameId });
    //   if (gameData.length > 0) {
    //     const currentGame = gameData[0];
    //     setGame(currentGame);
    //     // Reset round scores for the newly loaded game state
    //     const newRoundScores = {};
    //     currentGame.players.forEach((player) => {
    //       newRoundScores[player.player_id] = {
    //         melds_score: 0,
    //         cards_score: 0,
    //         bonus_clean_books: 0,
    //         bonus_dirty_books: 0,
    //         bonus_red_threes: 0,
    //         penalty_cards_left: 0,
    //         went_out: false,
    //       };
    //     });
    //     setRoundScores(newRoundScores);
    //   }
    // } catch (error) {
    //   console.error("Error saving round:", error);
    // } finally {
    //   setSaving(false);
    // }
  };

  const endGame = async () => {
    // try {
    //   const winner = game.players.reduce((prev, current) =>
    //     current.total_score > prev.total_score ? current : prev
    //   );
    //   await Game.update(game.id, {
    //     status: "completed",
    //     winner_id: winner.player_id,
    //   });
    //   // Update winner stats
    //   const winnerData = await Player.filter({ id: winner.player_id });
    //   if (winnerData.length > 0) {
    //     await Player.update(winner.player_id, {
    //       games_won: (winnerData[0].games_won || 0) + 1,
    //     });
    //   }
    //   navigate(createPageUrl("History"));
    // } catch (error) {
    //   console.error("Error ending game:", error);
    // }
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

          <Text className="text-gray-600">Loading game...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (!game) {
    return (
      <View style={styles.screen}>
        <Text style={styles.gameId}>Game ID: {gameId}</Text>
      </View>
      // <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 p-8 flex items-center justify-center">
      //   <div className="text-center">
      //     <Trophy className="w-16 h-16 text-red-500 mx-auto mb-4" />
      //     <h1 className="text-2xl font-bold text-gray-900 mb-2">
      //       Game Not Found
      //     </h1>
      //     <p className="text-gray-600 mb-4">
      //       The game you're looking for doesn't exist.
      //     </p>
      //     <Button onClick={() => navigate(createPageUrl("Home"))}>
      //       <ArrowLeft className="w-4 h-4 mr-2" />
      //       Back to Home
      //     </Button>
      //   </div>
      // </div>
    );
  }

  // const currentLeader = game.players.reduce((prev, current) =>
  //   current.total_score > prev.total_score ? current : prev
  // );

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <LinearGradient
        colors={["#ECFDF5", "#EFF6FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.screen}
      >
        <View style={styles.container}>
          <Text style={styles.gameId}>Game ID: {gameId}</Text>

          {/* Header */}
          <View style={styles.header}>
            {/* Back Button + Title */}
            <View style={styles.titleRow}>
              <TouchableOpacity
                onPress={() => router.push("/")}
                style={styles.backButton}
              >
                {/* <ArrowLeft size={16} color="#1E3A8A" /> */}
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>

              <View>
                <Text style={styles.gameName}>{game.name}</Text>
                <View style={styles.badgeRow}>
                  <View style={styles.roundBadge}>
                    <Text style={styles.roundText}>
                      Round {game.current_round}
                    </Text>
                  </View>
                  <View style={styles.playerBadge}>
                    {/* <Users size={12} color="#1E3A8A" /> */}
                    <Text style={styles.playerText}>
                      {game.players.length} players
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={saveRound}
                disabled={saving}
                style={[
                  styles.saveButton,
                  saving && { backgroundColor: "#A7F3D0" },
                ]}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    {/* <Save size={16} color="#fff" style={{ marginRight: 6 }} /> */}
                    <Text style={styles.saveText}>Save Round</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={endGame} style={styles.endButton}>
                <Text style={styles.endText}>End Game</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Current Standings */}

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleRow}>
                {/* <Trophy size={20} color="#CA8A04" /> */}
                <Text style={styles.cardTitle}>Current Standings</Text>
              </View>
            </View>
            <View style={styles.cardContent}>
              {game.players
                .sort((a, b) => (b.total_score || 0) - (a.total_score || 0))
                .map((player, index) => (
                  <View
                    key={player.id}
                    style={[
                      styles.playerRow,
                      index === 0 ? styles.leaderRow : styles.defaultRow,
                    ]}
                  >
                    <View style={styles.playerInfo}>
                      {/* {index === 0 && (
                        <Crown className="w-5 h-5 text-yellow-600" />
                      )} */}
                      <View>
                        <Text style={styles.playerName}>{player.name}</Text>
                        <Text style={styles.roundsPlayed}>
                          {player.rounds?.length || 0} rounds played
                        </Text>
                      </View>
                    </View>
                    <View style={styles.scoreBox}>
                      <Text style={styles.score}>
                        {player.total_score || 0}
                      </Text>
                      <Text style={styles.pointsLabel}>points</Text>
                    </View>
                  </View>
                ))}
            </View>
          </View>

          {/* Round Scoring */}

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-600" />
                Round {game.current_round} Scoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {game.players.map((player) => (
                  <div
                    key={player.player_id}
                    className="border border-gray-200 rounded-lg p-6 bg-white"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold">{player.name}</h3>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">
                          {calculateRoundTotal(player.player_id)}
                        </p>
                        <p className="text-sm text-gray-500">Round Total</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Basic Scores  */}

                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-700">
                          Basic Scores
                        </h4>

                        <div>
                          <Label>Melds Score</Label>
                          <Input
                            type="number"
                            value={
                              roundScores[player.player_id]?.melds_score || 0
                            }
                            onChange={(e) =>
                              updateScore(
                                player.player_id,
                                "melds_score",
                                e.target.value
                              )
                            }
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label>Cards Score</Label>
                          <Input
                            type="number"
                            value={
                              roundScores[player.player_id]?.cards_score || 0
                            }
                            onChange={(e) =>
                              updateScore(
                                player.player_id,
                                "cards_score",
                                e.target.value
                              )
                            }
                            className="mt-1"
                          />
                        </div>
                      </div>

                      {/* Bonuses 
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-700">Bonuses</h4>

                      <div>
                        <Label>Clean Books (+500 each)</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              updateScore(
                                player.player_id,
                                "bonus_clean_books",
                                Math.max(
                                  0,
                                  (roundScores[player.player_id]
                                    ?.bonus_clean_books || 0) - 1
                                )
                              )
                            }
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <Input
                            type="number"
                            value={
                              roundScores[player.player_id]
                                ?.bonus_clean_books || 0
                            }
                            onChange={(e) =>
                              updateScore(
                                player.player_id,
                                "bonus_clean_books",
                                e.target.value
                              )
                            }
                            className="text-center"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              updateScore(
                                player.player_id,
                                "bonus_clean_books",
                                (roundScores[player.player_id]
                                  ?.bonus_clean_books || 0) + 1
                              )
                            }
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label>Dirty Books (+300 each)</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              updateScore(
                                player.player_id,
                                "bonus_dirty_books",
                                Math.max(
                                  0,
                                  (roundScores[player.player_id]
                                    ?.bonus_dirty_books || 0) - 1
                                )
                              )
                            }
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <Input
                            type="number"
                            value={
                              roundScores[player.player_id]
                                ?.bonus_dirty_books || 0
                            }
                            onChange={(e) =>
                              updateScore(
                                player.player_id,
                                "bonus_dirty_books",
                                e.target.value
                              )
                            }
                            className="text-center"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              updateScore(
                                player.player_id,
                                "bonus_dirty_books",
                                (roundScores[player.player_id]
                                  ?.bonus_dirty_books || 0) + 1
                              )
                            }
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label>Red Threes (+100 each)</Label>
                        <Input
                          type="number"
                          value={
                            roundScores[player.player_id]?.bonus_red_threes || 0
                          }
                          onChange={(e) =>
                            updateScore(
                              player.player_id,
                              "bonus_red_threes",
                              e.target.value
                            )
                          }
                          className="mt-1"
                        />
                      </div>
                    </div> */}

                      {/* Penalties & Special 
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-700">
                        Penalties & Special
                      </h4>

                      <div>
                        <Label>Cards Left (penalty)</Label>
                        <Input
                          type="number"
                          value={
                            roundScores[player.player_id]?.penalty_cards_left ||
                            0
                          }
                          onChange={(e) =>
                            updateScore(
                              player.player_id,
                              "penalty_cards_left",
                              e.target.value
                            )
                          }
                          className="mt-1"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`went-out-${player.player_id}`}
                          checked={
                            roundScores[player.player_id]?.went_out || false
                          }
                          onChange={() => toggleWentOut(player.player_id)}
                          className="w-4 h-4"
                        />
                        <Label htmlFor={`went-out-${player.player_id}`}>
                          Went Out (+100)
                        </Label>
                      </div>
                    </div> */}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    // backgroundColor: "#ECFDF5", // from-green-50
    padding: 16,
  },
  container: {
    maxWidth: 960,
    alignSelf: "center",
  },
  gameId: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 12,
  },
  header: {
    flexDirection: "column",
    gap: 16,
    marginBottom: 24,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
  },
  backText: {
    marginLeft: 6,
    color: "#1E3A8A",
    fontWeight: "500",
  },
  gameName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  badgeRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  roundBadge: {
    backgroundColor: "#DBEAFE",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  roundText: {
    color: "#1E3A8A",
    fontWeight: "600",
  },
  playerBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    gap: 4,
  },
  playerText: {
    color: "#1E3A8A",
    fontSize: 12,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#059669",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  saveText: {
    color: "#fff",
    fontWeight: "600",
  },
  endButton: {
    borderWidth: 1,
    borderColor: "#FCA5A5",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  endText: {
    color: "#DC2626",
    fontWeight: "600",
  },
  card: {
    marginBottom: 24,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    padding: 16,
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
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  cardContent: {
    gap: 12,
  },
  playerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
  },
  leaderRow: {
    backgroundColor: "#FEF9C3",
    borderWidth: 2,
    borderColor: "#FACC15",
  },
  defaultRow: {
    backgroundColor: "#F9FAFB",
  },
  playerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  playerName: {
    fontWeight: "600",
    fontSize: 16,
  },
  roundsPlayed: {
    fontSize: 12,
    color: "#6B7280",
  },
  scoreBox: {
    alignItems: "flex-end",
  },
  score: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  pointsLabel: {
    fontSize: 10,
    color: "#6B7280",
  },
});
