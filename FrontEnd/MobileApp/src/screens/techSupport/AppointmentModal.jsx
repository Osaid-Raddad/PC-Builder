import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../../config/api';
import colors from '../../config/colors';

export default function AppointmentModal({ visible, supporter, onClose }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate next 30 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }

    return dates;
  };

  const dates = generateDates();

  const getDayName = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);

    const dayName = getDayName(date);
    const slots = supporter.availability[dayName] || [];
    setAvailableSlots(slots);

    if (slots.length === 0) {
      Alert.alert(
        'Not Available',
        `${supporter.name} is not available on ${dayName}s. Please choose another date.`
      );
    }
  };

  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');

    if (hours === '12') {
      hours = modifier === 'AM' ? '00' : '12';
    } else {
      hours = modifier === 'PM' ? String(parseInt(hours, 10) + 12) : hours.padStart(2, '0');
    }

    return `${hours}:${minutes}:00`;
  };

  const handleSubmit = async () => {
    if (!selectedDate) {
      Alert.alert('Validation Error', 'Please select a date');
      return;
    }

    if (!selectedTimeSlot) {
      Alert.alert('Validation Error', 'Please select a time slot');
      return;
    }

    setIsSubmitting(true);

    try {
      // Parse the time slot (e.g., "9:00 AM - 5:00 PM")
      const [startTime, endTime] = selectedTimeSlot.split(' - ');

      const startTime24 = convertTo24Hour(startTime);
      const endTime24 = convertTo24Hour(endTime);

      // Format date as YYYY-MM-DD
      const dateStr = selectedDate.toISOString().split('T')[0];

      // Create ISO datetime strings
      const startDateTime = `${dateStr}T${startTime24}`;
      const endDateTime = `${dateStr}T${endTime24}`;

      // Prepare request payload (using exact backend field names with PascalCase)
      const requestPayload = {
        TechSupportId: supporter.id,
        StartDateTime: startDateTime,
        EndDateTime: endDateTime
      };

      console.log('Sending appointment request:', requestPayload);

      // Make API call (apiClient interceptor automatically adds auth token)
      const response = await apiClient.post('/TechSupport/Appointment/create', requestPayload);

      console.log('Appointment created successfully:', response.data);

      Alert.alert(
        'Success',
        'Appointment request sent successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              onClose();
              setSelectedDate(null);
              setSelectedTimeSlot(null);
              setAvailableSlots([]);
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error creating appointment:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);

      let errorMessage = 'Failed to send appointment request. Please try again.';

      if (error.response?.status === 401) {
        errorMessage = 'Please log in to request an appointment';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Handle validation errors
        const errors = error.response.data.errors;
        const errorDetails = Object.keys(errors).map(key => `${key}: ${errors[key].join(', ')}`).join('\n');
        errorMessage = `Validation Error:\n${errorDetails}`;
      } else if (error.response?.data) {
        errorMessage = JSON.stringify(error.response.data);
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection.';
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!supporter) return null;

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
            <View style={styles.headerContent}>
              <View style={styles.headerTop}>
                <Text style={styles.headerTitle}>Request Appointment</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Feather name="x" size={24} color={colors.jet} />
                </TouchableOpacity>
              </View>
              <View style={styles.supporterInfo}>
                <Image
                  source={{ uri: supporter.avatar }}
                  style={styles.supporterAvatar}
                />
                <View>
                  <Text style={styles.supporterName}>{supporter.name}</Text>
                  <Text style={styles.supporterSpec}>{supporter.specialization}</Text>
                </View>
              </View>
            </View>
          </View>

          <ScrollView style={styles.formContainer}>
            {/* Date Selection */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Feather name="calendar" size={18} color={colors.mainYellow} />
                <Text style={styles.sectionTitle}>Select Date *</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.dateScroll}
              >
                {dates.map((date, index) => {
                  const isSelected = selectedDate?.toDateString() === date.toDateString();
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[styles.dateCard, isSelected && styles.dateCardSelected]}
                      onPress={() => handleDateSelect(date)}
                    >
                      <Text style={[styles.dateDay, isSelected && styles.dateTextSelected]}>
                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </Text>
                      <Text style={[styles.dateNumber, isSelected && styles.dateTextSelected]}>
                        {date.getDate()}
                      </Text>
                      <Text style={[styles.dateMonth, isSelected && styles.dateTextSelected]}>
                        {date.toLocaleDateString('en-US', { month: 'short' })}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              {selectedDate && (
                <Text style={styles.selectedDateText}>
                  Selected: {selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Text>
              )}
            </View>

            {/* Time Slot Selection */}
            {selectedDate && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Feather name="clock" size={18} color={colors.mainYellow} />
                  <Text style={styles.sectionTitle}>Select Time Slot *</Text>
                </View>
                {availableSlots.length > 0 ? (
                  <View style={styles.slotsGrid}>
                    {availableSlots.map((slot, index) => {
                      const isSelected = selectedTimeSlot === slot;
                      return (
                        <TouchableOpacity
                          key={index}
                          style={[styles.slotButton, isSelected && styles.slotButtonSelected]}
                          onPress={() => setSelectedTimeSlot(slot)}
                        >
                          <Text style={[styles.slotText, isSelected && styles.slotTextSelected]}>
                            {slot}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ) : (
                  <View style={styles.noSlotsContainer}>
                    <Feather name="alert-circle" size={24} color={colors.mainYellow} />
                    <Text style={styles.noSlotsText}>
                      No available time slots for this date. Please select another date.
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Info Box */}
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>📝 Note:</Text>
              <Text style={styles.infoText}>
                Your appointment request will be sent to {supporter.name}. You will receive a notification once they accept or decline your request.
              </Text>
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
                  <Text style={styles.submitButtonText}>Send Request</Text>
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
    borderBottomWidth: 2,
    borderBottomColor: colors.platinum,
    padding: 20,
  },
  headerContent: {
    gap: 12,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.mainBlack,
  },
  closeButton: {
    padding: 4,
  },
  supporterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  supporterAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  supporterName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.mainBlack,
  },
  supporterSpec: {
    fontSize: 14,
    color: colors.jet,
  },
  formContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.mainBlack,
  },
  dateScroll: {
    marginBottom: 12,
  },
  dateCard: {
    width: 80,
    padding: 12,
    marginRight: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.platinum,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  dateCardSelected: {
    backgroundColor: colors.mainYellow,
    borderColor: colors.mainYellow,
  },
  dateDay: {
    fontSize: 12,
    color: colors.jet,
    fontWeight: '600',
  },
  dateNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.mainBlack,
    marginVertical: 4,
  },
  dateMonth: {
    fontSize: 12,
    color: colors.jet,
  },
  dateTextSelected: {
    color: 'white',
  },
  selectedDateText: {
    fontSize: 14,
    color: colors.jet,
    marginTop: 8,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  slotButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.mainYellow,
    backgroundColor: 'white',
    minWidth: '45%',
    alignItems: 'center',
  },
  slotButtonSelected: {
    backgroundColor: colors.mainYellow,
  },
  slotText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.jet,
  },
  slotTextSelected: {
    color: 'white',
  },
  noSlotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: colors.mainBeige,
    borderRadius: 8,
  },
  noSlotsText: {
    flex: 1,
    fontSize: 14,
    color: colors.jet,
  },
  infoBox: {
    backgroundColor: colors.mainBeige,
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.mainBlack,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.jet,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
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
