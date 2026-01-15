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
import motherboardsData from "../../data/components/motherboards.json";
import { useBuild } from "../../context/BuildContext";
import { useCompare } from "../../context/CompareContext";

const MOCK_PRODUCTS = (motherboardsData?.motherboards || []).map(mb => {
  const brandName = mb.brand || mb.manufacturer;
  return {
    ...mb,
    name: mb.model ? `${brandName} ${mb.model}` : brandName,
    brand: brandName,
  };
});

export default function MotherboardScreen({ navigation, route }) {
  const { addComponent, removeComponent, selectedComponents } = useBuild();
  const { source } = route.params || {}; // 'builder' or 'comparator'
  const { addToCompare, isInCompare, removeFromCompare, getCategory, compareList } = useCompare();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 1000 },
    manufacturers: [],
    rating: 0,
    socket: [],
    formFactor: [],
    chipset: [],
    memoryType: [],
    memorySlots: [],
    pcieX16Slots: [],
    sata6Ports: [],
    m2SlotsB: [],
    onboardVideo: null,
    wirelessNetworking: null,
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
      priceRange: { min: 0, max: 1000 },
      manufacturers: [],
      rating: 0,
      socket: [],
      formFactor: [],
      chipset: [],
      memoryType: [],
      memorySlots: [],
      pcieX16Slots: [],
      sata6Ports: [],
      m2SlotsB: [],
      onboardVideo: null,
      wirelessNetworking: null,
    });
  };

  const handleAddToBuild = (product) => {
    const componentType = 'motherboard';
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
      if (category && category !== 'motherboard') {
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
      addToCompare(product, 'motherboard');
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
    if (filters.socket?.length > 0 && !filters.socket.includes(product.socketCPU)) return false;
    if (filters.formFactor?.length > 0 && !filters.formFactor.includes(product.formFactor)) return false;
    return true;
  });

  const renderProduct = ({ item }) => {
    const isSelected = selectedComponents.motherboard?.model === item.model;
    const inCompare = isInCompare(item.id);
    
    return (
    <TouchableOpacity 
      style={[styles.productCard, isSelected && styles.productCardSelected]}
      onPress={() => navigation.navigate('ProductDetails', { 
        category: 'motherboard', 
        productId: item.id 
      })}
    >
      <View style={styles.productImage}>
        <Feather name="cpu" size={48} color={colors.mainYellow} />
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
                <Text style={styles.title}>Motherboards</Text>
                <TouchableOpacity onPress={() => setShowFilterModal(true)}>
                  <Feather name="filter" size={24} color={colors.mainBlack} />
                </TouchableOpacity>
              </View>

              <View style={styles.quickFilters}>
                {["Intel Socket", "AMD Socket"].map((filter) => (
                  <TouchableOpacity
                    key={filter}
                    style={[
                      styles.quickFilterButton,
                      (filter === "Intel Socket" && (filters.socket.includes("LGA1700") || filters.socket.includes("LGA1200"))) ||
                      (filter === "AMD Socket" && (filters.socket.includes("AM5") || filters.socket.includes("AM4"))) 
                        ? styles.quickFilterButtonActive : null,
                    ]}
                    onPress={() => {
                      if (filter === "Intel Socket") {
                        setFilters(prev => ({
                          ...prev,
                          socket: prev.socket.includes("LGA1700") || prev.socket.includes("LGA1200") 
                            ? prev.socket.filter(s => s !== "LGA1700" && s !== "LGA1200")
                            : [...prev.socket, "LGA1700", "LGA1200"]
                        }));
                      } else {
                        setFilters(prev => ({
                          ...prev,
                          socket: prev.socket.includes("AM5") || prev.socket.includes("AM4")
                            ? prev.socket.filter(s => s !== "AM5" && s !== "AM4")
                            : [...prev.socket, "AM5", "AM4"]
                        }));
                      }
                    }}
                  >
                    <Text
                      style={[
                        styles.quickFilterText,
                        (filter === "Intel Socket" && (filters.socket.includes("LGA1700") || filters.socket.includes("LGA1200"))) ||
                        (filter === "AMD Socket" && (filters.socket.includes("AM5") || filters.socket.includes("AM4")))
                          ? styles.quickFilterTextActive : null,
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
                {['ASRock', 'Asus', 'EVGA', 'Gigabyte', 'MSI'].map(brand => (
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

              {/* Socket */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Socket</Text>
                {['AM5', 'AM4', 'LGA1700', 'LGA1200', 'sTRX4', 'TR4'].map(socket => (
                  <TouchableOpacity
                    key={socket}
                    style={styles.checkboxRow}
                    onPress={() => handleCheckboxToggle('socket', socket)}
                  >
                    <MaterialCommunityIcons
                      name={filters.socket.includes(socket) ? "checkbox-marked" : "checkbox-blank-outline"}
                      size={24}
                      color={filters.socket.includes(socket) ? colors.mainYellow : colors.text}
                    />
                    <Text style={styles.checkboxLabel}>{socket}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Form Factor */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Form Factor</Text>
                {['ATX', 'EATX', 'Micro ATX', 'Mini ITX'].map(form => (
                  <TouchableOpacity
                    key={form}
                    style={styles.checkboxRow}
                    onPress={() => handleCheckboxToggle('formFactor', form)}
                  >
                    <MaterialCommunityIcons
                      name={filters.formFactor.includes(form) ? "checkbox-marked" : "checkbox-blank-outline"}
                      size={24}
                      color={filters.formFactor.includes(form) ? colors.mainYellow : colors.text}
                    />
                    <Text style={styles.checkboxLabel}>{form}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Chipset */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Chipset</Text>
                {['X670E', 'X670', 'B650', 'Z790', 'Z690', 'B760', 'B660'].map(chip => (
                  <TouchableOpacity
                    key={chip}
                    style={styles.checkboxRow}
                    onPress={() => handleCheckboxToggle('chipset', chip)}
                  >
                    <MaterialCommunityIcons
                      name={filters.chipset.includes(chip) ? "checkbox-marked" : "checkbox-blank-outline"}
                      size={24}
                      color={filters.chipset.includes(chip) ? colors.mainYellow : colors.text}
                    />
                    <Text style={styles.checkboxLabel}>{chip}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Memory Type */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Memory Type</Text>
                {['DDR5', 'DDR4', 'DDR3'].map(type => (
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

              {/* Memory Slots */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Memory Slots</Text>
                {[2, 4, 8].map(slots => (
                  <TouchableOpacity
                    key={slots}
                    style={styles.checkboxRow}
                    onPress={() => handleCheckboxToggle('memorySlots', slots)}
                  >
                    <MaterialCommunityIcons
                      name={filters.memorySlots.includes(slots) ? "checkbox-marked" : "checkbox-blank-outline"}
                      size={24}
                      color={filters.memorySlots.includes(slots) ? colors.mainYellow : colors.text}
                    />
                    <Text style={styles.checkboxLabel}>{slots} Slots</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* PCIe x16 Slots */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>PCIe x16 Slots</Text>
                {[1, 2, 3, 4].map(slots => (
                  <TouchableOpacity
                    key={slots}
                    style={styles.checkboxRow}
                    onPress={() => handleCheckboxToggle('pcieX16Slots', slots)}
                  >
                    <MaterialCommunityIcons
                      name={filters.pcieX16Slots.includes(slots) ? "checkbox-marked" : "checkbox-blank-outline"}
                      size={24}
                      color={filters.pcieX16Slots.includes(slots) ? colors.mainYellow : colors.text}
                    />
                    <Text style={styles.checkboxLabel}>{slots} Slot{slots > 1 ? 's' : ''}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* SATA 6.0 Gb/s */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>SATA 6.0 Gb/s</Text>
                {[2, 4, 6, 8].map(ports => (
                  <TouchableOpacity
                    key={ports}
                    style={styles.checkboxRow}
                    onPress={() => handleCheckboxToggle('sata6Ports', ports)}
                  >
                    <MaterialCommunityIcons
                      name={filters.sata6Ports.includes(ports) ? "checkbox-marked" : "checkbox-blank-outline"}
                      size={24}
                      color={filters.sata6Ports.includes(ports) ? colors.mainYellow : colors.text}
                    />
                    <Text style={styles.checkboxLabel}>{ports} Port{ports > 1 ? 's' : ''}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* M.2 Slots (B Key) */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>M.2 Slots (B Key)</Text>
                {[1, 2, 3, 4].map(slots => (
                  <TouchableOpacity
                    key={slots}
                    style={styles.checkboxRow}
                    onPress={() => handleCheckboxToggle('m2SlotsB', slots)}
                  >
                    <MaterialCommunityIcons
                      name={filters.m2SlotsB.includes(slots) ? "checkbox-marked" : "checkbox-blank-outline"}
                      size={24}
                      color={filters.m2SlotsB.includes(slots) ? colors.mainYellow : colors.text}
                    />
                    <Text style={styles.checkboxLabel}>{slots} Slot{slots > 1 ? 's' : ''}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Onboard Video */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Onboard Video</Text>
                {[
                  { label: 'Yes', value: true },
                  { label: 'No', value: false },
                  { label: 'Any', value: null }
                ].map(option => (
                  <TouchableOpacity
                    key={option.label}
                    style={styles.checkboxRow}
                    onPress={() => setFilters(prev => ({ ...prev, onboardVideo: option.value }))}
                  >
                    <MaterialCommunityIcons
                      name={filters.onboardVideo === option.value ? "radiobox-marked" : "radiobox-blank"}
                      size={24}
                      color={filters.onboardVideo === option.value ? colors.mainYellow : colors.text}
                    />
                    <Text style={styles.checkboxLabel}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Wireless Networking */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Wireless Networking</Text>
                {[
                  { label: 'Yes', value: true },
                  { label: 'No', value: false },
                  { label: 'Any', value: null }
                ].map(option => (
                  <TouchableOpacity
                    key={option.label}
                    style={styles.checkboxRow}
                    onPress={() => setFilters(prev => ({ ...prev, wirelessNetworking: option.value }))}
                  >
                    <MaterialCommunityIcons
                      name={filters.wirelessNetworking === option.value ? "radiobox-marked" : "radiobox-blank"}
                      size={24}
                      color={filters.wirelessNetworking === option.value ? colors.mainYellow : colors.text}
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
