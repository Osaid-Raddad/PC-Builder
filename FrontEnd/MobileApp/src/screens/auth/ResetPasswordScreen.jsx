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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import axios from "axios";
import colors from "../../config/colors";
import { API_BASE_URL } from "../../config/api";

export default function ResetPasswordScreen({ navigation, route }) {
  const email = route.params?.email;
  const [formData, setFormData] = useState({
    code: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return hasUpperCase && hasLowerCase && hasNumber && hasSymbol;
  };

  const validateForm = () => {
    const newErrors = {};

    // Verification code validation
    if (!formData.code.trim()) {
      newErrors.code = "Verification code is required";
    } else if (!/^[0-9]{4}$/.test(formData.code)) {
      newErrors.code = "Code must be exactly 4 digits";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 9) {
      newErrors.password = "Password must be at least 9 characters";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one lowercase letter";
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one symbol (!@#$%^&*...)";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert(
        "Email Missing",
        "Email is missing. Please restart the password reset process.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("ForgotPassword"),
          },
        ]
      );
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await axios.patch(
        `${API_BASE_URL}/Identity/Account/Reset-Password`,
        {
          email: email,
          Code: formData.code.trim(),
          newPassword: formData.password,
        }
      );

      Alert.alert(
        "Success",
        "Password reset successfully!",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login"),
          },
        ]
      );
    } catch (error) {
      console.error("Reset password error:", error);
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

      // Show specific error messages
      if (errorMessage) {
        Alert.alert("Error", errorMessage);
      } else if (status === 400) {
        Alert.alert(
          "Invalid Request",
          "Invalid verification code or password. Please try again."
        );
      } else {
        Alert.alert("Error", "Failed to reset password. Please try again.");
      }

      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Feather name="arrow-left" size={24} color={colors.mainBlack} />
          <Text style={styles.backText}>Back to Sign In</Text>
        </TouchableOpacity>

      {/* Icon */}
      <View style={styles.iconContainer}>
        <View style={styles.iconCircle}>
          <Feather name="shield" size={40} color={colors.mainYellow} />
        </View>
      </View>

      {/* Title and Description */}
      <View style={styles.header}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Enter the verification code sent to {email || "your email"} and create
          a new password.
        </Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        {/* Verification Code */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Verification Code</Text>
          <TextInput
            style={[styles.input, errors.code && styles.inputError]}
            placeholder="Enter 4-digit code"
            placeholderTextColor={colors.platinum}
            value={formData.code}
            onChangeText={(text) => handleInputChange("code", text)}
            keyboardType="number-pad"
            maxLength={4}
            editable={!isLoading}
          />
          {errors.code && <Text style={styles.errorText}>{errors.code}</Text>}
        </View>

        {/* New Password */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>New Password</Text>
          <View style={styles.passwordContainer}>
            <Feather
              name="lock"
              size={20}
              color={colors.mainYellow}
              style={styles.inputIcon}
            />
            <TextInput
              style={[
                styles.passwordInput,
                errors.password && styles.inputError,
              ]}
              placeholder="Create new password (min 9 chars, uppercase, symbol)"
              placeholderTextColor={colors.platinum}
              value={formData.password}
              onChangeText={(text) => handleInputChange("password", text)}
              secureTextEntry={!showPassword}
              editable={!isLoading}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Feather
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color={colors.text}
              />
            </TouchableOpacity>
          </View>
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
        </View>

        {/* Confirm Password */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.passwordContainer}>
            <Feather
              name="lock"
              size={20}
              color={colors.mainYellow}
              style={styles.inputIcon}
            />
            <TextInput
              style={[
                styles.passwordInput,
                errors.confirmPassword && styles.inputError,
              ]}
              placeholder="Confirm new password"
              placeholderTextColor={colors.platinum}
              value={formData.confirmPassword}
              onChangeText={(text) => handleInputChange("confirmPassword", text)}
              secureTextEntry={!showConfirmPassword}
              editable={!isLoading}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Feather
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={20}
                color={colors.text}
              />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          )}
        </View>
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
          <Text style={styles.submitButtonText}>Reset Password</Text>
        )}
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Didn't receive the code? </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("ForgotPassword")}
          disabled={isLoading}
        >
          <Text style={styles.footerLink}>Resend Code</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </KeyboardAvoidingView>
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
    paddingBottom: 40,
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
    gap: 20,
    marginBottom: 24,
  },
  inputWrapper: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.mainBlack,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: colors.mainBlack,
    borderWidth: 1,
    borderColor: colors.border,
  },
  passwordContainer: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: 16,
    zIndex: 1,
  },
  passwordInput: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    paddingLeft: 48,
    paddingRight: 48,
    paddingVertical: 16,
    fontSize: 16,
    color: colors.mainBlack,
    borderWidth: 1,
    borderColor: colors.border,
  },
  eyeButton: {
    position: "absolute",
    right: 16,
    padding: 4,
  },
  inputError: {
    borderColor: "#ef4444",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
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
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: colors.text,
  },
  footerLink: {
    fontSize: 14,
    color: colors.mainYellow,
    fontWeight: "600",
  },
});
