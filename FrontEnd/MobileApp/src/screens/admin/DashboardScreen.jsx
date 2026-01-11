import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenLayout from '../../components/ScreenLayout';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import colors from '../../config/colors';
import { apiClient } from '../../config/api';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [fullName, setFullName] = useState('Admin User');
  const [stats, setStats] = useState({
    pendingShops: 12,
    pendingSupport: 8,
    totalPosts: 145,
    totalUsers: 1250
  });

  // Chart data matching website structure
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Users',
        data: [650, 750, 890, 1020, 1150, 1250],
        borderColor: colors.mainYellow,
        backgroundColor: `${colors.mainYellow}40`,
        tension: 0.4,
        pointBackgroundColor: colors.mainYellow,
        pointBorderColor: colors.mainBlack,
        pointBorderWidth: 2,
      }
    ]
  };

  const barData = {
    labels: ['Shops', 'Tech Support', 'Posts', 'Users'],
    datasets: [
      {
        label: 'Activity',
        data: [45, 28, 89, 125],
        backgroundColor: [
          colors.mainYellow,
          colors.alabaster,
          colors.platinum,
          colors.jet
        ],
        borderColor: colors.mainBlack,
        borderWidth: 1,
      }
    ]
  };

  const recentActivities = [
    { action: 'New shop request from TechStore', time: '2 minutes ago', type: 'shop' },
    { action: 'Support ticket #1234 resolved', time: '15 minutes ago', type: 'support' },
    { action: 'New post published by User123', time: '1 hour ago', type: 'post' },
    { action: 'New user registration', time: '2 hours ago', type: 'user' },
  ];

  useEffect(() => {
    fetchDashboardData();
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const role = await AsyncStorage.getItem('userRole');
      const name = await AsyncStorage.getItem('fullName');
      if (role) setUserRole(role);
      if (name) setFullName(name);
    } catch (error) {
      console.error('Error loading user info:', error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // TODO: Implement actual API calls when backend endpoints are ready
      // const response = await apiClient.get('/Admin/Dashboard/stats');
      // setStats(response.data);
      
      // Simulating API call with same data structure as website
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.multiRemove(['authToken', 'fullName', 'userRole']);
            navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
          }
        }
      ]
    );
  };

  // Menu items matching website sidebar
  const allMenuItems = [
    { name: 'Overview', icon: 'bar-chart-2', screen: 'Dashboard' },
    { name: 'Shop Requests', icon: 'shopping-bag', screen: 'ShopRequests' },
    { name: 'Tech Support', icon: 'life-buoy', screen: 'TechSupportRequests', superAdminOnly: true },
    { name: 'Change Roles', icon: 'shield', screen: 'ChangeRoles', superAdminOnly: true },
    { name: 'Posts', icon: 'file-text', screen: 'PostManagement' },
    { name: 'Users', icon: 'users', screen: 'UserManagement' },
    { name: 'Products', icon: 'package', screen: 'ProductManagement' },
  ];

  // Filter menu items based on user role
  const menuItems = allMenuItems.filter(item => {
    if (item.superAdminOnly) {
      return userRole === 'SuperAdmin';
    }
    return true;
  });

  const StatsCard = ({ title, value, iconName, trend, trendValue }) => (
    <View style={[styles.statCard, { borderColor: colors.mainYellow }]}>
      <View style={styles.statCardContent}>
        <View style={{ flex: 1 }}>
          <Text style={styles.statTitle}>{title}</Text>
          <Text style={[styles.statValue, { color: colors.mainBlack }]}>{value}</Text>
          {trend && (
            <View style={styles.trendContainer}>
              <View
                style={[
                  styles.trendBadge,
                  {
                    backgroundColor:
                      trend === 'up' ? '#10b98120' : '#ef444420',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.trendText,
                    { color: trend === 'up' ? '#10b981' : '#ef4444' },
                  ]}
                >
                  {trend === 'up' ? '↑' : '↓'} {trendValue}%
                </Text>
              </View>
              <Text style={styles.trendLabel}>from last month</Text>
            </View>
          )}
        </View>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: colors.mainYellow },
          ]}
        >
          <Feather name={iconName} size={28} color={colors.mainBlack} />
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <ScreenLayout navigation={navigation}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.mainYellow} />
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
        currentScreen="Dashboard"
      />
      <AdminHeader onMenuPress={() => setSidebarVisible(true)} />
      <ScrollView style={styles.content}>
        {/* Page Title */}
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard Overview</Text>
          <Text style={styles.subtitle}>
            Welcome back! Here&apos;s what&apos;s happening today.
          </Text>
        </View>

        {/* Stats Grid - Matching website's 4-column layout */}
        <View style={styles.statsGrid}>
          <StatsCard
            title="Pending Shop Requests"
            value={stats.pendingShops}
            iconName="shopping-bag"
            trend="up"
            trendValue={12}
          />
          <StatsCard
            title="Pending Support Tickets"
            value={stats.pendingSupport}
            iconName="life-buoy"
            trend="down"
            trendValue={5}
          />
          <StatsCard
            title="Total Posts"
            value={stats.totalPosts}
            iconName="file-text"
            trend="up"
            trendValue={8}
          />
          <StatsCard
            title="Total Users"
            value={stats.totalUsers}
            iconName="users"
            trend="up"
            trendValue={15}
          />
        </View>

        {/* Charts Section - Matching website's 2-column grid */}
        <View style={styles.chartsGrid}>
          {/* User Growth Chart */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>User Growth</Text>
            <View style={styles.chartPlaceholder}>
              <Feather name="trending-up" size={48} color={colors.platinum} />
              <Text style={styles.chartPlaceholderText}>
                Line Chart: {chartData.labels.join(', ')}
              </Text>
              <Text style={styles.chartDataText}>
                Data: {chartData.datasets[0].data.join(', ')}
              </Text>
            </View>
          </View>

          {/* Platform Activity Chart */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Platform Activity</Text>
            <View style={styles.chartPlaceholder}>
              <Feather name="bar-chart-2" size={48} color={colors.platinum} />
              <Text style={styles.chartPlaceholderText}>
                Bar Chart: {barData.labels.join(', ')}
              </Text>
              <Text style={styles.chartDataText}>
                Data: {barData.datasets[0].data.join(', ')}
              </Text>
            </View>
          </View>
        </View>

        {/* Recent Activity - Matching website's activity feed */}
        <View style={styles.activityCard}>
          <Text style={styles.activityTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            {recentActivities.map((activity, index) => (
              <View key={index} style={styles.activityItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.activityAction}>{activity.action}</Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
                <View
                  style={[
                    styles.activityBadge,
                    { backgroundColor: colors.mainYellow },
                  ]}
                >
                  <Text style={styles.activityType}>{activity.type}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: colors.mainBeige,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
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
  statsGrid: {
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 16,
  },
  chartsGrid: {
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.jet,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trendBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '700',
  },
  trendLabel: {
    fontSize: 11,
    color: colors.jet,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: colors.mainYellow,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.mainBlack,
    marginBottom: 16,
  },
  chartPlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.alabaster,
    borderRadius: 8,
  },
  chartPlaceholderText: {
    marginTop: 12,
    fontSize: 13,
    color: colors.jet,
    textAlign: 'center',
  },
  chartDataText: {
    marginTop: 8,
    fontSize: 11,
    color: colors.jet,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  activityCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: colors.mainYellow,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.mainBlack,
    marginBottom: 16,
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: colors.mainBeige,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.platinum,
  },
  activityAction: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.mainBlack,
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: colors.jet,
  },
  activityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activityType: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.mainBlack,
  },
  // Dashboard Header Styles
  dashboardHeader: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: colors.mainBeige,
    borderBottomWidth: 2,
    borderBottomColor: colors.mainYellow,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  // Page Title Styles
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    maxWidth: '70%',
  },
  menuButton: {
    backgroundColor: colors.mainYellow,
    padding: 8,
    borderRadius: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 2,
    borderColor: colors.platinum,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchPlaceholder: {
    color: colors.jet,
    fontSize: 14,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationButton: {
    position: 'relative',
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.mainYellow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.mainBlack,
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.mainYellow,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  profileAvatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.mainBlack,
  },
  // Sidebar Styles
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    width: 280,
    height: '100%',
    backgroundColor: colors.mainBlack,
    borderRightWidth: 2,
    borderRightColor: colors.mainYellow,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    paddingTop: 60,
  },
  sidebarHeader: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.mainYellow,
  },
  sidebarLogo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.mainYellow,
  },
  sidebarNav: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 24,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    gap: 12,
  },
  sidebarItemActive: {
    backgroundColor: colors.mainYellow,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  sidebarItemText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.mainBeige,
  },
  sidebarItemTextActive: {
    color: colors.mainBlack,
    fontWeight: '600',
  },
  sidebarBottom: {
    paddingHorizontal: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: colors.mainYellow,
    paddingTop: 16,
  },
  sidebarBottomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 12,
  },
  sidebarBottomText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.mainYellow,
  },
});
