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
import memoryData from "../../data/components/memory.json";
import { useBuild } from "../../context/BuildContext";
import { useCompare } from "../../context/CompareContext";

const MOCK_PRODUCTS = (memoryData?.memory || []).map(mem => {
  const brandName = mem.brand || mem.manufacturer;
  return {
    ...mem,
    name: mem.model ? `${brandName} ${mem.model}` : brandName,
    brand: brandName,
    capacity: `${mem.capacityGB}GB`,
    speed: mem.speed,
  };
});

export default function MemoryScreen({ navigation, route }) {
  const { addComponent, removeComponent, selectedComponents } = useBuild();
  const { source } = route.params || {}; // 'builder' or 'comparator'
  const { addToCompare, isInCompare, removeFromCompare, getCategory, compareList } = useCompare();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 500 },
    manufacturers: [],
    rating: 0,
    formFactor: [],
    type: [],
    speed: [],
    modules: [],
    color: [],
    firstWordLatency: { min: 0, max: 20 },
    casLatency: [],
    voltage: [],
    timing: [],
    eccRegistered: null,
    heatSpreader: null,
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
      priceRange: { min: 0, max: 500 },
      manufacturers: [],
      rating: 0,
      formFactor: [],
      type: [],
      speed: [],
      modules: [],
      color: [],
      firstWordLatency: { min: 0, max: 20 },
      casLatency: [],
      voltage: [],
      timing: [],
      eccRegistered: null,
      heatSpreader: null,
    });
  };

  const handleAddToBuild = (product) => {
    const componentType = 'memory';
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
      if (category && category !== 'memory') {
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
      addToCompare(product, 'memory');
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

  // Filter products based on selected filters
  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    if (product.price < filters.priceRange?.min || product.price > filters.priceRange?.max) return false;
    if (filters.manufacturers?.length > 0 && !filters.manufacturers.includes(product.manufacturer)) return false;
    if (filters.rating > 0 && product.rating < filters.rating) return false;
    if (filters.speed?.length > 0 && !filters.speed.includes(product.speed?.toString())) return false;
    if (filters.capacity?.length > 0 && !filters.capacity.includes(product.capacity?.toString())) return false;
    return true;
  });

  const renderProduct = ({ item }) => {
    const isSelected = selectedComponents.memory?.model === item.model;
    const inCompare = isInCompare(item.id);
    
    return (
    <TouchableOpacity 
      style={[styles.productCard, isSelected && styles.productCardSelected]}
      onPress={() => navigation.navigate('ProductDetails', { 
        category: 'memory', 
        productId: item.id 
      })}
    >
      <View style={styles.productImage}>
        <Feather name="database" size={48} color={colors.mainYellow} />
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
          {source !== 'builder' && (
            <TouchableOpacity 
              style={[styles.compareButton, inCompare && styles.compareButtonActive]}
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
                <Text style={styles.title}>RAM Memory</Text>
                <TouchableOpacity onPress={() => setShowFilterModal(true)}>
                  <Feather name="filter" size={24} color={colors.mainBlack} />
                </TouchableOpacity>
              </View>

              {/* Quick Filters */}
              <View style={styles.quickFilters}>
                {['Corsair', 'G.Skill', 'Kingston', 'Crucial'].map((brand) => (
                  <TouchableOpacity
                    key={brand}
                    style={[
                      styles.quickFilterButton,
                      filters.manufacturers.includes(brand) && styles.quickFilterButtonActive,
                    ]}
                    onPress={() => handleCheckboxToggle('manufacturers', brand)}
                  >
                    <Text
                      style={[
                        styles.quickFilterText,
                        filters.manufacturers.includes(brand) && styles.quickFilterTextActive,
                      ]}
                    >
                      {brand}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          }
          contentContainerStyle={styles.listContainer}
        />

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
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
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
                          priceRange: { ...prev.priceRange, min: Math.max(0, prev.priceRange.min - 25) }
                        }))}
                      >
                        <Feather name="minus" size={16} color={colors.mainBlack} />
                      </TouchableOpacity>
                      <Text style={styles.rangeValue}>${filters.priceRange.min}</Text>
                      <TouchableOpacity 
                        style={styles.rangeButton}
                        onPress={() => setFilters(prev => ({
                          ...prev,
                          priceRange: { ...prev.priceRange, min: Math.min(prev.priceRange.max - 25, prev.priceRange.min + 25) }
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
                          priceRange: { ...prev.priceRange, max: Math.max(prev.priceRange.min + 25, prev.priceRange.max - 25) }
                        }))}
                      >
                        <Feather name="minus" size={16} color={colors.mainBlack} />
                      </TouchableOpacity>
                      <Text style={styles.rangeValue}>${filters.priceRange.max}</Text>
                      <TouchableOpacity 
                        style={styles.rangeButton}
                        onPress={() => setFilters(prev => ({
                          ...prev,
                          priceRange: { ...prev.priceRange, max: prev.priceRange.max + 25 }
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
                  {['Corsair', 'G.Skill', 'Kingston', 'Crucial', 'Teamgroup', 'Patriot'].map(brand => (
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

                {/* Form Factor */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>Form Factor</Text>
                  {['DIMM', 'SO-DIMM'].map(factor => (
                    <TouchableOpacity
                      key={factor}
                      style={styles.checkboxRow}
                      onPress={() => handleCheckboxToggle('formFactor', factor)}
                    >
                      <MaterialCommunityIcons
                        name={filters.formFactor.includes(factor) ? "checkbox-marked" : "checkbox-blank-outline"}
                        size={24}
                        color={filters.formFactor.includes(factor) ? colors.mainYellow : colors.text}
                      />
                      <Text style={styles.checkboxLabel}>{factor}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Type */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>Type</Text>
                  {['DDR4', 'DDR5'].map(type => (
                    <TouchableOpacity
                      key={type}
                      style={styles.checkboxRow}
                      onPress={() => handleCheckboxToggle('type', type)}
                    >
                      <MaterialCommunityIcons
                        name={filters.type.includes(type) ? "checkbox-marked" : "checkbox-blank-outline"}
                        size={24}
                        color={filters.type.includes(type) ? colors.mainYellow : colors.text}
                      />
                      <Text style={styles.checkboxLabel}>{type}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Speed */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>Speed</Text>
                  {['DDR4-2400', 'DDR4-2666', 'DDR4-3000', 'DDR4-3200', 'DDR4-3600', 'DDR5-4800', 'DDR5-5200', 'DDR5-5600', 'DDR5-6000', 'DDR5-6400'].map(speed => (
                    <TouchableOpacity
                      key={speed}
                      style={styles.checkboxRow}
                      onPress={() => handleCheckboxToggle('speed', speed)}
                    >
                      <MaterialCommunityIcons
                        name={filters.speed.includes(speed) ? "checkbox-marked" : "checkbox-blank-outline"}
                        size={24}
                        color={filters.speed.includes(speed) ? colors.mainYellow : colors.text}
                      />
                      <Text style={styles.checkboxLabel}>{speed}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Modules */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>Modules</Text>
                  {['1 x 8GB', '1 x 16GB', '2 x 8GB', '2 x 16GB', '2 x 32GB', '4 x 8GB', '4 x 16GB'].map(module => (
                    <TouchableOpacity
                      key={module}
                      style={styles.checkboxRow}
                      onPress={() => handleCheckboxToggle('modules', module)}
                    >
                      <MaterialCommunityIcons
                        name={filters.modules.includes(module) ? "checkbox-marked" : "checkbox-blank-outline"}
                        size={24}
                        color={filters.modules.includes(module) ? colors.mainYellow : colors.text}
                      />
                      <Text style={styles.checkboxLabel}>{module}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Color */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>Color</Text>
                  {['Black', 'White', 'Red', 'Blue', 'Silver', 'RGB'].map(color => (
                    <TouchableOpacity
                      key={color}
                      style={styles.checkboxRow}
                      onPress={() => handleCheckboxToggle('color', color)}
                    >
                      <MaterialCommunityIcons
                        name={filters.color.includes(color) ? "checkbox-marked" : "checkbox-blank-outline"}
                        size={24}
                        color={filters.color.includes(color) ? colors.mainYellow : colors.text}
                      />
                      <Text style={styles.checkboxLabel}>{color}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* First Word Latency */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>First Word Latency (ns)</Text>
                  <View style={styles.rangeControl}>
                    <View style={styles.rangeInput}>
                      <Text style={styles.rangeLabel}>Min:</Text>
                      <TouchableOpacity 
                        style={styles.rangeButton}
                        onPress={() => setFilters(prev => ({
                          ...prev,
                          firstWordLatency: { ...prev.firstWordLatency, min: Math.max(0, prev.firstWordLatency.min - 1) }
                        }))}
                      >
                        <Feather name="minus" size={16} color={colors.mainBlack} />
                      </TouchableOpacity>
                      <Text style={styles.rangeValue}>{filters.firstWordLatency.min} ns</Text>
                      <TouchableOpacity 
                        style={styles.rangeButton}
                        onPress={() => setFilters(prev => ({
                          ...prev,
                          firstWordLatency: { ...prev.firstWordLatency, min: Math.min(prev.firstWordLatency.max - 1, prev.firstWordLatency.min + 1) }
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
                          firstWordLatency: { ...prev.firstWordLatency, max: Math.max(prev.firstWordLatency.min + 1, prev.firstWordLatency.max - 1) }
                        }))}
                      >
                        <Feather name="minus" size={16} color={colors.mainBlack} />
                      </TouchableOpacity>
                      <Text style={styles.rangeValue}>{filters.firstWordLatency.max} ns</Text>
                      <TouchableOpacity 
                        style={styles.rangeButton}
                        onPress={() => setFilters(prev => ({
                          ...prev,
                          firstWordLatency: { ...prev.firstWordLatency, max: prev.firstWordLatency.max + 1 }
                        }))}
                      >
                        <Feather name="plus" size={16} color={colors.mainBlack} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* CAS Latency */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>CAS Latency</Text>
                  {['CL14', 'CL15', 'CL16', 'CL18', 'CL30', 'CL32', 'CL36', 'CL38', 'CL40'].map(cl => (
                    <TouchableOpacity
                      key={cl}
                      style={styles.checkboxRow}
                      onPress={() => handleCheckboxToggle('casLatency', cl)}
                    >
                      <MaterialCommunityIcons
                        name={filters.casLatency.includes(cl) ? "checkbox-marked" : "checkbox-blank-outline"}
                        size={24}
                        color={filters.casLatency.includes(cl) ? colors.mainYellow : colors.text}
                      />
                      <Text style={styles.checkboxLabel}>{cl}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Voltage */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>Voltage</Text>
                  {['1.2V', '1.35V', '1.5V'].map(voltage => (
                    <TouchableOpacity
                      key={voltage}
                      style={styles.checkboxRow}
                      onPress={() => handleCheckboxToggle('voltage', voltage)}
                    >
                      <MaterialCommunityIcons
                        name={filters.voltage.includes(voltage) ? "checkbox-marked" : "checkbox-blank-outline"}
                        size={24}
                        color={filters.voltage.includes(voltage) ? colors.mainYellow : colors.text}
                      />
                      <Text style={styles.checkboxLabel}>{voltage}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Timing */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>Timing</Text>
                  {['14-14-14-34', '16-18-18-38', '16-19-19-39', '18-22-22-42', '36-36-36-76', '40-40-40-84'].map(timing => (
                    <TouchableOpacity
                      key={timing}
                      style={styles.checkboxRow}
                      onPress={() => handleCheckboxToggle('timing', timing)}
                    >
                      <MaterialCommunityIcons
                        name={filters.timing.includes(timing) ? "checkbox-marked" : "checkbox-blank-outline"}
                        size={24}
                        color={filters.timing.includes(timing) ? colors.mainYellow : colors.text}
                      />
                      <Text style={styles.checkboxLabel}>{timing}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* ECC/Registered */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>ECC / Registered</Text>
                  {[
                    { label: 'ECC Supported', value: true },
                    { label: 'Non-ECC', value: false },
                  ].map(option => (
                    <TouchableOpacity
                      key={option.label}
                      style={styles.checkboxRow}
                      onPress={() => setFilters(prev => ({ ...prev, eccRegistered: option.value }))}
                    >
                      <MaterialCommunityIcons
                        name={filters.eccRegistered === option.value ? "radiobox-marked" : "radiobox-blank"}
                        size={24}
                        color={filters.eccRegistered === option.value ? colors.mainYellow : colors.text}
                      />
                      <Text style={styles.checkboxLabel}>{option.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Heat Spreader */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>Heat Spreader</Text>
                  {[
                    { label: 'With Heat Spreader', value: true },
                    { label: 'Without Heat Spreader', value: false },
                  ].map(option => (
                    <TouchableOpacity
                      key={option.label}
                      style={styles.checkboxRow}
                      onPress={() => setFilters(prev => ({ ...prev, heatSpreader: option.value }))}
                    >
                      <MaterialCommunityIcons
                        name={filters.heatSpreader === option.value ? "radiobox-marked" : "radiobox-blank"}
                        size={24}
                        color={filters.heatSpreader === option.value ? colors.mainYellow : colors.text}
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
  quickFilters: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 8,
    flexWrap: "wrap",
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
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
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
    marginBottom: 20,
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
    justifyContent: "center",
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
  },  detailsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: colors.mainBlack,
    justifyContent: "center",
    alignItems: "center",
  },  detailsButton: {
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
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: colors.mainYellow,
    justifyContent: "center",
    alignItems: "center",
  },
  compareButtonActive: {
    backgroundColor: colors.mainYellow,
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
