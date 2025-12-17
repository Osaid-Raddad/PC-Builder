import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  Image,
  Linking,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import ScreenLayout from "../../components/ScreenLayout";
import colors from "../../config/colors";

const ALL_SHOPS = [
  {
    id: 1,
    name: 'Watani Mall',
    description: 'Your trusted destination for computers, electronics, and tech accessories in Palestine',
    logo: require('../../../assets/watani.png'),
    url: 'https://watanimall.com/?srsltid=AfmBOor1Zh5XPOFWmau4Ty-57WDCplKHQEoddNMlTyIfS4TpG-4F1UMH',
    location: 'Beit-Hanina, Jerusalem',
    city: 'Jerusalem',
    specialties: ['Computers', 'Gaming', 'Electronics', 'Accessories']
  },
  {
    id: 2,
    name: 'CS Net Games',
    description: 'Gaming specialists with wide selection of gaming hardware',
    logo: require('../../../assets/cs.png'), // SVG not supported, using placeholder
    url: 'https://csnetgames.com/ar',
    location: 'Ramallah, West Bank',
    city: 'Ramallah',
    specialties: ['Gaming PCs', 'Consoles', 'Gaming Accessories']
  },
  {
    id: 3,
    name: 'Cobra Shop',
    description: 'Premium computer hardware and gaming equipment supplier',
    logo: require('../../../assets/cobra.webp'),
    url: 'https://www.cobrashop.ps/',
    location: 'Ramallah, West Bank',
    city: 'Ramallah',
    specialties: ['PC Components', 'Gaming Gear', 'Peripherals']
  },
  {
    id: 4,
    name: 'Mega Tech',
    description: 'Complete tech solutions for all your computing needs',
    logo: require('../../../assets/mega.png'),
    url: 'https://megatech.ps/',
    location: 'Ramallah, West Bank',
    city: 'Ramallah',
    specialties: ['PC Building', 'Repairs', 'Components', 'Gaming']
  },
  {
    id: 5,
    name: 'Quantum',
    description: 'Professional computer solutions and IT services',
    logo: require('../../../assets/quantum.webp'),
    url: 'https://quantum.ps/',
    location: 'Ramallah, West Bank',
    city: 'Ramallah',
    specialties: ['Business Solutions', 'Hardware', 'IT Services']
  },
  {
    id: 6,
    name: 'A to Z',
    description: 'Complete technology store offering comprehensive range of computer products',
    logo: require('../../../assets/AZ.jpg'),
    url: 'https://www.facebook.com/atoztechnologystore',
    location: 'Ramallah, West Bank',
    city: 'Ramallah',
    specialties: ['Computers', 'Technology', 'Accessories', 'Electronics']
  },
  {
    id: 7,
    name: 'ZikZak Store',
    description: 'Modern tech store offering latest computers and accessories',
    logo: require('../../../assets/zikzak.webp'),
    url: 'https://zikzakstore.com/en/',
    location: 'Nablus, West Bank',
    city: 'Nablus',
    specialties: ['Laptops', 'Desktops', 'Accessories', 'Software']
  },
  {
    id: 8,
    name: 'Arabi',
    description: 'Reliable computer shop offering quality hardware and excellent customer service',
    logo: require('../../../assets/Arabi.jpg'),
    url: 'https://www.facebook.com/alarabi.for.computer',
    location: 'Bethlehem, West Bank',
    city: 'Bethlehem',
    specialties: ['Computers', 'Hardware', 'Repairs', 'Accessories']
  },
  {
    id: 9,
    name: 'Alyamen',
    description: 'Trusted provider of computers and tech solutions for businesses and individuals',
    logo: require('../../../assets/yamen.png'),
    url: 'https://www.facebook.com/Yamen4Computer/',
    location: 'Hebron, West Bank',
    city: 'Hebron',
    specialties: ['PC Building', 'Components', 'Software', 'IT Support']
  },
  {
    id: 10,
    name: 'Extreme Gaming Store',
    description: 'Ultimate destination for gaming enthusiasts with top-tier gaming hardware',
    logo: require('../../../assets/extreme.png'),
    url: 'https://xgc.ps/',
    location: 'Ramallah, West Bank',
    city: 'Ramallah',
    specialties: ['Gaming PCs', 'High-End Components', 'Gaming Gear', 'Custom Builds']
  },
  {
    id: 11,
    name: 'Core Tech',
    description: 'Cutting-edge technology solutions and computer hardware provider',
    logo: require('../../../assets/coretech.jpg'),
    url: 'https://www.facebook.com/share/17SqcdAwHe/?mibextid=wwXIfr',
    location: 'Hebron, West Bank',
    city: 'Hebron',
    specialties: ['PC Components', 'Hardware', 'Gaming', 'Accessories']
  },
  {
    id: 12,
    name: 'Masalmeh',
    description: 'Trusted computer store with quality products and professional service',
    logo: require('../../../assets/masalmeh.jpg'),
    url: 'https://www.facebook.com/masalmehpc',
    location: 'Hebron, West Bank',
    city: 'Hebron',
    specialties: ['Computers', 'Components', 'Repairs', 'IT Solutions']
  },
  {
    id: 13,
    name: 'Digital Doctors',
    description: 'Expert computer repair and hardware solutions with technical expertise',
    logo: require('../../../assets/digital.jpg'),
    url: 'https://www.facebook.com/share/1AUkjNyi6F/?mibextid=wwXIfr',
    location: 'Hebron, West Bank',
    city: 'Hebron',
    specialties: ['Repairs', 'IT Support', 'Hardware', 'Diagnostics']
  },
  {
    id: 14,
    name: 'Islam PC',
    description: 'Quality computer hardware and accessories at competitive prices',
    logo: require('../../../assets/islam.jpg'),
    url: 'https://www.facebook.com/share/19Jy7FQ3Rt/?mibextid=wwXIfr',
    location: 'Hebron, West Bank',
    city: 'Hebron',
    specialties: ['PC Components', 'Accessories', 'Gaming', 'Peripherals']
  },
  {
    id: 15,
    name: 'Master PC',
    description: 'Professional PC building and hardware solutions for enthusiasts',
    logo: require('../../../assets/master.jpg'),
    url: 'https://www.facebook.com/share/17Pycrjfnw/?mibextid=wwXIfr',
    location: 'Hebron, West Bank',
    city: 'Hebron',
    specialties: ['Custom Builds', 'High-End Components', 'Gaming', 'Workstations']
  },
  {
    id: 16,
    name: 'Gold PC',
    description: 'Premium computer hardware and gaming equipment with excellent service',
    logo: require('../../../assets/gold.jpg'),
    url: 'https://www.facebook.com/share/1YuYdFSNAs/?mibextid=wwXIfr',
    location: 'Kafr Aqab, Jerusalem',
    city: 'Jerusalem',
    specialties: ['Gaming PCs', 'Components', 'Accessories', 'Upgrades']
  },
  {
    id: 17,
    name: 'Ultra PC',
    description: 'High-performance PC solutions and cutting-edge computer technology',
    logo: require('../../../assets/ultra.jpg'),
    url: 'https://www.facebook.com/share/1BM24Wqouh/?mibextid=wwXIfr',
    location: 'Hebron, West Bank',
    city: 'Hebron',
    specialties: ['Gaming', 'High-End Hardware', 'Custom Builds', 'Overclocking']
  },
  {
    id: 18,
    name: 'Computer Strix',
    description: 'Gaming-focused computer shop with latest hardware and peripherals',
    logo: require('../../../assets/strix.jpg'),
    url: 'https://www.facebook.com/share/16RSGSFkpM/?mibextid=wwXIfr',
    location: 'Jerusalem',
    city: 'Jerusalem',
    specialties: ['Gaming PCs', 'RGB Components', 'Peripherals', 'Custom Builds']
  },
  {
    id: 19,
    name: 'Nabtech',
    description: 'Modern technology solutions and computer hardware provider',
    logo: require('../../../assets/nabtech.jpg'),
    url: 'https://www.facebook.com/share/16dz6BzfjS/?mibextid=wwXIfr',
    location: 'Nablus, West Bank',
    city: 'Nablus',
    specialties: ['PC Components', 'Laptops', 'Networking', 'IT Solutions']
  },
  {
    id: 20,
    name: 'Warehouse',
    description: 'Large inventory of computer parts and electronics at wholesale prices',
    logo: require('../../../assets/warrehouse.jpg'),
    url: 'https://www.facebook.com/share/1CRDffJKm7/?mibextid=wwXIfr',
    location: 'Tulkarem, West Bank',
    city: 'Tulkarem',
    specialties: ['Wholesale', 'Components', 'Bulk Orders', 'Electronics']
  },
  {
    id: 21,
    name: 'Etihad',
    description: 'Comprehensive computer solutions and hardware supplier',
    logo: require('../../../assets/ithad.jpg'),
    url: 'https://www.facebook.com/share/16TGdXvzH1/?mibextid=wwXIfr',
    location: 'Hebron, West Bank',
    city: 'Hebron',
    specialties: ['Computers', 'Hardware', 'Networking', 'Business Solutions']
  },
  {
    id: 22,
    name: 'Horizon',
    description: 'Innovative computer solutions and technology services',
    logo: require('../../../assets/horizon.jpg'),
    url: 'https://www.facebook.com/profile.php?id=100083081091336',
    location: 'Kafr Aqab, Jerusalem',
    city: 'Jerusalem',
    specialties: ['PC Components', 'Gaming', 'Hardware', 'Tech Solutions']
  },
  {
    id: 23,
    name: 'Easy Life',
    description: 'Making technology accessible with quality computers and electronics',
    logo: require('../../../assets/Easy.png'),
    url: 'https://www.facebook.com/EasyLifeSales',
    location: 'Nablus, West Bank',
    city: 'Nablus',
    specialties: ['Computers', 'Electronics', 'Home Tech', 'Accessories']
  },
  {
    id: 24,
    name: 'Amro Store',
    description: 'Quality computer products and reliable service',
    logo: require('../../../assets/amro.jpg'),
    url: 'https://www.facebook.com/amrostore',
    location: 'Hebron, West Bank',
    city: 'Hebron',
    specialties: ['Computers', 'Components', 'Accessories', 'Gaming']
  }
];

