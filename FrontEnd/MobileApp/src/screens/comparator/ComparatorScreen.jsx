import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import ScreenLayout from "../../components/ScreenLayout";
import colors from "../../config/colors";
import { useCompare } from "../../context/CompareContext";

export default function ComparatorScreen({ navigation }) {
  const { compareList, removeFromCompare, clearCompare, getCategory } = useCompare();

  const category = getCategory();

  // Map category names to display names
  const categoryNames = {
    'cpu': 'CPUs',
    'gpu': 'GPUs',
    'motherboard': 'Motherboards',
    'memory': 'Memory',
    'storage': 'Storage',
    'psu': 'Power Supplies',
    'case': 'Cases',
    'cpucooler': 'CPU Coolers',
    'monitor': 'Monitors',
    'accessories': 'Accessories',
    'expansion': 'Expansion Cards',
    'peripherals': 'Peripherals'
  };

  // Get all spec keys from selected products
  const getAllSpecKeys = () => {
    const keys = new Set();
    compareList.forEach(product => {
      Object.keys(product).forEach(key => {
        if (key !== 'id' && key !== 'category' && key !== 'name' && key !== 'image') {
          keys.add(key);
        }
      });
    });
    return Array.from(keys);
  };

  const specKeys = getAllSpecKeys();

  // Format spec key for display
  const formatSpecKey = (key) => {
    return key.replace(/([A-Z])/g, ' $1').trim();
  };

  // Handle clear all with confirmation
  const handleClearAll = () => {
    Alert.alert(
      "Clear All Products",
      "Are you sure you want to remove all products from comparison?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Clear", 
          style: "destructive",
          onPress: () => clearCompare()
        }
      ]
    );
  };

  // Handle remove single product
  const handleRemoveProduct = (productId, productName) => {
    Alert.alert(
      "Remove Product",
      `Remove ${productName} from comparison?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive",
          onPress: () => removeFromCompare(productId)
        }
      ]
    );
  };

  // Get icon for category
  const getCategoryIcon = (cat) => {
    const icons = {
      'cpu': '🖥️',
      'gpu': '🎮',
      'motherboard': '💻',
      'memory': '🧠',
      'storage': '💾',
      'psu': '⚡',
      'case': '📦',
      'cpucooler': '❄️',
      'monitor': '🖥️',
      'accessories': '🎯',
      'expansion': '🔌',
      'peripherals': '⌨️'
    };
    return icons[cat] || '💻';
  };

  return (
    <ScreenLayout navigation={navigation}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <MaterialCommunityIcons
              name="compare"
              size={40}
              color={colors.mainYellow}
            />
            <Text style={styles.title}>
              Compare {category ? categoryNames[category] : 'Components'}
            </Text>
          </View>
          
          {compareList.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearAll}
            >
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        {compareList.length === 0 ? (
          /* Empty State */
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="compare-horizontal"
              size={100}
              color={colors.mainYellow}
            />
            <Text style={styles.emptyTitle}>No Products Selected</Text>
            <Text style={styles.emptyText}>
              Go to any product category and tap the "+" button to add products for comparison
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate("Products")}
            >
              <Feather name="grid" size={20} color={colors.mainBlack} />
              <Text style={styles.addButtonText}>Browse Products</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Comparison Table */
          <ScrollView style={styles.compareContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
              <View style={styles.table}>
                {/* Header Row with Product Cards */}
                <View style={styles.headerRow}>
                  <View style={styles.specLabelCell}>
                    <Text style={styles.specLabelHeader}>Specification</Text>
                  </View>
                  {compareList.map(product => (
                    <View key={product.id} style={styles.productCell}>
                      <View style={styles.productCard}>
                        <TouchableOpacity
                          style={styles.removeButton}
                          onPress={() => handleRemoveProduct(product.id, product.name || `${product.brand} ${product.model}`)}
                        >
                          <Feather name="x" size={16} color="white" />
                        </TouchableOpacity>
                        <View style={styles.productIcon}>
                          <Text style={styles.iconEmoji}>{getCategoryIcon(category)}</Text>
                        </View>
                        <Text style={styles.productName}>
                          {product.name || `${product.brand} ${product.model}`}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>

                {/* Price Row */}
                <View style={styles.row}>
                  <View style={styles.specLabelCell}>
                    <Text style={styles.specLabel}>Price</Text>
                  </View>
                  {compareList.map(product => (
                    <View key={product.id} style={styles.specValueCell}>
                      <Text style={styles.priceValue}>${product.price}</Text>
                    </View>
                  ))}
                </View>

                {/* Dynamic Spec Rows */}
                {specKeys.map((key, index) => (
                  <View key={key} style={[styles.row, index % 2 === 0 && styles.rowAlt]}>
                    <View style={styles.specLabelCell}>
                      <Text style={styles.specLabel}>{formatSpecKey(key)}</Text>
                    </View>
                    {compareList.map(product => (
                      <View key={product.id} style={styles.specValueCell}>
                        <Text style={styles.specValue}>
                          {product[key] !== undefined && product[key] !== null 
                            ? String(product[key]) 
                            : '-'}
                        </Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            </ScrollView>

            {/* Add More Button */}
            {compareList.length < 4 && (
              <View style={styles.addMoreContainer}>
                <TouchableOpacity
                  style={styles.addMoreButton}
                  onPress={() => navigation.navigate("Products", { 
                    screen: category === 'cpu' ? 'CPU' : 
                           category === 'gpu' ? 'GPU' : 
                           category === 'motherboard' ? 'Motherboard' : 
                           'Products' 
                  })}
                >
                  <Feather name="plus" size={20} color="white" />
                  <Text style={styles.addMoreButtonText}>
                    Add More Products to Compare
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.mainBeige,
  },
  header: {
    padding: 16,
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.platinum,
    backgroundColor: "white",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.mainBlack,
    flex: 1,
  },
  clearButton: {
    backgroundColor: "#F44336",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  clearButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
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
    gap: 8,
  },
  addButtonText: {
    color: colors.mainBlack,
    fontSize: 16,
    fontWeight: "600",
  },
  compareContainer: {
    flex: 1,
  },
  table: {
    backgroundColor: "white",
    margin: 16,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.platinum,
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: colors.mainBeige,
    borderBottomWidth: 2,
    borderBottomColor: colors.platinum,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.platinum,
  },
  rowAlt: {
    backgroundColor: "#F9F9F9",
  },
  specLabelCell: {
    width: 150,
    padding: 16,
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: colors.platinum,
  },
  specLabelHeader: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.mainBlack,
  },
  specLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.mainBlack,
    textTransform: "capitalize",
  },
  productCell: {
    width: 180,
    padding: 12,
  },
  productCard: {
    alignItems: "center",
    position: "relative",
  },
  removeButton: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#F44336",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  productIcon: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: colors.mainBeige,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  iconEmoji: {
    fontSize: 32,
  },
  productName: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.mainBlack,
    textAlign: "center",
  },
  specValueCell: {
    width: 180,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  priceValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.mainYellow,
  },
  specValue: {
    fontSize: 14,
    color: colors.jet,
    textAlign: "center",
  },
  addMoreContainer: {
    padding: 16,
    alignItems: "center",
  },
  addMoreButton: {
    flexDirection: "row",
    backgroundColor: colors.mainYellow,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    gap: 8,
  },
  addMoreButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});

