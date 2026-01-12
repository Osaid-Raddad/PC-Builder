import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../../config/api';
import colors from '../../config/colors';

export default function ApplyTechSupportModal({ visible, onClose, onSubmit }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    areaOfSpecialization: 'Gaming PCs & Hardware',
    yearsOfExperience: '',
    reason: '',
  });

  const [errors, setErrors] = useState({});

  const specializations = [
    'Gaming PCs & Hardware',
    'Software & Troubleshooting',
    'Network & Servers',
    'Custom Builds',
    'Upgrades & Maintenance',
    'Data Recovery',
    'General Support'
  ];

  const [showSpecPicker, setShowSpecPicker] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim() || formData.fullName.length < 3) {
      newErrors.fullName = 'Name must be at least 3 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!formData.phoneNumber.trim() || !phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    const years = parseInt(formData.yearsOfExperience);
    if (!formData.yearsOfExperience || isNaN(years) || years < 0 || years > 50) {
      newErrors.yearsOfExperience = 'Please enter valid years (0-50)';
    }

    if (!formData.reason.trim() || formData.reason.length < 20) {
      newErrors.reason = 'Please provide at least 20 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please check all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = await AsyncStorage.getItem('authToken');

      if (!token) {
        Alert.alert('Authentication Required', 'You must be logged in to apply');
        return;
      }

      await apiClient.post('/Public/Public/upgrade-to-tech-support', {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        areaOfSpecialization: formData.areaOfSpecialization,
        yearsOfExperience: parseInt(formData.yearsOfExperience),
        reason: formData.reason
      });

      Alert.alert(
        'Success',
        'Application submitted successfully! We will review it shortly.',
        [
          {
            text: 'OK',
            onPress: () => {
              onSubmit && onSubmit(formData);
              onClose();
              // Reset form
              setFormData({
                fullName: '',
                email: '',
                phoneNumber: '',
                areaOfSpecialization: 'Gaming PCs & Hardware',
                yearsOfExperience: '',
                reason: '',
              });
              setErrors({});
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error submitting application:', error);

      let errorMessage = 'Failed to submit application. Please try again.';

      if (error.response) {
        errorMessage = error.response.data?.message ||
                      error.response.data?.title ||
                      errorMessage;
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection.';
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Apply to Become Tech Support</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color={colors.jet} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer}>
            {/* Full Name */}
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Feather name="user" size={18} color={colors.mainYellow} />
                <Text style={styles.label}>Full Name *</Text>
              </View>
              <TextInput
                style={[styles.input, errors.fullName && styles.inputError]}
                placeholder="Enter your full name"
                placeholderTextColor={colors.text}
                value={formData.fullName}
                onChangeText={(text) => {
                  setFormData({ ...formData, fullName: text });
                  if (errors.fullName) setErrors({ ...errors, fullName: null });
                }}
              />
              {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Feather name="mail" size={18} color={colors.mainYellow} />
                <Text style={styles.label}>Email Address *</Text>
              </View>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="your.email@example.com"
                placeholderTextColor={colors.text}
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={(text) => {
                  setFormData({ ...formData, email: text });
                  if (errors.email) setErrors({ ...errors, email: null });
                }}
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            {/* Phone */}
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Feather name="phone" size={18} color={colors.mainYellow} />
                <Text style={styles.label}>Phone Number *</Text>
              </View>
              <TextInput
                style={[styles.input, errors.phoneNumber && styles.inputError]}
                placeholder="0599999999"
                placeholderTextColor={colors.text}
                keyboardType="phone-pad"
                value={formData.phoneNumber}
                onChangeText={(text) => {
                  setFormData({ ...formData, phoneNumber: text });
                  if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: null });
                }}
              />
              {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}
            </View>

            {/* Specialization */}
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Feather name="briefcase" size={18} color={colors.mainYellow} />
                <Text style={styles.label}>Area of Specialization *</Text>
              </View>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setShowSpecPicker(!showSpecPicker)}
              >
                <Text style={styles.pickerButtonText}>{formData.areaOfSpecialization}</Text>
                <Feather name="chevron-down" size={20} color={colors.jet} />
              </TouchableOpacity>
              {showSpecPicker && (
                <View style={styles.pickerContainer}>
                  {specializations.map((spec) => (
                    <TouchableOpacity
                      key={spec}
                      style={styles.pickerOption}
                      onPress={() => {
                        setFormData({ ...formData, areaOfSpecialization: spec });
                        setShowSpecPicker(false);
                      }}
                    >
                      <Text style={styles.pickerOptionText}>{spec}</Text>
                      {formData.areaOfSpecialization === spec && (
                        <Feather name="check" size={20} color={colors.mainYellow} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Experience */}
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Feather name="briefcase" size={18} color={colors.mainYellow} />
                <Text style={styles.label}>Years of Experience *</Text>
              </View>
              <TextInput
                style={[styles.input, errors.yearsOfExperience && styles.inputError]}
                placeholder="e.g., 4"
                placeholderTextColor={colors.text}
                keyboardType="numeric"
                value={formData.yearsOfExperience}
                onChangeText={(text) => {
                  setFormData({ ...formData, yearsOfExperience: text });
                  if (errors.yearsOfExperience) setErrors({ ...errors, yearsOfExperience: null });
                }}
              />
              {errors.yearsOfExperience && <Text style={styles.errorText}>{errors.yearsOfExperience}</Text>}
            </View>

            {/* Reason */}
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Feather name="file-text" size={18} color={colors.mainYellow} />
                <Text style={styles.label}>Why do you want to become a Tech Support? *</Text>
              </View>
              <TextInput
                style={[styles.textArea, errors.reason && styles.inputError]}
                placeholder="Tell us why you're passionate about helping others..."
                placeholderTextColor={colors.text}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={formData.reason}
                onChangeText={(text) => {
                  setFormData({ ...formData, reason: text });
                  if (errors.reason) setErrors({ ...errors, reason: null });
                }}
              />
              {errors.reason && <Text style={styles.errorText}>{errors.reason}</Text>}
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
                disabled={isSubmitting}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.submitButton, isSubmitting && styles.buttonDisabled]}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.submitButtonText}>Submit Application</Text>
                )}
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
    padding: 16,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '100%',
    maxHeight: '90%',
    borderWidth: 3,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.mainBlack,
    flex: 1,
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
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.mainBlack,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: colors.platinum,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: colors.jet,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  textArea: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: colors.platinum,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: colors.jet,
    minHeight: 100,
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: colors.platinum,
    borderRadius: 8,
    padding: 12,
  },
  pickerButtonText: {
    fontSize: 14,
    color: colors.jet,
  },
  pickerContainer: {
    marginTop: 8,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: colors.platinum,
    borderRadius: 8,
    maxHeight: 200,
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
    color: colors.jet,
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: colors.platinum,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.jet,
  },
  submitButton: {
    backgroundColor: colors.mainYellow,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
