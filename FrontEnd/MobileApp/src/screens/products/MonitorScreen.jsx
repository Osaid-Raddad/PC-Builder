import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import ScreenLayout from "../../components/ScreenLayout";
import colors from "../../config/colors";
import monitorsData from "../../data/components/monitors.json";
import { useBuild } from "../../context/BuildContext";
import { useCompare } from "../../context/CompareContext";

const MOCK_PRODUCTS = (monitorsData || []).map(monitor => ({
  ...monitor,
  manufacturer: monitor.brand,
  model: monitor.name,
}));

export default function MonitorScreen({ navigation }) {
  const { addComponent, selectedComponents } = useBuild();
  const { addToCompare, isInCompare, removeFromCompare, getCategory, compareList } = useCompare();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 2000 },
    manufacturers: [],
    rating: 0,
    screenSize: [],
    resolution: [],
    refreshRate: [],
    responseTime: { min: 0, max: 10 },
    panelType: [],
    aspectRatio: [],
    curvedScreen: null,
    interface: [],
    frameSync: [],
    builtInSpeakers: null,
  });

  const handleCheckboxToggle = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: prev[filterName].includes(value)
        ? prev[filterName].filter(item => item !== value)
        : [...prev[filterName], value]
    }));
  };

  const resetFilters = () => {
    setFilters({
      priceRange: { min: 0, max: 2000 },
      manufacturers: [],
      rating: 0,
      screenSize: [],
      resolution: [],
      refreshRate: [],
      responseTime: { min: 0, max: 10 },
      panelType: [],
      aspectRatio: [],
      curvedScreen: null,
      interface: [],
      frameSync: [],
      builtInSpeakers: null,
    });
  };

  const handleAddToBuild = (product) => {
    addComponent('monitor', product);
    Alert.alert(
      "Monitor Added",
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
      if (category && category !== 'monitor') {
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
      addToCompare(product, 'monitor');
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

  const renderProduct = ({ item }) => {
    const isSelected = selectedComponents.monitor?.model === item.model;
    const inCompare = isInCompare(item.id);
    
    return (
    <TouchableOpacity 
      style={[styles.productCard, isSelected && styles.productCardSelected]}
      onPress={() => navigation.navigate('ProductDetails', { 
        category: 'monitor', 
        productId: item.id 
      })}
    >
      <View style={styles.productImage}>
        <Feather name="monitor" size={48} color={colors.mainYellow} />
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
    </TouchableOpacity>
    );
  };

  return (
    <ScreenLayout navigation={navigation} scrollable={false} showFooter={false}>
      <View style={styles.container}>
        <FlatList
          data={MOCK_PRODUCTS}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <>
              <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Feather name="arrow-left" size={24} color={colors.mainBlack} />
                </TouchableOpacity>
                <Text style={styles.title}>Monitors</Text>
                <TouchableOpacity onPress={() => setShowFilterModal(true)}>
                  <Feather name="filter" size={24} color={colors.mainBlack} />
                </TouchableOpacity>
              </View>

              <View style={styles.quickFilters}>
                {["1440p", "4K", "144Hz"].map((filter) => (
                  <TouchableOpacity
                    key={filter}
                    style={[
                      styles.quickFilterButton,
                      (filter === "1440p" && filters.resolution.includes("1440p")) ||
                      (filter === "4K" && filters.resolution.includes("4K")) ||
                      (filter === "144Hz" && filters.refreshRate.includes("144Hz"))
                        ? styles.quickFilterButtonActive
                        : null,
                    ]}
                    onPress={() => {
                      if (filter === "1440p" || filter === "4K") {
                        handleCheckboxToggle('resolution', filter);
                      } else if (filter === "144Hz") {
                        handleCheckboxToggle('refreshRate', filter);
                      }
                    }}
                  >
                    <Text
                      style={[
                        styles.quickFilterText,
                        (filter === "1440p" && filters.resolution.includes("1440p")) ||
                        (filter === "4K" && filters.resolution.includes("4K")) ||
                        (filter === "144Hz" && filters.refreshRate.includes("144Hz"))
                          ? styles.quickFilterTextActive
                          : null,
                      ]}
                    >
                      {filter}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          }
          contentContainerStyle={styles.listContainer}
        />
      </View>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.filterModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <View style={styles.modalActions}>
                <TouchableOpacity onPress={resetFilters}>
                  <Text style={styles.resetText}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                  <Feather name="x" size={24} color={colors.mainBlack} />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView style={styles.filterContent}>
              {/* Price Range */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Price Range</Text>
                <View style={styles.rangeControl}>
                  <View style={styles.rangeInput}>
                    <Text style={styles.rangeLabel}>Min:</Text>
                    <TouchableOpacity 
                      style={styles.rangeButton}
                      onPress={() => setFilters(prev => ({
                        ...prev,
                        priceRange: { ...prev.priceRange, min: Math.max(0, prev.priceRange.min - 50) }
                      }))}
                    >
                      <Feather name="minus" size={16} color={colors.mainBlack} />
                    </TouchableOpacity>
                    <Text style={styles.rangeValue}>${filters.priceRange.min}</Text>
                    <TouchableOpacity 
                      style={styles.rangeButton}
                      onPress={() => setFilters(prev => ({
                        ...prev,
                        priceRange: { ...prev.priceRange, min: Math.min(prev.priceRange.max - 50, prev.priceRange.min + 50) }
                      }))}
                    >
                      <Feather name="plus" size={16} color={colors.mainBlack} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.rangeInput}>
                    <Text style={styles.rangeLabel}>Max:</Text>
                    <TouchableOpacity 
                      style={styles.rangeButton}
                      onPress={() => setFilters(prev => ({
                        ...prev,
                        priceRange: { ...prev.priceRange, max: Math.max(prev.priceRange.min + 50, prev.priceRange.max - 50) }
                      }))}
                    >
                      <Feather name="minus" size={16} color={colors.mainBlack} />
                    </TouchableOpacity>
                    <Text style={styles.rangeValue}>${filters.priceRange.max}</Text>
                    <TouchableOpacity 
                      style={styles.rangeButton}
                      onPress={() => setFilters(prev => ({
                        ...prev,
                        priceRange: { ...prev.priceRange, max: prev.priceRange.max + 50 }
                      }))}
                    >
                      <Feather name="plus" size={16} color={colors.mainBlack} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Manufacturer */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Manufacturer</Text>
                {['ASUS', 'LG', 'Samsung', 'Dell'].map(brand => (
                  <TouchableOpacity
                    key={brand}
                    style={styles.checkboxRow}
                    onPress={() => handleCheckboxToggle('manufacturers', brand)}
                  >
                    <MaterialCommunityIcons
                      name={filters.manufacturers.includes(brand) ? "checkbox-marked" : "checkbox-blank-outline"}
                      size={24}
                      color={filters.manufacturers.includes(brand) ? colors.mainYellow : colors.text}
                    />
                    <Text style={styles.checkboxLabel}>{brand}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Rating */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Minimum Rating</Text>
                {[5, 4, 3, 2, 1].map(rating => (
                  <TouchableOpacity
                    key={rating}
                    style={styles.checkboxRow}
                    onPress={() => setFilters(prev => ({ ...prev, rating }))}
                  >
                    <MaterialCommunityIcons
                      name={filters.rating === rating ? "radiobox-marked" : "radiobox-blank"}
                      size={24}
                      color={filters.rating === rating ? colors.mainYellow : colors.text}
                    />
                    <Text style={styles.checkboxLabel}>
                      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)} & Up
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Screen Size */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Screen Size</Text>
                {['24"', '27"', '32"', '34"'].map(size => (
                  <TouchableOpacity
                    key={size}
                    style={styles.checkboxRow}
                    onPress={() => handleCheckboxToggle('screenSize', size)}
                  >
                    <MaterialCommunityIcons
                      name={filters.screenSize.includes(size) ? "checkbox-marked" : "checkbox-blank-outline"}
                      size={24}
                      color={filters.screenSize.includes(size) ? colors.mainYellow : colors.text}
                    />
                    <Text style={styles.checkboxLabel}>{size}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Resolution */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Resolution</Text>
                {['1080p', '1440p', '4K'].map(res => (
                  <TouchableOpacity
                    key={res}
                    style={styles.checkboxRow}
                    onPress={() => handleCheckboxToggle('resolution', res)}
                  >
                    <MaterialCommunityIcons
                      name={filters.resolution.includes(res) ? "checkbox-marked" : "checkbox-blank-outline"}
                      size={24}
                      color={filters.resolution.includes(res) ? colors.mainYellow : colors.text}
                    />
                    <Text style={styles.checkboxLabel}>{res}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Refresh Rate */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Refresh Rate</Text>
                {['60Hz', '144Hz', '240Hz'].map(rate => (
                  <TouchableOpacity
                    key={rate}
                    style={styles.checkboxRow}
                    onPress={() => handleCheckboxToggle('refreshRate', rate)}
                  >
                    <MaterialCommunityIcons
                      name={filters.refreshRate.includes(rate) ? "checkbox-marked" : "checkbox-blank-outline"}
                      size={24}
                      color={filters.refreshRate.includes(rate) ? colors.mainYellow : colors.text}
                    />
                    <Text style={styles.checkboxLabel}>{rate}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Response Time */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Response Time (ms)</Text>
                <View style={styles.rangeControl}>
                  <View style={styles.rangeInput}>
                    <Text style={styles.rangeLabel}>Min:</Text>
                    <TouchableOpacity 
                      style={styles.rangeButton}
                      onPress={() => setFilters(prev => ({
                        ...prev,
                        responseTime: { ...prev.responseTime, min: Math.max(0, prev.responseTime.min - 1) }
                      }))}
                    >
                      <Feather name="minus" size={16} color={colors.mainBlack} />
                    </TouchableOpacity>
                    <Text style={styles.rangeValue}>{filters.responseTime.min}ms</Text>
                    <TouchableOpacity 
                      style={styles.rangeButton}
                      onPress={() => setFilters(prev => ({
                        ...prev,
                        responseTime: { ...prev.responseTime, min: Math.min(prev.responseTime.max - 1, prev.responseTime.min + 1) }
                      }))}
                    >
                      <Feather name="plus" size={16} color={colors.mainBlack} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.rangeInput}>
                    <Text style={styles.rangeLabel}>Max:</Text>
                    <TouchableOpacity 
                      style={styles.rangeButton}
                      onPress={() => setFilters(prev => ({
                        ...prev,
                        responseTime: { ...prev.responseTime, max: Math.max(prev.responseTime.min + 1, prev.responseTime.max - 1) }
                      }))}
                    >
                      <Feather name="minus" size={16} color={colors.mainBlack} />
                    </TouchableOpacity>
                    <Text style={styles.rangeValue}>{filters.responseTime.max}ms</Text>
                    <TouchableOpacity 
                      style={styles.rangeButton}
                      onPress={() => setFilters(prev => ({
                        ...prev,
                        responseTime: { ...prev.responseTime, max: prev.responseTime.max + 1 }
                      }))}
                    >
                      <Feather name="plus" size={16} color={colors.mainBlack} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Panel Type */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Panel Type</Text>
                {['IPS', 'VA', 'TN'].map(panel => (
                  <TouchableOpacity
                    key={panel}
                    style={styles.checkboxRow}
                    onPress={() => handleCheckboxToggle('panelType', panel)}
                  >
                    <MaterialCommunityIcons
                      name={filters.panelType.includes(panel) ? "checkbox-marked" : "checkbox-blank-outline"}
                      size={24}
                      color={filters.panelType.includes(panel) ? colors.mainYellow : colors.text}
                    />
                    <Text style={styles.checkboxLabel}>{panel}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Aspect Ratio */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Aspect Ratio</Text>
                {['16:9', '21:9'].map(ratio => (
                  <TouchableOpacity
                    key={ratio}
                    style={styles.checkboxRow}
                    onPress={() => handleCheckboxToggle('aspectRatio', ratio)}
                  >
                    <MaterialCommunityIcons
                      name={filters.aspectRatio.includes(ratio) ? "checkbox-marked" : "checkbox-blank-outline"}
                      size={24}
                      color={filters.aspectRatio.includes(ratio) ? colors.mainYellow : colors.text}
                    />
                    <Text style={styles.checkboxLabel}>{ratio}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Curved Screen */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Curved Screen</Text>
                {[
                  { label: 'Yes', value: true },
                  { label: 'No', value: false },
                  { label: 'Any', value: null }
                ].map(option => (
                  <TouchableOpacity
                    key={option.label}
                    style={styles.checkboxRow}
                    onPress={() => setFilters(prev => ({ ...prev, curvedScreen: option.value }))}
                  >
                    <MaterialCommunityIcons
                      name={filters.curvedScreen === option.value ? "radiobox-marked" : "radiobox-blank"}
                      size={24}
                      color={filters.curvedScreen === option.value ? colors.mainYellow : colors.text}
                    />
                    <Text style={styles.checkboxLabel}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Interface */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Interface</Text>
                {['HDMI', 'DisplayPort'].map(port => (
                  <TouchableOpacity
                    key={port}
                    style={styles.checkboxRow}
                    onPress={() => handleCheckboxToggle('interface', port)}
                  >
                    <MaterialCommunityIcons
                      name={filters.interface.includes(port) ? "checkbox-marked" : "checkbox-blank-outline"}
                      size={24}
                      color={filters.interface.includes(port) ? colors.mainYellow : colors.text}
                    />
                    <Text style={styles.checkboxLabel}>{port}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Frame Sync */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Frame Sync</Text>
                {['G-Sync', 'FreeSync'].map(sync => (
                  <TouchableOpacity
                    key={sync}
                    style={styles.checkboxRow}
                    onPress={() => handleCheckboxToggle('frameSync', sync)}
                  >
                    <MaterialCommunityIcons
                      name={filters.frameSync.includes(sync) ? "checkbox-marked" : "checkbox-blank-outline"}
                      size={24}
                      color={filters.frameSync.includes(sync) ? colors.mainYellow : colors.text}
                    />
                    <Text style={styles.checkboxLabel}>{sync}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Built-in Speakers */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Built-in Speakers</Text>
                {[
                  { label: 'Yes', value: true },
                  { label: 'No', value: false },
                  { label: 'Any', value: null }
                ].map(option => (
                  <TouchableOpacity
                    key={option.label}
                    style={styles.checkboxRow}
                    onPress={() => setFilters(prev => ({ ...prev, builtInSpeakers: option.value }))}
                  >
                    <MaterialCommunityIcons
                      name={filters.builtInSpeakers === option.value ? "radiobox-marked" : "radiobox-blank"}
                      size={24}
                      color={filters.builtInSpeakers === option.value ? colors.mainYellow : colors.text}
                    />
                    <Text style={styles.checkboxLabel}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setShowFilterModal(false)}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  quickFilters: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 8,
  },
  quickFilterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickFilterButtonActive: {
    backgroundColor: colors.mainYellow,
    borderColor: colors.mainYellow,
  },
  quickFilterText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "500",
  },
  quickFilterTextActive: {
    color: colors.mainBlack,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  filterModal: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.platinum,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.mainBlack,
  },
  modalActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  resetText: {
    fontSize: 16,
    color: colors.mainYellow,
    fontWeight: "600",
  },
  filterContent: {
    padding: 20,
  },
  filterSection: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.platinum,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.mainBlack,
    marginBottom: 12,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 12,
  },
  checkboxLabel: {
    fontSize: 15,
    color: colors.text,
  },
  applyButton: {
    backgroundColor: colors.mainYellow,
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.mainBlack,
  },
  rangeControl: {
    gap: 12,
  },
  rangeInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rangeLabel: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "500",
    width: 40,
  },
  rangeButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.mainYellow,
    justifyContent: "center",
    alignItems: "center",
  },
  rangeValue: {
    fontSize: 14,
    color: colors.mainBlack,
    fontWeight: "600",
    minWidth: 80,
    textAlign: "center",
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
    flexDirection: "column",
    gap: 8,
    alignSelf: "center",
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
  compareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.platinum,
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
  selectedBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "white",
    borderRadius: 10,
  },
});
