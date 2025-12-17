import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import ScreenLayout from "../../components/ScreenLayout";
import colors from "../../config/colors";

const GUIDES = [
  {
    id: "1",
    title: "Beginner's Guide to PC Building",
    difficulty: "Beginner",
    duration: "15 min",
    icon: "book-open",
  },
  {
    id: "2",
    title: "Choosing the Right Components",
    difficulty: "Beginner",
    duration: "20 min",
    icon: "check-square",
  },
  {
    id: "3",
    title: "Cable Management Tips",
    difficulty: "Intermediate",
    duration: "10 min",
    icon: "codepen",
  },
  {
    id: "4",
    title: "Overclocking Your CPU Safely",
    difficulty: "Advanced",
    duration: "25 min",
    icon: "zap",
  },
  {
    id: "5",
    title: "RGB Lighting Setup",
    difficulty: "Intermediate",
    duration: "12 min",
    icon: "sun",
  },
];

export default function BuildingGuidesScreen({ navigation }) {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return colors.success;
      case "Intermediate":
        return colors.warning;
      case "Advanced":
        return colors.error;
      default:
        return colors.text;
    }
  };

  return (
    <ScreenLayout navigation={navigation}>
      <View style={styles.container}>
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="book-open-page-variant"
            size={60}
            color={colors.mainYellow}
          />
          <Text style={styles.title}>Building Guides</Text>
          <Text style={styles.subtitle}>
            Learn how to build your perfect PC
          </Text>
        </View>

        {GUIDES.map((guide) => (
          <TouchableOpacity key={guide.id} style={styles.guideCard}>
            <View style={styles.guideIcon}>
              <Feather name={guide.icon} size={32} color={colors.mainYellow} />
            </View>
            <View style={styles.guideInfo}>
              <Text style={styles.guideTitle}>{guide.title}</Text>
              <View style={styles.guideMeta}>
                <View
                  style={[
                    styles.difficultyBadge,
                    {
                      backgroundColor:
                        getDifficultyColor(guide.difficulty) + "20",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.difficultyText,
                      { color: getDifficultyColor(guide.difficulty) },
                    ]}
                  >
                    {guide.difficulty}
                  </Text>
                </View>
                <View style={styles.duration}>
                  <Feather name="clock" size={14} color={colors.text} />
                  <Text style={styles.durationText}>{guide.duration}</Text>
                </View>
              </View>
            </View>
            <Feather name="chevron-right" size={24} color={colors.platinum} />
          </TouchableOpacity>
        ))}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.mainBeige,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.mainBlack,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
    marginTop: 8,
  },
  guideCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    alignItems: "center",
  },
  guideIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  guideInfo: {
    flex: 1,
  },
  guideTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.mainBlack,
    marginBottom: 8,
    lineHeight: 22,
  },
  guideMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: "600",
  },
  duration: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  durationText: {
    fontSize: 12,
    color: colors.text,
  },
});
