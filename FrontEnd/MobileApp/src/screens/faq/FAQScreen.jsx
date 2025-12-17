import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import ScreenLayout from "../../components/ScreenLayout";
import colors from "../../config/colors";

const FAQ_DATA = [
  {
    question: "How do I start building my PC?",
    answer:
      "Use our PC Builder tool to select compatible components step by step.",
  },
  {
    question: "Are all components compatible?",
    answer: "Our system automatically checks compatibility between components.",
  },
  {
    question: "Can I save my builds?",
    answer:
      "Yes! Create an account to save and share your builds with the community.",
  },
  {
    question: "How do I compare products?",
    answer: "Use the Comparator tool to view side-by-side specifications.",
  },
  {
    question: "Where can I buy components?",
    answer: "Check our Shops section for verified local retailers.",
  },
];

export default function FAQScreen({ navigation }) {
  const [expandedIndex, setExpandedIndex] = React.useState(null);

  return (
    <ScreenLayout navigation={navigation}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Frequently Asked Questions</Text>
          <Text style={styles.subtitle}>Find answers to common questions</Text>
        </View>

        <View style={styles.faqList}>
          {FAQ_DATA.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.faqItem}
              onPress={() =>
                setExpandedIndex(expandedIndex === index ? null : index)
              }
            >
              <View style={styles.faqQuestion}>
                <Text style={styles.questionText}>{item.question}</Text>
                <Feather
                  name={expandedIndex === index ? "chevron-up" : "chevron-down"}
                  size={24}
                  color={colors.mainYellow}
                />
              </View>
              {expandedIndex === index && (
                <Text style={styles.answerText}>{item.answer}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => navigation.navigate("Contact")}
        >
          <Feather name="mail" size={20} color={colors.mainBlack} />
          <Text style={styles.contactButtonText}>
            Still have questions? Contact Us
          </Text>
        </TouchableOpacity>
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
  faqList: {
    marginBottom: 24,
  },
  faqItem: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  faqQuestion: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  questionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: colors.mainBlack,
    marginRight: 12,
  },
  answerText: {
    fontSize: 14,
    color: colors.text,
    marginTop: 12,
    lineHeight: 20,
  },
  contactButton: {
    flexDirection: "row",
    backgroundColor: colors.mainYellow,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.mainBlack,
  },
});
