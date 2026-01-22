import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import ScreenLayout from "../../components/ScreenLayout";
import colors from "../../config/colors";
import psuData from "../../data/components/powerSupplies.json";
import { getPSUImage } from "../../utils/imageMapper";
import { useBuild } from "../../context/BuildContext";
import { useCompare } from "../../context/CompareContext";

const MOCK_PRODUCTS = (psuData?.powerSupplies || []).map(psu => {
  const brandName = psu.brand || psu.manufacturer;
  return {
    ...psu,
    name: psu.model ? `${brandName} ${psu.model}` : brandName,
    brand: brandName,
  };
});

export default function PowerSupplyScreen({ navigation, route }) {
  const { addComponent, removeComponent, selectedComponents } = useBuild();
  const { source } = route.params || {}; // 'builder' or 'comparator'
  const { addToCompare, isInCompare, removeFromCompare, getCategory, compareList } = useCompare();
  const [selectedFilter, setSelectedFilter] = useState("all");

  const handleAddToBuild = (product) => {
    const componentType = 'psu';
    const isSelected = selectedComponents[componentType]?.model === product.model;
    
    if (isSelected) {
      removeComponent(componentType);
      Alert.alert("Removed", `${product.name} removed from your build.`);
    } else {
      addComponent(componentType, product);
      Alert.alert(
        "Added to Build",
        `${product.name} has been added to your build.`,
        [
          { text: "Continue Browsing", style: "cancel" },
          {
            text: "View Build",
            onPress: () => navigation.navigate("Builder"),
          },
        ]
      );
    }
  };

  const handleCompareToggle = (product) => {
    if (isInCompare(product.id)) {
      removeFromCompare(product.id);
      Alert.alert("Removed", `${product.name} removed from comparison.`);
    } else {
      const category = getCategory();
      if (category && category !== 'psu') {
        Alert.alert(
          "Different Category",
          `You can only compare products from the same category. Clear your current comparison first.`,
          [{ text: "OK" }]
        );
        return;
      }
      if (compareList.length >= 4) {
        Alert.alert(
          "Limit Reached",
          "You can compare up to 4 products at once.",
          [{ text: "OK" }]
        );
        return;
      }
      addToCompare(product, 'psu');
      Alert.alert(
        "Added to Compare",
        `${product.name} added to comparison.`,
        [
          { text: "Continue Browsing", style: "cancel" },
          {
            text: "View Comparison",
            onPress: () => navigation.navigate("Comparator"),
          },
        ]
      );
    }
  };

  // Filter products based on selected filter
  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    if (selectedFilter === "all") return true;
    
    // Filter by wattage ranges
    const wattage = product.wattage || 0;
    if (selectedFilter === "intel") {
      // Low to mid range (for basic builds)
      return wattage >= 400 && wattage <= 650;
    }
    if (selectedFilter === "amd") {
      // High range (for gaming/performance builds)
      return wattage >= 700;
    }
    
    return true;
  });

  const renderProduct = ({ item }) => {
    const isSelected = selectedComponents.psu?.model === item.model;
    const inCompare = isInCompare(item.id);
    const psuImage = getPSUImage(item.manufacturer || item.brand, item.model);
    
    return (
    <TouchableOpacity 
      style={[styles.productCard, isSelected && styles.productCardSelected]}
      onPress={() => navigation.navigate('ProductDetails', { 
        category: 'power-supply', 
        productId: item.id 
      })}
    >
      <View style={styles.productImage}>
        {psuImage ? (
          <Image source={psuImage} style={styles.productImageActual} resizeMode="contain" />
        ) : (
          <Feather name="zap" size={48} color={colors.mainYellow} />
        )}
        {isSelected && (
          <View style={styles.selectedBadge}>
            <Feather name="check-circle" size={20} color={colors.success} />
          </View>
        )}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productBrand}>{item.brand}</Text>
        <View style={styles.productFooter}>
          <Text style={styles.productPrice}>${item.price}</Text>
          <View style={styles.rating}>
            <Feather name="star" size={16} color={colors.mainYellow} />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
      </View>
      {(source === 'builder' || source === 'comparator' || source) && (
        <View style={styles.actionButtons}>
          {source !== 'builder' && (
            <TouchableOpacity 
              style={[
                styles.compareButton,
                inCompare && styles.compareButtonActive,
              ]}
              onPress={(e) => {
                e.stopPropagation();
                handleCompareToggle(item);
              }}
            >
              <MaterialCommunityIcons 
                name={inCompare ? "check" : "compare"} 
                size={20} 
                color={inCompare ? "white" : colors.mainYellow} 
              />
            </TouchableOpacity>
          )}
          {source !== 'comparator' && (
            <TouchableOpacity 
              style={[styles.addButton, isSelected && styles.addButtonSelected]}
              onPress={(e) => {
                e.stopPropagation();
                handleAddToBuild(item);
              }}
            >
              <Feather 
                name={isSelected ? "check" : "plus"} 
                size={20} 
                color={isSelected ? colors.success : colors.mainBlack} 
              />
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
    );
  };

  return (
    <ScreenLayout navigation={navigation} scrollable={false} showFooter={false}>
      <View style={styles.container}>
        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <>
              <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Feather name="arrow-left" size={24} color={colors.mainBlack} />
                </TouchableOpacity>
                <Text style={styles.title}>Power Supplies</Text>
                <TouchableOpacity>
                  <Feather name="filter" size={24} color={colors.mainBlack} />
                </TouchableOpacity>
              </View>

              <View style={styles.filters}>
                {["all", "intel", "amd"].map((filter) => (
                  <TouchableOpacity
                    key={filter}
                    style={[
                      styles.filterButton,
                      selectedFilter === filter && styles.filterButtonActive,
                    ]}
                    onPress={() => setSelectedFilter(filter)}
                  >
                    <Text
                      style={[
                        styles.filterText,
                        selectedFilter === filter && styles.filterTextActive,
                      ]}
                    >
                      {filter.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          }
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.mainBlack,
  },
  filters: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.mainYellow,
    borderColor: colors.mainYellow,
  },
  filterText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "500",
  },
  filterTextActive: {
    color: colors.mainBlack,
    fontWeight: "600",
  },
  listContainer: {
    paddingBottom: 20,
  },
  productCard: {
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
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  productImageActual: {
    width: "100%",
    height: "100%",
  },
  productInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.mainBlack,
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
  },
  productFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.mainYellow,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  compareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: colors.mainYellow,
    justifyContent: "center",
    alignItems: "center",
  },
  detailsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: colors.mainBlack,
    justifyContent: "center",
    alignItems: "center",
  },
  compareButtonActive: {
    backgroundColor: colors.mainYellow,
    borderColor: colors.mainYellow,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.mainYellow,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonSelected: {
    backgroundColor: colors.success + "20",
  },
  productCardSelected: {
    borderColor: colors.success,
    borderWidth: 2,
  },
  selectedBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "white",
    borderRadius: 10,
  },
});
