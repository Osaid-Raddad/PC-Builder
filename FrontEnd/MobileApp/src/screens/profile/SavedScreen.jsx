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

const MOCK_SAVED = [
  {
    id: "1",
    type: "post",
    title: "Best RGB Setup 2024",
    author: "TechMaster",
    date: "2 days ago",
    icon: "post",
  },
  {
    id: "2",
    type: "build",
    title: "Budget Gaming PC Guide",
    author: "PCBuilder101",
    date: "1 week ago",
    icon: "desktop-tower",
  },
  {
    id: "3",
    type: "news",
    title: "RTX 5000 Series Announced",
    author: "Tom's Hardware",
    date: "3 days ago",
    icon: "newspaper",
  },
  {
    id: "4",
    type: "guide",
    title: "Cable Management Tips",
    author: "BuildGuide",
    date: "5 days ago",
    icon: "book-open-variant",
  },
];

export default function SavedScreen({ navigation }) {
  const getTypeColor = (type) => {
    const colors = {
      post: '#3b82f6',
      build: '#10b981',
      news: '#f59e0b',
      guide: '#8b5cf6',
    };
    return colors[type] || colors.mainYellow;
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemCard}>
      <View style={[styles.iconContainer, { backgroundColor: getTypeColor(item.type) + '20' }]}>
        <MaterialCommunityIcons
          name={item.icon}
          size={28}
          color={getTypeColor(item.type)}
        />
      </View>
      
      <View style={styles.itemInfo}>
        <View style={styles.itemHeader}>
          <View style={[styles.typeBadge, { backgroundColor: getTypeColor(item.type) }]}>
            <Text style={styles.typeText}>{item.type.toUpperCase()}</Text>
          </View>
          <Text style={styles.date}>{item.date}</Text>
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.author}>by {item.author}</Text>
      </View>

      <TouchableOpacity style={styles.removeButton}>
        <Feather name="bookmark" size={20} color={colors.mainYellow} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <ScreenLayout navigation={navigation} scrollable={false}>
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color={colors.mainBlack} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Saved</Text>
          <Text style={styles.subtitle}>
            {MOCK_SAVED.length} saved items
          </Text>
        </View>

        <FlatList
          data={MOCK_SAVED}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Feather name="bookmark" size={64} color={colors.text} />
              <Text style={styles.emptyText}>No saved items</Text>
              <Text style={styles.emptySubtext}>
                Save posts, builds, and articles to find them easily later
              </Text>
            </View>
          }
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
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
  itemCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    gap: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'white',
  },
  date: {
    fontSize: 12,
    color: colors.text,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.mainBlack,
    marginBottom: 4,
  },
  author: {
    fontSize: 13,
    color: colors.text,
  },
  removeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.mainYellow + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.mainBlack,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.text,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
