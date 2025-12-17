import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import ScreenLayout from "../../components/ScreenLayout";
import colors from "../../config/colors";

export default function TechSupportScreen({ navigation }) {
  const supportOptions = [
    {
      icon: "message-circle",
      title: "Live Chat",
      description: "Chat with our support team",
      color: colors.primary,
    },
    {
      icon: "mail",
      title: "Email Support",
      description: "Send us an email",
      color: colors.secondary,
    },
    {
      icon: "phone",
      title: "Phone Support",
      description: "Call us directly",
      color: colors.accent,
    },
    {
      icon: "calendar",
      title: "Book Appointment",
      description: "Schedule a tech consultation",
      color: colors.success,
    },
  ];

  return (
    <ScreenLayout navigation={navigation}>
      <View style={styles.container}>
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="face-agent"
            size={60}
            color={colors.mainYellow}
          />
          <Text style={styles.title}>Tech Support</Text>
          <Text style={styles.subtitle}>
            We're here to help you build your dream PC
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          {supportOptions.map((option, index) => (
            <TouchableOpacity key={index} style={styles.optionCard}>
              <View
                style={[
                  styles.optionIcon,
                  { backgroundColor: option.color + "20" },
                ]}
              >
                <Feather name={option.icon} size={32} color={option.color} />
              </View>
              <Text style={styles.optionTitle}>{option.title}</Text>
              <Text style={styles.optionDescription}>{option.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Support Hours</Text>
          <Text style={styles.infoText}>
            Monday - Friday: 9:00 AM - 6:00 PM
          </Text>
          <Text style={styles.infoText}>Saturday: 10:00 AM - 4:00 PM</Text>
          <Text style={styles.infoText}>Sunday: Closed</Text>
        </View>
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
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.mainBlack,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  optionCard: {
    width: "48%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  optionIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.mainBlack,
    marginBottom: 8,
    textAlign: "center",
  },
  optionDescription: {
    fontSize: 12,
    color: colors.text,
    textAlign: "center",
    lineHeight: 18,
  },
  infoCard: {
    backgroundColor: colors.mainBlack,
    borderRadius: 12,
    padding: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.mainYellow,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: colors.alabaster,
    marginBottom: 8,
    lineHeight: 20,
  },
});
