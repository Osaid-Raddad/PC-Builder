import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import colors from "../../config/colors";

export default function EditProfileModal({ visible, userData, onClose, onSave }) {
  const [editFormData, setEditFormData] = useState({ ...userData });
  const [avatarUri, setAvatarUri] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const handleAvatarChange = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        
        // Check file size (2MB limit)
        if (asset.fileSize && asset.fileSize > 2 * 1024 * 1024) {
          Alert.alert('Error', 'Avatar size must be less than 2MB');
          return;
        }

        setAvatarUri(asset.uri);
        setAvatarFile(asset);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSubmit = () => {
    onSave(editFormData, avatarFile);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color={colors.jet} />
            </TouchableOpacity>
          </View>

          {/* Body */}
          <ScrollView 
            style={styles.modalBody}
            showsVerticalScrollIndicator={false}
          >
            {/* Avatar Upload */}
            <View style={styles.avatarSection}>
              <View style={styles.avatarWrapper}>
                <Image
                  source={{ uri: avatarUri || editFormData.avatar }}
                  style={styles.avatarPreview}
                />
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={handleAvatarChange}
                >
                  <Feather name="upload" size={20} color="white" />
                </TouchableOpacity>
              </View>
              <Text style={styles.avatarHint}>
                Click to upload new avatar (Max 2MB)
              </Text>
            </View>

            {/* Form Fields */}
            <View style={styles.formSection}>
              {/* Full Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={editFormData.name}
                  onChangeText={(text) =>
                    setEditFormData({ ...editFormData, name: text })
                  }
                  placeholder="Enter your full name"
                />
              </View>

              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={editFormData.email}
                  onChangeText={(text) =>
                    setEditFormData({ ...editFormData, email: text })
                  }
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Phone */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone</Text>
                <TextInput
                  style={styles.input}
                  value={editFormData.phone}
                  onChangeText={(text) =>
                    setEditFormData({ ...editFormData, phone: text })
                  }
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                />
              </View>

              {/* City */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>City</Text>
                <TextInput
                  style={styles.input}
                  value={editFormData.city || ''}
                  onChangeText={(text) =>
                    setEditFormData({ ...editFormData, city: text })
                  }
                  placeholder="Enter your city"
                />
              </View>

              {/* Street */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Street</Text>
                <TextInput
                  style={styles.input}
                  value={editFormData.street || ''}
                  onChangeText={(text) =>
                    setEditFormData({ ...editFormData, street: text })
                  }
                  placeholder="Enter your street address"
                />
              </View>

              {/* Bio */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Bio</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={editFormData.bio}
                  onChangeText={(text) =>
                    setEditFormData({ ...editFormData, bio: text })
                  }
                  placeholder="Tell us about yourself"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onClose}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSubmit}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '100%',
    maxHeight: '90%',
    borderWidth: 3,
    borderColor: colors.mainYellow,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: colors.platinum,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.mainBlack,
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarPreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: colors.mainYellow,
  },
  uploadButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.mainYellow,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  avatarHint: {
    fontSize: 12,
    color: colors.jet,
    textAlign: 'center',
  },
  formSection: {
    gap: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.mainBlack,
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: colors.platinum,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.mainBlack,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 16,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.platinum,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.jet,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: colors.mainYellow,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});
