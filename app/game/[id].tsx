import { Game, Player } from "@/entities/all";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

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

  const [game, setGame] = useState(null);
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
    id: uuidv4(),
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
    setSaving(true);
    try {
      const updatedPlayers = game.players.map((player: Player) => {
        const playerScores = roundScores[player.id] || {};
        const roundTotal = calculateRoundTotal(player.id);

        const newRound = {
          round_number: game.current_round,
          ...playerScores,
          round_total: roundTotal,
        };

        return {
          ...player,
          rounds: [...(player.rounds || []), newRound],
          total_score: (player.total_score || 0) + roundTotal,
        };
      });

      await Game.update(game.id, {
        players: updatedPlayers,
        current_round: game.current_round + 1,
      });

      // Update player stats
      for (const player of updatedPlayers) {
        const playerData = await Player.filter({ id: player.player_id });
        if (playerData.length > 0) {
          await Player.update(player.player_id, {
            total_score:
              (playerData[0].total_score || 0) +
              calculateRoundTotal(player.player_id), // Use the latest total_score from DB
            games_played:
              (playerData[0].games_played || 0) +
              (game.current_round === 1 ? 1 : 0),
          });
        }
      }

      // Reload game data to get the most updated state for UI and next round scores reset
      const gameData = await Game.filter({ id: gameId });
      if (gameData.length > 0) {
        const currentGame = gameData[0];
        setGame(currentGame);

        // Reset round scores for the newly loaded game state
        const newRoundScores = {};
        currentGame.players.forEach((player) => {
          newRoundScores[player.player_id] = {
            melds_score: 0,
            cards_score: 0,
            bonus_clean_books: 0,
            bonus_dirty_books: 0,
            bonus_red_threes: 0,
            penalty_cards_left: 0,
            went_out: false,
          };
        });
        setRoundScores(newRoundScores);
      }
    } catch (error) {
      console.error("Error saving round:", error);
    } finally {
      setSaving(false);
    }
  };

  const endGame = async () => {
    try {
      const winner = game.players.reduce((prev, current) =>
        current.total_score > prev.total_score ? current : prev
      );

      await Game.update(game.id, {
        status: "completed",
        winner_id: winner.player_id,
      });

      // Update winner stats
      const winnerData = await Player.filter({ id: winner.player_id });
      if (winnerData.length > 0) {
        await Player.update(winner.player_id, {
          games_won: (winnerData[0].games_won || 0) + 1,
        });
      }

      navigate(createPageUrl("History"));
    } catch (error) {
      console.error("Error ending game:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading game...</p>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <Trophy className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Game Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            The game you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate(createPageUrl("Home"))}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const currentLeader = game.players.reduce((prev, current) =>
    current.total_score > prev.total_score ? current : prev
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <View>
          <Text>Game ID: {id}</Text>
          {/* Load game data with this ID */}
        </View>
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate(createPageUrl("Home"))}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {game.name}
              </h1>
              <div className="flex items-center gap-4 mt-1">
                <Badge className="bg-blue-100 text-blue-800">
                  Round {game.current_round}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {game.players.length} players
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={saveRound}
              disabled={saving}
              className="bg-green-600 hover:bg-green-700"
            >
              {saving ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Round
                </>
              )}
            </Button>
            <Button
              onClick={endGame}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              End Game
            </Button>
          </div>
        </div>

        {/* Current Standings */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              Current Standings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {game.players
                .sort((a, b) => (b.total_score || 0) - (a.total_score || 0))
                .map((player, index) => (
                  <div
                    key={player.player_id}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      index === 0
                        ? "bg-yellow-50 border-2 border-yellow-300"
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {index === 0 && (
                        <Crown className="w-5 h-5 text-yellow-600" />
                      )}
                      <div>
                        <p className="font-semibold">{player.name}</p>
                        <p className="text-sm text-gray-600">
                          {player.rounds?.length || 0} rounds played
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">
                        {player.total_score || 0}
                      </p>
                      <p className="text-xs text-gray-500">points</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

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
                    {/* Basic Scores */}
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

                    {/* Bonuses */}
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
                    </div>

                    {/* Penalties & Special */}
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
