import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
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

export default function ShopRequestsScreen({ navigation }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [sidebarVisible, setSidebarVisible] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      
      if (!token) {
        Alert.alert('Error', 'Please login to access this page');
        navigation.navigate('SignIn');
        return;
      }

      const response = await apiClient.get('/Public/Public/GetShops');
      
      const mappedData = response.data.map(shop => ({
        id: shop.id,
        shopName: shop.shopName,
        ownerName: shop.ownerName,
        email: shop.email,
        phone: shop.phone,
        city: shop.city,
        exactLocation: shop.exactLocation,
        webURL: shop.webURL,
        description: shop.description,
        specialities: shop.specialities,
        shopLogoUrl: shop.shopLogoUrl,
        status: shop.status === 0 ? 'pending' : shop.status === 1 ? 'approved' : 'rejected'
      }));
      
      setRequests(mappedData);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('Error fetching shop requests:', error);
      Alert.alert('Error', 'Failed to fetch shop requests');
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchRequests();
  };

  const handleApprove = async (requestId) => {
    Alert.alert(
      'Approve Shop Request?',
      'This will grant the shop owner access to the platform.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          style: 'default',
          onPress: async () => {
            try {
              await apiClient.post(`/Admins/Shop/AdminShops/Approve/${requestId}`);
              
              setRequests(requests.map(req => 
                req.id === requestId ? { ...req, status: 'approved' } : req
              ));
              
              Alert.alert('Success', 'Shop request approved successfully!');
            } catch (error) {
              console.error('Error approving shop:', error);
              Alert.alert('Error', 'Failed to approve request');
            }
          }
        }
      ]
    );
  };

  const handleReject = async (requestId) => {
    Alert.prompt(
      'Reject Shop Request',
      'Please provide a reason for rejection:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async (reason) => {
            if (!reason) {
              Alert.alert('Error', 'You need to provide a reason!');
              return;
            }

            try {
              await apiClient.post(`/Admins/Shop/AdminShops/Reject/${requestId}`, {
                reason: reason
              });
              
              setRequests(requests.map(req => 
                req.id === requestId ? { ...req, status: 'rejected' } : req
              ));
              
              Alert.alert('Success', 'Shop request rejected');
            } catch (error) {
              console.error('Error rejecting shop:', error);
              Alert.alert('Error', 'Failed to reject request');
            }
          }
        }
      ],
      'plain-text'
    );
  };

  const handleDelete = async (requestId) => {
    Alert.alert(
      'Delete Shop Request?',
      'This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiClient.delete(`/Admins/Shop/AdminShops/Delete/${requestId}`);
              
              setRequests(requests.filter(req => req.id !== requestId));
              
              Alert.alert('Success', 'Shop request deleted successfully');
            } catch (error) {
              console.error('Error deleting shop:', error);
              Alert.alert('Error', 'Failed to delete request');
            }
          }
        }
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return '#10b981';
      case 'rejected':
        return '#ef4444';
      case 'pending':
      default:
        return colors.mainYellow;
    }
  };

  const filteredRequests = requests.filter(req => {
    if (filter === 'all') return true;
    return req.status === filter;
  });

  if (loading) {
    return (
      <ScreenLayout navigation={navigation}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.mainYellow} />
          <Text style={styles.loadingText}>Loading Shop Requests...</Text>
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
        currentScreen="ShopRequests"
      />
      <AdminHeader onMenuPress={() => setSidebarVisible(true)} />
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Shop Requests</Text>
          <Text style={styles.subtitle}>
            Manage shop registration requests
          </Text>
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          {['all', 'pending', 'approved', 'rejected'].map((filterOption) => (
            <TouchableOpacity
              key={filterOption}
              style={[
                styles.filterButton,
                filter === filterOption && styles.filterButtonActive
              ]}
              onPress={() => setFilter(filterOption)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filter === filterOption && styles.filterButtonTextActive
                ]}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{requests.filter(r => r.status === 'pending').length}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{requests.filter(r => r.status === 'approved').length}</Text>
            <Text style={styles.statLabel}>Approved</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{requests.filter(r => r.status === 'rejected').length}</Text>
            <Text style={styles.statLabel}>Rejected</Text>
          </View>
        </View>

        {/* Shop Requests List */}
        {filteredRequests.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Feather name="inbox" size={64} color={colors.platinum} />
            <Text style={styles.emptyText}>No {filter !== 'all' ? filter : ''} requests found</Text>
          </View>
        ) : (
          filteredRequests.map((request) => (
            <View key={request.id} style={styles.requestCard}>
              {/* Shop Header */}
              <View style={styles.requestHeader}>
                {request.shopLogoUrl ? (
                  <Image
                    source={{ uri: request.shopLogoUrl }}
                    style={styles.shopLogo}
                  />
                ) : (
                  <View style={[styles.shopLogo, styles.shopLogoPlaceholder]}>
                    <Feather name="shopping-bag" size={24} color={colors.mainBlack} />
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  <Text style={styles.shopName}>{request.shopName}</Text>
                  <Text style={styles.ownerName}>{request.ownerName}</Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(request.status) + '20' }
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: getStatusColor(request.status) }
                    ]}
                  >
                    {request.status.toUpperCase()}
                  </Text>
                </View>
              </View>

              {/* Shop Details */}
              <View style={styles.requestDetails}>
                <View style={styles.detailRow}>
                  <Feather name="mail" size={16} color={colors.jet} />
                  <Text style={styles.detailText}>{request.email}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Feather name="phone" size={16} color={colors.jet} />
                  <Text style={styles.detailText}>{request.phone}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Feather name="map-pin" size={16} color={colors.jet} />
                  <Text style={styles.detailText}>{request.city} - {request.exactLocation}</Text>
                </View>
                {request.webURL && (
                  <View style={styles.detailRow}>
                    <Feather name="globe" size={16} color={colors.jet} />
                    <Text style={styles.detailText}>{request.webURL}</Text>
                  </View>
                )}
                {request.description && (
                  <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionLabel}>Description:</Text>
                    <Text style={styles.descriptionText}>{request.description}</Text>
                  </View>
                )}
                {request.specialities && (
                  <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionLabel}>Specialities:</Text>
                    <Text style={styles.descriptionText}>{request.specialities}</Text>
                  </View>
                )}
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                {request.status === 'pending' && (
                  <>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.approveButton]}
                      onPress={() => handleApprove(request.id)}
                    >
                      <Feather name="check-circle" size={20} color="white" />
                      <Text style={styles.actionButtonText}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.rejectButton]}
                      onPress={() => handleReject(request.id)}
                    >
                      <Feather name="x-circle" size={20} color="white" />
                      <Text style={styles.actionButtonText}>Reject</Text>
                    </TouchableOpacity>
                  </>
                )}
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDelete(request.id)}
                >
                  <Feather name="trash-2" size={20} color="white" />
                  <Text style={styles.actionButtonText}>Delete</Text>
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
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: colors.platinum,
  },
  filterButtonActive: {
    backgroundColor: colors.mainYellow,
    borderColor: colors.mainYellow,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.jet,
  },
  filterButtonTextActive: {
    color: colors.mainBlack,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.mainYellow,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.mainBlack,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.jet,
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
    marginBottom: 16,
    gap: 12,
  },
  shopLogo: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },
  shopLogoPlaceholder: {
    backgroundColor: colors.mainYellow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shopName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.mainBlack,
    marginBottom: 2,
  },
  ownerName: {
    fontSize: 14,
    color: colors.jet,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  requestDetails: {
    gap: 8,
    marginBottom: 16,
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
  descriptionContainer: {
    marginTop: 8,
  },
  descriptionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.mainBlack,
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: colors.jet,
    lineHeight: 20,
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
  approveButton: {
    backgroundColor: '#10b981',
  },
  rejectButton: {
    backgroundColor: '#ef4444',
  },
  deleteButton: {
    backgroundColor: colors.mainBlack,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
