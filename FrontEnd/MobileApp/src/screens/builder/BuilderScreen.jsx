import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
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
    removeComponent,
  } = useBuild();

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [buildName, setBuildName] = useState('');

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
    navigation.navigate(screen, { source: 'builder' });
  };

  const handleRemoveComponent = (componentId, componentName) => {
    Alert.alert(
      "Remove Component",
      `Remove ${componentName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removeComponent(componentId),
        },
      ]
    );
  };

  const handleSaveBuild = () => {
    if (componentCount === 0) {
      Alert.alert("Empty Build", "Please add at least one component before saving.");
      return;
    }
    setShowSaveModal(true);
  };

  const saveBuildWithName = async () => {
    if (!buildName.trim()) {
      Alert.alert("Build Name Required", "Please enter a name for your build.");
      return;
    }

    try {
      const newBuild = {
        id: Date.now().toString(),
        name: buildName.trim(),
        components: selectedComponents,
        totalPrice: totalPrice,
        totalPower: totalPower,
        compatibility: compatibility,
        performance: performance,
        componentCount: componentCount,
        createdAt: new Date().toISOString(),
      };

      // Get existing builds
      const existingBuildsJson = await AsyncStorage.getItem('savedBuilds');
      const existingBuilds = existingBuildsJson ? JSON.parse(existingBuildsJson) : [];

      // Add new build
      const updatedBuilds = [newBuild, ...existingBuilds];

      // Save to AsyncStorage
      await AsyncStorage.setItem('savedBuilds', JSON.stringify(updatedBuilds));

      setShowSaveModal(false);
      setBuildName('');

      Alert.alert(
        "Build Saved!",
        `"${buildName}" has been saved to your builds.`,
        [
          { text: "OK" },
          { text: "View Builds", onPress: () => navigation.navigate('Profile') }
        ]
      );
    } catch (error) {
      console.error('Error saving build:', error);
      Alert.alert("Error", "Failed to save build. Please try again.");
    }
  };

  return (
    <ScreenLayout navigation={navigation}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require("../../../assets/LogoBig.png")}
            style={styles.logoImage}
          />
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
                {selectedComponents[component.id] ? (
                  <View style={styles.selectedProductInfo}>
                    <View style={styles.selectedProductDetails}>
                      <Text style={styles.selectedProductName}>
                        {selectedComponents[component.id].name || 
                         `${selectedComponents[component.id].brand || selectedComponents[component.id].manufacturer || ''} ${selectedComponents[component.id].model || ''}`.trim()}
                      </Text>
                      <Text style={styles.selectedProductPrice}>
                        ${selectedComponents[component.id].price}
                      </Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => handleRemoveComponent(component.id, component.name)}
                    >
                      <Feather name="x" size={20} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Text style={styles.componentStatus}>
                    {component.description}
                  </Text>
                )}
              </View>
              <Feather name="chevron-right" size={24} color={colors.platinum} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSaveBuild}
        >
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

        {/* Save Build Modal */}
        <Modal
          visible={showSaveModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowSaveModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.saveModal}>
              <Text style={styles.modalTitle}>Save Build</Text>
              <Text style={styles.modalSubtitle}>Give your build a name</Text>
              
              <TextInput
                style={styles.buildNameInput}
                placeholder="e.g., Gaming Beast 2026"
                placeholderTextColor={colors.text}
                value={buildName}
                onChangeText={setBuildName}
                autoFocus
              />

              <View style={styles.buildSummary}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Components:</Text>
                  <Text style={styles.summaryValue}>{componentCount}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Total Cost:</Text>
                  <Text style={styles.summaryValue}>${totalPrice.toFixed(0)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Power:</Text>
                  <Text style={styles.summaryValue}>{totalPower}W</Text>
                </View>
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => {
                    setShowSaveModal(false);
                    setBuildName('');
                  }}
                >
                  <Text style={styles.modalCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalSaveButton}
                  onPress={saveBuildWithName}
                >
                  <Feather name="save" size={18} color={colors.mainBlack} />
                  <Text style={styles.modalSaveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  selectedProductInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },
  selectedProductDetails: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: 8,
  },
  selectedProductName: {
    fontSize: 14,
    color: colors.success,
    fontWeight: "500",
    flex: 1,
  },
  selectedProductPrice: {
    fontSize: 14,
    color: colors.mainYellow,
    fontWeight: "600",
    marginLeft: 8,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.error + "10",
    justifyContent: "center",
    alignItems: "center",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  saveModal: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.mainBlack,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 20,
  },
  buildNameInput: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.mainBlack,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.mainYellow,
  },
  buildSummary: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.text,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.mainBlack,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalCancelButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  modalSaveButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: colors.mainYellow,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  modalSaveButtonText: {
    color: colors.mainBlack,
    fontSize: 16,
    fontWeight: "600",
  },
});
