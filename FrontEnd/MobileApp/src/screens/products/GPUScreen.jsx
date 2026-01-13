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
import gpusData from "../../data/components/gpus.json";
import { useBuild } from "../../context/BuildContext";
import { useCompare } from "../../context/CompareContext";

const MOCK_PRODUCTS = (gpusData?.gpus || []).map(gpu => {
  const brandName = gpu.brand || gpu.manufacturer;
  return {
    ...gpu,
    name: gpu.model ? `${brandName} ${gpu.model}` : brandName,
    brand: brandName,
  };
});

export default function GPUScreen({ navigation, route }) {
  const { addComponent, removeComponent, selectedComponents } = useBuild();
  const { source } = route.params || {}; // 'builder' or 'comparator'
  const { addToCompare, isInCompare, removeFromCompare, getCategory, compareList } = useCompare();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 2000 },
    manufacturers: [],
    rating: 0,
    chipset: [],
    memory: [],
    memoryType: [],
    coreClock: { min: 0, max: 3000 },
    boostClock: { min: 0, max: 3500 },
    interface: [],
    color: [],
    frameSync: [],
    length: { min: 0, max: 400 },
    tdp: { min: 0, max: 600 },
    hdmiPorts: [],
    displayPortPorts: [],
    cooling: [],
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
      chipset: [],
      memory: [],
      memoryType: [],
      coreClock: { min: 0, max: 3000 },
      boostClock: { min: 0, max: 3500 },
      interface: [],
      color: [],
      frameSync: [],
      length: { min: 0, max: 400 },
      tdp: { min: 0, max: 600 },
      hdmiPorts: [],
      displayPortPorts: [],
      cooling: [],
    });
  };

  const handleAddToBuild = (product) => {
    const componentType = 'gpu';
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
      if (category && category !== 'gpu') {
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
      addToCompare(product, 'gpu');
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
    const isSelected = selectedComponents.gpu?.model === item.model;
    const inCompare = isInCompare(item.id);
    
    return (
    <TouchableOpacity 
      style={[styles.productCard, isSelected && styles.productCardSelected]}
      onPress={() => navigation.navigate('ProductDetails', { 
        category: 'gpu', 
        productId: item.id 
      })}
    >
      <View style={styles.productImage}>
        <Feather name="zap" size={48} color={colors.mainYellow} />
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
          data={MOCK_PRODUCTS}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <>
              <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Feather name="arrow-left" size={24} color={colors.mainBlack} />
                </TouchableOpacity>
                <Text style={styles.title}>GPUs</Text>
                <TouchableOpacity onPress={() => setShowFilterModal(true)}>
                  <Feather name="filter" size={24} color={colors.mainBlack} />
                </TouchableOpacity>
              </View>

              <View style={styles.quickFilters}>
                {["NVIDIA", "AMD"].map((brand) => (
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
                {['NVIDIA', 'AMD', 'Intel'].map(brand => (
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

              {/* Chipset */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Chipset</Text>
                {['RTX 4090', 'RTX 4080', 'RTX 4070', 'RX 7900 XTX', 'RX 7900 XT', 'RX 7800 XT'].map(chipset => (
                  <TouchableOpacity
                    key={chipset}
                    style={styles.checkboxRow}
                    onPress={() => handleCheckboxToggle('chipset', chipset)}
                  >
                    <MaterialCommunityIcons
                      name={filters.chipset.includes(chipset) ? "checkbox-marked" : "checkbox-blank-outline"}
                      size={24}
                      color={filters.chipset.includes(chipset) ? colors.mainYellow : colors.text}
                    />
                    <Text style={styles.checkboxLabel}>{chipset}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Memory */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Memory</Text>
                {['8 GB', '12 GB', '16 GB', '24 GB'].map(memory => (
                  <TouchableOpacity
                    key={memory}
                    style={styles.checkboxRow}
                    onPress={() => handleCheckboxToggle('memory', memory)}
                  >
                    <MaterialCommunityIcons
                      name={filters.memory.includes(memory) ? "checkbox-marked" : "checkbox-blank-outline"}
                      size={24}
                      color={filters.memory.includes(memory) ? colors.mainYellow : colors.text}
                    />
                    <Text style={styles.checkboxLabel}>{memory}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Memory Type */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Memory Type</Text>
                {['GDDR6', 'GDDR6X'].map(type => (
                  <TouchableOpacity
                    key={type}
                    style={styles.checkboxRow}
                    onPress={() => handleCheckboxToggle('memoryType', type)}
                  >
                    <MaterialCommunityIcons
                      name={filters.memoryType.includes(type) ? "checkbox-marked" : "checkbox-blank-outline"}
                      size={24}
                      color={filters.memoryType.includes(type) ? colors.mainYellow : colors.text}
                    />
                    <Text style={styles.checkboxLabel}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Core Clock */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Core Clock</Text>
                <View style={styles.rangeControl}>
                  <View style={styles.rangeInput}>
                    <Text style={styles.rangeLabel}>Min:</Text>
                    <TouchableOpacity 
                      style={styles.rangeButton}
                      onPress={() => setFilters(prev => ({
                        ...prev,
                        coreClock: { ...prev.coreClock, min: Math.max(0, prev.coreClock.min - 100) }
                      }))}
                    >
                      <Feather name="minus" size={16} color={colors.mainBlack} />
                    </TouchableOpacity>
                    <Text style={styles.rangeValue}>{filters.coreClock.min} MHz</Text>
                    <TouchableOpacity 
                      style={styles.rangeButton}
                      onPress={() => setFilters(prev => ({
                        ...prev,
                        coreClock: { ...prev.coreClock, min: Math.min(prev.coreClock.max - 100, prev.coreClock.min + 100) }
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
                        coreClock: { ...prev.coreClock, max: Math.max(prev.coreClock.min + 100, prev.coreClock.max - 100) }
                      }))}
                    >
                      <Feather name="minus" size={16} color={colors.mainBlack} />
                    </TouchableOpacity>
                    <Text style={styles.rangeValue}>{filters.coreClock.max} MHz</Text>
                    <TouchableOpacity 
                      style={styles.rangeButton}
                      onPress={() => setFilters(prev => ({
                        ...prev,
                        coreClock: { ...prev.coreClock, max: prev.coreClock.max + 100 }
                      }))}
                    >
                      <Feather name="plus" size={16} color={colors.mainBlack} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Interface */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Interface</Text>
                {['PCIe 4.0 x16', 'PCIe 3.0 x16'].map(iface => (
                  <TouchableOpacity
                    key={iface}
                    style={styles.checkboxRow}
                    onPress={() => handleCheckboxToggle('interface', iface)}
                  >
                    <MaterialCommunityIcons
                      name={filters.interface.includes(iface) ? "checkbox-marked" : "checkbox-blank-outline"}
                      size={24}
                      color={filters.interface.includes(iface) ? colors.mainYellow : colors.text}
                    />
                    <Text style={styles.checkboxLabel}>{iface}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Frame Sync */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Frame Sync</Text>
                {['G-SYNC', 'FreeSync'].map(sync => (
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

              {/* TDP */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>TDP (Thermal Design Power)</Text>
                <View style={styles.rangeControl}>
                  <View style={styles.rangeInput}>
                    <Text style={styles.rangeLabel}>Min:</Text>
                    <TouchableOpacity 
                      style={styles.rangeButton}
                      onPress={() => setFilters(prev => ({
                        ...prev,
                        tdp: { ...prev.tdp, min: Math.max(0, prev.tdp.min - 25) }
                      }))}
                    >
                      <Feather name="minus" size={16} color={colors.mainBlack} />
                    </TouchableOpacity>
                    <Text style={styles.rangeValue}>{filters.tdp.min}W</Text>
                    <TouchableOpacity 
                      style={styles.rangeButton}
                      onPress={() => setFilters(prev => ({
                        ...prev,
                        tdp: { ...prev.tdp, min: Math.min(prev.tdp.max - 25, prev.tdp.min + 25) }
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
                        tdp: { ...prev.tdp, max: Math.max(prev.tdp.min + 25, prev.tdp.max - 25) }
                      }))}
                    >
                      <Feather name="minus" size={16} color={colors.mainBlack} />
                    </TouchableOpacity>
                    <Text style={styles.rangeValue}>{filters.tdp.max}W</Text>
                    <TouchableOpacity 
                      style={styles.rangeButton}
                      onPress={() => setFilters(prev => ({
                        ...prev,
                        tdp: { ...prev.tdp, max: Math.min(600, prev.tdp.max + 25) }
                      }))}
                    >
                      <Feather name="plus" size={16} color={colors.mainBlack} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* HDMI Ports */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>HDMI Ports</Text>
                {['0', '1', '2', '3', '4'].map(ports => (
                  <TouchableOpacity
                    key={ports}
                    style={styles.checkboxRow}
                    onPress={() => handleCheckboxToggle('hdmiPorts', ports)}
                  >
                    <MaterialCommunityIcons
                      name={filters.hdmiPorts.includes(ports) ? "checkbox-marked" : "checkbox-blank-outline"}
                      size={24}
                      color={filters.hdmiPorts.includes(ports) ? colors.mainYellow : colors.text}
                    />
                    <Text style={styles.checkboxLabel}>{ports} Ports</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* DisplayPort Ports */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>DisplayPort Ports</Text>
                {['0', '1', '2', '3', '4'].map(ports => (
                  <TouchableOpacity
                    key={ports}
                    style={styles.checkboxRow}
                    onPress={() => handleCheckboxToggle('displayPortPorts', ports)}
                  >
                    <MaterialCommunityIcons
                      name={filters.displayPortPorts.includes(ports) ? "checkbox-marked" : "checkbox-blank-outline"}
                      size={24}
                      color={filters.displayPortPorts.includes(ports) ? colors.mainYellow : colors.text}
                    />
                    <Text style={styles.checkboxLabel}>{ports} Ports</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Cooling */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Cooling</Text>
                {['Fan', 'Hybrid', 'Passive'].map(cooling => (
                  <TouchableOpacity
                    key={cooling}
                    style={styles.checkboxRow}
                    onPress={() => handleCheckboxToggle('cooling', cooling)}
                  >
                    <MaterialCommunityIcons
                      name={filters.cooling.includes(cooling) ? "checkbox-marked" : "checkbox-blank-outline"}
                      size={24}
                      color={filters.cooling.includes(cooling) ? colors.mainYellow : colors.text}
                    />
                    <Text style={styles.checkboxLabel}>{cooling}</Text>
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
});
