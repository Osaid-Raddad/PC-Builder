import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenLayout from '../../components/ScreenLayout';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import colors from '../../config/colors';
import { apiClient } from '../../config/api';

export default function PostManagementScreen({ navigation }) {
  const [approvedPosts, setApprovedPosts] = useState([]);
  const [pendingPosts, setPendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('pending'); // pending, approved
  const [sidebarVisible, setSidebarVisible] = useState(false);

  useEffect(() => {
    fetchAllPosts();
  }, []);

  const fetchAllPosts = async () => {
    setLoading(true);
    await Promise.all([fetchApprovedPosts(), fetchPendingPosts()]);
    setLoading(false);
    setRefreshing(false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAllPosts();
  };

  const fetchApprovedPosts = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'Authentication required');
        return;
      }

      const response = await apiClient.get('/Admins/Posts/GetApprovedPosts');
      setApprovedPosts(response.data);
    } catch (error) {
      console.error('Error fetching approved posts:', error);
      Alert.alert('Error', 'Failed to fetch approved posts');
    }
  };

  const fetchPendingPosts = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        return;
      }

      const response = await apiClient.get('/Admins/Posts/GetPendingPosts');
      setPendingPosts(response.data);
    } catch (error) {
      console.error('Error fetching pending posts:', error);
      Alert.alert('Error', 'Failed to fetch pending posts');
    }
  };

  const handleApprove = async (postId) => {
    Alert.alert(
      'Approve Post?',
      'This post will be published to the community.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          style: 'default',
          onPress: async () => {
            try {
              await apiClient.put(`/Admins/Posts/ApprovePost/${postId}`);
              Alert.alert('Success', 'Post approved successfully! 🎉');
              fetchAllPosts();
            } catch (error) {
              console.error('Error approving post:', error);
              Alert.alert('Error', 'Failed to approve post');
            }
          }
        }
      ]
    );
  };

  const handleReject = async (postId) => {
    Alert.alert(
      'Reject Post?',
      'This post will be rejected and not published.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiClient.put(`/Admins/Posts/RejectPost/${postId}`);
              Alert.alert('Success', 'Post rejected');
              fetchAllPosts();
            } catch (error) {
              console.error('Error rejecting post:', error);
              Alert.alert('Error', 'Failed to reject post');
            }
          }
        }
      ]
    );
  };

  const handleDelete = async (postId) => {
    Alert.alert(
      'Delete Post?',
      'This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiClient.delete(`/Admins/Posts/DeletePost/${postId}`);
              Alert.alert('Success', 'Post deleted successfully');
              fetchAllPosts();
            } catch (error) {
              console.error('Error deleting post:', error);
              Alert.alert('Error', 'Failed to delete post');
            }
          }
        }
      ]
    );
  };

  const PostCard = ({ post, isPending }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.authorInfo}>
          <View style={styles.authorAvatar}>
            <Text style={styles.authorAvatarText}>
              {post.userName?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <View>
            <Text style={styles.authorName}>{post.userName || 'Unknown'}</Text>
            <Text style={styles.postDate}>
              {new Date(post.createdDate).toLocaleDateString()}
            </Text>
          </View>
        </View>
        {isPending && (
          <View style={styles.pendingBadge}>
            <Text style={styles.pendingText}>PENDING</Text>
          </View>
        )}
      </View>

      <Text style={styles.postTitle}>{post.title}</Text>
      <Text style={styles.postContent} numberOfLines={3}>
        {post.content}
      </Text>

      {post.images && post.images.length > 0 && (
        <ScrollView horizontal style={styles.imagesContainer} showsHorizontalScrollIndicator={false}>
          {post.images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image.imageUrl }}
              style={styles.postImage}
            />
          ))}
        </ScrollView>
      )}

      <View style={styles.postStats}>
        <View style={styles.statItem}>
          <Feather name="heart" size={16} color={colors.jet} />
          <Text style={styles.statText}>{post.likesCount || 0}</Text>
        </View>
        <View style={styles.statItem}>
          <Feather name="message-circle" size={16} color={colors.jet} />
          <Text style={styles.statText}>{post.commentsCount || 0}</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        {isPending ? (
          <>
            <TouchableOpacity
              style={[styles.actionButton, styles.approveButton]}
              onPress={() => handleApprove(post.id)}
            >
              <Feather name="check" size={20} color="white" />
              <Text style={styles.actionButtonText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
              onPress={() => handleReject(post.id)}
            >
              <Feather name="x" size={20} color="white" />
              <Text style={styles.actionButtonText}>Reject</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDelete(post.id)}
          >
            <Feather name="trash-2" size={20} color="white" />
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <ScreenLayout navigation={navigation}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.mainYellow} />
          <Text style={styles.loadingText}>Loading Posts...</Text>
        </View>
      </ScreenLayout>
    );
  }

  const currentPosts = activeTab === 'pending' ? pendingPosts : approvedPosts;

  return (
    <ScreenLayout navigation={navigation}>
      <AdminSidebar
        navigation={navigation}
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        currentScreen="PostManagement"
      />
      <AdminHeader onMenuPress={() => setSidebarVisible(true)} />
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Post Management</Text>
          <Text style={styles.subtitle}>Manage community posts</Text>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'pending' && styles.tabActive
            ]}
            onPress={() => setActiveTab('pending')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'pending' && styles.tabTextActive
              ]}
            >
              Pending ({pendingPosts.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'approved' && styles.tabActive
            ]}
            onPress={() => setActiveTab('approved')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'approved' && styles.tabTextActive
              ]}
            >
              Approved ({approvedPosts.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Posts List */}
        {currentPosts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Feather name="file-text" size={64} color={colors.platinum} />
            <Text style={styles.emptyText}>
              No {activeTab} posts found
            </Text>
          </View>
        ) : (
          currentPosts.map((post) => (
            <PostCard key={post.id} post={post} isPending={activeTab === 'pending'} />
          ))
        )}
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.mainBeige,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.jet,
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.mainBlack,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.jet,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: colors.platinum,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.mainYellow,
    borderColor: colors.mainYellow,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.jet,
  },
  tabTextActive: {
    color: colors.mainBlack,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.jet,
  },
  postCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.mainYellow,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.mainYellow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorAvatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.mainBlack,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.mainBlack,
  },
  postDate: {
    fontSize: 12,
    color: colors.jet,
  },
  pendingBadge: {
    backgroundColor: colors.mainYellow + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  pendingText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.mainYellow,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.mainBlack,
    marginBottom: 8,
  },
  postContent: {
    fontSize: 14,
    color: colors.jet,
    lineHeight: 20,
    marginBottom: 12,
  },
  imagesContainer: {
    marginBottom: 12,
  },
  postImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 8,
  },
  postStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.platinum,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: colors.jet,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  approveButton: {
    backgroundColor: '#10b981',
  },
  rejectButton: {
    backgroundColor: '#ef4444',
  },
  deleteButton: {
    backgroundColor: colors.mainBlack,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
