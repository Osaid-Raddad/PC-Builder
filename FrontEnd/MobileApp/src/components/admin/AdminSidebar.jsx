import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../../config/colors';

export default function AdminSidebar({ navigation, visible, onClose, currentScreen = 'Dashboard' }) {
  const [userRole, setUserRole] = useState('');
  const [fullName, setFullName] = useState('Admin User');

  useEffect(() => {
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

  const allMenuItems = [
    { name: 'Overview', icon: 'grid', screen: 'Dashboard' },
    { name: 'Shop Requests', icon: 'shopping-bag', screen: 'ShopRequests' },
    { name: 'Tech Support', icon: 'life-buoy', screen: 'TechSupportRequests', superAdminOnly: true },
    { name: 'Change Roles', icon: 'shield', screen: 'ChangeRoles', superAdminOnly: true },
    { name: 'Posts', icon: 'file-text', screen: 'PostManagement' },
    { name: 'Users', icon: 'users', screen: 'UserManagement' },
    { name: 'Products', icon: 'package', screen: 'ProductManagement' },
  ];

  const menuItems = allMenuItems.filter(item => {
    if (item.superAdminOnly) {
      return userRole === 'SuperAdmin';
    }
    return true;
  });

  const handleNavigation = (item) => {
    onClose();
    
    if (item.screen === currentScreen) {
      return; // Already on this screen
    }

    const screenMap = {
      'Dashboard': 'Dashboard',
      'ShopRequests': 'ShopRequests',
      'TechSupportRequests': 'Dashboard',
      'ChangeRoles': 'Dashboard',
      'PostManagement': 'PostManagement',
      'UserManagement': 'UserManagement',
      'ProductManagement': 'ProductManagement'
    };
    
    const targetScreen = screenMap[item.screen];
    if (targetScreen === 'Dashboard' && item.screen !== 'Dashboard') {
      Alert.alert('Coming Soon', `${item.name} screen is under development`);
    } else {
      navigation.navigate(targetScreen);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.sidebar}>
          {/* Logo */}
          <View style={styles.sidebarHeader}>
            <Text style={styles.sidebarLogo}>PC Builder</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color={colors.mainYellow} />
            </TouchableOpacity>
          </View>

          {/* Navigation */}
          <ScrollView style={styles.sidebarNav}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.sidebarItem,
                  item.screen === currentScreen && styles.sidebarItemActive
                ]}
                onPress={() => handleNavigation(item)}
              >
                <Feather 
                  name={item.icon} 
                  size={20} 
                  color={item.screen === currentScreen ? colors.mainBlack : colors.mainBeige} 
                />
                <Text style={[
                  styles.sidebarItemText,
                  item.screen === currentScreen && styles.sidebarItemTextActive
                ]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Bottom Actions */}
          <View style={styles.sidebarBottom}>
            <TouchableOpacity
              style={styles.sidebarBottomItem}
              onPress={() => {
                onClose();
                navigation.navigate('Home');
              }}
            >
              <Feather name="home" size={20} color={colors.mainYellow} />
              <Text style={styles.sidebarBottomText}>Back to Home</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.sidebarBottomItem, { marginTop: 8 }]}
              onPress={() => {
                onClose();
                handleLogout();
              }}
            >
              <Feather name="log-out" size={20} color="#ef4444" />
              <Text style={[styles.sidebarBottomText, { color: '#ef4444' }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.modalBackdrop} 
          activeOpacity={1} 
          onPress={onClose}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  },
  sidebarItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.mainBeige,
  },
  sidebarItemTextActive: {
    color: colors.mainBlack,
  },
  sidebarBottom: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.mainYellow,
  },
  sidebarBottomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  sidebarBottomText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.mainYellow,
  },
});
