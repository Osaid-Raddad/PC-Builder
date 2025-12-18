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
  Linking,
} from "react-native";
import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import colors from "../config/colors";

const { width } = Dimensions.get("window");

export default function Navbar({ navigation }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCommunityExpanded, setIsCommunityExpanded] = useState(false);
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
      hasSubmenu: true,
      submenu: [
        {
          label: "Posts",
          icon: "message-square",
          iconSet: "Feather",
          screen: "Posts",
        },
        {
          label: "News",
          icon: "newspaper",
          iconSet: "Ionicons",
          screen: "News",
        },
        {
          label: "Shops",
          icon: "shopping-bag",
          iconSet: "Feather",
          screen: "Shops",
        },
      ],
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

            {/* Notification Icon */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => handleNavigation("Notifications")}
            >
              <Feather name="bell" size={24} color={colors.alabaster} />
            </TouchableOpacity>

            {/* User Menu Icon */}
            {isLoggedIn && (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <Feather name="user" size={24} color={colors.alabaster} />
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
                <View key={index}>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => {
                      if (item.hasSubmenu) {
                        setIsCommunityExpanded(!isCommunityExpanded);
                      } else {
                        handleNavigation(item.screen);
                      }
                    }}
                  >
                    {renderIcon(item.icon, item.iconSet, 22, colors.mainYellow)}
                    <Text style={styles.menuItemText}>{item.label}</Text>
                    {item.hasSubmenu ? (
                      <Feather
                        name={isCommunityExpanded ? "chevron-down" : "chevron-right"}
                        size={20}
                        color={colors.platinum}
                      />
                    ) : (
                      <Feather
                        name="chevron-right"
                        size={20}
                        color={colors.platinum}
                      />
                    )}
                  </TouchableOpacity>
                  
                  {/* Community Submenu */}
                  {item.hasSubmenu && isCommunityExpanded && (
                    <View style={styles.submenuContainer}>
                      {item.submenu.map((subitem, subindex) => (
                        <TouchableOpacity
                          key={subindex}
                          style={styles.submenuItem}
                          onPress={() => handleNavigation(subitem.screen)}
                        >
                          {renderIcon(subitem.icon, subitem.iconSet, 20, colors.mainYellow)}
                          <Text style={styles.submenuItemText}>{subitem.label}</Text>
                          <Feather
                            name="chevron-right"
                            size={18}
                            color={colors.platinum}
                          />
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              ))}

              {/* Settings Section */}
              <View style={styles.settingsSection}>
                <Text style={styles.sectionTitle}>Settings</Text>
                
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleNavigation("Profile")}
                >
                  <Feather name="user" size={22} color={colors.mainYellow} />
                  <Text style={styles.menuItemText}>Profile</Text>
                  <Feather
                    name="chevron-right"
                    size={20}
                    color={colors.platinum}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleNavigation("AccountSettings")}
                >
                  <Feather name="settings" size={22} color={colors.mainYellow} />
                  <Text style={styles.menuItemText}>Account Settings</Text>
                  <Feather
                    name="chevron-right"
                    size={20}
                    color={colors.platinum}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleNavigation("Privacy")}
                >
                  <Feather name="lock" size={22} color={colors.mainYellow} />
                  <Text style={styles.menuItemText}>Privacy & Security</Text>
                  <Feather
                    name="chevron-right"
                    size={20}
                    color={colors.platinum}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleNavigation("Notifications")}
                >
                  <Feather name="bell" size={22} color={colors.mainYellow} />
                  <Text style={styles.menuItemText}>Notifications</Text>
                  <Feather
                    name="chevron-right"
                    size={20}
                    color={colors.platinum}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleNavigation("Language")}
                >
                  <Feather name="globe" size={22} color={colors.mainYellow} />
                  <Text style={styles.menuItemText}>Language & Region</Text>
                  <Feather
                    name="chevron-right"
                    size={20}
                    color={colors.platinum}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleNavigation("Appearance")}
                >
                  <Feather name="moon" size={22} color={colors.mainYellow} />
                  <Text style={styles.menuItemText}>Appearance</Text>
                  <Feather
                    name="chevron-right"
                    size={20}
                    color={colors.platinum}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleNavigation("DataUsage")}
                >
                  <Feather name="database" size={22} color={colors.mainYellow} />
                  <Text style={styles.menuItemText}>Data & Storage</Text>
                  <Feather
                    name="chevron-right"
                    size={20}
                    color={colors.platinum}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleNavigation("Help")}
                >
                  <Feather name="help-circle" size={22} color={colors.mainYellow} />
                  <Text style={styles.menuItemText}>Help & Support</Text>
                  <Feather
                    name="chevron-right"
                    size={20}
                    color={colors.platinum}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleNavigation("About")}
                >
                  <Feather name="info" size={22} color={colors.mainYellow} />
                  <Text style={styles.menuItemText}>About</Text>
                  <Feather
                    name="chevron-right"
                    size={20}
                    color={colors.platinum}
                  />
                </TouchableOpacity>
              </View>
              
              {/* Support Section from Footer */}
              <View style={styles.footerSection}>
                <Text style={styles.sectionTitle}>Support</Text>
                
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleNavigation("TechSupport")}
                >
                  <Feather name="headphones" size={22} color={colors.mainYellow} />
                  <Text style={styles.menuItemText}>Tech Support</Text>
                  <Feather name="chevron-right" size={20} color={colors.platinum} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleNavigation("FAQ")}
                >
                  <Feather name="help-circle" size={22} color={colors.mainYellow} />
                  <Text style={styles.menuItemText}>FAQ</Text>
                  <Feather name="chevron-right" size={20} color={colors.platinum} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleNavigation("BuildingGuides")}
                >
                  <Feather name="book-open" size={22} color={colors.mainYellow} />
                  <Text style={styles.menuItemText}>Building Guides</Text>
                  <Feather name="chevron-right" size={20} color={colors.platinum} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleNavigation("Contact")}
                >
                  <Feather name="mail" size={22} color={colors.mainYellow} />
                  <Text style={styles.menuItemText}>Contact Us</Text>
                  <Feather name="chevron-right" size={20} color={colors.platinum} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleNavigation("TermsOfService")}
                >
                  <Feather name="file-text" size={22} color={colors.mainYellow} />
                  <Text style={styles.menuItemText}>Terms of Service</Text>
                  <Feather name="chevron-right" size={20} color={colors.platinum} />
                </TouchableOpacity>
              </View>

              {/* Contact Information Section from Footer */}
              <View style={styles.footerSection}>
                <Text style={styles.sectionTitle}>Contact</Text>
                
                <View style={styles.contactInfoItem}>
                  <Feather name="mail" size={20} color={colors.mainYellow} />
                  <Text style={styles.contactInfoText}>support@pcbuilder.com</Text>
                </View>

                <View style={styles.contactInfoItem}>
                  <Feather name="phone" size={20} color={colors.mainYellow} />
                  <Text style={styles.contactInfoText}>+972 52 275 8700</Text>
                </View>

                <View style={styles.contactInfoItem}>
                  <Feather name="map-pin" size={20} color={colors.mainYellow} />
                  <View>
                    <Text style={styles.contactInfoText}>Rafidia St</Text>
                    <Text style={styles.contactInfoText}>Almajeen, Nablus</Text>
                  </View>
                </View>
              </View>

              {/* Social Links Section from Footer */}
              <View style={styles.footerSection}>
                <Text style={styles.sectionTitle}>Follow Us</Text>
                <View style={styles.socialLinksContainer}>
                  <TouchableOpacity
                    style={styles.socialIcon}
                    onPress={() => Linking.openURL("https://facebook.com")}
                  >
                    <Feather name="facebook" size={24} color={colors.mainYellow} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.socialIcon}
                    onPress={() => Linking.openURL("https://twitter.com")}
                  >
                    <Feather name="twitter" size={24} color={colors.mainYellow} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.socialIcon}
                    onPress={() => Linking.openURL("https://instagram.com")}
                  >
                    <Feather name="instagram" size={24} color={colors.mainYellow} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.socialIcon}
                    onPress={() => Linking.openURL("https://www.linkedin.com/in/omar-maher-khatib/")}
                  >
                    <Feather name="linkedin" size={24} color={colors.mainYellow} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.socialIcon}
                    onPress={() => Linking.openURL("https://github.com/Omar-Maher-Khatib")}
                  >
                    <Feather name="github" size={24} color={colors.mainYellow} />
                  </TouchableOpacity>
                </View>
              </View>
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
  submenuContainer: {
    backgroundColor: colors.jet,
    marginLeft: 20,
    marginRight: 10,
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 8,
    overflow: "hidden",
  },
  submenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.mainBlack,
  },
  submenuItemText: {
    color: colors.alabaster,
    fontSize: 15,
    fontWeight: "400",
    marginLeft: 12,
    flex: 1,
  },
  settingsSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: colors.jet,
  },
  sectionTitle: {
    color: colors.mainYellow,
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 8,
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
  footerSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: colors.jet,
  },
  contactInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 12,
  },
  contactInfoText: {
    color: colors.alabaster,
    fontSize: 14,
    marginLeft: 8,
  },
  socialLinksContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  socialIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.jet,
    justifyContent: "center",
    alignItems: "center",
  },
});
