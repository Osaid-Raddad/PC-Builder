import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../../config/api';
import colors from '../../config/colors';

export default function SubmitShopModal({ visible, onClose }) {
  const [formData, setFormData] = useState({
    ShopName: '',
    OwnerName: '',
    Email: '',
    Phone: '',
    City: '',
    ExactLocation: '',
    WebURL: '',
    Description: '',
    Specialties: '',
  });
  const [logoImage, setLogoImage] = useState(null);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cities = [
    'Ramallah',
    'Jerusalem',
    'Nablus',
    'Hebron',
    'Bethlehem',
    'Jenin',
    'Tulkarem',
    'Qalqilya',
    'Jericho',
  ];

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Please allow access to your photo library to upload a shop logo');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setLogoImage(result.assets[0]);
    }
  };

  const validateForm = () => {
    if (!formData.ShopName.trim()) {
      Alert.alert('Validation Error', 'Shop name is required');
      return false;
    }
    if (!formData.OwnerName.trim()) {
      Alert.alert('Validation Error', 'Owner name is required');
      return false;
    }
    if (!logoImage) {
      Alert.alert('Validation Error', 'Please upload a shop logo');
      return false;
    }
    if (!formData.Email.trim()) {
      Alert.alert('Validation Error', 'Email is required');
      return false;
    }
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(formData.Email)) {
      Alert.alert('Validation Error', 'Invalid email address');
      return false;
    }
    if (!formData.Phone.trim()) {
      Alert.alert('Validation Error', 'Phone number is required');
      return false;
    }
    if (!formData.City) {
      Alert.alert('Validation Error', 'City is required');
      return false;
    }
    if (!formData.ExactLocation.trim()) {
      Alert.alert('Validation Error', 'Exact location is required');
      return false;
    }
    if (!formData.WebURL.trim()) {
      Alert.alert('Validation Error', 'Website URL is required');
      return false;
    }
    if (!formData.WebURL.match(/^https?:\/\/.+/)) {
      Alert.alert('Validation Error', 'Please enter a valid URL starting with http:// or https://');
      return false;
    }
    if (!formData.Description.trim()) {
      Alert.alert('Validation Error', 'Shop description is required');
      return false;
    }
    if (!formData.Specialties.trim()) {
      Alert.alert('Validation Error', 'Specialties are required');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const token = await AsyncStorage.getItem('authToken');
      
      if (!token) {
        Alert.alert('Authentication Required', 'Please log in to submit a shop');
        setIsSubmitting(false);
        return;
      }

      // Create FormData
      const form = new FormData();
      form.append('ShopName', formData.ShopName);
      form.append('OwnerName', formData.OwnerName);
      form.append('Email', formData.Email);
      form.append('Phone', formData.Phone);
      form.append('City', formData.City);
      form.append('ExactLocation', formData.ExactLocation);
      form.append('WebURL', formData.WebURL);
      form.append('Description', formData.Description);
      form.append('Specialties', formData.Specialties);
      
      // Append logo image
      const uriParts = logoImage.uri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      
      form.append('ShopLogo', {
        uri: logoImage.uri,
        name: `shop_logo.${fileType}`,
        type: `image/${fileType}`,
      });

      console.log('Sending shop submission request...');

      // Make API call
      const response = await apiClient.post('/Shops/Shop/Request', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Shop submitted successfully:', response.data);

      Alert.alert(
        'Success',
        'Your shop has been submitted for review! We will contact you soon.',
        [
          {
            text: 'OK',
            onPress: () => {
              resetForm();
              onClose();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error submitting shop:', error);
      console.error('Error response:', error.response?.data);

      let errorMessage = 'Failed to submit shop. Please try again.';

      if (error.response?.status === 401) {
        errorMessage = 'Please log in to submit a shop';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data) {
        errorMessage = typeof error.response.data === 'string' 
          ? error.response.data 
          : 'Failed to submit shop. Please try again.';
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection.';
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      ShopName: '',
      OwnerName: '',
      Email: '',
      Phone: '',
      City: '',
      ExactLocation: '',
      WebURL: '',
      Description: '',
      Specialties: '',
    });
    setLogoImage(null);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Submit Your Shop</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color={colors.mainBlack} />
            </TouchableOpacity>
          </View>

          {/* Form */}
          <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
            {/* Shop Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Shop Name <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                value={formData.ShopName}
                onChangeText={(text) => setFormData({ ...formData, ShopName: text })}
                placeholder="Enter shop name"
                placeholderTextColor={colors.jet}
              />
            </View>

            {/* Owner Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Owner Name <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                value={formData.OwnerName}
                onChangeText={(text) => setFormData({ ...formData, OwnerName: text })}
                placeholder="Your full name"
                placeholderTextColor={colors.jet}
              />
            </View>

            {/* Shop Logo */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Shop Logo <Text style={styles.required}>*</Text></Text>
              <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
                {logoImage ? (
                  <View style={styles.imagePreviewContainer}>
                    <Image source={{ uri: logoImage.uri }} style={styles.imagePreview} />
                    <Text style={styles.imagePickedText}>✓ Logo uploaded</Text>
                  </View>
                ) : (
                  <>
                    <Feather name="upload" size={32} color={colors.mainYellow} />
                    <Text style={styles.imagePickerText}>Click to upload logo</Text>
                    <Text style={styles.imagePickerSubtext}>JPG, PNG (Recommended: Square)</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Email & Phone */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                value={formData.Email}
                onChangeText={(text) => setFormData({ ...formData, Email: text })}
                placeholder="shop@example.com"
                placeholderTextColor={colors.jet}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                value={formData.Phone}
                onChangeText={(text) => setFormData({ ...formData, Phone: text })}
                placeholder="+970 XX XXX XXXX"
                placeholderTextColor={colors.jet}
                keyboardType="phone-pad"
              />
            </View>

            {/* City */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>City <Text style={styles.required}>*</Text></Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setShowCityPicker(!showCityPicker)}
              >
                <Text style={[styles.pickerButtonText, !formData.City && styles.placeholderText]}>
                  {formData.City || 'Select a city'}
                </Text>
                <Feather name="chevron-down" size={20} color={colors.jet} />
              </TouchableOpacity>
              {showCityPicker && (
                <View style={styles.pickerContainer}>
                  {cities.map((city) => (
                    <TouchableOpacity
                      key={city}
                      style={styles.pickerOption}
                      onPress={() => {
                        setFormData({ ...formData, City: city });
                        setShowCityPicker(false);
                      }}
                    >
                      <Text style={styles.pickerOptionText}>{city}</Text>
                      {formData.City === city && (
                        <Feather name="check" size={20} color={colors.mainYellow} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Exact Location */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Exact Location <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                value={formData.ExactLocation}
                onChangeText={(text) => setFormData({ ...formData, ExactLocation: text })}
                placeholder="Street address, area"
                placeholderTextColor={colors.jet}
              />
            </View>

            {/* Website URL */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Website or Facebook Page URL <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                value={formData.WebURL}
                onChangeText={(text) => setFormData({ ...formData, WebURL: text })}
                placeholder="https://..."
                placeholderTextColor={colors.jet}
                keyboardType="url"
                autoCapitalize="none"
              />
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Shop Description <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.Description}
                onChangeText={(text) => setFormData({ ...formData, Description: text })}
                placeholder="Describe your shop and services..."
                placeholderTextColor={colors.jet}
                multiline
                numberOfLines={4}
              />
            </View>

            {/* Specialties */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Specialties <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                value={formData.Specialties}
                onChangeText={(text) => setFormData({ ...formData, Specialties: text })}
                placeholder="e.g., Gaming PCs, Laptops, Repairs"
                placeholderTextColor={colors.jet}
              />
              <Text style={styles.helperText}>Separate multiple specialties with commas</Text>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Feather name="send" size={18} color="white" />
                  <Text style={styles.submitButtonText}>Submit Shop</Text>
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '90%',
    maxHeight: '90%',
    borderWidth: 2,
    borderColor: colors.mainYellow,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: colors.platinum,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.mainBlack,
  },
  closeButton: {
    padding: 4,
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.mainBlack,
    marginBottom: 8,
  },
  required: {
    color: 'red',
  },
  input: {
    borderWidth: 2,
    borderColor: colors.platinum,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: colors.mainBlack,
    backgroundColor: 'white',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imagePickerButton: {
    borderWidth: 2,
    borderColor: colors.platinum,
    borderRadius: 8,
    borderStyle: 'dashed',
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.mainYellow + '08',
  },
  imagePreviewContainer: {
    alignItems: 'center',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  imagePickedText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.mainYellow,
  },
  imagePickerText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.mainBlack,
    marginTop: 10,
  },
  imagePickerSubtext: {
    fontSize: 12,
    color: colors.jet,
    marginTop: 5,
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.platinum,
    borderRadius: 8,
    padding: 12,
    backgroundColor: 'white',
  },
  pickerButtonText: {
    fontSize: 14,
    color: colors.mainBlack,
  },
  placeholderText: {
    color: colors.jet,
  },
  pickerContainer: {
    marginTop: 8,
    borderWidth: 2,
    borderColor: colors.platinum,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  pickerOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.platinum,
  },
  pickerOptionText: {
    fontSize: 14,
    color: colors.mainBlack,
  },
  helperText: {
    fontSize: 12,
    color: colors.jet,
    marginTop: 5,
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: colors.mainYellow,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
  },
});
