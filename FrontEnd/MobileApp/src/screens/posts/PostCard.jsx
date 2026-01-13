import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import colors from "../../config/colors";

const PostCard = ({ post, onLike, onComment }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <View style={styles.postCard}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {post.userFullName?.[0]?.toUpperCase() || 'U'}
          </Text>
        </View>
        <View style={styles.postMeta}>
          <Text style={styles.authorName}>{post.userFullName || 'Unknown User'}</Text>
          <Text style={styles.postTime}>{formatDate(post.createdAt)}</Text>
        </View>
      </View>

      {/* Post Content */}
      <Text style={styles.postContent}>{post.description}</Text>

      {/* Post Images */}
      {post.imageUrls && post.imageUrls.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.imagesContainer}
        >
          {post.imageUrls.map((imageUrl, index) => (
            <Image
              key={index}
              source={{ uri: imageUrl }}
              style={styles.postImage}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
      )}

      {/* Post Stats */}
      <View style={styles.postStats}>
        <View style={styles.statItem}>
          <Feather 
            name="heart" 
            size={14} 
            color={colors.mainYellow} 
            style={{ fill: colors.mainYellow }}
          />
          <Text style={styles.statText}>
            {post.likesCount || 0} {post.likesCount === 1 ? 'Like' : 'Likes'}
          </Text>
        </View>
        <TouchableOpacity onPress={() => onComment(post)}>
          <Text style={styles.statText}>
            {post.commentsCount || 0} {post.commentsCount === 1 ? 'Comment' : 'Comments'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Post Actions */}
      <View style={styles.postActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onLike(post.id)}
        >
          <Feather 
            name="heart" 
            size={20} 
            color={post.liked || post.isLiked ? colors.mainYellow : colors.text}
            style={post.liked || post.isLiked ? { fill: colors.mainYellow } : {}}
          />
          <Text style={[
            styles.actionText,
            (post.liked || post.isLiked) && { color: colors.mainYellow }
          ]}>
            Like
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onComment(post)}
        >
          <Feather name="message-circle" size={20} color={colors.text} />
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Feather name="share-2" size={20} color={colors.text} />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  postCard: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: colors.platinum,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.mainYellow,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
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
    fontSize: 13,
    color: colors.text,
    marginTop: 2,
  },
  postContent: {
    fontSize: 15,
    color: colors.mainBlack,
    paddingHorizontal: 16,
    paddingBottom: 12,
    lineHeight: 22,
  },
  imagesContainer: {
    paddingLeft: 16,
    marginBottom: 12,
  },
  postImage: {
    width: 250,
    height: 200,
    borderRadius: 8,
    marginRight: 8,
  },
  postStats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.platinum,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  postActions: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    gap: 6,
  },
  actionText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
  },
});

export default PostCard;