export default function ShopsScreen({ navigation }) {
  const [selectedCity, setSelectedCity] = useState('All');
  
  // Get unique cities for filter
  const cities = ['All', ...new Set(ALL_SHOPS.map(shop => shop.city))];
  
  // Filter shops by selected city
  const filteredShops = selectedCity === 'All' 
    ? ALL_SHOPS 
    : ALL_SHOPS.filter(shop => shop.city === selectedCity);

  const openShopUrl = (url) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };
  const renderShop = ({ item }) => (
    <TouchableOpacity 
      style={styles.shopCard}
      onPress={() => openShopUrl(item.url)}
    >
      <Image 
        source={item.logo}
        style={styles.shopLogo}
        resizeMode="contain"
      />
      <View style={styles.shopInfo}>
        <Text style={styles.shopName}>{item.name}</Text>
        <Text style={styles.shopDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.shopLocation}>
          <Feather name="map-pin" size={14} color={colors.text} />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>
        <View style={styles.specialties}>
          {item.specialties.slice(0, 2).map((specialty, index) => (
            <View key={index} style={styles.specialtyTag}>
              <Text style={styles.specialtyText}>{specialty}</Text>
            </View>
          ))}
        </View>
      </View>
      <Feather name="external-link" size={20} color={colors.mainYellow} />
    </TouchableOpacity>
  );

  return (
    <ScreenLayout navigation={navigation} scrollable={false} showFooter={false}>
      <View style={styles.container}>
        <FlatList
          data={filteredShops}
          renderItem={renderShop}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={
            <>
              <View style={styles.header}>
                <Text style={styles.title}>Local Shops</Text>
                <Text style={styles.subtitle}>Find PC shops near you ({filteredShops.length} shops)</Text>
              </View>

              {/* City Filter */}
              <View style={styles.filterContainer}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.cityFilterContent}
                >
                  {cities.map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={[
                        styles.cityButton,
                        selectedCity === item && styles.cityButtonActive
                      ]}
                      onPress={() => setSelectedCity(item)}
                    >
                      <Text
                        style={[
                          styles.cityButtonText,
                          selectedCity === item && styles.cityButtonTextActive
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
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
    backgroundColor: colors.mainBeige,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.mainBlack,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text,
  },
  filterContainer: {
    paddingHorizontal: 2,
    paddingVertical: 15,
    backgroundColor: colors.mainBeige,
  },
  cityFilterContent: {
    paddingRight: 20,
  },
  cityButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.platinum,
  },
  cityButtonActive: {
    backgroundColor: colors.mainYellow,
    borderColor: colors.mainYellow,
  },
  cityButtonText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "500",
  },
  cityButtonTextActive: {
    color: colors.mainBlack,
    fontWeight: "600",
  },
  listContainer: {
    padding: 20,
  },
  shopCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: "flex-start",
  },
  shopLogo: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  shopInfo: {
    flex: 1,
  },
  shopName: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.mainBlack,
    marginBottom: 6,
  },
  shopDescription: {
    fontSize: 13,
    color: colors.text,
    marginBottom: 8,
    lineHeight: 18,
  },
  shopLocation: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  locationText: {
    fontSize: 13,
    color: colors.text,
    marginLeft: 6,
  },
  specialties: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  specialtyTag: {
    backgroundColor: colors.mainYellow + "20",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  specialtyText: {
    fontSize: 11,
    color: colors.mainBlack,
    fontWeight: "500",
  },
});
