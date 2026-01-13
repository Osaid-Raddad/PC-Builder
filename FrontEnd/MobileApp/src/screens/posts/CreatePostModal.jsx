import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import colors from "../../config/colors";

const CreatePostModal = ({ visible, onClose, onSubmit }) => {
  const [content, setContent] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pickImages = async () => {
    if (selectedImages.length >= 3) {
      Alert.alert('Limit Reached', 'You can only upload up to 3 images per post');
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'We need camera roll permissions to add images');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      quality: 0.8,
    });

    if (!result.canceled) {
      const newImages = result.assets.slice(0, 3 - selectedImages.length);
      setSelectedImages([...selectedImages, ...newImages]);
    }
  };

  const removeImage = (index) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      Alert.alert('Empty Post', 'Please write something in your post');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ content, images: selectedImages });
      // Reset form
      setContent('');
      setSelectedImages([]);
      onClose();
    } catch (error) {
      console.error('Error submitting post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setContent('');
    setSelectedImages([]);
    onClose();
  };

  return (
    <Modal
      visible={visible}
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
              📋 Your post will be reviewed by our admin team before being published to ensure it follows our community guidelines.
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
            {selectedImages.length < 3 && (
              <TouchableOpacity 
                style={styles.addImagesButton}
                onPress={pickImages}
              >
                <Feather name="image" size={20} color={colors.mainYellow} />
                <Text style={styles.addImagesText}>
                  Add Photos ({selectedImages.length}/3)
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>

          {/* Footer Buttons */}
          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={handleCancel}
              disabled={isSubmitting}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.postButton,
                (!content.trim() || isSubmitting) && styles.postButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={!content.trim() || isSubmitting}
            >
              <Text style={styles.postButtonText}>
                {isSubmitting ? 'Posting...' : 'Post'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
    maxHeight: 400,
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

export default CreatePostModal;
