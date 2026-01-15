import React, { useState, useRef } from "react";
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
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef(null);
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
      title: "AI Hardware Calculator",
      description: "Find hardware for AI workloads",
      icon: "brain",
      color: colors.mainYellow,
      screen: "AIHardwareCalculator",
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
      color: colors.primary,
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
      title: "Quantum Computing",
      description: "Explore the future of computing",
      icon: "atom",
      color: colors.mainYellow,
      screen: "QuantumComputing",
    },
    {
      title: "FAQ",
      description: "Frequently asked questions",
      icon: "help-circle",
      color: colors.primary,
      screen: "FAQ",
    },
    {
      title: "Contact",
      description: "Get in touch with us",
      icon: "email",
      color: colors.secondary,
      screen: "Contact",
    },
  ];

  // Group features into chunks of 4
  const groupedFeatures = [];
  for (let i = 0; i < features.length; i += 4) {
    groupedFeatures.push(features.slice(i, i + 4));
  }

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const pageWidth = width - 45 + 10; // featurePage width + marginRight
    const page = Math.round(scrollPosition / pageWidth);
    setCurrentPage(page);
  };

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
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            decelerationRate="fast"
            contentContainerStyle={styles.featuresScrollContent}
            onScroll={handleScroll}
            scrollEventThrottle={16}
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
          
          {/* Pagination Dots */}
          <View style={styles.pagination}>
            {groupedFeatures.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  const pageWidth = width - 45 + 10;
                  scrollViewRef.current?.scrollTo({
                    x: index * pageWidth,
                    animated: true,
                  });
                }}
              >
                <View
                  style={[
                    styles.paginationDot,
                    currentPage === index && styles.paginationDotActive,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* AI Hardware Calculator Special Banner */}
        <TouchableOpacity
          style={styles.aiCalculatorBanner}
          onPress={() => navigation.navigate("AIHardwareCalculator")}
          activeOpacity={0.9}
        >
          <View style={styles.aiCalculatorGradient}>
            {/* Decorative Elements */}
            <View style={styles.aiCalculatorDecor}>
              <View style={styles.decorCircle1} />
              <View style={styles.decorCircle2} />
              <View style={styles.decorCircle3} />
            </View>
            
            <View style={styles.aiCalculatorContent}>
              <View style={styles.aiCalculatorLeft}>
                <View style={styles.newBadge}>
                  <MaterialCommunityIcons name="sparkles" size={12} color={colors.mainBlack} />
                  <Text style={styles.newBadgeText}>NEW</Text>
                </View>
                <Text style={styles.aiCalculatorTitle}>AI Hardware{"\n"}Calculator</Text>
                <Text style={styles.aiCalculatorSubtitle}>
                  🤖 Find perfect specs for your AI projects
                </Text>
                <View style={styles.aiCalculatorFeatures}>
                  <View style={styles.featureTag}>
                    <MaterialCommunityIcons name="lightning-bolt" size={14} color={colors.mainYellow} />
                    <Text style={styles.featureTagText}>LLMs</Text>
                  </View>
                  <View style={styles.featureTag}>
                    <MaterialCommunityIcons name="image-outline" size={14} color={colors.mainYellow} />
                    <Text style={styles.featureTagText}>Image Gen</Text>
                  </View>
                  <View style={styles.featureTag}>
                    <MaterialCommunityIcons name="brain" size={14} color={colors.mainYellow} />
                    <Text style={styles.featureTagText}>Custom</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.aiCalculatorRight}>
                <View style={styles.aiIconContainer}>
                  <MaterialCommunityIcons name="brain" size={50} color={colors.mainYellow} />
                  <View style={styles.pulseRing} />
                </View>
                <View style={styles.arrowButton}>
                  <MaterialCommunityIcons name="arrow-right" size={24} color={colors.mainBlack} />
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>

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
          <Text style={styles.ctaTitle}>Discover PC Builds!</Text>
          <Text style={styles.ctaText}>
            Explore amazing PC builds from our community!
          </Text>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("CompletedBuilds")}
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
  aiCalculatorBanner: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 8,
    shadowColor: colors.mainYellow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  aiCalculatorGradient: {
    backgroundColor: colors.mainBlack,
    position: "relative",
  },
  aiCalculatorDecor: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  decorCircle1: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.mainYellow,
    opacity: 0.1,
    top: -30,
    right: -20,
  },
  decorCircle2: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.mainYellow,
    opacity: 0.08,
    bottom: -20,
    left: 20,
  },
  decorCircle3: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.mainYellow,
    opacity: 0.12,
    top: 40,
    left: -10,
  },
  aiCalculatorContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    paddingVertical: 24,
  },
  aiCalculatorLeft: {
    flex: 1,
    paddingRight: 15,
  },
  newBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.mainYellow,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 12,
    gap: 4,
  },
  newBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.mainBlack,
    letterSpacing: 1,
  },
  aiCalculatorTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.mainYellow,
    marginBottom: 8,
    lineHeight: 30,
  },
  aiCalculatorSubtitle: {
    fontSize: 14,
    color: colors.alabaster,
    marginBottom: 12,
    lineHeight: 20,
  },
  aiCalculatorFeatures: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  featureTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 193, 7, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 193, 7, 0.3)",
  },
  featureTagText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.mainYellow,
  },
  aiCalculatorRight: {
    alignItems: "center",
    gap: 12,
  },
  aiIconContainer: {
    position: "relative",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 193, 7, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.mainYellow,
  },
  pulseRing: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: colors.mainYellow,
    opacity: 0.3,
  },
  arrowButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.mainYellow,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: colors.mainYellow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
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
    height: 160,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
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
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.platinum,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    width: 24,
    backgroundColor: colors.mainYellow,
  },
  statsSection: {
    marginTop: 40,
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
