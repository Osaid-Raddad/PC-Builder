import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import colors from "../config/colors";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ScreenLayout({
  children,
  navigation,
  showFooter = true,
  scrollable = true,
}) {
  const content = scrollable ? (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
    >
      {children}
      {showFooter && <Footer navigation={navigation} />}
    </ScrollView>
  ) : (
    <View style={styles.container}>
      {children}
      {showFooter && <Footer navigation={navigation} />}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Navbar navigation={navigation} />
      {content}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
