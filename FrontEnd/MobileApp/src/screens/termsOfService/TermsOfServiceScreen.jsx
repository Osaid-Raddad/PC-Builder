import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import ScreenLayout from "../../components/ScreenLayout";
import colors from "../../config/colors";

export default function TermsOfServiceScreen({ navigation }) {
  return (
    <ScreenLayout navigation={navigation}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Terms of Service</Text>
        <Text style={styles.lastUpdated}>Last updated: December 17, 2025</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.text}>
            By accessing and using PC Builder mobile application, you accept and
            agree to be bound by the terms and provision of this agreement.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Use License</Text>
          <Text style={styles.text}>
            Permission is granted to temporarily download one copy of the
            materials on PC Builder's mobile application for personal,
            non-commercial transitory viewing only.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. User Account</Text>
          <Text style={styles.text}>
            You are responsible for maintaining the confidentiality of your
            account and password. You agree to accept responsibility for all
            activities that occur under your account.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Content</Text>
          <Text style={styles.text}>
            Users may post, upload, and share content. You retain all rights to
            your content. By posting content, you grant us the right to use,
            modify, and display your content within the application.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Prohibited Uses</Text>
          <Text style={styles.text}>
            You may not use PC Builder for any illegal or unauthorized purpose.
            You must not transmit any worms or viruses or any code of a
            destructive nature.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Disclaimer</Text>
          <Text style={styles.text}>
            The materials on PC Builder's mobile application are provided on an
            'as is' basis. PC Builder makes no warranties, expressed or implied,
            and hereby disclaims and negates all other warranties.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Limitations</Text>
          <Text style={styles.text}>
            In no event shall PC Builder or its suppliers be liable for any
            damages arising out of the use or inability to use the materials on
            PC Builder's application.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Privacy Policy</Text>
          <Text style={styles.text}>
            Your use of PC Builder is also governed by our Privacy Policy.
            Please review our Privacy Policy, which also governs the application
            and informs users of our data collection practices.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Changes to Terms</Text>
          <Text style={styles.text}>
            PC Builder reserves the right to revise these terms of service at
            any time without notice. By using this application you are agreeing
            to be bound by the then current version of these terms of service.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Contact Information</Text>
          <Text style={styles.text}>
            If you have any questions about these Terms, please contact us at
            support@pcbuilder.com or call +972 52 275 8700.
          </Text>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.mainBlack,
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.mainBlack,
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
  },
});
