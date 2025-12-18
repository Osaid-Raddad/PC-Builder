import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  ScrollView,
  Image,
} from "react-native";
import {
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import colors from "../config/colors";

export default function Footer({ navigation }) {
  const currentYear = new Date().getFullYear();

  const handleNavigation = (screen) => {
    navigation.navigate(screen);
  };

  const handleExternalLink = (url) => {
    Linking.openURL(url);
  };

  const quickLinks = [
    { label: "PC Builder", screen: "Builder" },
    { label: "Comparator", screen: "Comparator" },
    { label: "Completed Builds", screen: "CompletedBuilds" },
    { label: "Community Posts", screen: "Posts" },
    { label: "Latest News", screen: "News" },
    { label: "Shops", screen: "Shops" },
  ];

  const supportLinks = [
    { label: "Tech Support", screen: "TechSupport" },
    { label: "FAQ", screen: "FAQ" },
    { label: "Building Guides", screen: "BuildingGuides" },
    { label: "Contact Us", screen: "Contact" },
    { label: "Terms of Service", screen: "TermsOfService" },
  ];

  const socialLinks = [
    {
      name: "facebook",
      icon: "facebook",
      url: "https://facebook.com",
    },
    {
      name: "twitter",
      icon: "twitter",
      url: "https://twitter.com",
    },
    {
      name: "instagram",
      icon: "instagram",
      url: "https://instagram.com",
    },
    {
      name: "linkedin",
      icon: "linkedin",
      url: "https://www.linkedin.com/in/omar-maher-khatib/",
    },
    {
      name: "github",
      icon: "github",
      url: "https://github.com/Omar-Maher-Khatib",
    },
  ];

  return (
    <View style={styles.footer}>
      <ScrollView style={styles.scrollContainer}>
        {/* About Section */}
        <View style={styles.section}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/LogoIcon.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.aboutText}>
            Build your dream PC with our comprehensive tools and expert
            guidance. Join thousands of builders worldwide.
          </Text>
        </View>

        {/* Quick Links Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Links</Text>
          <View style={styles.linksContainer}>
            {quickLinks.map((link, index) => (
              <TouchableOpacity
                key={index}
                style={styles.link}
                onPress={() => handleNavigation(link.screen)}
              >
                <Feather
                  name="chevron-right"
                  size={16}
                  color={colors.mainYellow}
                />
                <Text style={styles.linkText}>{link.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.linksContainer}>
            {supportLinks.map((link, index) => (
              <TouchableOpacity
                key={index}
                style={styles.link}
                onPress={() => handleNavigation(link.screen)}
              >
                <Feather
                  name="chevron-right"
                  size={16}
                  color={colors.mainYellow}
                />
                <Text style={styles.linkText}>{link.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <View style={styles.contactContainer}>
            <View style={styles.contactItem}>
              <Feather name="mail" size={18} color={colors.mainYellow} />
              <Text style={styles.contactText}>support@pcbuilder.com</Text>
            </View>
            <View style={styles.contactItem}>
              <Feather name="phone" size={18} color={colors.mainYellow} />
              <Text style={styles.contactText}>+972 52 275 8700</Text>
            </View>
            <View style={styles.contactItem}>
              <Feather name="map-pin" size={18} color={colors.mainYellow} />
              <View>
                <Text style={styles.contactText}>Rafidia St</Text>
                <Text style={styles.contactText}>Almajeen, Nablus</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Social Media Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Follow Us</Text>
          <View style={styles.socialContainer}>
            {socialLinks.map((social, index) => (
              <TouchableOpacity
                key={index}
                style={styles.socialIcon}
                onPress={() => handleExternalLink(social.url)}
              >
                <FontAwesome
                  name={social.icon}
                  size={28}
                  color={colors.mainYellow}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Copyright Section */}
        <View style={styles.copyrightContainer}>
          <Text style={styles.copyrightText}>
            © {currentYear} PC Builder. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: colors.mainBlack,
    paddingTop: 20,
  },
  scrollContainer: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  logoImage: {
    width: 100,
    height: 100,
  },
  aboutText: {
    color: colors.alabaster,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  sectionTitle: {
    color: colors.mainYellow,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  linksContainer: {
    gap: 8,
  },
  link: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  linkText: {
    color: colors.alabaster,
    fontSize: 14,
    marginLeft: 8,
  },
  contactContainer: {
    gap: 16,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  contactText: {
    color: colors.alabaster,
    fontSize: 14,
    lineHeight: 20,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
    marginTop: 8,
  },
  socialIcon: {
    padding: 8,
  },
  copyrightContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.jet,
    paddingVertical: 20,
    marginTop: 10,
    alignItems: "center",
  },
  copyrightText: {
    color: colors.platinum,
    fontSize: 12,
    textAlign: "center",
  },
});
