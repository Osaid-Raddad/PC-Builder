import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import ScreenLayout from "../../components/ScreenLayout";
import colors from "../../config/colors";
import expansionData from "../../data/components/expansion.json";
import { useBuild } from "../../context/BuildContext";
import { useCompare } from "../../context/CompareContext";

export default function ExpansionScreen({ navigation }) {
  const { addComponent, selectedComponents } = useBuild();
  const { addToCompare, isInCompare, removeFromCompare, getCategory, compareList } = useCompare();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [brandFilter, setBrandFilter] = useState("All");

  const expansionList = expansionData.map(expansion => ({
    ...expansion,
    brand: expansion.manufacturer
  }));

  const types = ['All', ...new Set(expansionList.map(e => e.type))];
  const brands = ['All', ...new Set(expansionList.map(e => e.brand))];

  const handleAddToBuild = (product) => {
    addComponent('expansion', product);
    Alert.alert(
      "Expansion Card Added",
      `${product.name} has been added to your build.`,
      [
        { text: "Continue Browsing", style: "cancel" },
        {
          text: "View Build",
          onPress: () => navigation.navigate("Builder"),
        },
      ]
    );
  };

  const handleCompareToggle = (product) => {
    if (isInCompare(product.id)) {
      removeFromCompare(product.id);
      Alert.alert("Removed", `${product.name} removed from comparison.`);
    } else {
      const category = getCategory();
      if (category && category !== 'expansion') {
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
      addToCompare(product, 'expansion');
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

  const filteredExpansions = expansionList.filter(expansion => {
    const matchesSearch = searchTerm === '' || 
      expansion.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      expansion.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || expansion.type === typeFilter;
    const matchesBrand = brandFilter === 'All' || expansion.brand === brandFilter;
    return matchesSearch && matchesType && matchesBrand;
  });

  const renderExpansionCard = ({ item }) => {
    const isSelected = selectedComponents.expansion?.name === item.name;
    const inCompare = isInCompare(item.id);
    
    return (
    <TouchableOpacity
      style={[styles.productCard, isSelected && styles.productCardSelected]}
      onPress={() => navigation.navigate("ProductDetails", { product: item })}
    >
      <View style={styles.productInfo}>
        <Text style={styles.productBrand}>{item.brand}</Text>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Type</Text>
            <Text style={styles.detailValue}>{item.type}</Text>
          </View>
          {item.interface && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Interface</Text>
              <Text style={styles.detailValue}>{item.interface}</Text>
            </View>
          )}
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.price}>${item.price}</Text>
          <View style={styles.actionButtons}>
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
            <TouchableOpacity
              style={[styles.compareButton, inCompare && styles.compareButtonActive]}
              onPress={(e) => {
                e.stopPropagation();
                handleCompareToggle(item);
              }}
            >
              <MaterialCommunityIcons 
                name="compare" 
                size={20} 
                color={inCompare ? colors.mainYellow : colors.mainBlack} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
    );
  };

  return (
    <ScreenLayout navigation={navigation} scrollable={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color={colors.mainBlack} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <MaterialCommunityIcons name="network-outline" size={28} color={colors.mainYellow} />
            <Text style={styles.headerTitle}>Expansion Cards</Text>
          </View>
          <View style={{ width: 24 }} />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color={colors.platinum} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search expansion cards..."
            placeholderTextColor={colors.platinum}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>

        {/* Filter Chips */}
        <View style={styles.filtersContainer}>
          <Text style={styles.filterLabel}>Type:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScrollView}
          >
            {types.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.filterChip,
                  typeFilter === item && styles.filterChipActive
                ]}
                onPress={() => setTypeFilter(item)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    typeFilter === item && styles.filterChipTextActive
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.filtersContainer}>
          <Text style={styles.filterLabel}>Brand:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScrollView}
          >
            {brands.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.filterChip,
                  brandFilter === item && styles.filterChipActive
                ]}
                onPress={() => setBrandFilter(item)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    brandFilter === item && styles.filterChipTextActive
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Results Count */}
        <Text style={styles.resultsCount}>
          {filteredExpansions.length} Products Found
        </Text>

        {/* Products List */}
        <FlatList
          data={filteredExpansions}
          renderItem={renderExpansionCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.productsList}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.mainBeige,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.mainBlack,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.platinum,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.mainBlack,
  },
  filtersContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  filterScrollView: {
    flexGrow: 0,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.mainBlack,
    marginRight: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "white",
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.platinum,
  },
  filterChipActive: {
    backgroundColor: colors.mainYellow,
    borderColor: colors.mainYellow,
  },
  filterChipText: {
    fontSize: 14,
    color: colors.mainBlack,
  },
  filterChipTextActive: {
    fontWeight: "600",
  },
  resultsCount: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 12,
  },
  productsList: {
    paddingBottom: 20,
  },
  productCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productInfo: {
    flex: 1,
  },
  productBrand: {
    fontSize: 12,
    color: colors.mainYellow,
    fontWeight: "600",
    marginBottom: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.mainBlack,
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.text,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    color: colors.mainBlack,
    fontWeight: "500",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.mainYellow,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  addButton: {
    backgroundColor: colors.mainYellow,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonSelected: {
    backgroundColor: colors.success + "20",
  },
  compareButton: {
    backgroundColor: colors.platinum,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  compareButtonActive: {
    backgroundColor: colors.mainYellow + "40",
    borderWidth: 2,
    borderColor: colors.mainYellow,
  },
  productCardSelected: {
    borderColor: colors.success,
    borderWidth: 2,
  },
});
