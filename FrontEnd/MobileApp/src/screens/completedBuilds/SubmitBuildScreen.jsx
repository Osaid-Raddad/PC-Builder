import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import ScreenLayout from "../../components/ScreenLayout";
import colors from "../../config/colors";

export default function SubmitBuildScreen({ navigation }) {
  const MAX_IMAGES = 5;
  const [imagePreviews, setImagePreviews] = useState([]);
  const [formData, setFormData] = useState({
    buildName: "",
    ownerName: "",
    category: "Gaming",
    price: "",
    cpu: "",
    gpu: "",
    ram: "",
    storage: "",
    psu: "",
    description: "",
  });

  const categories = ["Gaming", "Workstation", "Budget", "Office", "Mini-ITX"];

  const pickImages = async () => {
    if (imagePreviews.length >= MAX_IMAGES) {
      Alert.alert("Limit Reached", `You can only upload up to ${MAX_IMAGES} images`);
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Sorry, we need camera roll permissions to upload images!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: MAX_IMAGES - imagePreviews.length,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((asset) => asset.uri);
      setImagePreviews([...imagePreviews, ...newImages]);
    }
  };

  const removeImage = (index) => {
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);
  };

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    // Validation
    if (imagePreviews.length === 0) {
      Alert.alert("Images Required", "Please upload at least one image of your build");
      return;
    }

    if (!formData.buildName || !formData.ownerName || !formData.cpu || !formData.gpu) {
      Alert.alert("Required Fields", "Please fill in all required fields (Build Name, Your Name, CPU, GPU)");
      return;
    }

    // TODO: Send data to backend
    console.log("Build submission:", { ...formData, images: imagePreviews });
    
    Alert.alert(
      "Success!",
      "Your build has been submitted successfully! It will be reviewed shortly.",
      [
        {
          text: "OK",
          onPress: () => navigation.navigate("CompletedBuilds"),
        },
      ]
    );
  };

  return (
    <ScreenLayout navigation={navigation} scrollable={false} showFooter={false}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color={colors.mainBlack} />
          </TouchableOpacity>
          <Text style={styles.title}>Submit Your Build</Text>
          <View style={{ width: 24 }} />
        </View>
        <Text style={styles.subtitle}>
          Share your amazing PC build with the community and inspire others!
        </Text>

        {/* Images Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Build Images * ({imagePreviews.length}/{MAX_IMAGES})
          </Text>

          {/* Image Previews Grid */}
          {imagePreviews.length > 0 && (
            <View style={styles.imagesGrid}>
              {imagePreviews.map((uri, index) => (
                <View key={index} style={styles.imagePreview}>
                  <Image source={{ uri }} style={styles.previewImage} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => removeImage(index)}
                  >
                    <Feather name="x" size={16} color="white" />
                  </TouchableOpacity>
                  <View style={styles.imageNumberBadge}>
                    <Text style={styles.imageNumberText}>#{index + 1}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Main Preview or Empty State */}
          {imagePreviews.length === 0 ? (
            <View style={styles.emptyImageState}>
              <Feather name="image" size={64} color={colors.mainYellow} />
              <Text style={styles.emptyImageTitle}>No images selected</Text>
              <Text style={styles.emptyImageText}>Upload up to {MAX_IMAGES} images</Text>
            </View>
          ) : (
            <View style={styles.mainImagePreview}>
              <Image source={{ uri: imagePreviews[0] }} style={styles.mainImage} />
              <View style={styles.mainImageBadge}>
                <Text style={styles.mainImageBadgeText}>Main Image</Text>
              </View>
            </View>
          )}

          {/* Upload Button */}
          {imagePreviews.length < MAX_IMAGES && (
            <TouchableOpacity style={styles.uploadButton} onPress={pickImages}>
              <Feather name="upload" size={20} color="white" />
              <Text style={styles.uploadButtonText}>
                {imagePreviews.length === 0
                  ? "Choose Images"
                  : `Add More Images (${MAX_IMAGES - imagePreviews.length} remaining)`}
              </Text>
            </TouchableOpacity>
          )}

          <Text style={styles.uploadHint}>
            Max {MAX_IMAGES} images. Each file max size: 5MB. Supported: JPG, PNG, WebP
          </Text>
        </View>

        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>

          {/* Build Name */}
          <View style={styles.inputGroup}>
            <View style={styles.inputLabel}>
              <Feather name="tag" size={18} color={colors.mainYellow} />
              <Text style={styles.labelText}>Build Name *</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="e.g., Ultimate Gaming Beast"
              placeholderTextColor={colors.platinum}
              value={formData.buildName}
              onChangeText={(text) => handleInputChange("buildName", text)}
            />
          </View>

          {/* Owner Name */}
          <View style={styles.inputGroup}>
            <View style={styles.inputLabel}>
              <Feather name="user" size={18} color={colors.mainYellow} />
              <Text style={styles.labelText}>Your Name *</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor={colors.platinum}
              value={formData.ownerName}
              onChangeText={(text) => handleInputChange("ownerName", text)}
            />
          </View>

          {/* Category */}
          <View style={styles.inputGroup}>
            <View style={styles.inputLabel}>
              <Feather name="tag" size={18} color={colors.mainYellow} />
              <Text style={styles.labelText}>Category *</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesScroll}
            >
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    formData.category === cat && styles.categoryChipActive,
                  ]}
                  onPress={() => handleInputChange("category", cat)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      formData.category === cat && styles.categoryChipTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Price */}
          <View style={styles.inputGroup}>
            <View style={styles.inputLabel}>
              <Feather name="dollar-sign" size={18} color={colors.mainYellow} />
              <Text style={styles.labelText}>Total Price</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="e.g., $2,500"
              placeholderTextColor={colors.platinum}
              value={formData.price}
              onChangeText={(text) => handleInputChange("price", text)}
            />
          </View>
        </View>

        {/* PC Specifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PC Specifications</Text>

          {/* CPU */}
          <View style={styles.inputGroup}>
            <View style={styles.inputLabel}>
              <MaterialCommunityIcons name="cpu-64-bit" size={18} color={colors.mainYellow} />
              <Text style={styles.labelText}>CPU / Processor *</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="e.g., Intel Core i9-14900K"
              placeholderTextColor={colors.platinum}
              value={formData.cpu}
              onChangeText={(text) => handleInputChange("cpu", text)}
            />
          </View>

          {/* GPU */}
          <View style={styles.inputGroup}>
            <View style={styles.inputLabel}>
              <MaterialCommunityIcons name="expansion-card" size={18} color={colors.mainYellow} />
              <Text style={styles.labelText}>GPU / Graphics Card *</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="e.g., NVIDIA RTX 4090"
              placeholderTextColor={colors.platinum}
              value={formData.gpu}
              onChangeText={(text) => handleInputChange("gpu", text)}
            />
          </View>

          {/* RAM */}
          <View style={styles.inputGroup}>
            <View style={styles.inputLabel}>
              <MaterialCommunityIcons name="memory" size={18} color={colors.mainYellow} />
              <Text style={styles.labelText}>RAM / Memory</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="e.g., 32GB DDR5"
              placeholderTextColor={colors.platinum}
              value={formData.ram}
              onChangeText={(text) => handleInputChange("ram", text)}
            />
          </View>

          {/* Storage */}
          <View style={styles.inputGroup}>
            <View style={styles.inputLabel}>
              <Feather name="hard-drive" size={18} color={colors.mainYellow} />
              <Text style={styles.labelText}>Storage</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="e.g., 1TB NVMe SSD"
              placeholderTextColor={colors.platinum}
              value={formData.storage}
              onChangeText={(text) => handleInputChange("storage", text)}
            />
          </View>

          {/* PSU */}
          <View style={styles.inputGroup}>
            <View style={styles.inputLabel}>
              <Feather name="zap" size={18} color={colors.mainYellow} />
              <Text style={styles.labelText}>Power Supply (PSU)</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="e.g., 850W 80+ Gold"
              placeholderTextColor={colors.platinum}
              value={formData.psu}
              onChangeText={(text) => handleInputChange("psu", text)}
            />
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>

          <View style={styles.inputGroup}>
            <View style={styles.inputLabel}>
              <Feather name="align-left" size={18} color={colors.mainYellow} />
              <Text style={styles.labelText}>Tell us about your build</Text>
            </View>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe your build, its purpose, what you love about it, or any special features..."
              placeholderTextColor={colors.platinum}
              value={formData.description}
              onChangeText={(text) => handleInputChange("description", text)}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit Build</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.requiredNote}>
          * Required fields. Your build will be reviewed before being published.
        </Text>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.mainBeige,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.mainBlack,
  },
  subtitle: {
    fontSize: 16,
    color: colors.jet,
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 24,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.platinum,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.mainBlack,
    marginBottom: 16,
  },
  imagesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  imagePreview: {
    width: "48%",
    height: 150,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    borderWidth: 2,
    borderColor: colors.platinum,
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#EF4444",
    borderRadius: 20,
    padding: 6,
  },
  imageNumberBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: colors.mainYellow,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  imageNumberText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
  },
  emptyImageState: {
    height: 250,
    backgroundColor: colors.platinum,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyImageTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.jet,
    marginTop: 12,
  },
  emptyImageText: {
    fontSize: 14,
    color: colors.jet,
    marginTop: 8,
  },
  mainImagePreview: {
    height: 250,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    position: "relative",
    borderWidth: 2,
    borderColor: colors.mainYellow,
  },
  mainImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  mainImageBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: colors.mainYellow,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  mainImageBadgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.mainYellow,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 10,
    marginBottom: 12,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  uploadHint: {
    fontSize: 12,
    color: colors.jet,
    textAlign: "center",
    lineHeight: 18,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  labelText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.mainBlack,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: colors.platinum,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.jet,
  },
  textArea: {
    minHeight: 120,
    paddingTop: 12,
  },
  categoriesScroll: {
    marginTop: 8,
  },
  categoryChip: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.platinum,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: colors.mainYellow,
    borderColor: colors.mainYellow,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.jet,
  },
  categoryChipTextActive: {
    color: "white",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.platinum,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.jet,
  },
  submitButton: {
    flex: 1,
    backgroundColor: colors.mainYellow,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  requiredNote: {
    fontSize: 12,
    color: colors.jet,
    textAlign: "center",
    marginBottom: 24,
  },
});
