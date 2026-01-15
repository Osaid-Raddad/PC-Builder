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
import cpusData from "../../data/components/cpus.json";
import { useBuild } from "../../context/BuildContext";
import { useCompare } from "../../context/CompareContext";

const MOCK_PRODUCTS = (cpusData?.cpus || []).map(cpu => ({
  ...cpu,
  name: cpu.model ? `${cpu.brand} ${cpu.model}` : cpu.brand,
  clockSpeed: cpu.baseClockGHz,
}));

export default function CPUScreen({ navigation, route }) {
  const { addComponent, removeComponent, selectedComponents } = useBuild();
  const { addToCompare, isInCompare, removeFromCompare, getCategory, compareList } = useCompare();
  const { source } = route.params || {}; // 'builder' or 'comparator'
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 2000 },
    manufacturers: [],
    rating: 0,
    coreCount: [],
    threadCount: [],
    clockSpeed: { min: 0, max: 6 },
    l2Cache: [],
    l3Cache: [],
    tdp: { min: 0, max: 300 },
    series: [],
    microarchitecture: [],
    socket: [],
    integratedGraphics: null,
    smt: null,
    eccSupport: null,
    includesCooler: null,
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
      coreCount: [],
      threadCount: [],
      clockSpeed: { min: 0, max: 6 },
      l2Cache: [],
      l3Cache: [],
      tdp: { min: 0, max: 300 },
      series: [],
      microarchitecture: [],
      socket: [],
      integratedGraphics: null,
      smt: null,
      eccSupport: null,
      includesCooler: null,
    });
  };

  const handleAddToBuild = (product) => {
    const componentType = 'cpu';
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
      if (category && category !== 'cpu') {
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
      addToCompare(product, 'cpu');
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
    if (filters.manufacturers?.length > 0 && !filters.manufacturers.includes(product.brand)) return false;
    if (filters.rating > 0 && product.rating < filters.rating) return false;
    if (filters.cores?.length > 0 && !filters.cores.includes(product.coreCount?.toString())) return false;
    if (filters.socket?.length > 0 && !filters.socket.includes(product.socket)) return false;
    return true;
  });

  const renderProduct = ({ item }) => {
    const isSelected = selectedComponents.cpu?.model === item.model;
    const inCompare = isInCompare(item.id);
    
    return (
      <TouchableOpacity 
        style={[styles.productCard, isSelected && styles.productCardSelected]}
        onPress={() => navigation.navigate('ProductDetails', { 
          category: 'cpu', 
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
                <Text style={styles.title}>CPUs</Text>
                <TouchableOpacity onPress={() => setShowFilterModal(true)}>
                  <Feather name="filter" size={24} color={colors.mainBlack} />
                </TouchableOpacity>
              </View>

              <View style={styles.quickFilters}>
                {["Intel", "AMD"].map((brand) => (
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
                {['Intel', 'AMD'].map(brand => (
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

              {/* Core Count */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Core Count</Text>
                {[4, 6, 8, 10, 12, 16, 24, 32].map(cores => (
                  <TouchableOpacity
                    key={cores}
                    style={styles.checkboxRow}
                    onPress={() => handleCheckboxToggle('coreCount', cores)}
                  >
                    <MaterialCommunityIcons
                      name={filters.coreCount.includes(cores) ? "checkbox-marked" : "checkbox-blank-outline"}
                      size={24}
                      color={filters.coreCount.includes(cores) ? colors.mainYellow : colors.text}
                    />
                    <Text style={styles.checkboxLabel}>{cores} Cores</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Thread Count */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Thread Count</Text>
                {[8, 12, 16, 20, 24, 32, 48, 64].map(threads => (
                  <TouchableOpacity
                    key={threads}
                    style={styles.checkboxRow}
                    onPress={() => handleCheckboxToggle('threadCount', threads)}
                  >
                    <MaterialCommunityIcons
                      name={filters.threadCount.includes(threads) ? "checkbox-marked" : "checkbox-blank-outline"}
                      size={24}
                      color={filters.threadCount.includes(threads) ? colors.mainYellow : colors.text}
                    />
                    <Text style={styles.checkboxLabel}>{threads} Threads</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Clock Speed */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Clock Speed</Text>
                <View style={styles.rangeControl}>
                  <View style={styles.rangeInput}>
                    <Text style={styles.rangeLabel}>Min:</Text>
                    <TouchableOpacity 
                      style={styles.rangeButton}
                      onPress={() => setFilters(prev => ({
                        ...prev,
                        clockSpeed: { ...prev.clockSpeed, min: Math.max(0, prev.clockSpeed.min - 0.5) }
                      }))}
                    >
                      <Feather name="minus" size={16} color={colors.mainBlack} />
                    </TouchableOpacity>
                    <Text style={styles.rangeValue}>{filters.clockSpeed.min.toFixed(1)} GHz</Text>
                    <TouchableOpacity 
                      style={styles.rangeButton}
                      onPress={() => setFilters(prev => ({
                        ...prev,
                        clockSpeed: { ...prev.clockSpeed, min: Math.min(prev.clockSpeed.max - 0.5, prev.clockSpeed.min + 0.5) }
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
                        clockSpeed: { ...prev.clockSpeed, max: Math.max(prev.clockSpeed.min + 0.5, prev.clockSpeed.max - 0.5) }
                      }))}
                    >
                      <Feather name="minus" size={16} color={colors.mainBlack} />
                    </TouchableOpacity>
                    <Text style={styles.rangeValue}>{filters.clockSpeed.max.toFixed(1)} GHz</Text>
                    <TouchableOpacity 
                      style={styles.rangeButton}
                      onPress={() => setFilters(prev => ({
                        ...prev,
                        clockSpeed: { ...prev.clockSpeed, max: prev.clockSpeed.max + 0.5 }
                      }))}
                    >
                      <Feather name="plus" size={16} color={colors.mainBlack} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* L2 Cache */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>L2 Cache</Text>
                {['2 MB', '4 MB', '8 MB', '16 MB', '32 MB'].map(cache => (
                  <TouchableOpacity
                    key={cache}
                    style={styles.checkboxRow}
                    onPress={() => handleCheckboxToggle('l2Cache', cache)}
                  >
                    <MaterialCommunityIcons
                      name={filters.l2Cache.includes(cache) ? "checkbox-marked" : "checkbox-blank-outline"}
                      size={24}
                      color={filters.l2Cache.includes(cache) ? colors.mainYellow : colors.text}
                    />
                    <Text style={styles.checkboxLabel}>{cache}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* L3 Cache */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>L3 Cache</Text>
                {['8 MB', '16 MB', '32 MB', '64 MB', '96 MB', '128 MB'].map(cache => (
                  <TouchableOpacity
                    key={cache}
                    style={styles.checkboxRow}
                    onPress={() => handleCheckboxToggle('l3Cache', cache)}
                  >
                    <MaterialCommunityIcons
                      name={filters.l3Cache.includes(cache) ? "checkbox-marked" : "checkbox-blank-outline"}
                      size={24}
                      color={filters.l3Cache.includes(cache) ? colors.mainYellow : colors.text}
                    />
                    <Text style={styles.checkboxLabel}>{cache}</Text>
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
                        tdp: { ...prev.tdp, min: Math.max(0, prev.tdp.min - 10) }
                      }))}
                    >
                      <Feather name="minus" size={16} color={colors.mainBlack} />
                    </TouchableOpacity>
                    <Text style={styles.rangeValue}>{filters.tdp.min}W</Text>
                    <TouchableOpacity 
                      style={styles.rangeButton}
                      onPress={() => setFilters(prev => ({
                        ...prev,
                        tdp: { ...prev.tdp, min: Math.min(prev.tdp.max - 10, prev.tdp.min + 10) }
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
                        tdp: { ...prev.tdp, max: Math.max(prev.tdp.min + 10, prev.tdp.max - 10) }
                      }))}
                    >
                      <Feather name="minus" size={16} color={colors.mainBlack} />
                    </TouchableOpacity>
                    <Text style={styles.rangeValue}>{filters.tdp.max}W</Text>
                    <TouchableOpacity 
                      style={styles.rangeButton}
                      onPress={() => setFilters(prev => ({
                        ...prev,
                        tdp: { ...prev.tdp, max: Math.min(300, prev.tdp.max + 10) }
                      }))}
                    >
                      <Feather name="plus" size={16} color={colors.mainBlack} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Series */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Series</Text>
                {['Ryzen 5', 'Ryzen 7', 'Ryzen 9', 'Core i3', 'Core i5', 'Core i7', 'Core i9'].map(series => (
                  <TouchableOpacity
                    key={series}
                    style={styles.checkboxRow}
                    onPress={() => handleCheckboxToggle('series', series)}
                  >
                    <MaterialCommunityIcons
                      name={filters.series.includes(series) ? "checkbox-marked" : "checkbox-blank-outline"}
                      size={24}
                      color={filters.series.includes(series) ? colors.mainYellow : colors.text}
                    />
                    <Text style={styles.checkboxLabel}>{series}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Microarchitecture */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Microarchitecture</Text>
                {['Zen 4', 'Zen 3', 'Zen 2', 'Raptor Lake', 'Alder Lake', 'Rocket Lake'].map(arch => (
                  <TouchableOpacity
                    key={arch}
                    style={styles.checkboxRow}
                    onPress={() => handleCheckboxToggle('microarchitecture', arch)}
                  >
                    <MaterialCommunityIcons
                      name={filters.microarchitecture.includes(arch) ? "checkbox-marked" : "checkbox-blank-outline"}
                      size={24}
                      color={filters.microarchitecture.includes(arch) ? colors.mainYellow : colors.text}
                    />
                    <Text style={styles.checkboxLabel}>{arch}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Socket */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Socket</Text>
                {['AM5', 'AM4', 'LGA1700', 'LGA1200'].map(socket => (
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

              {/* Integrated Graphics */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Integrated Graphics</Text>
                {[
                  { label: 'Yes', value: true },
                  { label: 'No', value: false },
                  { label: 'Any', value: null }
                ].map(option => (
                  <TouchableOpacity
                    key={option.label}
                    style={styles.checkboxRow}
                    onPress={() => setFilters(prev => ({ ...prev, integratedGraphics: option.value }))}
                  >
                    <MaterialCommunityIcons
                      name={filters.integratedGraphics === option.value ? "radiobox-marked" : "radiobox-blank"}
                      size={24}
                      color={filters.integratedGraphics === option.value ? colors.mainYellow : colors.text}
                    />
                    <Text style={styles.checkboxLabel}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* SMT */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Simultaneous Multithreading (SMT)</Text>
                {[
                  { label: 'Yes', value: true },
                  { label: 'No', value: false },
                  { label: 'Any', value: null }
                ].map(option => (
                  <TouchableOpacity
                    key={option.label}
                    style={styles.checkboxRow}
                    onPress={() => setFilters(prev => ({ ...prev, smt: option.value }))}
                  >
                    <MaterialCommunityIcons
                      name={filters.smt === option.value ? "radiobox-marked" : "radiobox-blank"}
                      size={24}
                      color={filters.smt === option.value ? colors.mainYellow : colors.text}
                    />
                    <Text style={styles.checkboxLabel}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* ECC Support */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>ECC Memory Support</Text>
                {[
                  { label: 'Yes', value: true },
                  { label: 'No', value: false },
                  { label: 'Any', value: null }
                ].map(option => (
                  <TouchableOpacity
                    key={option.label}
                    style={styles.checkboxRow}
                    onPress={() => setFilters(prev => ({ ...prev, eccSupport: option.value }))}
                  >
                    <MaterialCommunityIcons
                      name={filters.eccSupport === option.value ? "radiobox-marked" : "radiobox-blank"}
                      size={24}
                      color={filters.eccSupport === option.value ? colors.mainYellow : colors.text}
                    />
                    <Text style={styles.checkboxLabel}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Includes Cooler */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Includes CPU Cooler</Text>
                {[
                  { label: 'Yes', value: true },
                  { label: 'No', value: false },
                  { label: 'Any', value: null }
                ].map(option => (
                  <TouchableOpacity
                    key={option.label}
                    style={styles.checkboxRow}
                    onPress={() => setFilters(prev => ({ ...prev, includesCooler: option.value }))}
                  >
                    <MaterialCommunityIcons
                      name={filters.includesCooler === option.value ? "radiobox-marked" : "radiobox-blank"}
                      size={24}
                      color={filters.includesCooler === option.value ? colors.mainYellow : colors.text}
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
  priceDisplay: {
    fontSize: 14,
    color: colors.text,
    marginTop: 8,
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
