import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import ScreenLayout from '../../components/ScreenLayout';
import colors from '../../config/colors';
import { useBuild } from '../../context/BuildContext';

// Import all product data
import cpusData from '../../data/components/cpus.json';
import gpusData from '../../data/components/gpus.json';
import motherboardsData from '../../data/components/motherboards.json';
import memoryData from '../../data/components/memory.json';
import storageData from '../../data/components/storage.json';
import casesData from '../../data/components/cases.json';
import powerSuppliesData from '../../data/components/powerSupplies.json';
import monitorsData from '../../data/components/monitors.json';
import cpuCoolersData from '../../data/components/cpuCoolers.json';
import accessoriesData from '../../data/components/accessories.json';
import expansionData from '../../data/components/expansion.json';
import peripheralsData from '../../data/components/peripherals.json';

const { width } = Dimensions.get('window');

export default function ProductDetailsScreen({ route, navigation }) {
  const { category, productId } = route.params;
  const { addComponent } = useBuild();
  const [product, setProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('specs'); // specs, features, compatibility

  useEffect(() => {
    loadProduct();
  }, [category, productId]);

  const getProductData = () => {
    let productList;
    let componentKey;

    switch (category) {
      case 'cpu':
        productList = cpusData?.cpus;
        componentKey = 'cpu';
        break;
      case 'gpu':
        productList = gpusData?.gpus;
        componentKey = 'gpu';
        break;
      case 'motherboard':
        productList = motherboardsData?.motherboards;
        componentKey = 'motherboard';
        break;
      case 'memory':
        productList = memoryData?.memory;
        componentKey = 'memory';
        break;
      case 'storage':
        productList = storageData?.storage;
        componentKey = 'storage';
        break;
      case 'case':
        productList = casesData?.cases;
        componentKey = 'case';
        break;
      case 'power-supply':
      case 'powersupply':
        productList = powerSuppliesData?.powerSupplies;
        componentKey = 'psu';
        break;
      case 'monitor':
        productList = Array.isArray(monitorsData) ? monitorsData : monitorsData?.monitors;
        componentKey = 'monitor';
        break;
      case 'cooler':
      case 'cpucooler':
        productList = cpuCoolersData?.cpuCoolers;
        componentKey = 'cooler';
        break;
      case 'accessories':
        productList = Array.isArray(accessoriesData) ? accessoriesData : accessoriesData?.accessories;
        componentKey = 'accessories';
        break;
      case 'expansion':
        productList = Array.isArray(expansionData) ? expansionData : expansionData?.expansion;
        componentKey = 'expansion';
        break;
      case 'peripherals':
        productList = Array.isArray(peripheralsData) ? peripheralsData : peripheralsData?.peripherals;
        componentKey = 'peripherals';
        break;
      default:
        return null;
    }

    if (!productList || !Array.isArray(productList)) {
      return null;
    }

    const rawProduct = productList.find(
      p => p.id === productId || p.id === parseInt(productId) || p.id?.toString() === productId?.toString()
    );

    if (!rawProduct) {
      return null;
    }

    const brand = rawProduct.brand || rawProduct.manufacturer;
    const model = rawProduct.model || '';

    return {
      ...rawProduct,
      componentKey,
      name: rawProduct.name || (model ? `${brand} ${model}` : brand),
      brand: brand,
      rating: rawProduct.rating || 4.5,
      images: [
        rawProduct.image || 'https://via.placeholder.com/400x300/242423/f3bd4a?text=Product+Image',
        'https://via.placeholder.com/400x300/242423/efece1?text=View+2',
        'https://via.placeholder.com/400x300/242423/CFDBD5?text=View+3',
        'https://via.placeholder.com/400x300/242423/333533?text=View+4',
      ],
      specifications: generateSpecifications(rawProduct, category),
      features: generateFeatures(rawProduct, category),
      compatibility: generateCompatibility(rawProduct, category),
    };
  };

  const generateSpecifications = (product, category) => {
    const brand = product.brand || product.manufacturer;
    const model = product.model || '';

    switch (category) {
      case 'cpu':
        return [
          { label: 'Brand', value: brand },
          { label: 'Model', value: model },
          { label: 'Cores', value: product.cores },
          { label: 'Threads', value: product.threads },
          { label: 'Base Clock', value: `${product.baseClockGHz} GHz` },
          { label: 'Boost Clock', value: `${product.boostClockGHz} GHz` },
          { label: 'TDP', value: `${product.tdpWatts}W` },
          { label: 'Socket', value: product.socket },
          { label: 'Performance', value: product.performanceScore },
        ];
      case 'gpu':
        return [
          { label: 'Brand', value: brand },
          { label: 'Model', value: model },
          { label: 'Memory', value: `${product.memoryGB}GB ${product.memoryType}` },
          { label: 'Core Clock', value: `${product.coreClockMHz} MHz` },
          { label: 'Boost Clock', value: `${product.boostClockMHz} MHz` },
          { label: 'TDP', value: `${product.tdpWatts}W` },
          { label: 'Length', value: `${product.length}mm` },
          { label: 'PCI Slots', value: product.pciSlots },
          { label: 'Performance', value: product.performanceScore },
        ];
      case 'motherboard':
        return [
          { label: 'Brand', value: brand },
          { label: 'Model', value: model },
          { label: 'Socket', value: product.socket },
          { label: 'Form Factor', value: product.formFactor },
          { label: 'Chipset', value: product.chipset },
          { label: 'Memory Type', value: product.memoryType },
          { label: 'Memory Slots', value: product.memorySlots },
          { label: 'Max Memory', value: `${product.maxMemoryGB}GB` },
          { label: 'PCIe x16', value: product.pcie16Slots },
          { label: 'M.2 Slots', value: product.m2Slots },
        ];
      case 'memory':
        return [
          { label: 'Brand', value: brand },
          { label: 'Model', value: model },
          { label: 'Type', value: product.type },
          { label: 'Speed', value: `${product.speedMHz} MHz` },
          { label: 'Modules', value: product.modules },
          { label: 'Per Module', value: `${product.capacityPerModuleGB}GB` },
          { label: 'Total', value: `${product.totalCapacityGB}GB` },
          { label: 'CAS Latency', value: `CL${product.casLatency}` },
          { label: 'Color', value: product.color },
        ];
      case 'storage':
        return [
          { label: 'Brand', value: brand },
          { label: 'Model', value: model },
          { label: 'Type', value: product.type },
          { label: 'Capacity', value: `${product.capacityGB}GB` },
          { label: 'Form Factor', value: product.formFactor },
          { label: 'Interface', value: product.interface },
          { label: 'Cache', value: `${product.cacheMB}MB` },
        ];
      case 'monitor':
        return [
          { label: 'Brand', value: brand },
          { label: 'Model', value: model || product.name },
          { label: 'Size', value: `${product.screenSize}"` },
          { label: 'Resolution', value: product.resolution },
          { label: 'Refresh Rate', value: `${product.refreshRate}Hz` },
          { label: 'Response Time', value: `${product.responseTime}ms` },
          { label: 'Panel Type', value: product.panelType },
        ];
      default:
        return [
          { label: 'Brand', value: brand },
          { label: 'Name', value: product.name || `${brand} ${model}` },
          { label: 'Price', value: `$${product.price}` },
        ];
    }
  };

  const generateFeatures = (product, category) => {
    const features = [];

    switch (category) {
      case 'cpu':
        features.push(`${product.cores} cores / ${product.threads} threads`);
        features.push(`Up to ${product.boostClockGHz}GHz boost`);
        if (product.integratedGraphics) features.push(`Integrated ${product.integratedGraphics}`);
        features.push(`${product.socket} socket`);
        break;
      case 'gpu':
        features.push(`${product.memoryGB}GB ${product.memoryType} memory`);
        features.push(`Performance score: ${product.performanceScore}`);
        features.push(`Boost up to ${product.boostClockMHz}MHz`);
        features.push(`${product.pciSlots}-slot design`);
        break;
      case 'motherboard':
        features.push(`Supports ${product.memoryType} up to ${product.maxMemoryGB}GB`);
        features.push(`${product.pcie16Slots} PCIe x16 slots`);
        features.push(`${product.m2Slots} M.2 slots`);
        features.push(`${product.formFactor} form factor`);
        break;
      default:
        features.push('High-quality construction');
        features.push('Reliable performance');
        features.push('Great value');
    }

    return features;
  };

  const generateCompatibility = (product, category) => {
    const compat = [];

    switch (category) {
      case 'cpu':
        compat.push(`Compatible with ${product.socket} motherboards`);
        compat.push('Requires appropriate cooling');
        compat.push('Check motherboard compatibility');
        break;
      case 'gpu':
        compat.push(`Requires ${product.pciSlots} PCIe slots`);
        compat.push(`Minimum ${product.tdpWatts}W PSU recommended`);
        compat.push(`Check case clearance (${product.length}mm)`);
        break;
      default:
        compat.push('Check specifications for compatibility');
        compat.push('Consult manufacturer documentation');
    }

    return compat;
  };

  const loadProduct = () => {
    const productData = getProductData();
    setProduct(productData);
  };

  const handleAddToBuild = () => {
    if (product) {
      addComponent(product.componentKey, product);
      Alert.alert(
        'Added to Build',
        `${product.name} has been added to your build.`,
        [
          { text: 'Continue', style: 'cancel' },
          { text: 'View Build', onPress: () => navigation.navigate('Builder') },
        ]
      );
    }
  };

  if (!product) {
    return (
      <ScreenLayout>
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={64} color={colors.platinum} />
          <Text style={styles.errorText}>Product not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </ScreenLayout>
    );
  }

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Feather
          key={i}
          name={i <= Math.floor(rating) ? 'star' : 'star'}
          size={16}
          color={i <= Math.floor(rating) ? colors.mainYellow : colors.platinum}
          style={styles.star}
        />
      );
    }
    return stars;
  };

  return (
    <ScreenLayout navigation={navigation} scrollable={false} showFooter={false}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerButton}
          >
            <Feather name="arrow-left" size={24} color={colors.mainYellow} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Product Details</Text>
          <View style={styles.headerButton} />
        </View>

        {/* Image Gallery */}
        <View style={styles.imageSection}>
          <Image
            source={{ uri: product.images[selectedImageIndex] }}
            style={styles.mainImage}
            resizeMode="cover"
          />
          <View style={styles.thumbnailContainer}>
            {product.images.map((img, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedImageIndex(index)}
                style={[
                  styles.thumbnail,
                  selectedImageIndex === index && styles.thumbnailActive,
                ]}
              >
                <Image source={{ uri: img }} style={styles.thumbnailImage} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Product Info */}
        <View style={styles.infoSection}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.brandText}>Brand: {product.brand}</Text>

          <View style={styles.ratingRow}>
            <View style={styles.starsRow}>{renderStars(product.rating)}</View>
            <Text style={styles.ratingText}>{product.rating}</Text>
          </View>

          <Text style={styles.priceText}>${product.price?.toFixed(2)}</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'specs' && styles.tabActive]}
            onPress={() => setActiveTab('specs')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'specs' && styles.tabTextActive,
              ]}
            >
              Specifications
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'features' && styles.tabActive]}
            onPress={() => setActiveTab('features')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'features' && styles.tabTextActive,
              ]}
            >
              Features
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'compatibility' && styles.tabActive,
            ]}
            onPress={() => setActiveTab('compatibility')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'compatibility' && styles.tabTextActive,
              ]}
            >
              Compatibility
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'specs' && (
            <View style={styles.specsContainer}>
              {product.specifications.map((spec, index) => (
                <View key={index} style={styles.specRow}>
                  <Text style={styles.specLabel}>{spec.label}</Text>
                  <Text style={styles.specValue}>{spec.value}</Text>
                </View>
              ))}
            </View>
          )}

          {activeTab === 'features' && (
            <View style={styles.featuresContainer}>
              {product.features.map((feature, index) => (
                <View key={index} style={styles.featureRow}>
                  <Feather
                    name="check-circle"
                    size={20}
                    color={colors.mainYellow}
                  />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          )}

          {activeTab === 'compatibility' && (
            <View style={styles.compatContainer}>
              {product.compatibility.map((item, index) => (
                <View key={index} style={styles.compatRow}>
                  <Feather name="info" size={20} color={colors.mainYellow} />
                  <Text style={styles.compatText}>{item}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Add to Build Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddToBuild}
        >
          <Feather name="plus" size={24} color="white" />
          <Text style={styles.addButtonText}>Add to Build</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.mainBeige,
  },
  headerButton: {
    width: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.mainBlack,
  },
  imageSection: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
  },
  mainImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    backgroundColor: colors.mainBeige,
  },
  thumbnailContainer: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.platinum,
    overflow: 'hidden',
  },
  thumbnailActive: {
    borderColor: colors.mainYellow,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  infoSection: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.mainBlack,
    marginBottom: 8,
  },
  brandText: {
    fontSize: 16,
    color: colors.jet,
    marginBottom: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  starsRow: {
    flexDirection: 'row',
    marginRight: 8,
  },
  star: {
    marginRight: 2,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.mainBlack,
  },
  priceText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.mainYellow,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 4,
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.mainYellow,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.jet,
  },
  tabTextActive: {
    color: colors.mainYellow,
  },
  tabContent: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
  },
  specsContainer: {
    gap: 12,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.platinum,
  },
  specLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.mainBlack,
  },
  specValue: {
    fontSize: 16,
    color: colors.jet,
  },
  featuresContainer: {
    gap: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: colors.jet,
    flex: 1,
  },
  compatContainer: {
    gap: 12,
  },
  compatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  compatText: {
    fontSize: 16,
    color: colors.jet,
    flex: 1,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: colors.mainYellow,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    gap: 8,
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.mainBlack,
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: colors.mainYellow,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});
