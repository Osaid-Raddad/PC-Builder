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
import storageData from "../../data/components/storage.json";
import { useBuild } from "../../context/BuildContext";

const MOCK_PRODUCTS = (storageData?.storage || []).map(storage => ({
  ...storage,
  name: `${storage.manufacturer} ${storage.model}`,
  brand: storage.manufacturer,
  capacity: `${storage.capacityGB}GB`,
}));

export default function StorageScreen({ navigation }) {
  const { addComponent, selectedComponents } = useBuild();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 500 },
    manufacturers: [],
    rating: 0,
    capacity: [],
    type: [],
    interface: [],
    cache: [],
    formFactor: [],
    nvme: null,
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
      capacity: [],
      type: [],
      interface: [],
      cache: [],
      formFactor: [],
      nvme: null,
    });
  };

  const handleAddToBuild = (product) => {
    addComponent('storage', product);
    Alert.alert(
      "Storage Added",
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

  const renderProduct = ({ item }) => {
    const isSelected = selectedComponents.storage?.model === item.model;
    
    return (
    <TouchableOpacity style={[styles.productCard, isSelected && styles.productCardSelected]}>
      <View style={styles.productImage}>
        <Feather name="hard-drive" size={48} color={colors.mainYellow} />
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
      <TouchableOpacity 
        style={[styles.addButton, isSelected && styles.addButtonSelected]}
        onPress={() => handleAddToBuild(item)}
      >
        <Feather 
          name={isSelected ? "check" : "plus"} 
          size={20} 
          color={isSelected ? colors.success : colors.mainBlack} 
        />
      </TouchableOpacity>
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
                <Text style={styles.title}>Storage</Text>
                <TouchableOpacity onPress={() => setShowFilterModal(true)}>
                  <Feather name="filter" size={24} color={colors.mainBlack} />
                </TouchableOpacity>
              </View>

              {/* Quick Filters */}
              <View style={styles.quickFilters}>
                {['NVMe SSD', 'SATA SSD', 'HDD'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.quickFilterButton,
                      filters.type.includes(type) && styles.quickFilterButtonActive,
                    ]}
                    onPress={() => handleCheckboxToggle('type', type)}
                  >
                    <Text
                      style={[
                        styles.quickFilterText,
                        filters.type.includes(type) && styles.quickFilterTextActive,
                      ]}
                    >
                      {type}
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
                  {['Samsung', 'Western Digital', 'Crucial', 'Seagate', 'Kingston', 'SK Hynix'].map(brand => (
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

                {/* Capacity */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>Capacity</Text>
                  {['256GB', '500GB', '1TB', '2TB', '4TB', '8TB'].map(capacity => (
                    <TouchableOpacity
                      key={capacity}
                      style={styles.checkboxRow}
                      onPress={() => handleCheckboxToggle('capacity', capacity)}
                    >
                      <MaterialCommunityIcons
                        name={filters.capacity.includes(capacity) ? "checkbox-marked" : "checkbox-blank-outline"}
                        size={24}
                        color={filters.capacity.includes(capacity) ? colors.mainYellow : colors.text}
                      />
                      <Text style={styles.checkboxLabel}>{capacity}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Type */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>Type</Text>
                  {['NVMe SSD', 'SATA SSD', 'HDD'].map(type => (
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

                {/* Interface */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>Interface</Text>
                  {['PCIe 3.0 x4', 'PCIe 4.0 x4', 'PCIe 5.0 x4', 'SATA III', 'SATA II'].map(iface => (
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

                {/* Cache */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>Cache</Text>
                  {['64MB', '128MB', '256MB', '512MB', '1GB', '2GB'].map(cache => (
                    <TouchableOpacity
                      key={cache}
                      style={styles.checkboxRow}
                      onPress={() => handleCheckboxToggle('cache', cache)}
                    >
                      <MaterialCommunityIcons
                        name={filters.cache.includes(cache) ? "checkbox-marked" : "checkbox-blank-outline"}
                        size={24}
                        color={filters.cache.includes(cache) ? colors.mainYellow : colors.text}
                      />
                      <Text style={styles.checkboxLabel}>{cache}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Form Factor */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>Form Factor</Text>
                  {['M.2 2280', 'M.2 2242', 'M.2 22110', '2.5"', '3.5"'].map(factor => (
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

                {/* NVMe */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>NVMe</Text>
                  {[
                    { label: 'NVMe Supported', value: true },
                    { label: 'Non-NVMe', value: false },
                  ].map(option => (
                    <TouchableOpacity
                      key={option.label}
                      style={styles.checkboxRow}
                      onPress={() => setFilters(prev => ({ ...prev, nvme: option.value }))}
                    >
                      <MaterialCommunityIcons
                        name={filters.nvme === option.value ? "radiobox-marked" : "radiobox-blank"}
                        size={24}
                        color={filters.nvme === option.value ? colors.mainYellow : colors.text}
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.mainYellow,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
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
