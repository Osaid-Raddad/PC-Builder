import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import ScreenLayout from "../../components/ScreenLayout";
import colors from "../../config/colors";

const MOCK_POSTS = [
  {
    id: "1",
    title: "Best RGB Setup 2024",
    author: "TechMaster",
    likes: 156,
    comments: 23,
    time: "2h ago",
  },
  {
    id: "2",
    title: "Help with Cable Management",
    author: "NewBuilder",
    likes: 89,
    comments: 45,
    time: "5h ago",
  },
  {
    id: "3",
    title: "My First Build Complete!",
    author: "PCEnthusiast",
    likes: 234,
    comments: 67,
    time: "1d ago",
  },
];

export default function PostsScreen({ navigation }) {
  const renderPost = ({ item }) => (
    <TouchableOpacity style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.avatar}>
          <Feather name="user" size={20} color={colors.mainYellow} />
        </View>
        <View style={styles.postMeta}>
          <Text style={styles.authorName}>{item.author}</Text>
          <Text style={styles.postTime}>{item.time}</Text>
        </View>
      </View>
      <Text style={styles.postTitle}>{item.title}</Text>
      <View style={styles.postFooter}>
        <TouchableOpacity style={styles.action}>
          <Feather name="heart" size={20} color={colors.text} />
          <Text style={styles.actionText}>{item.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.action}>
          <Feather name="message-circle" size={20} color={colors.text} />
          <Text style={styles.actionText}>{item.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.action}>
          <Feather name="share-2" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenLayout navigation={navigation}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Community Posts</Text>
          <TouchableOpacity style={styles.createButton}>
            <Feather name="plus" size={20} color={colors.mainBlack} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={MOCK_POSTS}
          renderItem={renderPost}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.mainBlack,
  },
  createButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.mainYellow,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
  postCard: {
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
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  postMeta: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.mainBlack,
  },
  postTime: {
    fontSize: 12,
    color: colors.text,
    marginTop: 2,
  },
  postTitle: {
    fontSize: 16,
    color: colors.mainBlack,
    marginBottom: 12,
    lineHeight: 22,
  },
  postFooter: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
    gap: 20,
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    color: colors.text,
  },
});
