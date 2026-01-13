import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from "../../config/colors";
import { apiClient } from "../../config/api";

const CommentsModal = ({ visible, post, onClose }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (visible && post) {
      fetchComments();
    }
  }, [visible, post]);

  const fetchComments = async () => {
    try {
      const response = await apiClient.get(`/User/Posts/getComments/${post.id}`);
      setComments(response.data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim()) {
      Alert.alert('Empty Comment', 'Please write something');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'Please login to comment');
        return;
      }

      const requestBody = {
        content: commentText,
        parentCommentId: replyingTo || null
      };

      await apiClient.post(`/User/Posts/commentPost/${post.id}`, requestBody);
      
      Alert.alert('Success', replyingTo ? 'Reply posted successfully!' : 'Comment posted successfully!');
      
      // Refresh comments
      await fetchComments();
      
      // Reset form
      setCommentText('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Error posting comment:', error);
      Alert.alert('Error', 'Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      await apiClient.post(`/User/Posts/likeComment/${commentId}`);
      await fetchComments();
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

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
      day: 'numeric'
    });
  };

  const renderComment = (comment, isReply = false) => (
    <View key={comment.id} style={[styles.commentItem, isReply && styles.replyItem]}>
      <View style={styles.commentHeader}>
        <View style={styles.commentAvatar}>
          <Text style={styles.commentAvatarText}>
            {comment.userFullName?.[0]?.toUpperCase() || 'U'}
          </Text>
        </View>
        <View style={styles.commentContent}>
          <Text style={styles.commentAuthor}>{comment.userFullName || 'Unknown'}</Text>
          <Text style={styles.commentText}>{comment.content}</Text>
          <View style={styles.commentActions}>
            <Text style={styles.commentTime}>{formatDate(comment.createdAt)}</Text>
            <TouchableOpacity onPress={() => handleLikeComment(comment.id)}>
              <Text style={styles.commentActionText}>
                {comment.likesCount || 0} {comment.likesCount === 1 ? 'Like' : 'Likes'}
              </Text>
            </TouchableOpacity>
            {!isReply && (
              <TouchableOpacity onPress={() => setReplyingTo(comment.id)}>
                <Text style={styles.commentActionText}>Reply</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      
      {/* Render replies */}
      {comment.replies && comment.replies.length > 0 && (
        <View style={styles.repliesContainer}>
          {comment.replies.map(reply => renderComment(reply, true))}
        </View>
      )}
    </View>
  );

  if (!post) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{post.userFullName}'s Post</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color={colors.mainBlack} />
            </TouchableOpacity>
          </View>

          {/* Post Preview */}
          <View style={styles.postPreview}>
            <View style={styles.postHeader}>
              <View style={styles.postAvatar}>
                <Text style={styles.postAvatarText}>
                  {post.userFullName?.[0]?.toUpperCase() || 'U'}
                </Text>
              </View>
              <View>
                <Text style={styles.postAuthor}>{post.userFullName}</Text>
                <Text style={styles.postTime}>{formatDate(post.createdAt)}</Text>
              </View>
            </View>
            <Text style={styles.postContent}>{post.description}</Text>
            <View style={styles.postStats}>
              <View style={styles.statItem}>
                <Feather name="heart" size={14} color={colors.mainYellow} />
                <Text style={styles.statText}>{post.likesCount || 0}</Text>
              </View>
              <View style={styles.statItem}>
                <Feather name="message-circle" size={14} color={colors.text} />
                <Text style={styles.statText}>{comments.length} comments</Text>
              </View>
            </View>
          </View>

          {/* Comments List */}
          <ScrollView style={styles.commentsList}>
            {comments.length === 0 ? (
              <View style={styles.emptyState}>
                <Feather name="message-circle" size={48} color={colors.platinum} />
                <Text style={styles.emptyText}>No comments yet</Text>
                <Text style={styles.emptySubtext}>Be the first to comment!</Text>
              </View>
            ) : (
              comments.map(comment => renderComment(comment))
            )}
          </ScrollView>

          {/* Comment Input */}
          <View style={styles.commentInputContainer}>
            {replyingTo && (
              <View style={styles.replyingToBar}>
                <Text style={styles.replyingToText}>Replying to comment...</Text>
                <TouchableOpacity onPress={() => setReplyingTo(null)}>
                  <Feather name="x" size={16} color={colors.text} />
                </TouchableOpacity>
              </View>
            )}
            <View style={styles.inputRow}>
              <TextInput
                style={styles.commentInput}
                placeholder="Write a comment..."
                placeholderTextColor={colors.text}
                value={commentText}
                onChangeText={setCommentText}
                multiline
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  (!commentText.trim() || isSubmitting) && styles.sendButtonDisabled
                ]}
                onPress={handleSubmitComment}
                disabled={!commentText.trim() || isSubmitting}
              >
                <Feather name="send" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '90%',
    borderWidth: 3,
    borderColor: colors.mainYellow,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 2,
    borderBottomColor: colors.platinum,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.mainBlack,
  },
  postPreview: {
    padding: 16,
    borderBottomWidth: 2,
    borderBottomColor: colors.platinum,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.mainYellow,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  postAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  postAuthor: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.mainBlack,
  },
  postTime: {
    fontSize: 12,
    color: colors.text,
  },
  postContent: {
    fontSize: 15,
    color: colors.mainBlack,
    marginBottom: 12,
  },
  postStats: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.platinum,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  commentsList: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.mainBlack,
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.text,
    marginTop: 4,
  },
  commentItem: {
    marginBottom: 16,
  },
  replyItem: {
    marginLeft: 40,
  },
  commentHeader: {
    flexDirection: 'row',
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.mainYellow,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  commentAvatarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  commentContent: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.mainBlack,
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    color: colors.mainBlack,
    marginBottom: 6,
  },
  commentActions: {
    flexDirection: 'row',
    gap: 16,
  },
  commentTime: {
    fontSize: 12,
    color: colors.text,
  },
  commentActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  repliesContainer: {
    marginTop: 12,
  },
  commentInputContainer: {
    borderTopWidth: 2,
    borderTopColor: colors.platinum,
    backgroundColor: 'white',
  },
  replyingToBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.mainYellow + '15',
  },
  replyingToText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    gap: 12,
  },
  commentInput: {
    flex: 1,
    maxHeight: 100,
    minHeight: 40,
    fontSize: 15,
    color: colors.mainBlack,
    padding: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.platinum,
    backgroundColor: colors.mainBeige,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.mainYellow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

export default CommentsModal;
