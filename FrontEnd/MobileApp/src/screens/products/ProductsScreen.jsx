import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
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
      id: "gpu",
      name: "GPU",
      icon: "expansion-card",
      screen: "GPU",
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
      name: "RAM",
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
      id: "power-supply",
      name: "Power Supply",
      icon: "flash",
      screen: "PowerSupply",
      color: colors.error,
    },
    {
      id: "case",
      name: "Case",
      icon: "desktop-tower",
      screen: "Case",
      color: colors.primary,
    },
    {
      id: "cooler",
      name: "Cooling",
      icon: "fan",
      screen: "Cooler",
      color: colors.secondary,
    },
    {
      id: "monitor",
      name: "Monitor",
      icon: "monitor",
      screen: "Monitor",
      color: colors.accent,
    },
    {
      id: "accessories",
      name: "Accessories",
      icon: "cable-data",
      screen: "Accessories",
      color: colors.success,
    },
  ];

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
    <ScreenLayout navigation={navigation}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Products</Text>
          <Text style={styles.subtitle}>Browse all PC components</Text>
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
        </View>

        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
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
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.mainBlack,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    marginTop: 8,
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
});
