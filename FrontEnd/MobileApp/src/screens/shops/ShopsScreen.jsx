import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import ScreenLayout from "../../components/ScreenLayout";
import colors from "../../config/colors";

const MOCK_SHOPS = [
  {
    id: "1",
    name: "TechZone",
    location: "Nablus, Palestine",
    rating: 4.8,
    verified: true,
  },
  {
    id: "2",
    name: "PC Paradise",
    location: "Ramallah, Palestine",
    rating: 4.6,
    verified: true,
  },
  {
    id: "3",
    name: "GamersHub",
    location: "Bethlehem, Palestine",
    rating: 4.7,
    verified: false,
  },
];

export default function ShopsScreen({ navigation }) {
  const renderShop = ({ item }) => (
    <TouchableOpacity style={styles.shopCard}>
      <View style={styles.shopIcon}>
        <Feather name="shopping-bag" size={32} color={colors.mainYellow} />
      </View>
      <View style={styles.shopInfo}>
        <View style={styles.shopHeader}>
          <Text style={styles.shopName}>{item.name}</Text>
          {item.verified && (
            <MaterialCommunityIcons
              name="check-decagram"
              size={20}
              color={colors.primary}
            />
          )}
        </View>
        <View style={styles.shopLocation}>
          <Feather name="map-pin" size={14} color={colors.text} />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>
        <View style={styles.rating}>
          <Feather name="star" size={16} color={colors.mainYellow} />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      </View>
      <Feather name="chevron-right" size={24} color={colors.platinum} />
    </TouchableOpacity>
  );

  return (
    <ScreenLayout navigation={navigation}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Local Shops</Text>
          <Text style={styles.subtitle}>Find PC shops near you</Text>
        </View>

        <TouchableOpacity style={styles.filterButton}>
          <Feather name="map" size={20} color={colors.mainBlack} />
          <Text style={styles.filterText}>Map View</Text>
        </TouchableOpacity>

        <FlatList
          data={MOCK_SHOPS}
          renderItem={renderShop}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.mainBlack,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    marginTop: 8,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  filterText: {
    fontSize: 16,
    color: colors.mainBlack,
    fontWeight: "500",
  },
  listContainer: {
    paddingBottom: 20,
  },
  shopCard: {
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
    alignItems: "center",
  },
  shopIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  shopInfo: {
    flex: 1,
  },
  shopHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  shopName: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.mainBlack,
  },
  shopLocation: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 6,
  },
  locationText: {
    fontSize: 14,
    color: colors.text,
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
});
