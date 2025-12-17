import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import ScreenLayout from "../../components/ScreenLayout";
import colors from "../../config/colors";

const MOCK_NEWS = [
  {
    id: "1",
    title: "NVIDIA Announces New RTX 5000 Series",
    category: "GPU",
    time: "1h ago",
  },
  {
    id: "2",
    title: "AMD Zen 5 CPUs Break Performance Records",
    category: "CPU",
    time: "3h ago",
  },
  {
    id: "3",
    title: "DDR5 Prices Drop Significantly",
    category: "Memory",
    time: "1d ago",
  },
  {
    id: "4",
    title: "Best Budget Builds for 2024",
    category: "Guides",
    time: "2d ago",
  },
];

export default function NewsScreen({ navigation }) {
  const renderNews = ({ item }) => (
    <TouchableOpacity style={styles.newsCard}>
      <View style={styles.newsImage}>
        <Feather name="trending-up" size={32} color={colors.mainYellow} />
      </View>
      <View style={styles.newsContent}>
        <View style={styles.newsHeader}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
          <Text style={styles.newsTime}>{item.time}</Text>
        </View>
        <Text style={styles.newsTitle}>{item.title}</Text>
      </View>
      <Feather name="chevron-right" size={24} color={colors.platinum} />
    </TouchableOpacity>
  );

  return (
    <ScreenLayout navigation={navigation}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Latest News</Text>
          <Text style={styles.subtitle}>
            Stay updated with PC hardware news
          </Text>
        </View>

        <FlatList
          data={MOCK_NEWS}
          renderItem={renderNews}
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
  listContainer: {
    paddingBottom: 20,
  },
  newsCard: {
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
  newsImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  newsContent: {
    flex: 1,
  },
  newsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: colors.mainYellow + "30",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 12,
    color: colors.mainBlack,
    fontWeight: "600",
  },
  newsTime: {
    fontSize: 12,
    color: colors.text,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.mainBlack,
    lineHeight: 22,
  },
});
