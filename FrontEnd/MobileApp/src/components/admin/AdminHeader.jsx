import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../../config/colors';

export default function AdminHeader({ onMenuPress }) {
  const [fullName, setFullName] = useState('Admin User');

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const name = await AsyncStorage.getItem('fullName');
      if (name) setFullName(name);
    } catch (error) {
      console.error('Error loading user info:', error);
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={onMenuPress}
        >
          <Feather name="menu" size={24} color={colors.mainBlack} />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Feather name="search" size={18} color={colors.jet} style={styles.searchIcon} />
          <Text style={styles.searchPlaceholder}>Search...</Text>
        </View>
      </View>
      
      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.notificationButton}>
          <Feather name="bell" size={20} color={colors.mainBlack} />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
        
        <View style={styles.profileAvatar}>
          <Text style={styles.profileAvatarText}>{fullName.charAt(0).toUpperCase()}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
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
    top: -4,
    right: -4,
    backgroundColor: colors.mainYellow,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.mainBeige,
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
});
