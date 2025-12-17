import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import ScreenLayout from "../../components/ScreenLayout";
import colors from "../../config/colors";

const MOCK_BUILDS = [
  {
    id: "1",
    title: "Gaming Beast 2024",
    author: "John Doe",
    likes: 234,
    budget: 2500,
  },
  {
    id: "2",
    title: "Budget Workstation",
    author: "Jane Smith",
    likes: 189,
    budget: 1200,
  },
  {
    id: "3",
    title: "Content Creator Pro",
    author: "Mike Johnson",
    likes: 312,
    budget: 3000,
  },
];

export default function CompletedBuildsScreen({ navigation }) {
  const renderBuild = ({ item }) => (
    <TouchableOpacity style={styles.buildCard}>
      <View style={styles.buildImage}>
        <MaterialCommunityIcons
          name="desktop-tower"
          size={48}
          color={colors.mainYellow}
        />
      </View>
      <View style={styles.buildInfo}>
        <Text style={styles.buildTitle}>{item.title}</Text>
        <Text style={styles.buildAuthor}>by {item.author}</Text>
        <View style={styles.buildFooter}>
          <View style={styles.likes}>
            <Feather name="heart" size={16} color={colors.error} />
            <Text style={styles.likesText}>{item.likes}</Text>
          </View>
          <Text style={styles.budget}>${item.budget}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenLayout navigation={navigation}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Completed Builds</Text>
          <Text style={styles.subtitle}>
            Explore PC builds from the community
          </Text>
        </View>

        <View style={styles.filters}>
          <TouchableOpacity style={styles.filterChip}>
            <Feather name="filter" size={18} color={colors.mainBlack} />
            <Text style={styles.filterText}>Filters</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip}>
            <Feather name="trending-up" size={18} color={colors.mainBlack} />
            <Text style={styles.filterText}>Popular</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip}>
            <Feather name="clock" size={18} color={colors.mainBlack} />
            <Text style={styles.filterText}>Recent</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={MOCK_BUILDS}
          renderItem={renderBuild}
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
    backgroundColor: colors.mainBeige,
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
  filters: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 8,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  filterText: {
    fontSize: 14,
    color: colors.mainBlack,
    fontWeight: "500",
  },
  listContainer: {
    paddingBottom: 20,
  },
  buildCard: {
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
  buildImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  buildInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  buildTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.mainBlack,
    marginBottom: 4,
  },
  buildAuthor: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
  },
  buildFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  likes: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  likesText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "500",
  },
  budget: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.mainYellow,
  },
});
