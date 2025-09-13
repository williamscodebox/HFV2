import Card from "@/components/Card";
import CardContent from "@/components/CardContent";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { tutorialData } from "../data/tutorialData";

export default function TutorialPage() {
  const [currentSection, setCurrentSection] = useState(0);
  const tutorialSections = tutorialData;
  const currentTutorial = tutorialSections[currentSection];
  const scrollRef = useRef<ScrollView>(null);
  const { width } = useWindowDimensions();
  const isMd = width >= 768;

  const nextSection = () => {
    if (currentSection < tutorialSections.length - 1) {
      setCurrentSection(currentSection + 1);
      scrollRef.current?.scrollTo?.({ y: 0, animated: true });
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      scrollRef.current?.scrollTo?.({ y: 0, animated: true });
    }
  };

  useFocusEffect(
    useCallback(() => {
      setCurrentSection(0); // Reset to first section
    }, [])
  );

  return (
    <ScrollView ref={scrollRef} contentContainerStyle={styles.container}>
      <LinearGradient
        colors={["#ebf8ff", "#ffffff", "#f3e8ff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradientWrapper, isMd && { padding: 32 }]}
      >
        <View style={styles.contentWrapper}>
          <View style={styles.headerBlock}>
            <Text style={styles.title}>Learn Hand & Foot</Text>
            <Text style={styles.subtitle}>
              Master the classic card game with our interactive tutorial
            </Text>

            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>
                {currentSection + 1} of {tutorialSections.length}
              </Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${
                        ((currentSection + 1) / tutorialSections.length) * 100
                      }%`,
                    },
                  ]}
                />
              </View>
            </View>

            <View style={styles.tabContainer}>
              {tutorialSections.map((section, index) => {
                const isActive = index === currentSection;
                const iconColor = isActive ? "white" : "black";
                return (
                  <TouchableOpacity
                    key={section.id}
                    style={[
                      styles.tabButton,
                      isActive && styles.tabButtonActive,
                    ]}
                    onPress={() => setCurrentSection(index)}
                  >
                    {section.icon({ name: "bell", size: 24, color: iconColor })}
                    <Text style={[styles.tabText, { color: iconColor }]}>
                      {section.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.sectionWrapper}>
              <Card style={styles.card}>
                <LinearGradient
                  colors={["#2563eb", "#9333ea"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientHeader}
                >
                  <View style={styles.cardHeader}>
                    {currentTutorial.icon({
                      name: "bell",
                      size: 24,
                      color: "white",
                    })}
                    <Text style={styles.cardTitle}>
                      {currentTutorial.title}
                    </Text>
                  </View>
                </LinearGradient>
                <CardContent style={styles.cardContent}>
                  {currentTutorial.content()}
                </CardContent>
              </Card>
            </View>

            <View style={styles.navRow}>
              <TouchableOpacity
                onPress={prevSection}
                disabled={currentSection === 0}
                style={[
                  styles.navButton,
                  currentSection === 0 && styles.disabled,
                ]}
              >
                <Feather
                  name="chevron-left"
                  size={20}
                  color={currentSection === 0 ? "#4B5563" : "#FFFFFF"}
                />
                <Text
                  style={[
                    styles.textButton,
                    currentSection === 0 && styles.buttonDisabled,
                  ]}
                >
                  Previous
                </Text>
              </TouchableOpacity>

              <View style={styles.dotRow}>
                {tutorialSections.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      index === currentSection
                        ? styles.dotActive
                        : styles.dotInactive,
                    ]}
                  />
                ))}
              </View>

              <TouchableOpacity
                onPress={nextSection}
                disabled={currentSection === tutorialSections.length - 1}
                style={[
                  styles.navButton,
                  currentSection === tutorialSections.length - 1 &&
                    styles.disabled,
                ]}
              >
                <Text
                  style={[
                    styles.textButton,
                    currentSection === tutorialSections.length - 1 &&
                      styles.buttonDisabled,
                  ]}
                >
                  Next
                </Text>
                <Feather
                  name="chevron-right"
                  size={20}
                  color={
                    currentSection === tutorialSections.length - 1
                      ? "#4B5563"
                      : "#FFFFFF"
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  gradientWrapper: {
    flex: 1,
    padding: 16,
  },
  contentWrapper: {
    maxWidth: 1024,
    alignSelf: "center",
    width: "100%",
  },
  headerBlock: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 8,
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
  },
  progressContainer: {
    marginTop: 6,
    marginBottom: 32,
  },
  progressText: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#D1D5DB",
    borderRadius: 3,
  },
  progressFill: {
    height: 6,
    backgroundColor: "#6366F1",
    borderRadius: 3,
  },
  tabContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
    gap: 8,
  },
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 6,
    backgroundColor: "#E5E7EB",
    margin: 4,
  },
  tabButtonActive: {
    backgroundColor: "#6366F1",
  },
  tabText: {
    marginLeft: 6,
    fontSize: 14,
  },
  sectionWrapper: {
    marginVertical: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    marginBottom: 20,
    borderRadius: 12,
    elevation: 1,
  },
  gradientHeader: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 16,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 8,
    color: "#FFFFFF",
  },
  cardContent: {
    padding: 32,
    marginTop: 4,
  },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: "#6366F1",
  },
  disabled: {
    opacity: 0.5,
    backgroundColor: "#E5E7EB",
  },
  textButton: {
    fontSize: 16,
    color: "white",
    marginHorizontal: 8,
  },
  buttonDisabled: {
    color: "#4B5563", // gray-600
  },
  dotRow: {
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: "#2563eb", // blue-600
  },
  dotInactive: {
    backgroundColor: "#D1D5DB", // gray-300
  },
});
