import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScreenLayout from "../../components/ScreenLayout";
import ApplyTechSupportModal from "./ApplyTechSupportModal";
import AppointmentModal from "./AppointmentModal";
import { apiClient } from "../../config/api";
import colors from "../../config/colors";

export default function TechSupportScreen({ navigation }) {
  const [techSupporters, setTechSupporters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedSupport, setSelectedSupport] = useState(null);

  // Utility functions
  const formatTime = (time24) => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getDayNameFromNumber = (dayNumber) => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[dayNumber];
  };

  const getDayName = (dayIndex) => {
    return ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'][dayIndex];
  };

  const transformTechSupportData = (supporter) => {
    // Initialize availability object with all days empty
    const availability = {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: []
    };
    
    // Populate availability from backend data
    if (supporter.availabilities && supporter.availabilities.length > 0) {
      supporter.availabilities.forEach((slot) => {
        const dayName = getDayNameFromNumber(slot.day);
        const timeSlot = `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`;
        
        if (availability[dayName]) {
          availability[dayName].push(timeSlot);
        }
      });
    }

    return {
      id: supporter.id,
      name: supporter.fullName,
      email: supporter.email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(supporter.fullName)}&background=FFC436&color=fff&size=200`,
      specialization: supporter.areaOfSpecialization || 'General Support',
      rating: supporter.rating || 4.5,
      reviews: supporter.reviewsCount || 0,
      experience: supporter.yearsOfExperience ? `${supporter.yearsOfExperience}+ years` : 'N/A',
      status: supporter.isAvailable ? 'available' : 'busy',
      availability
    };
  };

  const fetchTechSupporters = async () => {
    try {
      const response = await apiClient.get('/TechSupport/Availability/tech-supports');
      
      if (response.data && Array.isArray(response.data)) {
        const transformedData = response.data.map(transformTechSupportData);
        setTechSupporters(transformedData);
      } else {
        setTechSupporters([]);
      }
    } catch (error) {
      console.error('Error fetching tech supporters:', error);
      Alert.alert('Error', 'Failed to load tech support team. Please try again later.');
      setTechSupporters([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const loadUserRole = async () => {
      try {
        const role = await AsyncStorage.getItem('userRole');
        setUserRole(role || '');
      } catch (error) {
        console.error('Error loading user role:', error);
      }
    };

    loadUserRole();
    fetchTechSupporters();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTechSupporters();
  };

  const handleChatWithSupport = (supporter) => {
    navigation.navigate('Chat', {
      recipientId: supporter.id,
      recipientName: supporter.name,
      recipientEmail: supporter.email,
    });
  };

  const handleRequestAppointment = (supporter) => {
    setSelectedSupport(supporter);
    setShowAppointmentModal(true);
  };

  const benefits = [
    {
      icon: 'headphones',
      title: 'Expert Technicians',
      description: 'Certified professionals with years of experience'
    },
    {
      icon: 'clock',
      title: 'Flexible Scheduling',
      description: 'Book appointments that fit your schedule'
    },
    {
      icon: 'message-circle',
      title: 'Direct Communication',
      description: 'Chat directly with technicians in real-time'
    }
  ];

  const howItWorks = [
    { step: '1', title: 'Choose Support', desc: 'Select a tech support specialist' },
    { step: '2', title: 'Schedule', desc: 'Pick a convenient time slot' },
    { step: '3', title: 'Get Confirmation', desc: 'Receive appointment confirmation' },
    { step: '4', title: 'Get Help', desc: 'Chat or meet with your technician' }
  ];

  return (
    <ScreenLayout navigation={navigation}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.mainYellow]} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <MaterialCommunityIcons name="face-agent" size={60} color={colors.mainYellow} />
          <Text style={styles.title}>Tech Support</Text>
          <Text style={styles.subtitle}>
            Get expert help from certified PC technicians
          </Text>
          <TouchableOpacity
            style={styles.applyButton}
            onPress={() => setShowApplyModal(true)}
          >
            <Text style={styles.applyButtonText}>Become a Tech Support</Text>
          </TouchableOpacity>
        </View>

        {/* Benefits Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Choose Our Tech Support</Text>
          <View style={styles.benefitsContainer}>
            {benefits.map((benefit, index) => (
              <View key={`benefit-${index}`} style={styles.benefitCard}>
                <View style={styles.benefitIcon}>
                  <Feather name={benefit.icon} size={32} color={colors.mainYellow} />
                </View>
                <Text style={styles.benefitTitle}>{benefit.title}</Text>
                <Text style={styles.benefitDescription}>{benefit.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tech Support Team */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Tech Support Team</Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.mainYellow} />
              <Text style={styles.loadingText}>Loading tech support team...</Text>
            </View>
          ) : techSupporters.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Feather name="users" size={48} color={colors.jet} />
              <Text style={styles.emptyText}>
                No tech support specialists available at the moment.
              </Text>
            </View>
          ) : (
            <>
              {techSupporters.map((supporter) => (
                <View key={supporter.id} style={styles.supporterCard}>
                {/* Header */}
                <View style={styles.supporterHeader}>
                  <Image source={{ uri: supporter.avatar }} style={styles.supporterAvatar} />
                  <View style={styles.supporterInfo}>
                    <View style={styles.supporterNameRow}>
                      <Text style={styles.supporterName}>{supporter.name}</Text>
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={20}
                        color={colors.mainYellow}
                        style={{ marginLeft: 6 }}
                      />
                    </View>
                    <Text style={styles.supporterSpec}>{supporter.specialization}</Text>
                    <View style={styles.supporterMeta}>
                      <View style={styles.ratingContainer}>
                        <Feather name="star" size={14} color={colors.mainYellow} fill={colors.mainYellow} />
                        <Text style={styles.ratingText}>{supporter.rating}</Text>
                        <Text style={styles.reviewsText}>({supporter.reviews} reviews)</Text>
                      </View>
                      <Text style={styles.experienceText}>{supporter.experience} experience</Text>
                    </View>
                  </View>
                </View>

                {/* Weekly Schedule */}
                <View style={styles.scheduleContainer}>
                  <View style={styles.scheduleHeader}>
                    <Feather name="calendar" size={16} color={colors.mainYellow} />
                    <Text style={styles.scheduleTitle}>Weekly Schedule</Text>
                  </View>
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, dayIndex) => {
                    const dayKey = getDayName(dayIndex);
                    const slots = supporter.availability[dayKey];
                    return (
                      <View key={`${supporter.id}-${day}`} style={styles.scheduleDay}>
                        <Text style={styles.scheduleDayName}>
                          {day}
                        </Text>
                        <View style={styles.slotsWrapper}>
                          {slots && slots.length > 0 ? (
                            <View style={styles.slotsContainer}>
                              {slots.map((slot, slotIndex) => (
                                <View key={`${supporter.id}-${day}-slot-${slotIndex}`} style={styles.slotBadge}>
                                  <Text style={styles.slotText}>{slot}</Text>
                                </View>
                              ))}
                            </View>
                          ) : (
                            <Text style={styles.notAvailableText}>Not Available</Text>
                          )}
                        </View>
                      </View>
                    );
                  })}
                </View>

                {/* Actions */}
                <View style={styles.actionsContainer}>
                  {userRole !== 'TechSupport' ? (
                    <>
                      <TouchableOpacity
                        style={styles.chatButton}
                        onPress={() => handleChatWithSupport(supporter)}
                        disabled={supporter.status === 'busy'}
                      >
                        <Feather name="message-circle" size={18} color={colors.mainYellow} />
                        <Text style={styles.chatButtonText}>Chat Now</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.appointmentButton}
                        onPress={() => handleRequestAppointment(supporter)}
                      >
                        <Feather name="calendar" size={18} color="white" />
                        <Text style={styles.appointmentButtonText}>Request Appointment</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <View style={styles.techSupportView}>
                      <Text style={styles.techSupportViewText}>Tech Support View Only</Text>
                    </View>
                  )}
                </View>
              </View>
              ))}
            </>
          )}
        </View>

        {/* How It Works Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { textAlign: 'center' }]}>How It Works</Text>
          <View style={styles.stepsContainer}>
            {howItWorks.map((item, index) => (
              <View key={`step-${index}`} style={styles.stepCard}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{item.step}</Text>
                </View>
                <Text style={styles.stepTitle}>{item.title}</Text>
                <Text style={styles.stepDesc}>{item.desc}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Modals */}
      <ApplyTechSupportModal
        visible={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        onSubmit={() => console.log('Application submitted')}
      />

      <AppointmentModal
        visible={showAppointmentModal}
        supporter={selectedSupport}
        onClose={() => {
          setShowAppointmentModal(false);
          setSelectedSupport(null);
        }}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.mainBeige,
  },
  header: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.mainBlack,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 24,
  },
  applyButton: {
    marginTop: 20,
    backgroundColor: colors.mainYellow,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.mainBlack,
    marginBottom: 16,
  },
  benefitsContainer: {
  },
  benefitCard: {
    marginBottom: 16,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.platinum,
  },
  benefitIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.mainYellow + "20",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  benefitTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.mainBlack,
    marginBottom: 8,
    textAlign: "center",
  },
  benefitDescription: {
    fontSize: 14,
    color: colors.jet,
    textAlign: "center",
    lineHeight: 20,
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.mainBlack,
    marginTop: 16,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: colors.jet,
    textAlign: "center",
    marginTop: 16,
  },
  supporterCard: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.platinum,
    overflow: "hidden",
  },
  supporterHeader: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 2,
    borderBottomColor: colors.platinum,
  },
  supporterAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginRight: 12,
  },
  supporterInfo: {
    flex: 1,
  },
  supporterNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  supporterName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.mainBlack,
  },
  supporterSpec: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.mainYellow,
    marginBottom: 8,
  },
  supporterMeta: {
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.jet,
    marginLeft: 4,
  },
  reviewsText: {
    fontSize: 14,
    color: colors.jet,
    marginLeft: 4,
  },
  experienceText: {
    fontSize: 14,
    color: colors.jet,
  },
  scheduleContainer: {
    padding: 16,
  },
  scheduleHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.mainBlack,
    marginLeft: 8,
  },
  scheduleDay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.mainBeige,
    borderRadius: 8,
    marginBottom: 8,
  },
  scheduleDayName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.mainBlack,
  },
  slotsWrapper: {
    flex: 1,
    alignItems: "flex-end",
    marginLeft: 12,
  },
  slotsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  slotBadge: {
    backgroundColor: colors.mainYellow,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginLeft: 6,
    marginBottom: 4,
  },
  slotText: {
    fontSize: 11,
    fontWeight: "600",
    color: "white",
  },
  notAvailableContainer: {
    alignItems: "flex-start",
  },
  notAvailableText: {
    fontSize: 12,
    color: colors.jet,
  },
  actionsContainer: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 2,
    borderTopColor: colors.platinum,
  },
  chatButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.mainYellow,
    backgroundColor: "white",
    marginRight: 8,
  },
  chatButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.mainYellow,
    marginLeft: 6,
  },
  appointmentButton: {
    flex: 1.2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: colors.mainYellow,
    marginLeft: 4,
  },
  appointmentButtonText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "white",
    marginLeft: 6,
    flexShrink: 1,
  },
  techSupportView: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: colors.mainBeige,
    alignItems: "center",
  },
  techSupportViewText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.jet,
  },
  stepsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  stepCard: {
    width: "45%",
    alignItems: "center",
    marginBottom: 16,
  },
  stepNumber: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.mainYellow,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  stepNumberText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.mainBlack,
    marginBottom: 6,
    textAlign: "center",
  },
  stepDesc: {
    fontSize: 12,
    color: colors.jet,
    textAlign: "center",
    lineHeight: 18,
  },
});
