import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import ScreenLayout from "../../components/ScreenLayout";
import colors from "../../config/colors";
import { useBuild } from "../../context/BuildContext";

export default function BuilderScreen({ navigation }) {
  const {
    selectedComponents,
    calculateTotalPrice,
    calculateTotalPower,
    checkCompatibility,
    getPerformanceScore,
    clearBuild,
  } = useBuild();

  const components = [
    { id: "cpu", name: "CPU", icon: "cpu-64-bit", description: "Choose your processor", required: true, screen: "CPU" },
    { id: "cooler", name: "CPU Cooler", icon: "fan", description: "Keep your CPU cool", required: true, screen: "Cooler" },
    { id: "motherboard", name: "Motherboard", icon: "chip", description: "The backbone of your PC", required: true, screen: "Motherboard" },
    { id: "memory", name: "Memory", icon: "memory", description: "RAM for multitasking", required: true, screen: "Memory" },
    { id: "storage", name: "Storage", icon: "harddisk", description: "HDD/SSD for your data", required: true, screen: "Storage" },
    { id: "gpu", name: "GPU", icon: "expansion-card", description: "Graphics card for gaming", required: false, screen: "GPU" },
    { id: "case", name: "Case", icon: "desktop-tower", description: "House your components", required: true, screen: "Case" },
    { id: "psu", name: "Power Supply", icon: "flash", description: "Power your build", required: true, screen: "PowerSupply" },
    { id: "monitor", name: "Monitor", icon: "monitor", description: "Display your visuals", required: false, screen: "Monitor" },
    { id: "expansion", name: "Expansion Cards / Networking", icon: "network-outline", description: "Wi-Fi, sound cards, etc.", required: false, screen: "Expansion" },
    { id: "peripherals", name: "Peripherals", icon: "keyboard-outline", description: "Keyboard, mouse, etc.", required: false, screen: "Peripherals" },
    { id: "accessories", name: "Accessories / Other", icon: "cable-data", description: "Extra items", required: false, screen: "Accessories" },
  ];

  const totalPrice = calculateTotalPrice();
  const totalPower = calculateTotalPower();
  const compatibility = checkCompatibility();
  const performance = getPerformanceScore();
  const componentCount = Object.values(selectedComponents).filter(Boolean).length;

  const handleClearBuild = () => {
    Alert.alert(
      "Clear Build",
      "Are you sure you want to clear all components?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => clearBuild(),
        },
      ]
    );
  };

  const handleSelectComponent = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <ScreenLayout navigation={navigation}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require("../../../assets/LogoBig.png")}
            style={styles.logoImage}
          />
          <Text style={styles.title}>PC Builder</Text>
          <Text style={styles.subtitle}>Build your custom PC step by step</Text>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{componentCount}</Text>
            <Text style={styles.statLabel}>Components</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>${totalPrice.toFixed(0)}</Text>
            <Text style={styles.statLabel}>Total Cost</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalPower}W</Text>
            <Text style={styles.statLabel}>Power</Text>
          </View>
        </View>

        {/* Compatibility Status */}
        <View style={[
          styles.compatibilityCard,
          { borderLeftColor: !compatibility.isCompatible ? colors.error : 
                             compatibility.hasWarnings ? colors.warning : 
                             colors.success }
        ]}>
          <View style={styles.compatibilityHeader}>
            <MaterialCommunityIcons
              name={!compatibility.isCompatible ? "alert-circle" : 
                    compatibility.hasWarnings ? "alert" : 
                    "check-decagram"}
              size={24}
              color={!compatibility.isCompatible ? colors.error : 
                     compatibility.hasWarnings ? colors.warning : 
                     colors.success}
            />
            <Text style={styles.compatibilityTitle}>Compatibility Status</Text>
          </View>
          <View style={styles.compatibilityContent}>
            {componentCount === 0 ? (
              <View style={styles.compatibilityItem}>
                <Feather name="info" size={18} color={colors.primary} />
                <Text style={styles.compatibilityTextInfo}>
                  Add components to check compatibility
                </Text>
              </View>
            ) : (
              <>
                {compatibility.isCompatible && !compatibility.hasWarnings && (
                  <View style={styles.compatibilityItem}>
                    <Feather name="check-circle" size={18} color={colors.success} />
                    <Text style={styles.compatibilityText}>
                      All components compatible
                    </Text>
                  </View>
                )}
                {compatibility.issues.map((issue, index) => (
                  <View key={`issue-${index}`} style={styles.compatibilityItem}>
                    <Feather name="x-circle" size={18} color={colors.error} />
                    <Text style={styles.compatibilityTextError}>
                      {issue.message}
                    </Text>
                  </View>
                ))}
                {compatibility.warnings.map((warning, index) => (
                  <View key={`warning-${index}`} style={styles.compatibilityItem}>
                    <Feather name="alert-triangle" size={18} color={colors.warning} />
                    <Text style={styles.compatibilityTextWarning}>
                      {warning.message}
                    </Text>
                  </View>
                ))}
              </>
            )}
          </View>
        </View>

        {/* Performance Score */}
        {componentCount > 0 && (
          <View style={styles.performanceCard}>
            <View style={styles.performanceHeader}>
              <MaterialCommunityIcons
                name="speedometer"
                size={24}
                color={colors.mainYellow}
              />
              <Text style={styles.performanceTitle}>Performance Score</Text>
            </View>
            <View style={styles.performanceContent}>
              <Text style={styles.performanceScore}>{performance.score}</Text>
              <Text style={styles.performanceCategory}>{performance.category}</Text>
            </View>
          </View>
        )}

        <Text style={styles.sectionTitle}>Select Components</Text>

        <View style={styles.componentsList}>
          {components.map((component) => (
            <TouchableOpacity
              key={component.id}
              style={styles.componentCard}
              onPress={() => handleSelectComponent(component.screen)}
            >
              <View style={styles.componentIcon}>
                <MaterialCommunityIcons
                  name={component.icon}
                  size={32}
                  color={
                    selectedComponents[component.id]
                      ? colors.success
                      : colors.mainYellow
                  }
                />
              </View>
              <View style={styles.componentInfo}>
                <View style={styles.componentHeader}>
                  <Text style={styles.componentName}>{component.name}</Text>
                  {component.required && (
                    <View style={styles.requiredBadge}>
                      <Text style={styles.requiredText}>Required</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.componentStatus}>
                  {selectedComponents[component.id]
                    ? "Selected"
                    : "Not selected"}
                </Text>
              </View>
              <Feather name="chevron-right" size={24} color={colors.platinum} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.saveButton}>
          <Feather name="save" size={20} color={colors.mainBlack} />
          <Text style={styles.saveButtonText}>Save Build</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.clearButton}
          onPress={handleClearBuild}
        >
          <Feather name="trash-2" size={20} color={colors.error} />
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.mainBeige,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  logoImage: {
    width: 180,
    height: 180,
    resizeMode: "contain",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.mainBlack,
    marginTop: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
    marginTop: 8,
  },
  statsCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.mainYellow,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  compatibilityCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  compatibilityHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  compatibilityTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.mainBlack,
    marginLeft: 8,
  },
  compatibilityContent: {
    gap: 8,
  },
  compatibilityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  compatibilityText: {
    fontSize: 14,
    color: colors.success,
    marginLeft: 10,
    fontWeight: "500",
  },
  compatibilityTextInfo: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 10,
  },
  compatibilityTextError: {
    fontSize: 14,
    color: colors.error,
    marginLeft: 10,
    fontWeight: "500",
    flex: 1,
  },
  compatibilityTextWarning: {
    fontSize: 14,
    color: colors.warning || "#f59e0b",
    marginLeft: 10,
    fontWeight: "500",
    flex: 1,
  },
  performanceCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: colors.mainYellow,
  },
  performanceHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  performanceTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.mainBlack,
    marginLeft: 8,
  },
  performanceContent: {
    alignItems: "center",
  },
  performanceScore: {
    fontSize: 48,
    fontWeight: "bold",
    color: colors.mainYellow,
  },
  performanceCategory: {
    fontSize: 18,
    color: colors.text,
    marginTop: 4,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.mainBlack,
    marginBottom: 16,
  },
  componentsList: {
    marginBottom: 16,
  },
  componentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  componentIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.mainBlack + "10",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  componentInfo: {
    flex: 1,
  },
  componentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  componentName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.mainBlack,
    marginRight: 8,
  },
  requiredBadge: {
    backgroundColor: colors.error + "20",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  requiredText: {
    fontSize: 10,
    color: colors.error,
    fontWeight: "600",
  },
  componentStatus: {
    fontSize: 14,
    color: colors.text,
  },
  saveButton: {
    flexDirection: "row",
    backgroundColor: colors.mainYellow,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  saveButtonText: {
    color: colors.mainBlack,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  clearButton: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.error,
  },
  clearButtonText: {
    color: colors.error,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
