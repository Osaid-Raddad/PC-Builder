import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
  RefreshControl,
  Modal,
  TextInput,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import ScreenLayout from "../../components/ScreenLayout";
import colors from "../../config/colors";
import { apiClient } from "../../config/api";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

export default function TechSupportProfileScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshing, setRefreshing] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [appointmentFilter, setAppointmentFilter] = useState("all");
  const [schedule, setSchedule] = useState({
    saturday: [],
    sunday: [],
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
  });
  const [editedSchedule, setEditedSchedule] = useState(schedule);
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      checkAuthenticationAndFetchData();
    });

    return unsubscribe;
  }, [navigation]);

  const checkAuthenticationAndFetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        navigation.replace("Login");
        return;
      }

      setIsLoading(true);
      await Promise.all([
        fetchProfileData(),
        fetchSchedule(),
        fetchAppointments()
      ]);
      setIsLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
      navigation.replace("Login");
    }
  };

  const fetchProfileData = async () => {
    try {
      const response = await apiClient.get("/Profile/TechProfile/profile");
      const profileData = response.data;

      // Fetch appointments to calculate stats
      let completedCount = 0;
      let averageRating = 0;
      let reviewsCount = 0;

      try {
        const appointmentsResponse = await apiClient.get(
          "/TechSupport/Appointment/tech/schedule"
        );

        const appointments = appointmentsResponse.data;

        // Count completed sessions (status === 3)
        const completedAppointments = appointments.filter(
          (apt) => apt.status === 3
        );
        completedCount = completedAppointments.length;

        // Calculate average rating from appointments with ratings
        const ratedAppointments = completedAppointments.filter(
          (apt) => apt.rating !== null && apt.rating !== undefined
        );
        reviewsCount = ratedAppointments.length;

        if (ratedAppointments.length > 0) {
          const totalRating = ratedAppointments.reduce(
            (sum, apt) => sum + apt.rating,
            0
          );
          averageRating = (totalRating / ratedAppointments.length).toFixed(1);
        }
      } catch (appointmentError) {
        console.error("Error fetching appointments for stats:", appointmentError);
      }

      // Transform API data
      const transformedData = {
        id: profileData.id,
        name: profileData.fullName || "-",
        email: profileData.email || "-",
        phone: profileData.phone || "-",
        city: profileData.city || "-",
        street: profileData.street || "-",
        location:
          profileData.city && profileData.street
            ? `${profileData.street}, ${profileData.city}`
            : profileData.city || profileData.street || "-",
        bio: profileData.bio || "-",
        specialization: profileData.specialization || "-",
        experience: profileData.yearsOfExperience
          ? `${profileData.yearsOfExperience} years`
          : "-",
        yearsOfExperience: profileData.yearsOfExperience || "",
        rate: profileData.rate || "-",
        role: profileData.role || "-",
        joinDate: profileData.createdAt
          ? new Date(profileData.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
            })
          : "-",
        avatar:
          profileData.profileImageUrl ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            profileData.fullName || "User"
          )}&background=F9B233&color=fff&size=200`,
        stats: {
          totalAppointments: completedCount,
          rating: averageRating || 0,
          reviews: reviewsCount,
        },
      };

      setUserData(transformedData);
    } catch (error) {
      console.error("Error fetching profile data:", error);
      Alert.alert("Error", "Failed to load profile data");
    }
  };

  const fetchSchedule = async () => {
    try {
      const response = await apiClient.get("/TechSupport/Availability/Schedule");
      const scheduleData = response.data;

      const dayNames = [
        "saturday",
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
      ];
      const transformedSchedule = {
        saturday: [],
        sunday: [],
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
      };

      scheduleData.forEach((item) => {
        const dayName = dayNames[item.day];
        if (dayName) {
          const startTime = item.startTime.substring(0, 5);
          const endTime = item.endTime.substring(0, 5);

          transformedSchedule[dayName].push({
            id: item.id,
            start: startTime,
            end: endTime,
          });
        }
      });

      setSchedule(transformedSchedule);
    } catch (error) {
      console.error("Error fetching schedule:", error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await apiClient.get("/TechSupport/Appointment/tech/schedule");
      
      const statusMap = {
        0: "pending",
        1: "accepted",
        2: "rejected",
        3: "completed",
      };

      const transformedData = response.data.map((apt) => {
        const startDate = new Date(apt.startDateTime);
        const endDate = new Date(apt.endDateTime);
        const date = startDate.toLocaleDateString("en-US", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        const startTime = startDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
        const endTime = endDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });

        return {
          id: apt.id,
          userName: apt.userName || "User",
          userEmail: apt.userEmail,
          date: date,
          time: `${startTime} - ${endTime}`,
          status: statusMap[apt.status] || "pending",
          statusCode: apt.status,
          meetingLink: apt.meetingLink || null,
          rating: apt.rating,
        };
      });

      setAppointments(transformedData);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProfileData();
    await fetchSchedule();
    await fetchAppointments();
    setRefreshing(false);
  };

  // Appointment status handlers
  const handleAcceptAppointment = async (appointmentId) => {
    try {
      await apiClient.post(`/TechSupport/Appointment/approve/${appointmentId}`);
      
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId ? { ...apt, status: "accepted", statusCode: 1 } : apt
        )
      );
      
      Alert.alert("Success", "Appointment accepted successfully!");
    } catch (error) {
      console.error("Error accepting appointment:", error);
      Alert.alert("Error", error.response?.data?.message || "Failed to accept appointment");
    }
  };

  const handleRejectAppointment = async (appointmentId) => {
    Alert.alert(
      "Reject Appointment",
      "Are you sure you want to reject this appointment?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          style: "destructive",
          onPress: async () => {
            try {
              await apiClient.post(`/TechSupport/Appointment/reject/${appointmentId}`);
              
              setAppointments((prev) =>
                prev.map((apt) =>
                  apt.id === appointmentId ? { ...apt, status: "rejected", statusCode: 2 } : apt
                )
              );
              
              Alert.alert("Success", "Appointment rejected");
              
              // Remove from list after 3 seconds
              setTimeout(() => {
                setAppointments((prev) => prev.filter((apt) => apt.id !== appointmentId));
              }, 3000);
            } catch (error) {
              console.error("Error rejecting appointment:", error);
              Alert.alert("Error", error.response?.data?.message || "Failed to reject appointment");
            }
          },
        },
      ]
    );
  };

  const handleCompleteAppointment = async (appointmentId) => {
    Alert.alert(
      "Complete Appointment",
      "Mark this appointment as completed?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Complete",
          onPress: async () => {
            try {
              await apiClient.post(`/TechSupport/Appointment/complete/${appointmentId}`);
              
              setAppointments((prev) =>
                prev.map((apt) =>
                  apt.id === appointmentId ? { ...apt, status: "completed", statusCode: 3 } : apt
                )
              );
              
              Alert.alert("Success", "Appointment marked as completed!");
            } catch (error) {
              console.error("Error completing appointment:", error);
              Alert.alert("Error", error.response?.data?.message || "Failed to mark as completed");
            }
          },
        },
      ]
    );
  };

  // Schedule editing handlers
  const handleEditSchedule = () => {
    setEditedSchedule(schedule);
    setIsEditingSchedule(true);
  };

  const handleCancelScheduleEdit = () => {
    setEditedSchedule(schedule);
    setIsEditingSchedule(false);
  };

  const addTimeSlot = (day) => {
    setEditedSchedule({
      ...editedSchedule,
      [day]: [...editedSchedule[day], { start: "09:00", end: "17:00" }],
    });
  };

  const removeTimeSlot = async (day, index) => {
    const slot = editedSchedule[day][index];

    if (slot.id) {
      Alert.alert(
        "Delete Time Slot",
        "Are you sure you want to delete this time slot?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                await apiClient.delete(`/TechSupport/Availability/Delete-Availabile/${slot.id}`);
                const newSlots = editedSchedule[day].filter((_, i) => i !== index);
                setEditedSchedule({ ...editedSchedule, [day]: newSlots });
                Alert.alert("Success", "Time slot deleted successfully!");
              } catch (error) {
                console.error("Error deleting time slot:", error);
                Alert.alert("Error", "Failed to delete time slot");
              }
            },
          },
        ]
      );
    } else {
      const newSlots = editedSchedule[day].filter((_, i) => i !== index);
      setEditedSchedule({ ...editedSchedule, [day]: newSlots });
    }
  };

  const updateTimeSlot = (day, index, field, value) => {
    const newSlots = [...editedSchedule[day]];
    newSlots[index][field] = value;
    setEditedSchedule({ ...editedSchedule, [day]: newSlots });
  };

  const handleSaveSchedule = async () => {
    try {
      const daysOfWeek = ["saturday", "sunday", "monday", "tuesday", "wednesday", "thursday", "friday"];
      const newSlotsToAdd = [];
      const existingSlotsToUpdate = [];

      for (let dayIndex = 0; dayIndex < daysOfWeek.length; dayIndex++) {
        const day = daysOfWeek[dayIndex];
        const slots = editedSchedule[day];

        if (slots && slots.length > 0) {
          for (const slot of slots) {
            if (slot.end <= slot.start) {
              Alert.alert("Invalid Time", `End time must be after start time for ${day}`);
              return;
            }

            const startTime = `${slot.start}:00`;
            const endTime = `${slot.end}:00`;

            if (slot.id) {
              const originalSlot = schedule[day].find((s) => s.id === slot.id);
              if (originalSlot && (originalSlot.start !== slot.start || originalSlot.end !== slot.end)) {
                existingSlotsToUpdate.push({
                  id: slot.id,
                  day: dayIndex,
                  startTime,
                  endTime,
                });
              }
            } else {
              newSlotsToAdd.push({
                day: dayIndex,
                startTime,
                endTime,
              });
            }
          }
        }
      }

      // Delete and recreate modified slots
      for (const slot of existingSlotsToUpdate) {
        await apiClient.delete(`/TechSupport/Availability/Delete-Availabile/${slot.id}`);
        await apiClient.post("/TechSupport/Availability/Add-Availabile", {
          day: slot.day,
          startTime: slot.startTime,
          endTime: slot.endTime,
        });
      }

      // Add new slots
      for (const slot of newSlotsToAdd) {
        await apiClient.post("/TechSupport/Availability/Add-Availabile", slot);
      }

      // Refresh schedule
      await fetchSchedule();
      setIsEditingSchedule(false);
      Alert.alert("Success", "Schedule updated successfully!");
    } catch (error) {
      console.error("Error saving schedule:", error);
      Alert.alert("Error", error.response?.data?.message || "Failed to update schedule");
    }
  };

  // Profile edit handlers
  const handleOpenEditModal = () => {
    setEditFormData({ ...userData });
    setAvatarPreview(null);
    setAvatarFile(null);
    setShowEditModal(true);
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Please grant camera roll permissions");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatarPreview(result.assets[0].uri);
      setAvatarFile(result.assets[0]);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const formData = new FormData();
      
      formData.append("FullName", editFormData.name || "");
      formData.append("Email", editFormData.email || "");
      formData.append("Phone", editFormData.phone || "");
      formData.append("City", editFormData.city || "");
      formData.append("Street", editFormData.street || "");
      formData.append("Bio", editFormData.bio || "");
      formData.append("Specialization", editFormData.specialization || "");
      formData.append("YearsOfExperience", editFormData.yearsOfExperience?.toString() || "0");

      if (avatarFile) {
        formData.append("ProfileImage", {
          uri: avatarFile.uri,
          type: avatarFile.type || "image/jpeg",
          name: avatarFile.fileName || "profile.jpg",
        });
      }

      await apiClient.put("/Profile/TechProfile/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await fetchProfileData();
      setShowEditModal(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile");
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("authToken");
          navigation.replace("Login");
        },
      },
    ]);
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("authToken");
              await axios.delete(`${API_BASE_URL}/Profile/Profile/delete`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              await AsyncStorage.removeItem("authToken");
              Alert.alert("Success", "Your account has been deleted successfully.");
              navigation.replace("Home");
            } catch (error) {
              console.error("Error deleting account:", error);
              Alert.alert(
                "Error",
                error.response?.data?.message ||
                  "Failed to delete account. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  const handleNavigateToEditProfile = () => {
    navigation.navigate("EditTechProfile", { userData });
  };

  if (isLoading) {
    return (
      <ScreenLayout navigation={navigation}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.mainYellow} />
        </View>
      </ScreenLayout>
    );
  }

  if (!userData) {
    return (
      <ScreenLayout navigation={navigation}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load profile data</Text>
        </View>
      </ScreenLayout>
    );
  }

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
          <Text style={styles.headerTitle}>Tech Support Profile</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image source={{ uri: userData.avatar }} style={styles.avatar} />
          <Text style={styles.name}>{userData.name}</Text>
          <Text style={styles.role}>{userData.specialization}</Text>
          <Text style={styles.experience}>{userData.experience}</Text>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userData.stats.totalAppointments}</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>⭐ {userData.stats.rating}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userData.stats.reviews}</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleOpenEditModal}
            >
              <Feather name="edit-2" size={18} color={colors.mainBlack} />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "overview" && styles.activeTab]}
            onPress={() => setActiveTab("overview")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "overview" && styles.activeTabText,
              ]}
            >
              Overview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "appointments" && styles.activeTab]}
            onPress={() => setActiveTab("appointments")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "appointments" && styles.activeTabText,
              ]}
            >
              Appointments
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "schedule" && styles.activeTab]}
            onPress={() => setActiveTab("schedule")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "schedule" && styles.activeTabText,
              ]}
            >
              Schedule
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <View style={styles.tabContent}>
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.bioText}>{userData.bio}</Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              <View style={styles.infoItem}>
                <Feather name="mail" size={18} color={colors.mainYellow} />
                <Text style={styles.infoText}>{userData.email}</Text>
              </View>
              <View style={styles.infoItem}>
                <Feather name="phone" size={18} color={colors.mainYellow} />
                <Text style={styles.infoText}>{userData.phone}</Text>
              </View>
              <View style={styles.infoItem}>
                <Feather name="map-pin" size={18} color={colors.mainYellow} />
                <Text style={styles.infoText}>{userData.location}</Text>
              </View>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Professional Details</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Specialization:</Text>
                <Text style={styles.detailValue}>{userData.specialization}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Experience:</Text>
                <Text style={styles.detailValue}>{userData.experience}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Member Since:</Text>
                <Text style={styles.detailValue}>{userData.joinDate}</Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === "appointments" && (
          <View style={styles.tabContent}>
            {/* Filter Buttons */}
            <View style={styles.filterButtons}>
              {["all", "pending", "accepted", "completed"].map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={[
                    styles.filterButton,
                    appointmentFilter === filter && styles.filterButtonActive,
                  ]}
                  onPress={() => setAppointmentFilter(filter)}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      appointmentFilter === filter && styles.filterButtonTextActive,
                    ]}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)} (
                    {appointments.filter((a) => filter === "all" || a.status === filter).length})
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {appointments.filter((a) => appointmentFilter === "all" || a.status === appointmentFilter).length === 0 ? (
              <View style={styles.emptyState}>
                <Feather name="calendar" size={48} color={colors.platinum} />
                <Text style={styles.emptyStateText}>No appointments</Text>
              </View>
            ) : (
              appointments
                .filter((a) => appointmentFilter === "all" || a.status === appointmentFilter)
                .map((appointment) => (
                  <View key={appointment.id} style={styles.appointmentCard}>
                    <View style={styles.appointmentHeader}>
                      <Text style={styles.appointmentUser}>{appointment.userName}</Text>
                      <View
                        style={[
                          styles.statusBadge,
                          styles[`status${appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}`],
                        ]}
                      >
                        <Text style={styles.statusText}>{appointment.status}</Text>
                      </View>
                    </View>
                    <Text style={styles.appointmentDate}>{appointment.date}</Text>
                    <Text style={styles.appointmentTime}>{appointment.time}</Text>
                    {appointment.userEmail && (
                      <Text style={styles.appointmentEmail}>{appointment.userEmail}</Text>
                    )}
                    {appointment.meetingLink && (
                      <Text style={styles.meetingLink} numberOfLines={1}>
                        {appointment.meetingLink}
                      </Text>
                    )}

                    {/* Action Buttons */}
                    {appointment.status === "pending" && (
                      <View style={styles.appointmentActions}>
                        <TouchableOpacity
                          style={[styles.actionButton, styles.acceptButton]}
                          onPress={() => handleAcceptAppointment(appointment.id)}
                        >
                          <Feather name="check" size={16} color="white" />
                          <Text style={styles.actionButtonText}>Accept</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.actionButton, styles.rejectButton]}
                          onPress={() => handleRejectAppointment(appointment.id)}
                        >
                          <Feather name="x" size={16} color="white" />
                          <Text style={styles.actionButtonText}>Reject</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {appointment.status === "accepted" && (
                      <TouchableOpacity
                        style={[styles.actionButton, styles.completeButton]}
                        onPress={() => handleCompleteAppointment(appointment.id)}
                      >
                        <Feather name="check-circle" size={16} color="white" />
                        <Text style={styles.actionButtonText}>Mark as Completed</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))
            )}
          </View>
        )}

        {activeTab === "schedule" && (
          <View style={styles.tabContent}>
            {/* Edit/Save Controls */}
            <View style={styles.scheduleControls}>
              {!isEditingSchedule ? (
                <TouchableOpacity style={styles.editScheduleButton} onPress={handleEditSchedule}>
                  <Feather name="edit-2" size={18} color={colors.mainBlack} />
                  <Text style={styles.editScheduleButtonText}>Edit Schedule</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.scheduleActionButtons}>
                  <TouchableOpacity style={styles.cancelButton} onPress={handleCancelScheduleEdit}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.saveButton} onPress={handleSaveSchedule}>
                    <Feather name="save" size={18} color={colors.mainBlack} />
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Schedule Days */}
            {Object.entries(isEditingSchedule ? editedSchedule : schedule).map(([day, slots]) => (
              <View key={day} style={styles.scheduleDay}>
                <View style={styles.scheduleDayHeader}>
                  <Text style={styles.scheduleDayName}>
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </Text>
                  {isEditingSchedule && (
                    <TouchableOpacity onPress={() => addTimeSlot(day)}>
                      <Feather name="plus-circle" size={24} color={colors.mainYellow} />
                    </TouchableOpacity>
                  )}
                </View>

                {slots.length === 0 ? (
                  <Text style={styles.noSlotsText}>No availability</Text>
                ) : (
                  slots.map((slot, index) => (
                    <View key={slot.id || index} style={styles.timeSlotRow}>
                      {!isEditingSchedule ? (
                        <View style={styles.timeSlot}>
                          <Feather name="clock" size={16} color={colors.mainYellow} />
                          <Text style={styles.timeSlotText}>
                            {slot.start} - {slot.end}
                          </Text>
                        </View>
                      ) : (
                        <View style={styles.editTimeSlot}>
                          <TextInput
                            style={styles.timeInput}
                            value={slot.start}
                            onChangeText={(value) => updateTimeSlot(day, index, "start", value)}
                            placeholder="09:00"
                            placeholderTextColor={colors.platinum}
                          />
                          <Text style={styles.timeSeparator}>-</Text>
                          <TextInput
                            style={styles.timeInput}
                            value={slot.end}
                            onChangeText={(value) => updateTimeSlot(day, index, "end", value)}
                            placeholder="17:00"
                            placeholderTextColor={colors.platinum}
                          />
                          <TouchableOpacity onPress={() => removeTimeSlot(day, index)}>
                            <Feather name="trash-2" size={20} color="#ef4444" />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  ))
                )}
              </View>
            ))}
          </View>
        )}

        {/* Settings */}
        <View style={styles.settingsSection}>
          <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
            <Feather name="log-out" size={20} color={colors.mainBlack} />
            <Text style={styles.settingText}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.settingItem, styles.dangerItem]}
            onPress={handleDeleteAccount}
          >
            <Feather name="trash-2" size={20} color="#ef4444" />
            <Text style={[styles.settingText, styles.dangerText]}>
              Delete Account
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      {showEditModal && editFormData && (
        <Modal
          visible={showEditModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowEditModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Profile</Text>
                <TouchableOpacity onPress={() => setShowEditModal(false)}>
                  <Feather name="x" size={24} color={colors.mainBlack} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                {/* Avatar */}
                <View style={styles.avatarSection}>
                  <Image
                    source={{ uri: avatarPreview || editFormData.avatar }}
                    style={styles.modalAvatar}
                  />
                  <TouchableOpacity style={styles.uploadButton} onPress={handlePickImage}>
                    <Feather name="upload" size={20} color={colors.mainBlack} />
                    <Text style={styles.uploadButtonText}>Change Photo</Text>
                  </TouchableOpacity>
                </View>

                {/* Form Fields */}
                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>Full Name</Text>
                  <TextInput
                    style={styles.fieldInput}
                    value={editFormData.name}
                    onChangeText={(text) =>
                      setEditFormData({ ...editFormData, name: text })
                    }
                    placeholder="Enter name"
                    placeholderTextColor={colors.platinum}
                  />
                </View>

                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>Specialization</Text>
                  <TextInput
                    style={styles.fieldInput}
                    value={editFormData.specialization}
                    onChangeText={(text) =>
                      setEditFormData({ ...editFormData, specialization: text })
                    }
                    placeholder="e.g., Gaming PCs & Hardware"
                    placeholderTextColor={colors.platinum}
                  />
                </View>

                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>Years of Experience</Text>
                  <TextInput
                    style={styles.fieldInput}
                    value={editFormData.yearsOfExperience?.toString() || ""}
                    onChangeText={(text) =>
                      setEditFormData({ ...editFormData, yearsOfExperience: text })
                    }
                    placeholder="e.g., 5"
                    keyboardType="numeric"
                    placeholderTextColor={colors.platinum}
                  />
                </View>

                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>Email</Text>
                  <TextInput
                    style={styles.fieldInput}
                    value={editFormData.email}
                    onChangeText={(text) =>
                      setEditFormData({ ...editFormData, email: text })
                    }
                    placeholder="Enter email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor={colors.platinum}
                  />
                </View>

                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>Phone</Text>
                  <TextInput
                    style={styles.fieldInput}
                    value={editFormData.phone}
                    onChangeText={(text) =>
                      setEditFormData({ ...editFormData, phone: text })
                    }
                    placeholder="Enter phone"
                    keyboardType="phone-pad"
                    placeholderTextColor={colors.platinum}
                  />
                </View>

                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>City</Text>
                  <TextInput
                    style={styles.fieldInput}
                    value={editFormData.city}
                    onChangeText={(text) =>
                      setEditFormData({ ...editFormData, city: text })
                    }
                    placeholder="Enter city"
                    placeholderTextColor={colors.platinum}
                  />
                </View>

                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>Street</Text>
                  <TextInput
                    style={styles.fieldInput}
                    value={editFormData.street}
                    onChangeText={(text) =>
                      setEditFormData({ ...editFormData, street: text })
                    }
                    placeholder="Enter street"
                    placeholderTextColor={colors.platinum}
                  />
                </View>

                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>Bio</Text>
                  <TextInput
                    style={[styles.fieldInput, styles.bioInput]}
                    value={editFormData.bio}
                    onChangeText={(text) =>
                      setEditFormData({ ...editFormData, bio: text })
                    }
                    placeholder="Write about yourself"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    placeholderTextColor={colors.platinum}
                  />
                </View>

                <TouchableOpacity style={styles.saveProfileButton} onPress={handleSaveProfile}>
                  <Feather name="save" size={20} color={colors.mainBlack} />
                  <Text style={styles.saveProfileButtonText}>Save Changes</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: colors.text,
  },
  header: {
    padding: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.mainBlack,
  },
  profileCard: {
    backgroundColor: "white",
    margin: 16,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.mainBlack,
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: colors.mainYellow,
    fontWeight: "600",
    marginBottom: 2,
  },
  experience: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.mainBlack,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
  },
  actionButtons: {
    width: "100%",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.mainYellow,
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.mainBlack,
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: "white",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 4,
    elevation: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: colors.mainYellow,
  },
  tabText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "500",
  },
  activeTabText: {
    color: colors.mainBlack,
    fontWeight: "600",
  },
  tabContent: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  infoSection: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.mainBlack,
    marginBottom: 12,
  },
  bioText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "600",
    width: 120,
  },
  detailValue: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  appointmentCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  appointmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  appointmentUser: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.mainBlack,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPending: {
    backgroundColor: "#fef3c7",
  },
  statusAccepted: {
    backgroundColor: "#d1fae5",
  },
  statusRejected: {
    backgroundColor: "#fee2e2",
  },
  statusCompleted: {
    backgroundColor: "#dbeafe",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  appointmentDate: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  appointmentTime: {
    fontSize: 14,
    color: colors.text,
  },
  meetingLink: {
    fontSize: 12,
    color: colors.mainYellow,
    marginTop: 8,
  },
  scheduleDay: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  scheduleDayName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.mainBlack,
    marginBottom: 8,
  },
  noSlotsText: {
    fontSize: 14,
    color: colors.platinum,
    fontStyle: "italic",
  },
  timeSlot: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
  },
  timeSlotText: {
    fontSize: 14,
    color: colors.text,
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.platinum,
    marginTop: 12,
  },
  settingsSection: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  settingText: {
    fontSize: 16,
    color: colors.mainBlack,
    fontWeight: "500",
  },
  dangerItem: {
    borderWidth: 1,
    borderColor: "#fee2e2",
  },
  dangerText: {
    color: "#ef4444",
  },
  // Filter buttons
  filterButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.mainYellow,
    borderColor: colors.mainYellow,
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text,
  },
  filterButtonTextActive: {
    color: colors.mainBlack,
  },
  // Appointment actions
  appointmentActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  acceptButton: {
    backgroundColor: "#10b981",
  },
  rejectButton: {
    backgroundColor: "#ef4444",
  },
  completeButton: {
    backgroundColor: "#6b7280",
    marginTop: 12,
  },
  actionButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  appointmentEmail: {
    fontSize: 12,
    color: colors.text,
    marginTop: 4,
  },
  // Schedule editing
  scheduleControls: {
    marginBottom: 16,
  },
  editScheduleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.mainYellow,
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  editScheduleButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.mainBlack,
  },
  scheduleActionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  saveButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.mainYellow,
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.mainBlack,
  },
  scheduleDayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  timeSlotRow: {
    marginBottom: 8,
  },
  editTimeSlot: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  timeInput: {
    flex: 1,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    color: colors.mainBlack,
  },
  timeSeparator: {
    fontSize: 16,
    color: colors.text,
    fontWeight: "600",
  },
  // Edit Profile Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.mainBlack,
  },
  modalBody: {
    padding: 20,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  modalAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: colors.mainYellow,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.mainYellow,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.mainBlack,
  },
  formField: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.mainBlack,
    marginBottom: 8,
  },
  fieldInput: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: colors.mainBlack,
  },
  bioInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  saveProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.mainYellow,
    padding: 16,
    borderRadius: 8,
    gap: 8,
    marginTop: 8,
    marginBottom: 20,
  },
  saveProfileButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.mainBlack,
  },
});
