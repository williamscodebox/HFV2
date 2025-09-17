import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
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
  status: "active" | "completed" | "pending";
  // other fields...
};

export default function history() {
  const [games, setGames] = useState<Game[]>([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState(null);
  const [completedGames, activeGames] = Array.isArray(games)
    ? [
        games.filter((g) => g.status === "completed"),
        games.filter((g) => g.status === "active"),
      ]
    : [[], []];

  useEffect(() => {
    // loadData();
    setLoading(false);
  }, []);

  const loadData = async () => {};

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
                  size={24}
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

          {/* ************************************************ */}
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
    marginBottom: 42,
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
});
