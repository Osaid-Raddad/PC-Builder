import React, { useState, useEffect, useRef } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text,
  Modal,
  TextInput,
  Animated,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ScreenLayout({
  children,
  navigation,
  showFooter = false,
  scrollable = true,
}) {
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const indicatorPosition = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get('window').width;
  
  const quickMenuItems = [
    { name: "Home", icon: "home", screen: "Home" },
    { name: "Builder", icon: "hammer-wrench", screen: "Builder" },
    { name: "News", icon: "newspaper", screen: "News" },
    { name: "Posts", icon: "post", screen: "Posts" },
    { name: "Profile", icon: "account", screen: "Profile" },
  ];

  const handleQuickMenuPress = (targetScreen) => {
    const currentRoute = navigation.getState().routes[navigation.getState().index].name;
    const currentIndex = quickMenuItems.findIndex(item => item.screen === currentRoute);
    const targetIndex = quickMenuItems.findIndex(item => item.screen === targetScreen);
    
    // Determine animation direction
    const gestureDirection = targetIndex > currentIndex ? 'horizontal' : 'horizontal-inverted';
    
    navigation.navigate(targetScreen, {
      animation: gestureDirection
    });
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      // Here you would typically send the message to your AI service
      console.log("Sending message:", chatMessage);
      // Clear the input
      setChatMessage("");
      // You can add message handling logic here
    }
  };

  const openMainChat = () => {
    setChatModalVisible(false);
    navigation.navigate("Chat");
  };

  const getCurrentRoute = () => {
    return navigation.getState().routes[navigation.getState().index].name;
  };

  const getActiveIndex = () => {
    const currentRoute = getCurrentRoute();
    return quickMenuItems.findIndex(item => item.screen === currentRoute);
  };

  useEffect(() => {
    const activeIndex = getActiveIndex();
    const itemWidth = screenWidth / quickMenuItems.length;
    const targetPosition = activeIndex * itemWidth;
    
    Animated.spring(indicatorPosition, {
      toValue: targetPosition,
      useNativeDriver: true,
      friction: 8,
      tension: 80,
    }).start();
  }, [navigation.getState().index]);

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
      
      {/* AI Chat Button */}
      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => setChatModalVisible(true)}
      >
        <MaterialCommunityIcons
          name="robot"
          size={32}
          color="white"
        />
      </TouchableOpacity>

      {/* Chat Modal */}
      <Modal
        visible={chatModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setChatModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setChatModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.chatModal}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.chatHeader}>
              <View style={styles.chatHeaderLeft}>
                <MaterialCommunityIcons
                  name="robot"
                  size={24}
                  color={colors.mainYellow}
                />
                <Text style={styles.chatHeaderTitle}>AI Assistant</Text>
              </View>
              <TouchableOpacity onPress={() => setChatModalVisible(false)}>
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={colors.platinum}
                />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.chatMessages}>
              <View style={styles.welcomeMessage}>
                <Text style={styles.welcomeText}>
                  👋 Hi! I'm your PC Builder AI assistant. Ask me anything about PC components, compatibility, or building tips!
                </Text>
              </View>
            </ScrollView>

            <View style={styles.chatInputContainer}>
              <TextInput
                style={styles.chatInput}
                placeholder="Ask me anything..."
                placeholderTextColor={colors.platinum}
                value={chatMessage}
                onChangeText={setChatMessage}
                multiline
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSendMessage}
              >
                <MaterialCommunityIcons
                  name="send"
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.fullChatButton}
              onPress={openMainChat}
            >
              <MaterialCommunityIcons
                name="arrow-expand"
                size={20}
                color={colors.mainBlack}
              />
              <Text style={styles.fullChatText}>Open Full Chat</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Quick Menu Bar */}
      <View style={styles.quickMenu}>
        <Animated.View 
          style={[
            styles.activeIndicator,
            {
              transform: [{ translateX: indicatorPosition }],
              width: screenWidth / quickMenuItems.length,
            }
          ]} 
        />
        {quickMenuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.quickMenuItem}
            onPress={() => handleQuickMenuPress(item.screen)}
          >
            <MaterialCommunityIcons
              name={item.icon}
              size={24}
              color={colors.mainYellow}
            />
            <Text style={styles.quickMenuText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
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
  quickMenu: {
    flexDirection: "row",
    backgroundColor: colors.mainBlack,
    paddingVertical: 8,
    paddingBottom: 20,
    paddingHorizontal: 20,
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.platinum,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickMenuItem: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  activeIndicator: {
    position: "absolute",
    top: 0,
    left: 0,
    height: 4,
    backgroundColor: colors.mainYellow,
    borderRadius: 2,
  },
  quickMenuText: {
    fontSize: 10,
    color: colors.mainYellow,
    marginTop: 4,
    fontWeight: "500",
  },
  chatButton: {
    position: "absolute",
    bottom: 90,
    left: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.mainYellow,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    zIndex: 999,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
  chatModal: {
    width: 340,
    height: 480,
    backgroundColor: colors.mainBlack,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    marginLeft: 20,
    marginBottom: 160,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    overflow: "hidden",
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.mainBlack,
    borderBottomWidth: 1,
    borderBottomColor: colors.platinum + "40",
  },
  chatHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  chatHeaderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  chatMessages: {
    flex: 1,
    padding: 16,
  },
  welcomeMessage: {
    backgroundColor: colors.mainYellow + "20",
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.mainYellow,
  },
  welcomeText: {
    fontSize: 14,
    color: "white",
    lineHeight: 20,
  },
  chatInputContainer: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: colors.mainBlack,
    borderTopWidth: 1,
    borderTopColor: colors.platinum + "40",
    alignItems: "center",
    gap: 8,
  },
  chatInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: "white",
    fontSize: 14,
    maxHeight: 80,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.mainYellow,
    justifyContent: "center",
    alignItems: "center",
  },
  fullChatButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.mainYellow,
    paddingVertical: 12,
    paddingHorizontal: 20,
    margin: 12,
    marginTop: 0,
    borderRadius: 8,
  },
  fullChatText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.mainBlack,
  },
});
