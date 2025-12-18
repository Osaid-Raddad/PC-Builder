import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import ScreenLayout from "../../components/ScreenLayout";
import colors from "../../config/colors";

export default function BuilderScreen({ navigation }) {
  const [selectedComponents, setSelectedComponents] = useState({});

  const components = [
    { id: "cpu", name: "CPU", icon: "cpu-64-bit", required: true, screen: "CPU" },
    { id: "gpu", name: "GPU", icon: "expansion-card", required: false, screen: "GPU" },
    { id: "motherboard", name: "Motherboard", icon: "chip", required: true, screen: "Motherboard" },
    { id: "memory", name: "RAM", icon: "memory", required: true, screen: "Memory" },
    { id: "storage", name: "Storage", icon: "harddisk", required: true, screen: "Storage" },
    { id: "power-supply", name: "Power Supply", icon: "flash", required: true, screen: "PowerSupply" },
    { id: "case", name: "Case", icon: "desktop-tower", required: true, screen: "Case" },
    { id: "cooler", name: "Cooling", icon: "fan", required: false, screen: "Cooler" },
    { id: "monitor", name: "Monitor", icon: "monitor", required: false, screen: "Monitor" },
    {
      id: "accessories",
      name: "Accessories",
      icon: "cable-data",
      required: false,
      screen: "Accessories",
    },
  ];

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
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Components</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>$0</Text>
            <Text style={styles.statLabel}>Total Cost</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0W</Text>
            <Text style={styles.statLabel}>Power</Text>
          </View>
        </View>

        {/* Compatibility Status */}
        <View style={styles.compatibilityCard}>
          <View style={styles.compatibilityHeader}>
            <MaterialCommunityIcons
              name="check-decagram"
              size={24}
              color={colors.success}
            />
            <Text style={styles.compatibilityTitle}>Compatibility Status</Text>
          </View>
          <View style={styles.compatibilityContent}>
            <View style={styles.compatibilityItem}>
              <Feather name="check-circle" size={18} color={colors.success} />
              <Text style={styles.compatibilityText}>All components compatible</Text>
            </View>
            <View style={styles.compatibilityItem}>
              <Feather name="info" size={18} color={colors.primary} />
              <Text style={styles.compatibilityTextInfo}>Add components to check compatibility</Text>
            </View>
          </View>
        </View>

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

        <TouchableOpacity style={styles.clearButton}>
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
