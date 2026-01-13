import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import ScreenLayout from '../../components/ScreenLayout';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import colors from '../../config/colors';

export default function ProductManagementScreen({ navigation }) {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <ScreenLayout navigation={navigation}>
      <AdminSidebar
        navigation={navigation}
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        currentScreen="ProductManagement"
      />
      <AdminHeader onMenuPress={() => setSidebarVisible(true)} />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Feather name="package" size={80} color={colors.mainYellow} />
          <Text style={styles.title}>Product Management</Text>
          <Text style={styles.subtitle}>
            Product management features coming soon...
          </Text>
          <Text style={styles.description}>
            This section will allow you to manage product listings, categories, and inventory across all shops.
          </Text>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.mainBeige,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.mainBlack,
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.jet,
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: colors.jet,
    textAlign: 'center',
    lineHeight: 20,
  },
});
