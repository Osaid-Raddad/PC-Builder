import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
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

export default function TechSupportRequestsScreen({ navigation }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [sidebarVisible, setSidebarVisible] = useState(false);

  useEffect(() => {
    checkAccessAndFetch();
  }, []);

  const checkAccessAndFetch = async () => {
    try {
      const role = await AsyncStorage.getItem('userRole');
      setUserRole(role || '');
      
      if (role === 'SuperAdmin') {
        fetchPendingRequests();
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error checking access:', error);
      setLoading(false);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/Admin/TechSupport/pending');
      setRequests(response.data);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      Alert.alert('Error', 'Failed to fetch pending requests');
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPendingRequests();
  };

  const handleAccept = async (requestId, userId, userName) => {
    Alert.alert(
      'Accept Application?',
      `Approve ${userName} as Tech Support and update their role?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          style: 'default',
          onPress: async () => {
            try {
              // Step 1: Approve the request
              await apiClient.patch(`/Admin/TechSupport/upgrade-requests/${requestId}`, {
                isApproved: true
              });

              // Step 2: Change user role to TechSupport
              await apiClient.patch(`/Admins/Users/changeRole/${userId}`, {
                newRole: "TechSupport"
              });

              Alert.alert('Success', 'Application approved and user role updated to TechSupport!');
              
              // Remove the accepted request from the list
              setRequests(requests.filter(req => req.id !== requestId));
            } catch (error) {
              console.error('Error accepting request:', error);
              Alert.alert('Error', 'Failed to process application');
            }
          }
        }
      ]
    );
  };

  const handleReject = async (requestId, userName) => {
    Alert.alert(
      'Reject Application?',
      `Reject ${userName}'s tech support application?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiClient.patch(`/Admin/TechSupport/upgrade-requests/${requestId}`, {
                isApproved: false
              });

              Alert.alert('Success', 'Application rejected successfully!');
              
              // Remove the rejected request from the list
              setRequests(requests.filter(req => req.id !== requestId));
            } catch (error) {
              console.error('Error rejecting request:', error);
              Alert.alert('Error', 'Failed to reject application');
            }
          }
        }
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Access denied for non-SuperAdmin
  if (userRole !== 'SuperAdmin') {
    return (
      <ScreenLayout navigation={navigation}>
        <AdminSidebar
          navigation={navigation}
          visible={sidebarVisible}
          onClose={() => setSidebarVisible(false)}
          currentScreen="TechSupportRequests"
        />
        <AdminHeader onMenuPress={() => setSidebarVisible(true)} />
        <View style={styles.accessDeniedContainer}>
          <Feather name="shield-off" size={80} color="#ef4444" />
          <Text style={styles.accessDeniedTitle}>Access Denied</Text>
          <Text style={styles.accessDeniedText}>
            This page is only accessible to SuperAdmin users.
          </Text>
          <Text style={styles.accessDeniedRole}>
            Current role: {userRole || 'Unknown'}
          </Text>
        </View>
      </ScreenLayout>
    );
  }

  if (loading) {
    return (
      <ScreenLayout navigation={navigation}>
        <AdminSidebar
          navigation={navigation}
          visible={sidebarVisible}
          onClose={() => setSidebarVisible(false)}
          currentScreen="TechSupportRequests"
        />
        <AdminHeader onMenuPress={() => setSidebarVisible(true)} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.mainYellow} />
          <Text style={styles.loadingText}>Loading Requests...</Text>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout navigation={navigation}>
      <AdminSidebar
        navigation={navigation}
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        currentScreen="TechSupportRequests"
      />
      <AdminHeader onMenuPress={() => setSidebarVisible(true)} />
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Tech Support Applications</Text>
          <Text style={styles.subtitle}>Review pending upgrade requests</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.statsValue}>{requests.length}</Text>
          <Text style={styles.statsLabel}>Pending Applications</Text>
        </View>

        {/* Requests List */}
        {requests.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Feather name="inbox" size={64} color={colors.platinum} />
            <Text style={styles.emptyText}>No pending applications</Text>
          </View>
        ) : (
          requests.map((request) => (
            <View key={request.id} style={styles.requestCard}>
              {/* User Header */}
              <View style={styles.requestHeader}>
                <View style={styles.userAvatar}>
                  <Text style={styles.userAvatarText}>
                    {request.userName?.charAt(0).toUpperCase() || 'U'}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.userName}>{request.userName}</Text>
                  <View style={styles.dateContainer}>
                    <Feather name="clock" size={14} color={colors.jet} />
                    <Text style={styles.dateText}>
                      {formatDate(request.requestedAt)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* User Details */}
              <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                  <Feather name="mail" size={16} color={colors.jet} />
                  <Text style={styles.detailText}>{request.email}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Feather name="phone" size={16} color={colors.jet} />
                  <Text style={styles.detailText}>{request.phoneNumber || 'N/A'}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Feather name="briefcase" size={16} color={colors.jet} />
                  <Text style={styles.detailText}>
                    Experience: {request.yearsOfExperience || 'Not specified'} years
                  </Text>
                </View>
              </View>

              {/* Expertise */}
              {request.expertise && (
                <View style={styles.expertiseContainer}>
                  <Text style={styles.expertiseLabel}>Expertise:</Text>
                  <Text style={styles.expertiseText}>{request.expertise}</Text>
                </View>
              )}

              {/* Availability */}
              {request.availability && (
                <View style={styles.availabilityContainer}>
                  <Feather name="calendar" size={16} color={colors.mainYellow} />
                  <Text style={styles.availabilityText}>
                    Available: {request.availability}
                  </Text>
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.acceptButton]}
                  onPress={() => handleAccept(request.id, request.userId, request.userName)}
                >
                  <Feather name="check-circle" size={20} color="white" />
                  <Text style={styles.actionButtonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.rejectButton]}
                  onPress={() => handleReject(request.id, request.userName)}
                >
                  <Feather name="x-circle" size={20} color="white" />
                  <Text style={styles.actionButtonText}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
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
  accessDeniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  accessDeniedTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.mainBlack,
    marginTop: 24,
    marginBottom: 8,
  },
  accessDeniedText: {
    fontSize: 16,
    color: colors.jet,
    textAlign: 'center',
    marginBottom: 16,
  },
  accessDeniedRole: {
    fontSize: 14,
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
  statsCard: {
    backgroundColor: colors.mainYellow,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statsValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.mainBlack,
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 14,
    color: colors.mainBlack,
    fontWeight: '600',
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
  requestCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.mainYellow,
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
    color: colors.mainBlack,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.mainBlack,
    marginBottom: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: colors.jet,
  },
  detailsContainer: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: colors.jet,
    flex: 1,
  },
  expertiseContainer: {
    backgroundColor: colors.mainBeige,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  expertiseLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.mainBlack,
    marginBottom: 4,
  },
  expertiseText: {
    fontSize: 14,
    color: colors.jet,
    lineHeight: 20,
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.mainYellow + '20',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  availabilityText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.mainBlack,
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
  acceptButton: {
    backgroundColor: '#10b981',
  },
  rejectButton: {
    backgroundColor: '#ef4444',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
