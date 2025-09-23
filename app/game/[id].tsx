import { Game, GamePlayer, Round } from "@/entities/all";
import { EvilIcons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import "react-native-get-random-values";

// import { createPageUrl } from "@/utils";

//   RotateCcw

interface RoundScore {
  melds_score: number;
  cards_score: number;
  bonus_clean_books: number;
  bonus_dirty_books: number;
  bonus_red_threes: number;
  penalty_cards_left: number;
  went_out: boolean;
}
export interface Round2 {
  game_id: string;
  player_id: string;
  round_number: number;
  melds_score?: number;
  cards_score?: number;
  bonus_clean_books?: number;
  bonus_dirty_books?: number;
  bonus_red_threes?: number;
  penalty_cards_left?: number;
  went_out?: boolean;
  round_total?: number;
}

type NumericScoreField = Exclude<keyof RoundScore, "went_out">;

export default function GamePage() {
  const router = useRouter();
  const { id: gameId } = useLocalSearchParams();

  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [players, setPlayers] = useState<GamePlayer[]>([]);
  const [roundScores, setRoundScores] = useState<Record<string, RoundScore>>(
    {}
  );
  const db = useSQLiteContext();

  const loadData = async () => {
    setLoading(true);
    try {
      // Step 1: Get the game by ID

      const normalizedGameId = Array.isArray(gameId) ? gameId[0] : gameId;
      if (!normalizedGameId) return;

      const gameResult = await db.getFirstAsync<Game>(
        "SELECT * FROM games WHERE id = ?",
        normalizedGameId
      );

      if (!gameResult) {
        console.warn("Game not found");
        return;
      }

      // Step 2: Get all gameplayers for this game
      const rawGamePlayers = await db.getAllAsync<GamePlayer>(
        "SELECT * FROM gameplayers WHERE game_id = ?",
        normalizedGameId
      );

      // const playerIds = gamePlayers.map((gp) => gp.player_id);

      // Step 3: Get all rounds for these players
      const allRounds = await db.getAllAsync<Round>(
        "SELECT * FROM rounds WHERE game_id = ?",
        normalizedGameId
      );

      // Step 4: Attach Rounds to their respective GamePlayers
      const enrichedPlayers = rawGamePlayers.map((gp) => {
        const playerRounds = allRounds.filter(
          (r) => r.player_id === gp.player_id
        );
        return {
          ...gp,
          rounds: playerRounds,
        };
      });

      // ***** Work on calculating scores *****
      // *******************************************

      const scores = enrichedPlayers.map((player) => {
        const rounds =
          player.rounds && player.rounds.length > 0
            ? player.rounds
            : [
                {
                  game_id: normalizedGameId,
                  player_id: player.id,
                  round_number: 1,
                  melds_score: 0,
                  cards_score: 0,
                  bonus_clean_books: 0,
                  bonus_dirty_books: 0,
                  bonus_red_threes: 0,
                  penalty_cards_left: 0,
                  went_out: false,
                  round_total: 0,
                },
              ];
        return {
          ...player,
          rounds,
        };
      });

      setPlayers(enrichedPlayers);
      console.log("Loaded players:", enrichedPlayers);
      console.log("Loaded players scores", scores);
      console.log("Loaded players [1] scores", enrichedPlayers[1].rounds);

      // Step 5: Attach players to their respective games
      const gameWithPlayers: Game = {
        ...gameResult,
        players: enrichedPlayers,
      };

      setGame(gameWithPlayers);

      console.log("Loaded game with players:", gameWithPlayers);
    } catch (error) {
      console.error("Error loading game:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

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
    setRoundScores((prev) => {
      const current = prev[playerId] ?? {};
      return {
        ...prev,
        [playerId]: {
          ...current,
          went_out: !current.went_out,
        },
      };
    });
  };

  const calculateRoundTotal = (playerId: string) => {
    const scores = roundScores[playerId] || {};
    const bonuses =
      (scores.bonus_clean_books ?? 0) * 500 +
      (scores.bonus_dirty_books ?? 0) * 300 +
      (scores.bonus_red_threes ?? 0) * 100 +
      (scores.went_out ? 100 : 0);

    return (
      (scores.melds_score ?? 0) +
      (scores.cards_score ?? 0) +
      bonuses -
      (scores.penalty_cards_left ?? 0)
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
    console.log("Save round clicked");
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
    console.log("End game clicked");
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
      <View style={styles.ngscreen}>
        <View style={styles.ngcenter}>
          <EvilIcons
            name="trophy"
            size={64}
            color="#EF4444"
            style={styles.ngicon}
          />
          <Text style={styles.ngtitle}>Game Not Found</Text>
          <Text style={styles.ngsubtitle}>
            The game you're looking for doesn't exist.
          </Text>
          <TouchableOpacity
            style={styles.ngbutton}
            onPress={() => router.push("/")}
          >
            <Feather
              name="arrow-left"
              size={16}
              color="white"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.ngbuttonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const currentLeader = game.players.reduce((prev, current) =>
    (current.total_score ?? 0) > (prev.total_score ?? 0) ? current : prev
  );

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
                <Feather name="arrow-left" size={16} color="#1E3A8A" />
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
                    <Feather name="users" size={12} color="#1E3A8A" />
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
                    <Feather
                      name="save"
                      size={16}
                      color="white"
                      style={{ marginRight: 6 }}
                    />
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
                <EvilIcons name="trophy" size={28} color="#CA8A04" />
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
                      {index === 0 && (
                        <MaterialCommunityIcons
                          name="crown-outline"
                          size={28}
                          color="#D69E2E"
                        />
                      )}
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

          <View style={styles.card2}>
            <View style={styles.cardHeader2}>
              <View style={styles.titleRow2}>
                <Feather name="target" size={20} color="#059669" />
                <Text style={styles.cardTitle2}>
                  Round {game.current_round} Scoring
                </Text>
              </View>
            </View>

            <View style={styles.cardContent2}>
              {game.players.map((player) => (
                <View key={player.id} style={styles.playerCard2}>
                  <View style={styles.playerHeader2}>
                    <Text style={styles.playerName2}>{player.name}</Text>
                    <View style={styles.totalBox2}>
                      <Text style={styles.totalScore2}>
                        {calculateRoundTotal(player.id)}
                      </Text>
                      <Text style={styles.totalLabel2}>Round Total</Text>
                    </View>
                  </View>

                  <View style={styles.scoreGrid2}>
                    {/* Basic Scores */}
                    <View style={styles.scoreSection2}>
                      <Text style={styles.sectionTitle2}>Basic Scores</Text>

                      <View style={styles.inputGroup2}>
                        <Text style={styles.label2}>Melds Score</Text>
                        <TextInput
                          keyboardType="numeric"
                          value={String(
                            roundScores[player.id]?.melds_score || 0
                          )}
                          onChangeText={(value) =>
                            updateScore(player.id, "melds_score", value)
                          }
                          style={styles.input2}
                        />
                      </View>

                      <View style={styles.inputGroup2}>
                        <Text style={styles.label2}>Cards Score</Text>
                        <TextInput
                          keyboardType="numeric"
                          value={String(
                            roundScores[player.id]?.cards_score || 0
                          )}
                          onChangeText={(value) =>
                            updateScore(player.id, "cards_score", value)
                          }
                          style={styles.input2}
                        />
                      </View>
                    </View>

                    {/* Bonuses */}
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>Bonuses</Text>

                      {/* Clean Books */}
                      <View style={styles.inputBlock}>
                        <Text style={styles.label}>
                          Clean Books (+500 each)
                        </Text>
                        <View style={styles.row}>
                          <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() =>
                              updateScore(
                                player.id,
                                "bonus_clean_books",
                                String(
                                  Math.max(
                                    0,
                                    (roundScores[player.id]
                                      ?.bonus_clean_books || 0) - 1
                                  )
                                )
                              )
                            }
                          >
                            <Feather name="minus" size={16} color="#374151" />
                          </TouchableOpacity>
                          <TextInput
                            keyboardType="numeric"
                            value={String(
                              roundScores[player.id]?.bonus_clean_books || 0
                            )}
                            onChangeText={(value) =>
                              updateScore(player.id, "bonus_clean_books", value)
                            }
                            style={styles.input}
                          />
                          <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() =>
                              updateScore(
                                player.id,
                                "bonus_clean_books",
                                String(
                                  (roundScores[player.id]?.bonus_clean_books ||
                                    0) + 1
                                )
                              )
                            }
                          >
                            <Feather name="plus" size={16} color="#374151" />
                          </TouchableOpacity>
                        </View>
                      </View>

                      {/* Dirty Books */}
                      <View style={styles.inputBlock}>
                        <Text style={styles.label}>
                          Dirty Books (+300 each)
                        </Text>
                        <View style={styles.row}>
                          <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() =>
                              updateScore(
                                player.id,
                                "bonus_dirty_books",
                                String(
                                  Math.max(
                                    0,
                                    (roundScores[player.id]
                                      ?.bonus_dirty_books || 0) - 1
                                  )
                                )
                              )
                            }
                          >
                            <Feather name="minus" size={16} color="#374151" />
                          </TouchableOpacity>
                          <TextInput
                            keyboardType="numeric"
                            value={String(
                              roundScores[player.id]?.bonus_dirty_books || 0
                            )}
                            onChangeText={(value) =>
                              updateScore(player.id, "bonus_dirty_books", value)
                            }
                            style={styles.input}
                          />
                          <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() =>
                              updateScore(
                                player.id,
                                "bonus_dirty_books",
                                String(
                                  roundScores[player.id]?.bonus_dirty_books || 0
                                ) + 1
                              )
                            }
                          >
                            <Feather name="plus" size={16} color="#374151" />
                          </TouchableOpacity>
                        </View>
                      </View>

                      {/* Red Threes */}
                      <View style={styles.inputBlock}>
                        <Text style={styles.label}>Red Threes (+100 each)</Text>
                        <TextInput
                          keyboardType="numeric"
                          value={String(
                            roundScores[player.id]?.bonus_red_threes || 0
                          )}
                          onChangeText={(value) =>
                            updateScore(player.id, "bonus_red_threes", value)
                          }
                          style={styles.input}
                        />
                      </View>
                    </View>

                    {/* Penalties & Special */}

                    <View style={styles.pssection}>
                      <Text style={styles.pssectionTitle}>
                        Penalties & Special
                      </Text>

                      {/* Cards Left (Penalty) */}
                      <View style={styles.psinputBlock}>
                        <Text style={styles.pslabel}>Cards Left (penalty)</Text>
                        <TextInput
                          keyboardType="numeric"
                          value={String(
                            roundScores[player.id]?.penalty_cards_left || 0
                          )}
                          onChangeText={(value) =>
                            updateScore(player.id, "penalty_cards_left", value)
                          }
                          style={styles.psinput}
                        />
                      </View>

                      {/* Went Out Toggle */}
                      <View style={styles.pstoggleRow}>
                        <Switch
                          value={roundScores[player.id]?.went_out || false}
                          onValueChange={() => toggleWentOut(player.id)}
                        />
                        <Text style={styles.pstoggleLabel}>
                          Went Out (+100)
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  ngscreen: {
    flex: 1,
    backgroundColor: "#FFE4E6", // from-red-50 to pink-50 gradient fallback
    padding: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  ngcenter: {
    alignItems: "center",
  },
  ngicon: {
    marginBottom: 16,
  },
  ngtitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  ngsubtitle: {
    fontSize: 16,
    color: "#4B5563",
    marginBottom: 16,
    textAlign: "center",
  },
  ngbutton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DC2626",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  ngbuttonText: {
    color: "#fff",
    fontWeight: "600",
  },
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
    backgroundColor: "#FFFF",
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
    backgroundColor: "#FFFF",
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
    backgroundColor: "#FFFF",
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
  card2: {
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 4,
    padding: 16,
    marginBottom: 24,
  },
  cardHeader2: {
    marginBottom: 12,
  },
  titleRow2: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardTitle2: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginLeft: 8,
  },
  cardContent2: {
    flexDirection: "column",
    gap: 16,
  },
  playerCard2: {
    flexDirection: "column",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    backgroundColor: "#fff",
    padding: 16,
  },
  playerHeader2: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  playerName2: {
    fontSize: 18,
    fontWeight: "600",
  },
  totalBox2: {
    alignItems: "flex-end",
  },
  totalScore2: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#059669",
  },
  totalLabel2: {
    fontSize: 12,
    color: "#6B7280",
  },
  scoreGrid2: {
    flexDirection: "column",
    gap: 16,
  },
  scoreSection2: {
    flex: 1,
    gap: 12,
  },
  sectionTitle2: {
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  inputGroup2: {
    marginBottom: 12,
  },
  label2: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 4,
  },
  input2: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 6,
    padding: 8,
    fontSize: 16,
    backgroundColor: "#F9FAFB",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  inputBlock: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 6,
    backgroundColor: "#F9FAFB",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 6,
    padding: 8,
    textAlign: "center",
    backgroundColor: "#F9FAFB",
    fontSize: 16,
  },
  pssection: {
    marginBottom: 24,
  },
  pssectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  psinputBlock: {
    marginBottom: 16,
  },
  pslabel: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 6,
  },
  psinput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 6,
    padding: 8,
    fontSize: 16,
    backgroundColor: "#F9FAFB",
  },
  pstoggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  pstoggleLabel: {
    fontSize: 14,
    color: "#374151",
  },
});
