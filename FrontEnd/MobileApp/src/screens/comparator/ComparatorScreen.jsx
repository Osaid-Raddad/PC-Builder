import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import ScreenLayout from "../../components/ScreenLayout";
import colors from "../../config/colors";

export default function ComparatorScreen({ navigation }) {
  const [selectedProducts, setSelectedProducts] = useState([]);

  return (
    <ScreenLayout navigation={navigation}>
      <View style={styles.container}>
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="compare"
            size={60}
            color={colors.mainYellow}
          />
          <Text style={styles.title}>Comparator</Text>
          <Text style={styles.subtitle}>
            Compare PC components side by side
          </Text>
        </View>

        {selectedProducts.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="compare-horizontal"
              size={120}
              color={colors.platinum}
            />
            <Text style={styles.emptyTitle}>No Products Selected</Text>
            <Text style={styles.emptyText}>
              Select products to compare their specifications
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate("Products")}
            >
              <Feather name="plus" size={20} color={colors.mainBlack} />
              <Text style={styles.addButtonText}>Add Products</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView style={styles.compareContainer}>
            <Text style={styles.infoText}>
              Comparison feature coming soon...
            </Text>
          </ScrollView>
        )}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
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
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.mainBlack,
    marginTop: 24,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: colors.mainYellow,
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 16,
    alignItems: "center",
  },
  addButtonText: {
    color: colors.mainBlack,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  compareContainer: {
    flex: 1,
  },
  infoText: {
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
    marginTop: 20,
  },
});
