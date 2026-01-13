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

export default function ChangeRolesScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const availableRoles = ['User', 'Admin', 'TechSupport'];

  useEffect(() => {
    checkAccessAndFetch();
  }, []);

  const checkAccessAndFetch = async () => {
    try {
      const role = await AsyncStorage.getItem('userRole');
      setUserRole(role || '');
      
      if (role === 'SuperAdmin') {
        fetchAllUsers();
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error checking access:', error);
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/Public/Public/GetAllUsers');
      setUsers(response.data);
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
    fetchAllUsers();
  };

  const handleRoleChange = async (userId, userName, currentRole, newRole) => {
    if (currentRole === newRole) {
      Alert.alert('Error', 'User already has this role');
      return;
    }

    Alert.alert(
      'Are you sure?',
      `Change ${userName}'s role to: ${newRole}?\n\nNote: The user will need to log out and log back in for the role change to take effect.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          style: 'default',
          onPress: async () => {
            try {
              const response = await apiClient.patch(`/Admins/Users/changeRole/${userId}`, {
                newRole: newRole
              });

              console.log('Role change response:', response.data);

              Alert.alert(
                'Success', 
                `User role updated to ${newRole}!\n\nThe user must log out and log back in for the change to take effect.`,
                [{ text: 'OK' }]
              );

              // Update the user in the local state
              setUsers(users.map(user => 
                user.id === userId ? { ...user, userRole: newRole } : user
              ));
            } catch (error) {
              console.error('Error changing role:', error);
              console.error('Error details:', error.response?.data);
              
              const errorMessage = error.response?.data?.message || 
                                 error.response?.data?.title || 
                                 'Failed to change user role';
              Alert.alert('Error', errorMessage);
            }
          }
        }
      ]
    );
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'SuperAdmin':
        return '#EF4444';
      case 'Admin':
        return '#F59E0B';
      case 'TechSupport':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  // Access denied for non-SuperAdmin
  if (userRole !== 'SuperAdmin') {
    return (
      <ScreenLayout navigation={navigation}>
        <AdminSidebar
          navigation={navigation}
          visible={sidebarVisible}
          onClose={() => setSidebarVisible(false)}
          currentScreen="ChangeRoles"
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
          currentScreen="ChangeRoles"
        />
        <AdminHeader onMenuPress={() => setSidebarVisible(true)} />
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
        currentScreen="ChangeRoles"
      />
      <AdminHeader onMenuPress={() => setSidebarVisible(true)} />
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Change User Roles</Text>
            <Text style={styles.subtitle}>Manage user permissions and roles</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.statsValue}>{users.length}</Text>
          <Text style={styles.statsLabel}>Total Users</Text>
        </View>

        {/* Users List */}
        {users.map((user) => (
          <View key={user.id} style={styles.userCard}>
            {/* User Header */}
            <View style={styles.userHeader}>
              <View style={styles.userAvatar}>
                <Text style={styles.userAvatarText}>
                  {user.fullName?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.userName}>{user.fullName}</Text>
                <Text style={styles.userUsername}>@{user.userName}</Text>
              </View>
              <View
                style={[
                  styles.roleBadge,
                  { backgroundColor: getRoleBadgeColor(user.userRole) + '20' }
                ]}
              >
                <Text
                  style={[
                    styles.roleBadgeText,
                    { color: getRoleBadgeColor(user.userRole) }
                  ]}
                >
                  {user.userRole || 'User'}
                </Text>
              </View>
            </View>

            {/* User Details */}
            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Feather name="mail" size={16} color={colors.jet} />
                <Text style={styles.detailText}>{user.email}</Text>
              </View>
              <View style={styles.detailRow}>
                <Feather name="phone" size={16} color={colors.jet} />
                <Text style={styles.detailText}>{user.phoneNumber || 'N/A'}</Text>
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
            </View>

            {/* Role Change Section */}
            {user.userRole !== 'SuperAdmin' && (
              <View style={styles.roleChangeContainer}>
                <Text style={styles.roleChangeLabel}>Change Role:</Text>
                <View style={styles.roleButtonsContainer}>
                  {availableRoles.map((role) => (
                    <TouchableOpacity
                      key={role}
                      style={[
                        styles.roleButton,
                        user.userRole === role && styles.roleButtonActive,
                        { borderColor: getRoleBadgeColor(role) }
                      ]}
                      onPress={() => handleRoleChange(user.id, user.fullName, user.userRole, role)}
                    >
                      <Text
                        style={[
                          styles.roleButtonText,
                          user.userRole === role && { color: getRoleBadgeColor(role) }
                        ]}
                      >
                        {role}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* SuperAdmin Notice */}
            {user.userRole === 'SuperAdmin' && (
              <View style={styles.superAdminNotice}>
                <Feather name="shield" size={16} color="#EF4444" />
                <Text style={styles.superAdminText}>
                  SuperAdmin role cannot be changed
                </Text>
              </View>
            )}
          </View>
        ))}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  userCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.platinum,
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
  userUsername: {
    fontSize: 14,
    color: colors.jet,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '700',
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
  roleChangeContainer: {
    backgroundColor: colors.mainBeige,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  roleChangeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.mainBlack,
    marginBottom: 8,
  },
  roleButtonsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  roleButtonActive: {
    backgroundColor: colors.mainYellow + '10',
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.jet,
  },
  superAdminNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EF444420',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  superAdminText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
  },
});
