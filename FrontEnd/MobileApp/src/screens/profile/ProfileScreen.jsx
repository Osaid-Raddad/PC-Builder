import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import ScreenLayout from "../../components/ScreenLayout";
import colors from "../../config/colors";

export default function ProfileScreen({ navigation }) {
  const stats = [
    { label: "Builds", value: "12" },
    { label: "Posts", value: "28" },
    { label: "Following", value: "145" },
  ];

  const menuItems = [
    { icon: "box", label: "My Builds", screen: "MyBuilds" },
    { icon: "heart", label: "Wishlist", screen: "Wishlist" },
    { icon: "bookmark", label: "Saved", screen: "Saved" },
    { icon: "settings", label: "Settings", screen: "Settings" },
    { icon: "help-circle", label: "Help & Support", screen: "TechSupport" },
    { icon: "file-text", label: "Terms of Service", screen: "TermsOfService" },
  ];

  return (
    <ScreenLayout navigation={navigation}>
      <View style={styles.container}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarLarge}>
            <Feather name="user" size={60} color={colors.mainYellow} />
          </View>
          <Text style={styles.userName}>John Doe</Text>
          <Text style={styles.userEmail}>john.doe@example.com</Text>

          <View style={styles.statsContainer}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.stat}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.editButton}>
            <Feather name="edit-2" size={18} color={colors.mainBlack} />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => navigation.navigate(item.screen)}
            >
              <View style={styles.menuIcon}>
                <Feather name={item.icon} size={22} color={colors.mainYellow} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Feather name="chevron-right" size={22} color={colors.platinum} />
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.logoutButton}>
            <Feather name="log-out" size={20} color={colors.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatarLarge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 4,
    borderColor: colors.mainYellow,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.mainBlack,
  },
  userEmail: {
    fontSize: 16,
    color: colors.text,
    marginTop: 4,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 24,
  },
  stat: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.mainYellow,
  },
  statLabel: {
    fontSize: 14,
    color: colors.text,
    marginTop: 4,
  },
  editButton: {
    flexDirection: "row",
    backgroundColor: colors.mainYellow,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    gap: 8,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.mainBlack,
  },
  menuSection: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    color: colors.mainBlack,
    fontWeight: "500",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.error,
  },
});
