import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  TextInput,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
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
    content: "Just finished my RGB build and it looks amazing! Using the latest Corsair fans and RGB strips.",
    images: [],
  },
  {
    id: "2",
    title: "Help with Cable Management",
    author: "NewBuilder",
    likes: 89,
    comments: 45,
    time: "5h ago",
    content: "Any tips for better cable management in a compact case?",
    images: [],
  },
  {
    id: "3",
    title: "My First Build Complete!",
    author: "PCEnthusiast",
    likes: 234,
    comments: 67,
    time: "1d ago",
    content: "Finally completed my first PC build! So proud of the result.",
    images: [],
  },
];

export default function PostsScreen({ navigation }) {
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [modalVisible, setModalVisible] = useState(false);
  const [content, setContent] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);

  const pickImages = async () => {
    if (selectedImages.length >= 5) {
      Alert.alert('Limit Reached', 'You can only upload up to 5 images per post');
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'We need camera roll permissions to add images');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 5 - selectedImages.length,
    });

    if (!result.canceled) {
      setSelectedImages([...selectedImages, ...result.assets]);
    }
  };

  const removeImage = (index) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!content.trim()) {
      Alert.alert('Empty Post', 'Please write something in your post');
      return;
    }

    const newPost = {
      id: Date.now().toString(),
      title: content.split('\n')[0].substring(0, 50),
      author: 'You',
      likes: 0,
      comments: 0,
      time: 'Just now',
      content: content,
      images: selectedImages.map(img => img.uri),
    };

    setPosts([newPost, ...posts]);
    setModalVisible(false);
    setContent('');
    setSelectedImages([]);
    
    Alert.alert(
      'Post Submitted!',
      'Your post will be reviewed by our admin team before being published to ensure it follows our community guidelines.',
      [{ text: 'OK' }]
    );
  };

  const handleCancel = () => {
    setModalVisible(false);
    setContent('');
    setSelectedImages([]);
  };

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
      <Text style={styles.postTitle}>{item.content}</Text>
      
      {/* Post Images */}
      {item.images && item.images.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.imagesContainer}
        >
          {item.images.map((img, index) => (
            <Image
              key={index}
              source={{ uri: img }}
              style={styles.postImage}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
      )}
      
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
    <ScreenLayout navigation={navigation} scrollable={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Community Posts</Text>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => setModalVisible(true)}
          >
            <Feather name="plus" size={20} color={colors.mainBlack} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />

        {/* Create Post Modal */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={handleCancel}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              {/* Header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Create Post</Text>
                <TouchableOpacity onPress={handleCancel}>
                  <Feather name="x" size={24} color={colors.mainBlack} />
                </TouchableOpacity>
              </View>

              {/* Info Notice */}
              <View style={styles.noticeContainer}>
                <MaterialCommunityIcons 
                  name="information" 
                  size={20} 
                  color={colors.mainYellow} 
                />
                <Text style={styles.noticeText}>
                  Your post will be reviewed by our admin team before being published.
                </Text>
              </View>

              <ScrollView style={styles.modalContent}>
                {/* User Info */}
                <View style={styles.userInfo}>
                  <View style={styles.userAvatar}>
                    <Text style={styles.userAvatarText}>U</Text>
                  </View>
                  <View>
                    <Text style={styles.userName}>You</Text>
                    <Text style={styles.userVisibility}>Public</Text>
                  </View>
                </View>

                {/* Content Input */}
                <TextInput
                  style={styles.textInput}
                  placeholder="What's on your mind? Share your build, ask a question, or start a discussion..."
                  placeholderTextColor={colors.text}
                  value={content}
                  onChangeText={setContent}
                  multiline
                  textAlignVertical="top"
                />

                {/* Image Previews */}
                {selectedImages.length > 0 && (
                  <View style={styles.imagePreviewContainer}>
                    {selectedImages.map((image, index) => (
                      <View key={index} style={styles.imagePreview}>
                        <Image 
                          source={{ uri: image.uri }} 
                          style={styles.previewImage}
                          resizeMode="cover"
                        />
                        <TouchableOpacity
                          style={styles.removeImageButton}
                          onPress={() => removeImage(index)}
                        >
                          <Feather name="x" size={16} color="white" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}

                {/* Add Images Button */}
                <TouchableOpacity 
                  style={styles.addImagesButton}
                  onPress={pickImages}
                >
                  <Feather name="image" size={20} color={colors.mainYellow} />
                  <Text style={styles.addImagesText}>
                    Add Photos ({selectedImages.length}/5)
                  </Text>
                </TouchableOpacity>
              </ScrollView>

              {/* Footer Buttons */}
              <View style={styles.modalFooter}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={handleCancel}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.postButton,
                    !content.trim() && styles.postButtonDisabled
                  ]}
                  onPress={handleSubmit}
                  disabled={!content.trim()}
                >
                  <Text style={styles.postButtonText}>Post</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  imagesContainer: {
    marginBottom: 12,
  },
  postImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginRight: 8,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    maxHeight: '90%',
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
  noticeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    margin: 16,
    padding: 12,
    backgroundColor: colors.mainYellow + '15',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.mainYellow,
    gap: 8,
  },
  noticeText: {
    flex: 1,
    fontSize: 13,
    color: colors.mainBlack,
    fontWeight: '600',
    lineHeight: 18,
  },
  modalContent: {
    padding: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.mainYellow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.mainBlack,
  },
  userVisibility: {
    fontSize: 12,
    color: colors.text,
  },
  textInput: {
    minHeight: 120,
    fontSize: 16,
    color: colors.mainBlack,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.platinum,
    marginBottom: 16,
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  imagePreview: {
    width: '48%',
    height: 150,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImagesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.mainYellow,
    gap: 8,
  },
  addImagesText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.mainYellow,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 2,
    borderTopColor: colors.platinum,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.platinum,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  postButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: colors.mainYellow,
    alignItems: 'center',
  },
  postButtonDisabled: {
    opacity: 0.5,
  },
  postButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.mainBlack,
  },
});
