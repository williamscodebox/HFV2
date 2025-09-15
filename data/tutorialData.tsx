import Badge from "@/components/Badge";
import CardTitle from "@/components/CardTitle";
import { VerticalStack } from "@/components/Spacer";
import { EvilIcons, Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as React from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import Card from "../components/Card";
import CardContent from "../components/CardContent";
import CardHeader from "../components/CardHeader";

type FeatherIconName = React.ComponentProps<typeof Feather>["name"];
type IoniconsIconName = React.ComponentProps<typeof Ionicons>["name"];

type TutorialSection = {
  id: string;
  title: string;
  iconname: FeatherIconName | IoniconsIconName;
  icon: React.ComponentType<{ name: string; size: number; color: string }>;
  content: React.FC;
};

const asIcon = <T extends React.ComponentType<any>>(Icon: T) =>
  Icon as React.ComponentType<{ name: string; size: number; color: string }>;

export const tutorialData: TutorialSection[] = [
  {
    id: "overview",
    title: "Game Overview",
    iconname: "book-open",
    icon: asIcon(Feather),
    content: function OverviewContent() {
      const { width } = useWindowDimensions();
      const isMd = width >= 768;

      return (
        <VerticalStack>
          <LinearGradient
            colors={["#eff6ff", "#f5f3ff"]} // blue-50 to purple-50
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          >
            <View style={styles.introBox}>
              <Text style={styles.heading}>What is Hand and Foot?</Text>
              <Text style={styles.paragraph}>
                Hand and Foot is a North American card game similar to Canasta.
                Players work to create melds (sets of cards) and earn points.
                The game is called "Hand and Foot" because each player is dealt
                two sets of cards: the "hand" (played first) and the "foot"
                (played after the hand is exhausted).
              </Text>
            </View>
          </LinearGradient>

          <View
            style={[styles.cardRow, { flexDirection: isMd ? "row" : "column" }]}
          >
            {/* Players Card */}
            <Card style={styles.playersCard}>
              <CardHeader>
                <View style={styles.cardTitleRow}>
                  <Feather name="users" size={20} color="#065F46" />
                  <Text style={styles.cardTitleText}>Players</Text>
                </View>
              </CardHeader>
              <CardContent style={styles.cardContent}>
                <Text style={styles.cardText}>2–6 players (best with 4)</Text>
                <Text style={styles.cardSubText}>
                  Can be played in partnerships
                </Text>
              </CardContent>
            </Card>

            {/* Decks Card */}
            <Card style={styles.decksCard}>
              <CardHeader>
                <View style={styles.cardTitleRow}>
                  <Ionicons name="shuffle-sharp" size={20} color="#C026D3" />
                  <Text style={[styles.cardTitleText, { color: "#C026D3" }]}>
                    Decks
                  </Text>
                </View>
              </CardHeader>
              <CardContent style={styles.cardContent}>
                <Text style={styles.cardText}>4–7 standard decks + jokers</Text>
                <Text style={[styles.cardSubText, { color: "#C026D3" }]}>
                  Number depends on player count
                </Text>
              </CardContent>
            </Card>
          </View>
        </VerticalStack>
      );
    },
  },
  {
    id: "setup",
    title: "Game Setup",
    iconname: "shuffle-sharp",
    icon: asIcon(Ionicons),
    content: function SetupContent() {
      const { width } = useWindowDimensions();
      const isMd = width >= 768;

      return (
        <VerticalStack>
          <LinearGradient
            colors={["#eff6ff", "#f5f3ff"]} // blue-50 to purple-50
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          >
            <View style={styles.introBox}>
              <Text style={styles.heading}>Initial Deal</Text>
              <View style={[styles.flexRow, isMd ? styles.row : styles.column]}>
                <View style={styles.cardBlock}>
                  <Text style={styles.cardTitle}>Hand Cards</Text>
                  <Text style={styles.cardDescription}>
                    Each player receives 13 cards face down. Keep these cards
                    hidden from other players.
                  </Text>
                </View>
                <View style={styles.cardBlock}>
                  <Text style={styles.cardTitle}>Foot Cards</Text>
                  <Text style={styles.cardDescription}>
                    Each player receives 13 additional cards face down. Don't
                    look at these until your hand is empty!
                  </Text>
                </View>
              </View>
            </View>
          </LinearGradient>

          <View
            style={[styles.cardContainer, isMd ? styles.row : styles.column]}
          >
            <Card style={[styles.card, styles.indigoSetupCard]}>
              <CardHeader>
                <CardTitle>
                  <Text style={styles.cardSetupTitle}>Step 1</Text>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Text style={styles.cardSetupText}>
                  Deal 13 cards to each player's hand
                </Text>
              </CardContent>
            </Card>
            <Card style={[styles.card, styles.slateSetupCard]}>
              <CardHeader>
                <CardTitle>
                  <Text style={styles.cardSetupTitle}>Step 2</Text>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Text style={styles.cardSetupText}>
                  Deal 13 cards to each player's foot
                </Text>
              </CardContent>
            </Card>
            <Card style={[styles.card, styles.greenSetupCard]}>
              <CardHeader>
                <CardTitle>
                  <Text style={styles.cardSetupTitle}>Step 3</Text>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Text style={styles.cardSetupText}>
                  Place remaining cards as stock pile
                </Text>
              </CardContent>
            </Card>
          </View>
        </VerticalStack>
      );
    },
  },
  {
    id: "melds",
    title: "Making Melds",
    iconname: "target",
    icon: asIcon(Feather),
    content: function MeldsContent() {
      const { width } = useWindowDimensions();
      const isMd = width >= 768;

      return (
        <VerticalStack>
          <LinearGradient
            colors={["#eff6ff", "#f5f3ff"]} // blue-50 to purple-50
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          >
            <View style={styles.introBox}>
              <Text style={styles.heading}>What are Melds?</Text>
              <Text style={styles.paragraph}>
                Melds are sets of 8 or more cards of the same rank. Melds begin
                as sets of 3 or more cards. You must play at least 3 cards of
                the same rank (Red Meld) or at least 2 cards of the same rank
                and a wildcard (Black Meld) in order to begin a meld on the
                table. You need melds to score points and eventually "go out" to
                win the round.
              </Text>
            </View>
          </LinearGradient>

          <View
            style={[styles.flexContainer, isMd ? styles.row : styles.column]}
          >
            <Card style={[styles.cardMelds, styles.greenCard]}>
              <CardHeader>
                <View style={styles.titleRow}>
                  <View style={styles.greenDot} />
                  <Text style={styles.cardMeldGTitle}>Clean Books</Text>
                </View>
                <Text style={styles.cardMeldGSubtitle}>(Natural Melds)</Text>
              </CardHeader>
              <CardContent>
                <Text style={styles.cardMeldText}>
                  8 or more cards of the same rank with NO wildcards
                </Text>
                <Text style={styles.cardMeldText}>
                  Another name for this is a red meld
                </Text>
                <View style={styles.cardMeldRow}>
                  {["K♥", "K♠", "K♥", "K♦", "K♣", "K♣", "K♥", "K♠"].map(
                    (card, i) => (
                      <Text key={i} style={styles.cardMeldChip}>
                        {card}
                      </Text>
                    )
                  )}
                </View>
                <View style={styles.badgeWrapper}>
                  <Badge
                    value={"+ 500 points"}
                    color={"#DCFCE7"}
                    textColor={"green"}
                    height={28}
                    width={90}
                  />
                </View>
              </CardContent>
            </Card>

            <Card style={[styles.cardMelds, styles.yellowCard]}>
              <CardHeader>
                <View style={styles.titleRow}>
                  <View style={styles.yellowDot}></View>
                  <Text style={styles.cardMeldYTitle}>Dirty Books</Text>
                </View>
                <Text style={styles.cardMeldYSubtitle}>(Mixed Melds)</Text>
              </CardHeader>
              <CardContent>
                <Text style={styles.cardMeldText}>
                  8 or more cards of the same rank with wildcards (2s, Jokers)
                </Text>
                <Text style={styles.cardMeldText}>
                  Another name for this is a black meld
                </Text>
                <View style={styles.cardMeldRow}>
                  {["K♥", "K♠", "2♣", "K♦", "JKR", "K♣", "K♥", "JKR"].map(
                    (card, i) => (
                      <Text
                        key={i}
                        style={[
                          styles.cardBox,
                          card.includes("2") || card === "JKR"
                            ? styles.wildCard
                            : styles.normalCard,
                        ]}
                      >
                        {card}
                      </Text>
                    )
                  )}
                </View>
                <View style={styles.badgeWrapper}>
                  <Badge
                    value={"+ 300 points"}
                    color={"#FEF9C3"}
                    textColor={"#854D0E"}
                    height={28}
                    width={90}
                  />
                </View>
              </CardContent>
            </Card>
          </View>

          <View style={styles.ruleBox}>
            <Text style={styles.ruleHeading}>Wildcard Rules</Text>
            <View style={styles.ruleList}>
              <Text style={styles.ruleText}>2s and Jokers are wildcards</Text>
              <Text style={styles.ruleText}>
                Maximum number of wildcards per Meld is limited to the rule
                below as follows
              </Text>
              <Text style={styles.ruleText}>
                Wildcards cannot outnumber natural cards
              </Text>
            </View>
          </View>
        </VerticalStack>
      );
    },
  },
  {
    id: "scoring",
    title: "Scoring System",
    iconname: "trophy",
    icon: asIcon(EvilIcons),
    content: function ScoringContent() {
      const { width } = useWindowDimensions();
      const isMd = width >= 768;
      const cardValueRows = [
        {
          label: "Jokers",
          value: "50 points",
          color: "#5b7db4ff",
          textColor: "white",
        },
        {
          label: "2s (wildcards)",
          value: "20 points",
          color: "#5b7db4ff",
          textColor: "white",
        },
        {
          label: "Aces",
          value: "20 points",
          color: "#5b7db4ff",
          textColor: "white",
        },
        {
          label: "8, 9, 10, J, Q, K",
          value: "10 points",
          color: "#5b7db4ff",
          textColor: "white",
        },
        {
          label: "4, 5, 6, 7",
          value: "5 points",
          color: "#5b7db4ff",
          textColor: "white",
        },
        {
          label: "Black 3s",
          value: "5 points",
          color: "#5b7db4ff",
          textColor: "white",
        },
        {
          label: "Red 3s",
          value: "500 points",
          color: "#EF4444",
          textColor: "white",
        },
      ];

      return (
        <VerticalStack>
          <LinearGradient
            colors={["#eff6ff", "#f5f3ff"]} // blue-50 to purple-50
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          >
            <View style={styles.introBox}>
              <Text style={styles.heading}>How Points Work</Text>
              <Text style={styles.paragraph}>
                Points come from melds, individual cards, and bonuses. At the
                end of each round, subtract points for cards left in hand.
              </Text>
            </View>
          </LinearGradient>

          <View
            style={[
              styles.gridContainer,
              isMd ? styles.gridTwoCols : styles.gridOneCol,
            ]}
          >
            <Card style={styles.CvCard}>
              <CardHeader>
                <Text style={styles.Cvtitle}>Card Values</Text>
              </CardHeader>
              <CardContent>
                {cardValueRows.map(({ label, value, color, textColor }, i) => (
                  <View key={i} style={styles.Cvrow}>
                    <Text style={styles.Cvlabel}>{label}</Text>
                    <Badge
                      value={value}
                      color={color}
                      textColor={textColor}
                      height={30}
                      width={90}
                    />
                  </View>
                ))}
              </CardContent>
            </Card>

            <Card style={styles.CvCard}>
              <CardHeader>
                <Text style={styles.Btitle}>Bonuses</Text>
              </CardHeader>
              <CardContent>
                <View style={styles.Cvrow}>
                  <Text style={styles.Cvlabel}>Clean Book</Text>
                  <Badge
                    value={"+ 500 points"}
                    color={"#DCFCE7"}
                    textColor={"black"}
                    height={30}
                    width={90}
                  />
                </View>
                <View style={styles.Cvrow}>
                  <Text style={styles.Cvlabel}>Dirty Book</Text>
                  <Badge
                    value={"+ 300 points"}
                    color={"#FEF9C3"}
                    textColor={"black"}
                    height={30}
                    width={90}
                  />
                </View>
              </CardContent>
            </Card>
          </View>

          <View style={styles.P4container}>
            <Text style={styles.P4title}>Penalty</Text>
            <Text style={styles.P4description}>
              At round end, subtract the point value of all cards remaining in
              your hand and foot from your score.
            </Text>
          </View>
        </VerticalStack>
      );
    },
  },
];

const styles = StyleSheet.create({
  P4container: {
    backgroundColor: "#FEF2F2", // red-50
    padding: 32, // p-8
    borderRadius: 12, // rounded-lg
    borderWidth: 1,
    borderColor: "#FECACA", // red-200
    marginTop: 32, // mt-8
  },
  P4title: {
    fontSize: 28, // text-2xl
    fontWeight: "600", // font-semibold
    color: "#991B1B", // red-800
    marginBottom: 16, // mb-4
  },
  P4description: {
    fontSize: 20, // text-xl
    lineHeight: 28, // leading-relaxed
    color: "#B91C1C", // red-700
  },
  gridContainer: {
    gap: 24, // Tailwind gap-6 = 1.5rem
  },
  gridOneCol: {
    flexDirection: "column",
  },
  gridTwoCols: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  CvCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F9FAFB", // Tailwind gray-50
    padding: 24,
    marginTop: 16,
    borderRadius: 12,
  },
  Cvtitle: {
    color: "#15803D", // Tailwind green-700
    fontSize: 28,
    fontWeight: "bold",
    paddingBottom: 20,
    marginLeft: -8,
  },
  Btitle: {
    color: "#1D4ED8", // Tailwind blue-700
    fontSize: 28,
    fontWeight: "bold",
    paddingBottom: 20,
    marginLeft: -8,
  },
  Cvrow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: -10,
    marginLeft: -10,
    paddingBottom: 8,
  },
  Cvlabel: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
    marginTop: -2,
  },
  flexContainer: {
    gap: 24, // Tailwind's gap-6 = 1.5rem = 24px
  },
  introBox: {
    marginBottom: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  yellowBox: {
    backgroundColor: "#FEF9C3", // Tailwind yellow-50
    marginTop: 8,
    padding: 24,
    borderRadius: 16,
    paddingBottom: 40,
  },
  paragraph: {
    fontSize: 18,
    color: "#4B5563",
    lineHeight: 28,
    marginTop: 10,
  },
  gradient: {
    padding: 24, // Tailwind's p-6
    borderRadius: 12, // rounded-xl
    overflow: "hidden",
    marginBottom: 24, // mb-6
    marginTop: 8, // mt-2
  },
  playersCard: {
    backgroundColor: "#f0fdf4", // Tailwind's bg-green-50
    borderWidth: 1,
    borderColor: "#bbf7d0", // Tailwind's border-green-200
  },
  decksCard: {
    backgroundColor: "#fae8ff", // fuchsia-100
    borderWidth: 1,
    borderColor: "#f5d0fe", // fuchsia-200
  },
  cardRow: {
    gap: 24,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    margin: 20,
  },
  cardTitleText: {
    color: "#065F46", // green-800
    fontSize: 24,
    fontWeight: "bold",
  },
  cardContent: {
    flexDirection: "column",
    marginLeft: 20,
    marginBottom: 32,
    gap: 4,
  },
  cardText: {
    fontSize: 16,
    color: "#1F2937", // gray-800
  },
  cardSubText: {
    fontSize: 14,
    color: "#047857", // green-700 or fuchsia-700 depending on context
    marginTop: 8,
  },
  flexRow: {
    marginTop: 12,
    gap: 24,
  },
  row: {
    flexDirection: "row",
  },
  column: {
    flexDirection: "column",
  },
  cardBlock: {
    marginBottom: 16,
  },
  cardTitle: {
    fontWeight: "600",
    color: "#1E40AF", // Tailwind's blue-800
    marginBottom: 8,
    fontSize: 20,
  },
  cardDescription: {
    color: "#374151", // Tailwind's gray-700
    fontSize: 20,
    lineHeight: 28,
  },
  cardContainer: {
    flexDirection: "column",
    gap: 16,
  },
  card: {
    alignItems: "center",
    borderWidth: 1,
    paddingVertical: 16,
  },
  indigoSetupCard: {
    backgroundColor: "#eef2ff", // Tailwind's indigo-50
    borderColor: "#e0e7ff", // Tailwind's indigo-100
    paddingTop: 32,
  },
  slateSetupCard: {
    backgroundColor: "#F8FAFC", // Tailwind's slate-50
    borderColor: "#F1F5F9", // Tailwind's slate-100
    paddingTop: 32,
  },
  greenSetupCard: {
    backgroundColor: "#F0FDF4", // Tailwind's green-50
    borderColor: "#DCFCE7", // Tailwind's green-100
    paddingTop: 32,
  },
  cardSetupTitle: {
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: 24,
    paddingBottom: 8,
    textAlign: "center",
  },
  cardSetupText: {
    fontSize: 20,
    margin: 16,
    lineHeight: 28,
    paddingBottom: 16,
    textAlign: "center",
  },
  cardMelds: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    padding: 24,
    borderRadius: 12,
  },
  greenCard: {
    borderColor: "#BBF7D0", // Tailwind green-200
  },
  yellowCard: {
    borderColor: "#FEF9C3", // Tailwind yellow-200
  },
  titleRow: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  greenDot: {
    width: 24,
    height: 24,
    marginTop: 12,
    backgroundColor: "#22C55E", // Tailwind green-500
    borderRadius: 12,
  },
  yellowDot: {
    width: 24,
    height: 24,
    marginTop: 12,
    backgroundColor: "#EAB308", // Tailwind yellow-500
    borderRadius: 12,
  },
  cardMeldGTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#166534", // Tailwind green-800
  },
  cardMeldYTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#975A16", // Tailwind yellow-800
  },
  cardMeldGSubtitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#166534",
    marginLeft: 38,
    marginTop: -8,
  },
  cardMeldYSubtitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#975A16",
    marginLeft: 38,
    marginTop: -8,
  },
  cardMeldText: {
    fontSize: 20,
    marginVertical: 8,
  },
  cardMeldRow: {
    flexDirection: "row",
    gap: 0,
    marginBottom: 8,
    marginLeft: 4,
  },
  cardMeldChip: {
    width: 30,
    height: 48,
    backgroundColor: "#F3F4F6", // Tailwind gray-100
    borderColor: "#9CA3AF", // Tailwind gray-400
    borderWidth: 1,
    borderRadius: 6,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 12,
    marginTop: 12,
    marginLeft: -4,
  },
  badgeWrapper: {
    marginTop: 24,
    paddingBottom: 8,
  },
  cardBox: {
    width: 30,
    height: 48,
    borderWidth: 1,
    borderRadius: 6,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    marginLeft: -4,
  },
  wildCard: {
    backgroundColor: "#FEF9C3", // yellow-100
    borderColor: "#9CA3AF", // gray-400
  },
  normalCard: {
    backgroundColor: "#F3F4F6", // gray-100
    borderColor: "#9CA3AF", // gray-400
  },
  ruleBox: {
    backgroundColor: "#F9FAFB", // Tailwind gray-50
    borderRadius: 12,
    marginTop: 32,
    padding: 24,
  },
  ruleHeading: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 16,
  },
  ruleList: {
    gap: 12,
    marginBottom: 8,
  },
  ruleText: {
    fontSize: 20,
    color: "#374151", // Tailwind gray-700
  },
});
