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
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import ScreenLayout from "../../components/ScreenLayout";
import colors from "../../config/colors";

const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "Intel Core i9-13900K",
    price: 589,
    brand: "Intel",
    rating: 4.8,
  },
  { id: "2", name: "AMD Ryzen 9 7950X", price: 699, brand: "AMD", rating: 4.9 },
  {
    id: "3",
    name: "Intel Core i7-13700K",
    price: 419,
    brand: "Intel",
    rating: 4.7,
  },
  { id: "4", name: "AMD Ryzen 7 7700X", price: 399, brand: "AMD", rating: 4.6 },
];

export default function PowerSupplyScreen({ navigation }) {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 500 },
    manufacturers: [],
    rating: 0,
    type: [],
    efficiencyRating: [],
    wattage: [],
    modular: [],
    fanless: null,
    pcie8pin: [],
    sataConnectors: [],
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
      type: [],
      efficiencyRating: [],
      wattage: [],
      modular: [],
      fanless: null,
      pcie8pin: [],
      sataConnectors: [],
    });
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity style={styles.productCard}>
      <View style={styles.productImage}>
        <Feather name="battery-charging" size={48} color={colors.mainYellow} />
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
      <TouchableOpacity style={styles.addButton}>
        <Feather name="plus" size={20} color={colors.mainBlack} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

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
                <Text style={styles.title}>Power Supplies</Text>
                <TouchableOpacity onPress={() => setShowFilterModal(true)}>
                  <Feather name="filter" size={24} color={colors.mainBlack} />
                </TouchableOpacity>
              </View>

              <View style={styles.quickFilters}>
                {["80+ Gold", "80+ Platinum", "Fully Modular"].map((filter) => (
                  <TouchableOpacity
                    key={filter}
                    style={[
                      styles.quickFilterButton,
                      (filter === "80+ Gold" && filters.efficiencyRating.includes("80+ Gold")) ||
                      (filter === "80+ Platinum" && filters.efficiencyRating.includes("80+ Platinum")) ||
                      (filter === "Fully Modular" && filters.modular.includes("Full"))
                        ? styles.quickFilterButtonActive : null,
                    ]}
                    onPress={() => {
                      if (filter === "Fully Modular") {
                        handleCheckboxToggle('modular', 'Full');
                      } else {
                        handleCheckboxToggle('efficiencyRating', filter);
                      }
                    }}
                  >
                    <Text
                      style={[
                        styles.quickFilterText,
                        (filter === "80+ Gold" && filters.efficiencyRating.includes("80+ Gold")) ||
                        (filter === "80+ Platinum" && filters.efficiencyRating.includes("80+ Platinum")) ||
                        (filter === "Fully Modular" && filters.modular.includes("Full"))
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
                {['Corsair', 'EVGA', 'Seasonic', 'Thermaltake', 'be quiet!', 'Cooler Master'].map(brand => (
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

              {/* Type */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Type</Text>
                {['ATX', 'SFX', 'TFX'].map(type => (
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

              {/* Efficiency Rating */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Efficiency Rating</Text>
                {['80+ Titanium', '80+ Platinum', '80+ Gold', '80+ Silver', '80+ Bronze'].map(rating => (
                  <TouchableOpacity
                    key={rating}
                    style={styles.checkboxRow}
                    onPress={() => handleCheckboxToggle('efficiencyRating', rating)}
                  >
                    <MaterialCommunityIcons
                      name={filters.efficiencyRating.includes(rating) ? "checkbox-marked" : "checkbox-blank-outline"}
                      size={24}
                      color={filters.efficiencyRating.includes(rating) ? colors.mainYellow : colors.text}
                    />
                    <Text style={styles.checkboxLabel}>{rating}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Wattage */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Wattage</Text>
                {['450W', '550W', '650W', '750W', '850W', '1000W', '1200W'].map(watts => (
                  <TouchableOpacity
                    key={watts}
                    style={styles.checkboxRow}
                    onPress={() => handleCheckboxToggle('wattage', watts)}
                  >
                    <MaterialCommunityIcons
                      name={filters.wattage.includes(watts) ? "checkbox-marked" : "checkbox-blank-outline"}
                      size={24}
                      color={filters.wattage.includes(watts) ? colors.mainYellow : colors.text}
                    />
                    <Text style={styles.checkboxLabel}>{watts}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Modular */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Modular</Text>
                {['Full', 'Semi', 'No'].map(mod => (
                  <TouchableOpacity
                    key={mod}
                    style={styles.checkboxRow}
                    onPress={() => handleCheckboxToggle('modular', mod)}
                  >
                    <MaterialCommunityIcons
                      name={filters.modular.includes(mod) ? "checkbox-marked" : "checkbox-blank-outline"}
                      size={24}
                      color={filters.modular.includes(mod) ? colors.mainYellow : colors.text}
                    />
                    <Text style={styles.checkboxLabel}>{mod === 'Full' ? 'Fully Modular' : mod === 'Semi' ? 'Semi Modular' : 'Non-Modular'}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Fanless */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Fanless</Text>
                {[
                  { label: 'Yes', value: true },
                  { label: 'No', value: false },
                  { label: 'Any', value: null }
                ].map(option => (
                  <TouchableOpacity
                    key={option.label}
                    style={styles.checkboxRow}
                    onPress={() => setFilters(prev => ({ ...prev, fanless: option.value }))}
                  >
                    <MaterialCommunityIcons
                      name={filters.fanless === option.value ? "radiobox-marked" : "radiobox-blank"}
                      size={24}
                      color={filters.fanless === option.value ? colors.mainYellow : colors.text}
                    />
                    <Text style={styles.checkboxLabel}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* PCIe 8-Pin Connectors */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>PCIe 8-Pin Connectors</Text>
                {[2, 3, 4, 5, 6].map(pins => (
                  <TouchableOpacity
                    key={pins}
                    style={styles.checkboxRow}
                    onPress={() => handleCheckboxToggle('pcie8pin', pins)}
                  >
                    <MaterialCommunityIcons
                      name={filters.pcie8pin.includes(pins) ? "checkbox-marked" : "checkbox-blank-outline"}
                      size={24}
                      color={filters.pcie8pin.includes(pins) ? colors.mainYellow : colors.text}
                    />
                    <Text style={styles.checkboxLabel}>{pins} Connector{pins > 1 ? 's' : ''}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* SATA Connectors */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>SATA Connectors</Text>
                {[4, 6, 8, 10, 12].map(sata => (
                  <TouchableOpacity
                    key={sata}
                    style={styles.checkboxRow}
                    onPress={() => handleCheckboxToggle('sataConnectors', sata)}
                  >
                    <MaterialCommunityIcons
                      name={filters.sataConnectors.includes(sata) ? "checkbox-marked" : "checkbox-blank-outline"}
                      size={24}
                      color={filters.sataConnectors.includes(sata) ? colors.mainYellow : colors.text}
                    />
                    <Text style={styles.checkboxLabel}>{sata} Connector{sata > 1 ? 's' : ''}</Text>
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
});
