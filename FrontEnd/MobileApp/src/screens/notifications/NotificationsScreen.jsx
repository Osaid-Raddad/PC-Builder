import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Switch,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import ScreenLayout from "../../components/ScreenLayout";
import colors from "../../config/colors";

const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    type: "build",
    title: "Build Complete!",
    message: "Your custom PC build 'Gaming Beast' has been saved successfully.",
    time: "5m ago",
    read: false,
    icon: "check-circle",
  },
  {
    id: "2",
    type: "comment",
    title: "New Comment",
    message: "TechMaster commented on your build: 'Great RGB setup!'",
    time: "1h ago",
    read: false,
    icon: "message-circle",
  },
  {
    id: "3",
    type: "price",
    title: "Price Drop Alert",
    message: "RTX 4080 is now 15% off at TechStore!",
    time: "3h ago",
    read: true,
    icon: "trending-down",
  },
  {
    id: "4",
    type: "like",
    title: "New Likes",
    message: "Your post 'Best RGB Setup 2024' received 25 new likes.",
    time: "5h ago",
    read: true,
    icon: "heart",
  },
  {
    id: "5",
    type: "news",
    title: "Latest Hardware News",
    message: "AMD announces new Ryzen 9000 series processors.",
    time: "1d ago",
    read: true,
    icon: "newspaper",
  },
  {
    id: "6",
    type: "support",
    title: "Tech Support Response",
    message: "Your support ticket #1234 has been answered.",
    time: "2d ago",
    read: true,
    icon: "help-circle",
  },
];

export default function NotificationsScreen({ navigation }) {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const getIconColor = (type) => {
    const colors = {
      build: "#10b981",
      comment: "#3b82f6",
      price: "#ef4444",
      like: "#ec4899",
      news: "#f59e0b",
      support: "#8b5cf6",
    };
    return colors[type] || colors.mainYellow;
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const filteredNotifications = showUnreadOnly
    ? notifications.filter((n) => !n.read)
    : notifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      style={[styles.notificationCard, !item.read && styles.unreadCard]}
      onPress={() => markAsRead(item.id)}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: getIconColor(item.type) + "20" },
        ]}
      >
        <Feather
          name={item.icon}
          size={24}
          color={getIconColor(item.type)}
        />
      </View>
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          {!item.read && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationTime}>{item.time}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteNotification(item.id)}
      >
        <Feather name="x" size={20} color={colors.text} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons
        name="bell-outline"
        size={64}
        color={colors.text}
      />
      <Text style={styles.emptyTitle}>
        {showUnreadOnly ? "No Unread Notifications" : "No Notifications"}
      </Text>
      <Text style={styles.emptyText}>
        {showUnreadOnly
          ? "You're all caught up!"
          : "You'll see notifications here when you have them."}
      </Text>
    </View>
  );

  return (
    <ScreenLayout navigation={navigation} scrollable={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Notifications</Text>
            {unreadCount > 0 && (
              <Text style={styles.unreadCount}>
                {unreadCount} unread
              </Text>
            )}
          </View>
          {unreadCount > 0 && (
            <TouchableOpacity
              style={styles.markAllButton}
              onPress={markAllAsRead}
            >
              <Text style={styles.markAllText}>Mark all read</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Toggle */}
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Show unread only</Text>
          <Switch
            value={showUnreadOnly}
            onValueChange={setShowUnreadOnly}
            trackColor={{ false: colors.text, true: colors.mainYellow }}
            thumbColor={showUnreadOnly ? colors.mainBlack : colors.alabaster}
          />
        </View>

        {/* Notifications List */}
        <FlatList
          data={filteredNotifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          contentContainerStyle={
            filteredNotifications.length === 0
              ? styles.emptyContainer
              : styles.listContainer
          }
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.mainBlack,
  },
  unreadCount: {
    fontSize: 14,
    color: colors.text,
    marginTop: 4,
  },
  markAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.mainYellow,
    borderRadius: 8,
  },
  markAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.mainBlack,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 16,
    color: colors.mainBlack,
    fontWeight: "500",
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flexGrow: 1,
  },
  notificationCard: {
    flexDirection: "row",
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
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.mainYellow,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
    justifyContent: "center",
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.mainBlack,
    marginRight: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.mainYellow,
  },
  notificationMessage: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 12,
    color: colors.text,
  },
  deleteButton: {
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.mainBlack,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.text,
    textAlign: "center",
    lineHeight: 20,
  },
});
