import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ScreenLayout from "../components/ScreenLayout";
import colors from "../config/colors";

const { width } = Dimensions.get("window");

export default function HomeScreen({ navigation }) {
  const features = [
    {
      title: "PC Builder",
      description: "Build your custom PC step by step",
      icon: "hammer-wrench",
      color: colors.primary,
      screen: "Builder",
    },
    {
      title: "Compare",
      description: "Compare components side by side",
      icon: "compare",
      color: colors.secondary,
      screen: "Comparator",
    },
    {
      title: "Shops",
      description: "Browse local PC shops",
      icon: "store",
      color: colors.accent,
      screen: "Shops",
    },
    {
      title: "Guides",
      description: "Learn from expert tutorials",
      icon: "book-open-variant",
      color: colors.success,
      screen: "BuildingGuides",
    },
    {
      title: "Completed Builds",
      description: "Explore community builds",
      icon: "check-decagram",
      color: colors.mainYellow,
      screen: "CompletedBuilds",
    },
    {
      title: "Posts",
      description: "Share and discuss builds",
      icon: "post",
      color: colors.primary,
      screen: "Posts",
    },
    {
      title: "News",
      description: "Latest PC hardware news",
      icon: "newspaper",
      color: colors.secondary,
      screen: "News",
    },
    {
      title: "Chat",
      description: "Connect with builders",
      icon: "chat",
      color: colors.accent,
      screen: "Chat",
    },
    {
      title: "Tech Support",
      description: "Get expert assistance",
      icon: "tools",
      color: colors.success,
      screen: "TechSupport",
    },
    {
      title: "FAQ",
      description: "Frequently asked questions",
      icon: "help-circle",
      color: colors.mainYellow,
      screen: "FAQ",
    },
    {
      title: "Contact",
      description: "Get in touch with us",
      icon: "email",
      color: colors.primary,
      screen: "Contact",
    },
  ];

  // Group features into chunks of 4
  const groupedFeatures = [];
  for (let i = 0; i < features.length; i += 4) {
    groupedFeatures.push(features.slice(i, i + 4));
  }

  return (
    <ScreenLayout navigation={navigation}>
      <ScrollView style={styles.container}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <Image
            source={require("../../assets/LogoIcon.png")}
            style={styles.heroLogo}
            resizeMode="contain"
          />
          <Text style={styles.heroTitle}>PC Builder</Text>
          <Text style={styles.heroSubtitle}>
            Build Your Dream PC with Confidence
          </Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => navigation.navigate("Builder")}
          >
            <Text style={styles.ctaButtonText}>Start Building</Text>
          </TouchableOpacity>
        </View>

        {/* Features Grid */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Features</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            decelerationRate="fast"
            contentContainerStyle={styles.featuresScrollContent}
          >
            {groupedFeatures.map((group, pageIndex) => (
              <View key={pageIndex} style={styles.featurePage}>
                <View style={styles.featuresGrid}>
                  {group.map((feature, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.featureCard}
                      onPress={() => navigation.navigate(feature.screen)}
                    >
                      <View
                        style={[
                          styles.featureIconContainer,
                          { backgroundColor: feature.color + "20" },
                        ]}
                      >
                        <MaterialCommunityIcons
                          name={feature.icon}
                          size={32}
                          color={feature.color}
                        />
                      </View>
                      <Text style={styles.featureTitle}>{feature.title}</Text>
                      <Text style={styles.featureDescription}>
                        {feature.description}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Join Our Community</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>10K+</Text>
              <Text style={styles.statLabel}>Builders</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>50K+</Text>
              <Text style={styles.statLabel}>Builds</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>1000+</Text>
              <Text style={styles.statLabel}>Components</Text>
            </View>
          </View>
        </View>

        {/* Call to Action */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Ready to Build?</Text>
          <Text style={styles.ctaText}>
            Start your PC building journey today and create the perfect setup
          </Text>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("Builder")}
          >
            <Text style={styles.secondaryButtonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.mainBeige,
  },
  hero: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
    backgroundColor: colors.mainBlack,
  },
  heroLogo: {
    width: 150,
    height: 150,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.mainYellow,
    marginTop: 16,
  },
  heroSubtitle: {
    fontSize: 16,
    color: colors.alabaster,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  ctaButton: {
    backgroundColor: colors.mainYellow,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
  },
  ctaButtonText: {
    color: colors.mainBlack,
    fontSize: 16,
    fontWeight: "600",
  },
  featuresSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.mainBlack,
    marginBottom: 20,
  },
  featuresScrollContent: {
    paddingRight: 10,
  },
  featurePage: {
    width: width - 45,
    paddingHorizontal: 0,
    marginRight: 10,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureCard: {
    width: "48%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 12,
  },
  featureIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.mainBlack,
    marginBottom: 8,
    textAlign: "center",
  },
  featureDescription: {
    fontSize: 12,
    color: colors.text,
    textAlign: "center",
    lineHeight: 16,
  },
  statsSection: {
    paddingBottom: 30,
    backgroundColor: colors.mainBlack,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statCard: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.mainYellow,
  },
  statLabel: {
    fontSize: 14,
    color: colors.alabaster,
    marginTop: 4,
  },
  ctaSection: {
    padding: 20,
    alignItems: "center",
    marginVertical: 20,
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.mainBlack,
    marginBottom: 12,
  },
  ctaText: {
    fontSize: 14,
    color: colors.text,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  secondaryButton: {
    backgroundColor: colors.mainBlack,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
  },
  secondaryButtonText: {
    color: colors.mainYellow,
    fontSize: 16,
    fontWeight: "600",
  },
});
