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
import axios from "axios";
import colors from "../../config/colors";
import { API_BASE_URL } from "../../config/api";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    // Validation
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Invalid email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await axios.post(
        `${API_BASE_URL}/Identity/Account/Forgot-Password`,
        {
          email: email.trim(),
        }
      );

      Alert.alert(
        "Success",
        "Verification code sent to your email!",
        [
          {
            text: "OK",
            onPress: () => {
              // Navigate to reset password screen with email
              navigation.navigate("ResetPassword", { email: email.trim() });
            },
          },
        ]
      );
    } catch (error) {
      console.error("Forgot password error:", error);
      console.error("Error response:", error.response);

      // Handle network errors
      if (!error.response) {
        Alert.alert(
          "Connection Error",
          "Unable to connect to the server. Please check your internet connection."
        );
        setIsLoading(false);
        return;
      }

      const errorData = error.response?.data;
      const status = error.response?.status;

      // Handle the backend response - can be a string or object
      let errorMessage = "";
      if (typeof errorData === "string") {
        errorMessage = errorData;
      } else if (errorData) {
        errorMessage =
          errorData.message || errorData.error || errorData.title || "";
      }

      console.log("Error status:", status);
      console.log("Error message:", errorMessage);
      console.log("Error data:", errorData);

      // Handle 400 error specifically for "This email is not signed up yet."
      if (
        status === 400 &&
        errorMessage.includes("This email is not signed up yet")
      ) {
        Alert.alert(
          "Email Not Found",
          "This email is not signed up yet. Please create an account first."
        );
      } else if (errorMessage) {
        Alert.alert("Error", errorMessage);
      } else {
        Alert.alert(
          "Error",
          "Failed to send verification code. Please try again."
        );
      }

      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Feather name="arrow-left" size={24} color={colors.mainBlack} />
        <Text style={styles.backText}>Back to Sign In</Text>
      </TouchableOpacity>

      {/* Icon */}
      <View style={styles.iconContainer}>
        <View style={styles.iconCircle}>
          <Feather name="mail" size={40} color={colors.mainYellow} />
        </View>
      </View>

      {/* Title and Description */}
      <View style={styles.header}>
        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.subtitle}>
          Enter your email address and we'll send you a verification code to
          reset your password.
        </Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.label}>Email Address</Text>
        <View style={styles.inputContainer}>
          <Feather
            name="mail"
            size={20}
            color={colors.mainYellow}
            style={styles.inputIcon}
          />
          <TextInput
            style={[styles.input, error && styles.inputError]}
            placeholder="Enter your email"
            placeholderTextColor={colors.platinum}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (error) setError("");
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={colors.mainBlack} />
        ) : (
          <Text style={styles.submitButtonText}>Send Verification Code</Text>
        )}
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Remember your password? </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          disabled={isLoading}
        >
          <Text style={styles.footerLink}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.mainBeige,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 40,
  },
  backText: {
    fontSize: 16,
    color: colors.mainBlack,
    fontWeight: "500",
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${colors.mainYellow}20`,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.mainBlack,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  form: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.mainBlack,
    marginBottom: 8,
  },
  inputContainer: {
    position: "relative",
  },
  inputIcon: {
    position: "absolute",
    left: 16,
    top: 16,
    zIndex: 1,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingLeft: 48,
    paddingRight: 16,
    paddingVertical: 16,
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
  submitButton: {
    backgroundColor: colors.mainYellow,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.mainBlack,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 16,
    color: colors.text,
  },
  footerLink: {
    fontSize: 16,
    color: colors.mainYellow,
    fontWeight: "600",
  },
});
