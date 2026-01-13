import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import ScreenLayout from "../../components/ScreenLayout";
import colors from "../../config/colors";

export default function ProductsScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      id: "cpu",
      name: "CPU",
      icon: "cpu-64-bit",
      screen: "CPU",
      color: colors.primary,
    },
    {
      id: "cooler",
      name: "CPU Cooler",
      icon: "fan",
      screen: "Cooler",
      color: colors.secondary,
    },
    {
      id: "motherboard",
      name: "Motherboard",
      icon: "chip",
      screen: "Motherboard",
      color: colors.accent,
    },
    {
      id: "memory",
      name: "Memory",
      icon: "memory",
      screen: "Memory",
      color: colors.success,
    },
    {
      id: "storage",
      name: "Storage",
      icon: "harddisk",
      screen: "Storage",
      color: colors.warning,
    },
    {
      id: "gpu",
      name: "GPU",
      icon: "expansion-card",
      screen: "GPU",
      color: colors.secondary,
    },
    {
      id: "case",
      name: "Case",
      icon: "desktop-tower",
      screen: "Case",
      color: colors.primary,
    },
    {
      id: "psu",
      name: "Power Supply",
      icon: "flash",
      screen: "PowerSupply",
      color: colors.error,
    },
    {
      id: "monitor",
      name: "Monitor",
      icon: "monitor",
      screen: "Monitor",
      color: colors.accent,
    },
    {
      id: "expansion",
      name: "Expansion Cards",
      icon: "network-outline",
      screen: "Expansion",
      color: colors.primary,
    },
    {
      id: "peripherals",
      name: "Peripherals",
      icon: "keyboard-outline",
      screen: "Peripherals",
      color: colors.secondary,
    },
    {
      id: "accessories",
      name: "Accessories",
      icon: "cable-data",
      screen: "Accessories",
      color: colors.success,
    },
  ];

  // Filter categories based on search query
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => navigation.navigate(item.screen)}
    >
      <View
        style={[styles.iconContainer, { backgroundColor: item.color + "20" }]}
      >
        <MaterialCommunityIcons name={item.icon} size={40} color={item.color} />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
      <Feather name="chevron-right" size={20} color={colors.platinum} />
    </TouchableOpacity>
  );

  return (
    <ScreenLayout navigation={navigation} scrollable={false}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Feather name="arrow-left" size={24} color={colors.mainBlack} />
            </TouchableOpacity>
            <View style={styles.headerText}>
              <Text style={styles.title}>Products</Text>
              <Text style={styles.subtitle}>Browse all PC components</Text>
            </View>
          </View>

          <View style={styles.searchContainer}>
            <Feather name="search" size={20} color={colors.platinum} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              placeholderTextColor={colors.platinum}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Feather name="x" size={20} color={colors.platinum} />
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={filteredCategories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Feather name="search" size={64} color={colors.platinum} />
                <Text style={styles.emptyTitle}>No Results Found</Text>
                <Text style={styles.emptyText}>
                  Try searching with different keywords
                </Text>
              </View>
            }
          />
        </View>
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.mainBeige,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.mainBlack,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    marginTop: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    paddingLeft: 12,
    fontSize: 16,
    color: colors.mainBlack,
  },
  listContainer: {
    paddingBottom: 20,
  },
  categoryCard: {
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
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  categoryName: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: colors.mainBlack,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.mainBlack,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
  },
});
