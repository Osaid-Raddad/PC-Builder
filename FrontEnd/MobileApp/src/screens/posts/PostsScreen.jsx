import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenLayout from "../../components/ScreenLayout";
import colors from "../../config/colors";
import { apiClient } from "../../config/api";
import PostCard from "./PostCard";
import CreatePostModal from "./CreatePostModal";
import CommentsModal from "./CommentsModal";

export default function PostsScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [likedPosts, setLikedPosts] = useState(() => {
    // Initialize from AsyncStorage synchronously isn't possible, so we load it in useEffect
    return [];
  });

  // Load liked posts from AsyncStorage on mount
  useEffect(() => {
    const loadLikedPosts = async () => {
      try {
        const saved = await AsyncStorage.getItem('likedPosts');
        if (saved) {
          setLikedPosts(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Error loading liked posts:', error);
      }
    };
    loadLikedPosts();
  }, []);

  // Save liked posts to AsyncStorage whenever it changes
  useEffect(() => {
    if (likedPosts.length >= 0) {
      AsyncStorage.setItem('likedPosts', JSON.stringify(likedPosts));
    }
  }, [likedPosts]);

  // Fetch posts on mount
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = useCallback(async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Authentication Required', 'Please login to view posts');
        setLoading(false);
        return;
      }

      const response = await apiClient.get('/User/Posts/GetApprovedPosts');
      
      if (response.data && response.data.length > 0) {
        const postsWithLikedStatus = response.data.map(post => ({
          ...post,
          liked: likedPosts.includes(post.id) || post.isLiked || post.liked,
          isLiked: likedPosts.includes(post.id) || post.isLiked || post.liked
        }));
        setPosts(postsWithLikedStatus);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      if (error.response?.status === 401) {
        Alert.alert('Session Expired', 'Please login again.');
      } else {
        Alert.alert('Error', 'Failed to load posts. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [loading, likedPosts]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  }, [fetchPosts]);

  const handleLike = async (postId) => {
    try {
      await apiClient.post(`/User/Posts/likePost/${postId}`);

      // Update the post's like status and count in local state
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          const isCurrentlyLiked = post.liked || post.isLiked;
          const newLikedState = !isCurrentlyLiked;
          
          // Update likedPosts state (AsyncStorage update is handled by useEffect)
          if (newLikedState) {
            setLikedPosts(curr => [...curr, postId]);
          } else {
            setLikedPosts(curr => curr.filter(id => id !== postId));
          }
          
          return {
            ...post,
            liked: newLikedState,
            isLiked: newLikedState,
            likesCount: isCurrentlyLiked ? post.likesCount - 1 : post.likesCount + 1
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('Error liking post:', error);
      Alert.alert('Error', 'Failed to like post');
    }
  };

  const handleComment = (post) => {
    setSelectedPost(post);
    setShowCommentsModal(true);
  };

  const handleCreatePost = async ({ content, images }) => {
    try {
      const formData = new FormData();
      formData.append('Description', content);
      
      // Append images
      images.forEach((image, index) => {
        const fileType = image.uri.split('.').pop();
        formData.append('Images', {
          uri: image.uri,
          type: `image/${fileType}`,
          name: `photo_${index}.${fileType}`,
        });
      });

      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'Please login to create a post');
        return;
      }

      await apiClient.post('/User/Posts/createPost', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert(
        'Success!',
        'Your post has been submitted for review!',
        [
          {
            text: 'OK',
            onPress: () => {
              setShowCreateModal(false);
              fetchPosts();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error creating post:', error);
      if (error.response?.data?.message) {
        Alert.alert('Error', error.response.data.message);
      } else if (error.response?.status === 401) {
        Alert.alert('Error', 'Please login to create a post');
      } else {
        Alert.alert('Error', 'Failed to create post. Please try again.');
      }
    }
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.subtitle}>
        Share your builds, ask questions, and connect with PC builders
      </Text>
      
      {/* Create Post Button */}
      <TouchableOpacity 
        style={styles.createPostButton}
        onPress={() => setShowCreateModal(true)}
      >
        <View style={styles.createPostContent}>
          <View style={styles.createPostAvatar}>
            <Feather name="plus" size={24} color="white" />
          </View>
          <View style={styles.createPostPlaceholder}>
            <Text style={styles.createPostPlaceholderText}>
              What's on your mind? Share your PC build...
            </Text>
          </View>
        </View>
        <View style={styles.createPostFooter}>
          <View style={styles.createPostAction}>
            <Feather name="image" size={20} color={colors.mainYellow} />
            <Text style={styles.createPostActionText}>Photo/Video</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderPost = ({ item }) => (
    <PostCard
      post={item}
      onLike={handleLike}
      onComment={handleComment}
    />
  );

  const renderEmpty = () => {
    if (loading) return null;
    
    return (
      <View style={styles.emptyState}>
        <Feather name="image" size={64} color={colors.platinum} />
        <Text style={styles.emptyTitle}>No posts yet</Text>
        <Text style={styles.emptyText}>
          Be the first to share something with the community!
        </Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (!loading) return null;
    
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="large" color={colors.mainYellow} />
        <Text style={styles.loadingText}>Loading posts...</Text>
      </View>
    );
  };

  return (
    <ScreenLayout navigation={navigation} scrollable={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Community Posts</Text>
        </View>

        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.mainYellow]}
              tintColor={colors.mainYellow}
            />
          }
        />

        {/* Modals */}
        <CreatePostModal
          visible={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreatePost}
        />

        <CommentsModal
          visible={showCommentsModal}
          post={selectedPost}
          onClose={() => {
            setShowCommentsModal(false);
            setSelectedPost(null);
          }}
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
  },
  headerContainer: {
    paddingBottom: 16,
  },
  subtitle: {
    fontSize: 15,
    color: colors.text,
    marginBottom: 16,
    lineHeight: 22,
  },
  createPostButton: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: colors.platinum,
    marginBottom: 16,
  },
  createPostContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  createPostAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.mainYellow,
    justifyContent: "center",
    alignItems: "center",
  },
  createPostPlaceholder: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: colors.mainBeige,
  },
  createPostPlaceholderText: {
    fontSize: 15,
    color: colors.text,
  },
  createPostFooter: {
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: colors.platinum,
  },
  createPostAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  createPostActionText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.mainYellow,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.mainBlack,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: colors.text,
    textAlign: "center",
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
  },
});
