import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScreenLayout from "../../components/ScreenLayout";
import colors from "../../config/colors";
import {
  createHubConnection,
  stopHubConnection,
  sendMessage,
  getAllUsers,
  getChat,
  filterUsersByRole,
  decodeJWT,
} from "../../services/chatService";

export default function ChatScreen({ navigation, route }) {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [hubConnection, setHubConnection] = useState(null);
  const flatListRef = useRef(null);

  // Initialize chat
  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Get current user data from AsyncStorage
        const token = await AsyncStorage.getItem("authToken");
        const fullName = await AsyncStorage.getItem("fullName");
        const userRole = await AsyncStorage.getItem("userRole");

        if (!token) {
          Alert.alert("Error", "Please log in to use chat");
          navigation.navigate("Login");
          return;
        }

        // Decode JWT token to get user ID
        const decodedToken = decodeJWT(token);
        if (!decodedToken) {
          Alert.alert("Error", "Invalid authentication token");
          navigation.navigate("Login");
          return;
        }

        // Extract user ID from token
        const userId =
          decodedToken.sub ||
          decodedToken.userId ||
          decodedToken.id ||
          decodedToken.nameid ||
          decodedToken[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ];

        if (!userId) {
          console.error("Could not extract user ID from token:", decodedToken);
          Alert.alert("Error", "Authentication error. Please log in again.");
          navigation.navigate("Login");
          return;
        }

        // Create user object
        const user = {
          id: userId,
          fullName: fullName || "User",
          role: userRole || "User",
          firstName: fullName ? fullName.split(" ")[0] : "User",
          lastName: fullName ? fullName.split(" ").slice(1).join(" ") : "",
        };

        setCurrentUser(user);

        // Fetch all users
        const usersData = await getAllUsers();
        console.log("Fetched users data:", usersData);

        // Filter users based on role
        const filteredUsers = filterUsersByRole(usersData, user.role);
        console.log("Filtered users:", filteredUsers);

        // Convert users to conversations format
        const userConversations = filteredUsers
          .filter((u) => u.id !== user.id)
          .map((u) => ({
            id: u.id,
            name: u.fullName || u.userName || u.email || "Unknown User",
            lastMessage: "Start a conversation",
            timestamp: "",
            unread: 0,
            online: false,
            role: u.userRole,
            email: u.email,
            userName: u.userName,
          }));

        setConversations(userConversations);

        // Connect to SignalR Hub
        const connection = await createHubConnection(token);
        setHubConnection(connection);

        // Listen for incoming messages
        connection.on("ReceiveMessage", (senderId, message, timestamp) => {
          console.log("Received message:", senderId, message, timestamp);

          // Don't add message if it's from the current user (already added locally)
          if (senderId === user.id) {
            return;
          }

          let formattedTime;
          try {
            if (timestamp) {
              const date = new Date(timestamp);
              formattedTime = date.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              });
            } else {
              formattedTime = new Date().toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              });
            }
          } catch (error) {
            formattedTime = new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            });
          }

          const newMsg = {
            id: `${senderId}-${Date.now()}-${Math.random()}`,
            senderId: senderId,
            text: message,
            timestamp: formattedTime,
            isSent: false,
            isRead: false,
          };

          setMessages((prev) => [...prev, newMsg]);

          // Update conversation's last message
          setConversations((prev) =>
            prev.map((conv) =>
              conv.id === senderId
                ? {
                    ...conv,
                    lastMessage: message,
                    timestamp: "Now",
                    unread: conv.unread + 1,
                  }
                : conv
            )
          );
        });

        // Listen for user online status
        connection.on("UserOnline", (userId) => {
          setConversations((prev) =>
            prev.map((conv) =>
              conv.id === userId ? { ...conv, online: true } : conv
            )
          );
        });

        connection.on("UserOffline", (userId) => {
          setConversations((prev) =>
            prev.map((conv) =>
              conv.id === userId ? { ...conv, online: false } : conv
            )
          );
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing chat:", error);
        Alert.alert("Error", "Failed to initialize chat system");
        setIsLoading(false);
      }
    };

    initializeChat();

    // Cleanup on unmount
    return () => {
      stopHubConnection();
    };
  }, [navigation]);

  // Handle incoming tech support worker from navigation
  useEffect(() => {
    const { recipientId, recipientName, recipientType } = route.params || {};

    if (recipientId && recipientType === "techSupport" && conversations.length > 0) {
      const existingConv = conversations.find((c) => c.id === recipientId);

      if (existingConv) {
        handleSelectChat(existingConv);
      } else {
        const newTechSupport = {
          id: recipientId,
          name: recipientName,
          lastMessage: "Start chatting with your tech support specialist",
          timestamp: "Now",
          unread: 0,
          online: true,
          isTechSupport: true,
          role: "TechSupport",
        };

        setConversations((prev) => [newTechSupport, ...prev]);
        handleSelectChat(newTechSupport);
      }
    }
  }, [route.params, conversations]);

  // Auto scroll to bottom on new message
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || !selectedChat || !hubConnection) return;

    try {
      const newMsg = {
        id: `${currentUser.id}-${Date.now()}-${Math.random()}`,
        senderId: currentUser.id,
        text: newMessage,
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isSent: true,
        isRead: false,
      };

      setMessages((prev) => [...prev, newMsg]);

      // Send message through SignalR
      await sendMessage(selectedChat.id, newMessage);

      // Update conversation's last message
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedChat.id
            ? { ...conv, lastMessage: newMessage, timestamp: "Now" }
            : conv
        )
      );

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert("Error", "Failed to send message");
    }
  };

  const handleSelectChat = async (conversation) => {
    setSelectedChat(conversation);

    try {
      // Fetch chat history
      const chatHistory = await getChat(conversation.id);
      console.log("Chat history received:", chatHistory);

      // Convert API response to messages format
      const formattedMessages = chatHistory.map((msg) => {
        let formattedTime;
        try {
          if (msg.sentAt) {
            const date = new Date(msg.sentAt);
            formattedTime = date.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            });
          } else {
            formattedTime = "";
          }
        } catch (error) {
          formattedTime = "";
        }

        return {
          id: msg.id || `${msg.senderId}-${Date.now()}-${Math.random()}`,
          senderId: msg.senderId,
          text: msg.message || msg.text,
          timestamp: formattedTime,
          isSent: msg.senderId === currentUser.id,
          isRead: msg.isRead || false,
        };
      });

      setMessages(formattedMessages);

      // Mark conversation as read
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversation.id ? { ...conv, unread: 0 } : conv
        )
      );
    } catch (error) {
      console.error("Error loading chat:", error);
      setMessages([]);
    }
  };

  const handleBackToConversations = () => {
    setSelectedChat(null);
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.mainYellow} />
        <Text style={styles.loadingText}>Loading chat...</Text>
      </View>
    );
  }

  const renderConversation = ({ item }) => (
    <TouchableOpacity
      style={styles.chatCard}
      onPress={() => handleSelectChat(item)}
    >
      <View style={styles.avatarContainer}>
        <View style={[styles.avatar, item.online && styles.avatarOnline]}>
          <Feather name="user" size={24} color={colors.mainYellow} />
        </View>
        {item.online && <View style={styles.onlineDot} />}
      </View>
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <View style={styles.nameContainer}>
            <Text style={styles.chatName}>{item.name}</Text>
            {item.role && (
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>{item.role}</Text>
              </View>
            )}
          </View>
          {item.timestamp && (
            <Text style={styles.chatTime}>{item.timestamp}</Text>
          )}
        </View>
        <View style={styles.chatFooter}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.isSent ? styles.sentMessage : styles.receivedMessage,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          item.isSent ? styles.sentBubble : styles.receivedBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            item.isSent ? styles.sentText : styles.receivedText,
          ]}
        >
          {item.text}
        </Text>
        <Text
          style={[
            styles.messageTime,
            item.isSent ? styles.sentTime : styles.receivedTime,
          ]}
        >
          {item.timestamp}
        </Text>
      </View>
    </View>
  );

  // Conversations List View
  if (!selectedChat) {
    return (
      <ScreenLayout navigation={navigation} scrollable={false} showFooter={false}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={24} color={colors.mainBlack} />
            </TouchableOpacity>
            <Text style={styles.title}>Messages</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.searchContainer}>
            <Feather
              name="search"
              size={20}
              color={colors.platinum}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search chats..."
              placeholderTextColor={colors.platinum}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <FlatList
            data={filteredConversations}
            renderItem={renderConversation}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <MaterialCommunityIcons
                  name="chat-outline"
                  size={64}
                  color={colors.platinum}
                />
                <Text style={styles.emptyTitle}>No conversations yet</Text>
                <Text style={styles.emptyText}>
                  Start chatting with support staff or admins
                </Text>
              </View>
            }
          />
        </View>
      </ScreenLayout>
    );
  }

  // Chat View
  return (
    <SafeAreaView style={styles.chatViewContainer}>
      {/* Chat Header */}
      <View style={styles.chatHeader}>
        <TouchableOpacity onPress={handleBackToConversations}>
          <Feather name="arrow-left" size={24} color={colors.mainBlack} />
        </TouchableOpacity>
        <View style={styles.chatHeaderInfo}>
          <View>
            <Text style={styles.chatHeaderName}>{selectedChat.name}</Text>
            <Text style={styles.chatHeaderStatus}>
              {selectedChat.online ? "Online" : "Offline"}
            </Text>
          </View>
        </View>
        <View style={{ width: 24 }} />
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
      />

      {/* Message Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.messageInput}
            placeholder="Type a message..."
            placeholderTextColor={colors.platinum}
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            maxHeight={100}
            maxLength={1000}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,

              newMessage.trim() === "" && styles.sendButtonDisabled,
            ]}
            onPress={handleSendMessage}
            disabled={newMessage.trim() === ""}
          >
            <Feather
              name="send"
              size={20}
              color={newMessage.trim() === "" ? colors.platinum : "white"}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.mainBeige,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.jet,
  },
  container: {
    flex: 1,
    backgroundColor: colors.mainBeige,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.mainBlack,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.mainBlack,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  chatCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.alabaster,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarOnline: {
    borderWidth: 2,
    borderColor: colors.success,
  },
  onlineDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: "white",
  },
  chatInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.mainBlack,
  },
  roleBadge: {
    backgroundColor: colors.mainYellow + "40",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  roleText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.jet,
  },
  chatTime: {
    fontSize: 12,
    color: colors.jet,
    fontWeight: "500",
  },
  chatFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: colors.jet,
  },
  unreadBadge: {
    backgroundColor: colors.mainYellow,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
    marginLeft: 8,
  },
  unreadText: {
    fontSize: 12,
    color: colors.mainBlack,
    fontWeight: "700",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.mainBlack,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colors.jet,
    textAlign: "center",
    paddingHorizontal: 40,
  },
  // Chat View Styles
  chatViewContainer: {
    flex: 1,
    backgroundColor: colors.mainBlack,
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  chatHeaderInfo: {
    flex: 1,
    justifyContent: "center",
    marginLeft: 16,
  },
  chatHeaderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.alabaster,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    position: "relative",
  },
  headerOnlineDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: "white",
  },
  chatHeaderName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.mainBlack,
  },
  chatHeaderStatus: {
    fontSize: 12,
    color: colors.jet,
  },
  messagesContainer: {
    padding: 16,
    flexGrow: 1,
    backgroundColor: colors.mainBeige,
  },
  messageContainer: {
    marginBottom: 12,
    maxWidth: "80%",
  },
  sentMessage: {
    alignSelf: "flex-end",
  },
  receivedMessage: {
    alignSelf: "flex-start",
  },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
    maxWidth: "100%",
  },
  sentBubble: {
    backgroundColor: colors.mainYellow,
    borderBottomRightRadius: 4,
  },
  receivedBubble: {
    backgroundColor: "white",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 4,
  },
  sentText: {
    color: colors.mainBlack,
  },
  receivedText: {
    color: colors.mainBlack,
  },
  messageTime: {
    fontSize: 11,
    marginTop: 2,
  },
  sentTime: {
    color: colors.jet,
  },
  receivedTime: {
    color: colors.jet,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  messageInput: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    fontSize: 15,
    color: colors.mainBlack,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.mainYellow,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  sendButtonDisabled: {
    backgroundColor: colors.mainBlack,
    elevation: 0,
    shadowOpacity: 0,
  },
});
