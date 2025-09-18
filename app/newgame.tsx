import Badge from "@/components/Badge";
// import { Button } from "@/components/ui/button";
import Card from "@/components/Card";
import CardContent from "@/components/CardContent";
import CardHeader from "@/components/CardHeader";
import CardTitle from "@/components/CardTitle";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import { Player } from "@/entities/all";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
  const [existingPlayers, setExistingPlayers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadExistingPlayers();
  }, []);

  const loadExistingPlayers = async () => {
    try {
      const players = await Player.list("name");
      setExistingPlayers(players);
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Start New Game
          </h1>
          <p className="text-lg text-gray-600">
            Set up your Hand & Foot game with players and begin scoring
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Game Setup */}
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

          {/* Player Selection */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Add Players
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add New Player */}
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

              {/* Existing Players */}
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
        </div>
      </div>
    </div>
  );
}
