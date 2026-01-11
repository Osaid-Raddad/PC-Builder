import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
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

export default function UserManagementScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarVisible, setSidebarVisible] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/Public/Public/GetAllUsers');
      
      const transformedUsers = await Promise.all(
        response.data.map(async (user) => {
          let isBlocked = false;
          
          try {
            const blockStatusResponse = await apiClient.patch(`/Admins/Users/IsBlocked/${user.id}`);
            isBlocked = blockStatusResponse.data?.message === "Block";
          } catch (error) {
            console.error(`Error checking block status for user ${user.id}:`, error);
            isBlocked = false;
          }
          
          return {
            id: user.id,
            name: user.fullName || user.userName || 'Unknown User',
            email: user.email,
            phoneNumber: user.phoneNumber || 'N/A',
            emailConfirmed: user.emailConfirmed || false,
            role: user.userRole || 'User',
            status: isBlocked ? 'suspended' : 'active',
            shopName: user.shopName,
            suspensionReason: isBlocked ? 'User is blocked' : null
          };
        })
      );
      
      setUsers(transformedUsers);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert('Error', 'Failed to fetch users');
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const handleSuspend = async (user) => {
    try {
      const isBlockedResponse = await apiClient.patch(`/Admins/Users/IsBlocked/${user.id}`);
      const isBlocked = isBlockedResponse.data?.message === "Block";

      if (isBlocked) {
        Alert.alert('Error', 'User is already blocked');
        return;
      }
    } catch (error) {
      console.error('Error checking block status:', error);
      Alert.alert('Error', 'Failed to check user block status');
      return;
    }

    Alert.prompt(
      `Block ${user.name}?`,
      'Number of days to block:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Block',
          style: 'destructive',
          onPress: async (days) => {
            if (!days || parseInt(days) < 1) {
              Alert.alert('Error', 'Please enter a valid number of days (minimum 1)');
              return;
            }

            try {
              await apiClient.patch(`/Admins/Users/BlockUser/${user.id}?days=${parseInt(days)}`);
              
              setUsers(users.map(u => 
                u.id === user.id ? { ...u, status: 'suspended' } : u
              ));
              
              Alert.alert('Success', `User blocked successfully for ${days} day(s)`);
            } catch (error) {
              console.error('Error blocking user:', error);
              Alert.alert('Error', 'Failed to block user');
            }
          }
        }
      ],
      'plain-text',
      '1'
    );
  };

  const handleActivate = async (user) => {
    try {
      const isBlockedResponse = await apiClient.patch(`/Admins/Users/IsBlocked/${user.id}`);
      const isBlocked = isBlockedResponse.data?.message === "Block";

      if (!isBlocked) {
        Alert.alert('Info', 'User is not currently blocked');
        return;
      }

      Alert.alert(
        'Unblock User?',
        `Are you sure you want to unblock ${user.name}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Unblock',
            style: 'default',
            onPress: async () => {
              try {
                await apiClient.patch(`/Admins/Users/UnblockUser/${user.id}`);
                
                setUsers(users.map(u => 
                  u.id === user.id ? { ...u, status: 'active', suspensionReason: null } : u
                ));
                
                Alert.alert('Success', 'User unblocked successfully');
              } catch (error) {
                console.error('Error unblocking user:', error);
                Alert.alert('Error', 'Failed to unblock user');
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error checking block status:', error);
      Alert.alert('Error', 'Failed to check user status');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <ScreenLayout navigation={navigation}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.mainYellow} />
          <Text style={styles.loadingText}>Loading Users...</Text>
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
        currentScreen="UserManagement"
      />
      <AdminHeader onMenuPress={() => setSidebarVisible(true)} />
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>User Management</Text>
          <Text style={styles.subtitle}>Manage platform users</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color={colors.jet} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholderTextColor={colors.jet}
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={() => setSearchTerm('')}>
              <Feather name="x" size={20} color={colors.jet} />
            </TouchableOpacity>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{users.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{users.filter(u => u.status === 'active').length}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{users.filter(u => u.status === 'suspended').length}</Text>
            <Text style={styles.statLabel}>Blocked</Text>
          </View>
        </View>

        {/* Users List */}
        {filteredUsers.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Feather name="users" size={64} color={colors.platinum} />
            <Text style={styles.emptyText}>No users found</Text>
          </View>
        ) : (
          filteredUsers.map((user) => (
            <View key={user.id} style={styles.userCard}>
              <View style={styles.userHeader}>
                <View style={styles.userAvatar}>
                  <Text style={styles.userAvatarText}>
                    {user.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userEmail}>{user.email}</Text>
                  {user.shopName && (
                    <View style={styles.shopBadge}>
                      <Feather name="shopping-bag" size={12} color={colors.mainBlack} />
                      <Text style={styles.shopText}>{user.shopName}</Text>
                    </View>
                  )}
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        user.status === 'active'
                          ? '#10b98120'
                          : '#ef444420',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color:
                          user.status === 'active'
                            ? '#10b981'
                            : '#ef4444',
                      },
                    ]}
                  >
                    {user.status.toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.userDetails}>
                <View style={styles.detailRow}>
                  <Feather name="phone" size={16} color={colors.jet} />
                  <Text style={styles.detailText}>{user.phoneNumber}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Feather name="shield" size={16} color={colors.jet} />
                  <Text style={styles.detailText}>Role: {user.role}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Feather 
                    name={user.emailConfirmed ? 'check-circle' : 'x-circle'} 
                    size={16} 
                    color={user.emailConfirmed ? '#10b981' : '#ef4444'} 
                  />
                  <Text style={styles.detailText}>
                    Email {user.emailConfirmed ? 'Verified' : 'Not Verified'}
                  </Text>
                </View>
                {user.status === 'suspended' && user.suspensionReason && (
                  <View style={styles.suspensionInfo}>
                    <Feather name="alert-circle" size={16} color="#ef4444" />
                    <Text style={styles.suspensionText}>{user.suspensionReason}</Text>
                  </View>
                )}
              </View>

              <View style={styles.actionButtons}>
                {user.status === 'active' ? (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.suspendButton]}
                    onPress={() => handleSuspend(user)}
                  >
                    <Feather name="slash" size={20} color="white" />
                    <Text style={styles.actionButtonText}>Block User</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.activateButton]}
                    onPress={() => handleActivate(user)}
                  >
                    <Feather name="check-circle" size={20} color="white" />
                    <Text style={styles.actionButtonText}>Unblock User</Text>
                  </TouchableOpacity>
                )}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.platinum,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
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
  userCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.mainYellow,
  },
  userHeader: {
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
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: colors.jet,
    marginBottom: 4,
  },
  shopBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.mainYellow + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  shopText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.mainBlack,
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
  userDetails: {
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
  },
  suspensionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ef444410',
    padding: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  suspensionText: {
    fontSize: 14,
    color: '#ef4444',
    flex: 1,
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
  suspendButton: {
    backgroundColor: '#ef4444',
  },
  activateButton: {
    backgroundColor: '#10b981',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
