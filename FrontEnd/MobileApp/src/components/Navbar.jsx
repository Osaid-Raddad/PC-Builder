import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Modal,
  Dimensions,
  Image,
} from "react-native";
import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import colors from "../config/colors";

const { width } = Dimensions.get("window");

export default function Navbar({ navigation }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // TODO: Replace with actual auth state
  const [userName, setUserName] = useState("John Doe"); // TODO: Get from auth context

  const menuItems = [
    {
      label: "Builder",
      icon: "hammer",
      iconSet: "Ionicons",
      screen: "Builder",
    },
    {
      label: "Products",
      icon: "package",
      iconSet: "Feather",
      screen: "Products",
    },
    {
      label: "Compare",
      icon: "bar-chart",
      iconSet: "Feather",
      screen: "Comparator",
    },
    {
      label: "Builds",
      icon: "monitor",
      iconSet: "Feather",
      screen: "CompletedBuilds",
    },
    {
      label: "Community",
      icon: "users",
      iconSet: "Feather",
      screen: "Posts",
    },
    {
      label: "Chat",
      icon: "message-circle",
      iconSet: "Feather",
      screen: "Chat",
    },
  ];

  const handleNavigation = (screen) => {
    setIsMenuOpen(false);
    navigation.navigate(screen);
  };

  const renderIcon = (
    iconName,
    iconSet,
    size = 24,
    color = colors.alabaster
  ) => {
    if (iconSet === "Feather") {
      return <Feather name={iconName} size={size} color={color} />;
    } else if (iconSet === "Ionicons") {
      return <Ionicons name={iconName} size={size} color={color} />;
    }
    return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.mainBlack} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.navbar}>
          {/* Logo */}
          <TouchableOpacity
            style={styles.logoContainer}
            onPress={() => handleNavigation("Home")}
          >
            <Image
              source={require("../../assets/LogoIcon.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.logoText}>PC Builder</Text>
          </TouchableOpacity>

          {/* Right Side Icons */}
          <View style={styles.rightIcons}>
            {/* Search Icon */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => handleNavigation("Search")}
            >
              <Feather name="search" size={24} color={colors.alabaster} />
            </TouchableOpacity>

            {/* User Menu Icon */}
            {isLoggedIn ? (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <Feather name="user" size={24} color={colors.alabaster} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => handleNavigation("Login")}
              >
                <Text style={styles.loginText}>Login</Text>
              </TouchableOpacity>
            )}

            {/* Menu Icon */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Feather
                name={isMenuOpen ? "x" : "menu"}
                size={24}
                color={colors.alabaster}
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Mobile Menu Modal */}
      <Modal
        visible={isMenuOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsMenuOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.menuContainer}>
            {/* Menu Header */}
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Menu</Text>
              <TouchableOpacity onPress={() => setIsMenuOpen(false)}>
                <Feather name="x" size={28} color={colors.alabaster} />
              </TouchableOpacity>
            </View>

            {/* Menu Items */}
            <ScrollView style={styles.menuItems}>
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.menuItem}
                  onPress={() => handleNavigation(item.screen)}
                >
                  {renderIcon(item.icon, item.iconSet, 22, colors.mainYellow)}
                  <Text style={styles.menuItemText}>{item.label}</Text>
                  <Feather
                    name="chevron-right"
                    size={20}
                    color={colors.platinum}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* User Menu Modal */}
      <Modal
        visible={isUserMenuOpen}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsUserMenuOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsUserMenuOpen(false)}
        >
          <View style={styles.userMenuContainer}>
            <View style={styles.userInfo}>
              <Feather name="user" size={40} color={colors.mainYellow} />
              <Text style={styles.userName}>{userName}</Text>
            </View>

            <TouchableOpacity
              style={styles.userMenuItem}
              onPress={() => {
                setIsUserMenuOpen(false);
                handleNavigation("Profile");
              }}
            >
              <Feather name="user" size={20} color={colors.alabaster} />
              <Text style={styles.userMenuItemText}>Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.userMenuItem}
              onPress={() => {
                setIsUserMenuOpen(false);
                handleNavigation("MyBuilds");
              }}
            >
              <Feather name="box" size={20} color={colors.alabaster} />
              <Text style={styles.userMenuItemText}>My Builds</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.userMenuItem}
              onPress={() => {
                setIsUserMenuOpen(false);
                handleNavigation("Wishlist");
              }}
            >
              <Feather name="heart" size={20} color={colors.alabaster} />
              <Text style={styles.userMenuItemText}>Wishlist</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.userMenuItem, styles.logoutItem]}
              onPress={() => {
                setIsUserMenuOpen(false);
                setIsLoggedIn(false);
              }}
            >
              <Feather name="log-out" size={20} color={colors.error} />
              <Text style={[styles.userMenuItemText, styles.logoutText]}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.mainBlack,
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.mainBlack,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoImage: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  logoText: {
    color: colors.mainYellow,
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 8,
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  loginButton: {
    backgroundColor: colors.mainYellow,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 8,
  },
  loginText: {
    color: colors.mainBlack,
    fontWeight: "600",
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  menuContainer: {
    backgroundColor: colors.mainBlack,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    paddingBottom: 20,
  },
  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.jet,
  },
  menuTitle: {
    color: colors.mainYellow,
    fontSize: 24,
    fontWeight: "bold",
  },
  menuItems: {
    padding: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.jet,
  },
  menuItemText: {
    color: colors.alabaster,
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 16,
    flex: 1,
  },
  userMenuContainer: {
    backgroundColor: colors.mainBlack,
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 100,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  userInfo: {
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.jet,
  },
  userName: {
    color: colors.alabaster,
    fontSize: 18,
    fontWeight: "600",
    marginTop: 12,
  },
  userMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.jet,
  },
  userMenuItemText: {
    color: colors.alabaster,
    fontSize: 16,
    marginLeft: 16,
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: colors.error,
  },
});
