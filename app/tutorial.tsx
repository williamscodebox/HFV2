import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { tutorialData } from "../data/tutorialData";

export default function TutorialPage() {
  const [currentSection, setCurrentSection] = useState(0);
  const tutorialSections = tutorialData;
  const currentTutorial = tutorialSections[currentSection];
  const scrollRef = useRef(null);

  const nextSection = () => {
    if (currentSection < tutorialSections.length - 1) {
      setCurrentSection(currentSection + 1);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
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
        colors={["#ebf8ff", "#ffffff", "#f3e8ff"]} // from-blue-50 via-white to-purple-50
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1 p-4 md:p-8"
      >
        <View>
          <Text>Tutorial</Text>
        </View>
        {/* <View className="max-w-4xl mx-auto">
          <View className="text-center mb-8">
            <Text style={styles.title}>Learn Hand & Foot</Text>
            <Text style={styles.subtitle}>
              Master the classic card game with our interactive tutorial
            </Text>

            {/* Progress Bar 
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

            {/* Navigation Tabs 
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
                    {section.icon({ color: iconColor })}
                    <Text style={[styles.tabText, { color: iconColor }]}>
                      {section.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Current Section Content 
            <View className="-m-2 mb-3">
              <Card style={styles.card} className="mb-8">
                <LinearGradient
                  colors={["#2563eb", "#9333ea"]} // from-blue-600 to-purple-600
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="rounded-t-lg p-4 overflow-hidden"
                >
                  <View style={styles.cardHeader} className="mt-3">
                    {currentTutorial.icon({ color: "white" })}
                    <Text style={styles.cardTitle}>
                      {currentTutorial.title}
                    </Text>
                  </View>
                </LinearGradient>
                <CardContent className="p-8 mt-1">
                  {currentTutorial.content()}
                </CardContent>
              </Card>
            </View>

            {/* Navigation Buttons 

            <View className="flex flex-row justify-between items-center mb-6">
              <TouchableOpacity
                onPress={prevSection}
                disabled={currentSection === 0}
                className="flex flex-row items-center gap-2 px-4 pr-6 py-4 rounded-xl overflow-hidden"
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

              <View className="flex flex-row gap-2">
                {tutorialSections.map((_, index) => (
                  <View
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentSection ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                ))}
              </View>

              <TouchableOpacity
                onPress={nextSection}
                disabled={currentSection === tutorialSections.length - 1}
                className="flex flex-row items-center gap-2 px-4 pl-10 pr-8 py-4 rounded-xl overflow-hidden"
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
        </View> */}
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
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
    gap: 8,
    justifyContent: "center",
    marginBottom: 20,
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
    color: "#FFFFFF",
  },
  card: {
    backgroundColor: "#FFFFFF",
    marginBottom: 20,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 8,
    color: "#FFFFFF",
  },
  cardContent: {
    fontSize: 16,
    color: "#4B5563",
  },
  navButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  navButton: {
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: "#6366F1",
  },
  disabled: {
    opacity: 0.5,
    backgroundColor: "#E5E7EB",
  },
  gradient: {
    borderRadius: 12,
  },
  textButton: {
    color: "white",
  },
  buttonDisabled: {
    color: "black",
  },
});
