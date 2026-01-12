import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import ScreenLayout from "../../components/ScreenLayout";
import colors from "../../config/colors";
import apiClient from "../../config/api";

export default function ContactScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Subject validation
    if (!subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (subject.trim().length < 3) {
      newErrors.subject = "Subject must be at least 3 characters";
    }

    // Message validation
    if (!message.trim()) {
      newErrors.message = "Message is required";
    } else if (message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiClient.post("/Public/Public/ContactUs", {
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
      });

      Alert.alert(
        "Success",
        "Your message has been sent successfully! We'll get back to you soon.",
        [
          {
            text: "OK",
            onPress: () => {
              // Clear form
              setName("");
              setEmail("");
              setSubject("");
              setMessage("");
              setErrors({});
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error submitting contact form:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Failed to send your message. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
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
            <Text style={styles.infoText}>support@pcbuilder.ps</Text>
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
          <View>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              placeholder="Your Name"
              placeholderTextColor={colors.platinum}
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) {
                  setErrors({ ...errors, name: null });
                }
              }}
            />
            {errors.name && (
              <Text style={styles.errorText}>{errors.name}</Text>
            )}
          </View>

          <View>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="Email Address"
              placeholderTextColor={colors.platinum}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) {
                  setErrors({ ...errors, email: null });
                }
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          <View>
            <TextInput
              style={[styles.input, errors.subject && styles.inputError]}
              placeholder="Subject"
              placeholderTextColor={colors.platinum}
              value={subject}
              onChangeText={(text) => {
                setSubject(text);
                if (errors.subject) {
                  setErrors({ ...errors, subject: null });
                }
              }}
            />
            {errors.subject && (
              <Text style={styles.errorText}>{errors.subject}</Text>
            )}
          </View>

          <View>
            <TextInput
              style={[
                styles.input,
                styles.messageInput,
                errors.message && styles.inputError,
              ]}
              placeholder="Your Message"
              placeholderTextColor={colors.platinum}
              value={message}
              onChangeText={(text) => {
                setMessage(text);
                if (errors.message) {
                  setErrors({ ...errors, message: null });
                }
              }}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
            {errors.message && (
              <Text style={styles.errorText}>{errors.message}</Text>
            )}
          </View>

          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.mainBlack} />
            ) : (
              <>
                <Feather name="send" size={20} color={colors.mainBlack} />
                <Text style={styles.submitButtonText}>Send Message</Text>
              </>
            )}
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
    backgroundColor: colors.mainBeige,
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
  inputError: {
    borderColor: "#ef4444",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
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
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.mainBlack,
  },
});
