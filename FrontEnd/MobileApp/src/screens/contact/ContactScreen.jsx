import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import ScreenLayout from "../../components/ScreenLayout";
import colors from "../../config/colors";

export default function ContactScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    console.log("Contact form submitted:", { name, email, subject, message });
    // TODO: Implement form submission
  };

  return (
    <ScreenLayout navigation={navigation}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Contact Us</Text>
          <Text style={styles.subtitle}>We'd love to hear from you</Text>
        </View>

        <View style={styles.contactInfo}>
          <View style={styles.infoItem}>
            <Feather name="mail" size={20} color={colors.mainYellow} />
            <Text style={styles.infoText}>support@pcbuilder.com</Text>
          </View>
          <View style={styles.infoItem}>
            <Feather name="phone" size={20} color={colors.mainYellow} />
            <Text style={styles.infoText}>+972 52 275 8700</Text>
          </View>
          <View style={styles.infoItem}>
            <Feather name="map-pin" size={20} color={colors.mainYellow} />
            <Text style={styles.infoText}>Rafidia St, Almajeen, Nablus</Text>
          </View>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Your Name"
            placeholderTextColor={colors.platinum}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor={colors.platinum}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Subject"
            placeholderTextColor={colors.platinum}
            value={subject}
            onChangeText={setSubject}
          />
          <TextInput
            style={[styles.input, styles.messageInput]}
            placeholder="Your Message"
            placeholderTextColor={colors.platinum}
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Feather name="send" size={20} color={colors.mainBlack} />
            <Text style={styles.submitButtonText}>Send Message</Text>
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
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.mainBlack,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    marginTop: 8,
  },
  contactInfo: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  infoText: {
    fontSize: 16,
    color: colors.mainBlack,
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.mainBlack,
    borderWidth: 1,
    borderColor: colors.border,
  },
  messageInput: {
    minHeight: 120,
    paddingTop: 14,
  },
  submitButton: {
    flexDirection: "row",
    backgroundColor: colors.mainYellow,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.mainBlack,
  },
});
