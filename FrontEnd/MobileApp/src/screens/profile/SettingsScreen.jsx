import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import ScreenLayout from "../../components/ScreenLayout";
import colors from "../../config/colors";

export default function SettingsScreen({ navigation }) {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => navigation.replace("Login"),
        },
      ]
    );
  };

  const SettingSection = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const SettingItem = ({ icon, title, subtitle, onPress, rightComponent }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} disabled={!onPress}>
      <View style={styles.itemLeft}>
        <View style={styles.iconContainer}>
          <Feather name={icon} size={20} color={colors.mainYellow} />
        </View>
        <View style={styles.itemText}>
          <Text style={styles.itemTitle}>{title}</Text>
          {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent || (
        onPress && <Feather name="chevron-right" size={20} color={colors.text} />
      )}
    </TouchableOpacity>
  );

  const ToggleItem = ({ icon, title, subtitle, value, onValueChange }) => (
    <View style={styles.settingItem}>
      <View style={styles.itemLeft}>
        <View style={styles.iconContainer}>
          <Feather name={icon} size={20} color={colors.mainYellow} />
        </View>
        <View style={styles.itemText}>
          <Text style={styles.itemTitle}>{title}</Text>
          {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#d1d5db', true: colors.mainYellow }}
        thumbColor="white"
      />
    </View>
  );

  return (
    <ScreenLayout navigation={navigation} scrollable={false}>
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color={colors.mainBlack} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.subtitle}>Manage your app preferences</Text>
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <SettingSection title="Account">
            <SettingItem
              icon="user"
              title="Edit Profile"
              subtitle="Update your personal information"
              onPress={() => Alert.alert("Edit Profile", "This feature is coming soon!")}
            />
            <SettingItem
              icon="lock"
              title="Change Password"
              subtitle="Update your password"
              onPress={() => Alert.alert("Change Password", "This feature is coming soon!")}
            />
            <SettingItem
              icon="shield"
              title="Privacy Settings"
              subtitle="Control your privacy preferences"
              onPress={() => Alert.alert("Privacy", "This feature is coming soon!")}
            />
          </SettingSection>

          <SettingSection title="Notifications">
            <ToggleItem
              icon="bell"
              title="Push Notifications"
              subtitle="Receive push notifications"
              value={pushNotifications}
              onValueChange={setPushNotifications}
            />
            <ToggleItem
              icon="mail"
              title="Email Notifications"
              subtitle="Receive email updates"
              value={emailNotifications}
              onValueChange={setEmailNotifications}
            />
            <ToggleItem
              icon="tag"
              title="Price Alerts"
              subtitle="Get notified when prices drop"
              value={priceAlerts}
              onValueChange={setPriceAlerts}
            />
          </SettingSection>

          <SettingSection title="Appearance">
            <ToggleItem
              icon="moon"
              title="Dark Mode"
              subtitle="Coming soon"
              value={darkMode}
              onValueChange={setDarkMode}
            />
          </SettingSection>

          <SettingSection title="Support">
            <SettingItem
              icon="help-circle"
              title="Help & Support"
              onPress={() => navigation.navigate("TechSupport")}
            />
            <SettingItem
              icon="file-text"
              title="Terms of Service"
              onPress={() => navigation.navigate("TermsOfService")}
            />
            <SettingItem
              icon="message-circle"
              title="FAQ"
              onPress={() => navigation.navigate("FAQ")}
            />
          </SettingSection>

          <SettingSection title="About">
            <SettingItem
              icon="info"
              title="App Version"
              rightComponent={
                <Text style={styles.versionText}>1.0.0</Text>
              }
            />
            <SettingItem
              icon="smartphone"
              title="Build Number"
              rightComponent={
                <Text style={styles.versionText}>2024.01</Text>
              }
            />
          </SettingSection>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialCommunityIcons name="logout" size={20} color="white" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>PC Builder © 2025</Text>
            <Text style={styles.footerSubtext}>Made with ❤️ for PC Enthusiasts</Text>
          </View>
        </ScrollView>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.mainBeige,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.mainBlack,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    marginTop: 8,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.mainYellow + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.mainBlack,
  },
  itemSubtitle: {
    fontSize: 13,
    color: colors.text,
    marginTop: 2,
  },
  versionText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef4444',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  footerSubtext: {
    fontSize: 12,
    color: colors.text,
    marginTop: 4,
  },
});
