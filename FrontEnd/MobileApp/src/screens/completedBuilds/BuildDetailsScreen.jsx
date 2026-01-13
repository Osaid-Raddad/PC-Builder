import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import ScreenLayout from "../../components/ScreenLayout";
import colors from "../../config/colors";

const { width } = Dimensions.get("window");

export default function BuildDetailsScreen({ route, navigation }) {
  const { build } = route.params;
  const [liked, setLiked] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Mock images for the build (4 images)
  const buildImages = [
    { id: 1, type: "main" },
    { id: 2, type: "angle" },
    { id: 3, type: "internal" },
    { id: 4, type: "closeup" },
  ];

  const handleLike = () => {
    setLiked(!liked);
    // TODO: Implement actual like functionality
  };

  const handleShare = () => {
    console.log("Share build:", build.id);
    // TODO: Implement share functionality
  };

  const handleComment = () => {
    console.log("Comment on build:", build.id);
    // TODO: Navigate to comments section
  };

  const specs = [
    { icon: "cpu-64-bit", label: "CPU", value: build.cpu },
    { icon: "expansion-card", label: "GPU", value: build.gpu },
    { icon: "memory", label: "RAM", value: build.ram },
    { icon: "harddisk", label: "Storage", value: build.storage },
    { icon: "power", label: "PSU", value: build.psu },
    { icon: "expansion-card-variant", label: "Motherboard", value: build.motherboard },
    { icon: "fan", label: "CPU Cooler", value: build.cpuCooler },
    { icon: "case-sensitive-alt", label: "Case", value: build.case },
  ];

  return (
    <ScreenLayout navigation={navigation} scrollable={false} showFooter={false}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color={colors.mainBlack} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Build Details</Text>
          <TouchableOpacity onPress={handleShare}>
            <Feather name="share-2" size={24} color={colors.mainYellow} />
          </TouchableOpacity>
        </View>

        {/* Build Image Gallery */}
        <View style={styles.imageGalleryContainer}>
          <View style={styles.mainImageContainer}>
            <MaterialCommunityIcons
              name="desktop-tower"
              size={120}
              color={colors.mainYellow}
            />
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{build.category}</Text>
            </View>
            <View style={styles.imageCounter}>
              <Feather name="image" size={16} color="white" />
              <Text style={styles.imageCounterText}>
                {selectedImageIndex + 1} / {buildImages.length}
              </Text>
            </View>
          </View>

          {/* Image Thumbnails */}
          <View style={styles.thumbnailContainer}>
            {buildImages.map((image, index) => (
              <TouchableOpacity
                key={image.id}
                style={[
                  styles.thumbnail,
                  selectedImageIndex === index && styles.thumbnailActive,
                ]}
                onPress={() => setSelectedImageIndex(index)}
              >
                <MaterialCommunityIcons
                  name="desktop-tower"
                  size={32}
                  color={
                    selectedImageIndex === index
                      ? colors.mainYellow
                      : colors.platinum
                  }
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Build Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.buildName}>{build.name}</Text>
          
          <View style={styles.metaRow}>
            <View style={styles.ownerInfo}>
              <Feather name="user" size={16} color={colors.mainYellow} />
              <Text style={styles.ownerText}>Built by {build.owner}</Text>
            </View>
            <View style={styles.dateInfo}>
              <Feather name="calendar" size={16} color={colors.text} />
              <Text style={styles.dateText}>{build.buildDate}</Text>
            </View>
          </View>

          {/* Price */}
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Total Cost</Text>
            <Text style={styles.priceValue}>{build.price}</Text>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{build.description}</Text>
          </View>

          {/* Purpose */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Purpose</Text>
            <Text style={styles.purposeText}>{build.purpose}</Text>
          </View>

          {/* Specifications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Specifications</Text>
            <View style={styles.specsGrid}>
              {specs.map((spec, index) => (
                <View key={index} style={styles.specCard}>
                  <View style={styles.specHeader}>
                    <MaterialCommunityIcons
                      name={spec.icon}
                      size={20}
                      color={colors.mainYellow}
                    />
                    <Text style={styles.specLabel}>{spec.label}</Text>
                  </View>
                  <Text style={styles.specValue}>{spec.value}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Social Stats and Actions */}
          <View style={styles.socialSection}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Feather name="thumbs-up" size={20} color={colors.mainYellow} />
                <Text style={styles.statText}>{build.likes} Likes</Text>
              </View>
              <View style={styles.statItem}>
                <Feather name="message-square" size={20} color={colors.text} />
                <Text style={styles.statText}>{build.comments} Comments</Text>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, liked && styles.actionButtonActive]}
                onPress={handleLike}
              >
                <Feather
                  name={liked ? "thumbs-up" : "thumbs-up"}
                  size={20}
                  color={liked ? "white" : colors.mainYellow}
                />
                <Text
                  style={[
                    styles.actionButtonText,
                    liked && styles.actionButtonTextActive,
                  ]}
                >
                  {liked ? "Liked" : "Like"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleComment}
              >
                <Feather name="message-square" size={20} color={colors.mainYellow} />
                <Text style={styles.actionButtonText}>Comment</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleShare}
              >
                <Feather name="share-2" size={20} color={colors.mainYellow} />
                <Text style={styles.actionButtonText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Similar Builds CTA */}
          <TouchableOpacity
            style={styles.similarBuildsButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.similarBuildsText}>
              View More Completed Builds
            </Text>
            <Feather name="arrow-right" size={20} color={colors.mainYellow} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.mainBeige,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.mainBlack,
  },
  imageGalleryContainer: {
    backgroundColor: colors.background,
  },
  mainImageContainer: {
    height: 240,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  categoryBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: colors.mainYellow,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  categoryBadgeText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
  imageCounter: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  imageCounterText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  thumbnailContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    backgroundColor: colors.background,
  },
  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.platinum,
  },
  thumbnailActive: {
    borderColor: colors.mainYellow,
    borderWidth: 3,
  },
  infoCard: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    padding: 20,
  },
  buildName: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.mainBlack,
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  ownerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ownerText: {
    fontSize: 14,
    color: colors.jet,
  },
  dateInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dateText: {
    fontSize: 14,
    color: colors.text,
  },
  priceContainer: {
    backgroundColor: colors.mainYellow + "20",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.jet,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.mainYellow,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.mainBlack,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: colors.jet,
    lineHeight: 24,
  },
  purposeText: {
    fontSize: 16,
    color: colors.jet,
    fontStyle: "italic",
  },
  specsGrid: {
    gap: 12,
  },
  specCard: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.mainYellow,
  },
  specHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  specLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.mainBlack,
  },
  specValue: {
    fontSize: 15,
    color: colors.jet,
    marginLeft: 28,
  },
  socialSection: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 2,
    borderTopColor: colors.platinum,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.mainBlack,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.mainYellow,
    backgroundColor: "white",
  },
  actionButtonActive: {
    backgroundColor: colors.mainYellow,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.mainYellow,
  },
  actionButtonTextActive: {
    color: "white",
  },
  similarBuildsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.platinum,
    backgroundColor: "white",
  },
  similarBuildsText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.jet,
  },
});
