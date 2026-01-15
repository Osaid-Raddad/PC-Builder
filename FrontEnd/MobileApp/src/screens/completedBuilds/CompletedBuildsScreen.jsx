import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  ScrollView,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import ScreenLayout from "../../components/ScreenLayout";
import colors from "../../config/colors";

const MOCK_BUILDS = [
  {
    id: "1",
    name: "The Beast Gaming Rig",
    owner: "Ahmad Khalil",
    category: "Gaming",
    cpu: "Intel Core i9-14900K",
    gpu: "NVIDIA RTX 4090",
    ram: "64GB DDR5",
    storage: "2TB NVMe SSD",
    psu: "1000W 80+ Platinum",
    motherboard: "ASUS ROG MAXIMUS Z790 HERO",
    cpuCooler: "NZXT Kraken Z73 RGB",
    case: "Lian Li O11 Dynamic EVO",
    price: "$3,500",
    likes: 234,
    comments: 45,
    description: "Ultimate gaming beast for 4K gaming at max settings",
    buildDate: "December 2025",
    purpose: "High-end gaming and content creation",
  },
  {
    id: "2",
    name: "Budget King",
    owner: "Mohammed Nasser",
    category: "Budget",
    cpu: "AMD Ryzen 5 7600X",
    gpu: "AMD RX 7600",
    ram: "16GB DDR5",
    storage: "512GB NVMe SSD",
    psu: "550W 80+ Bronze",
    motherboard: "MSI B650 GAMING PLUS WIFI",
    cpuCooler: "Stock AMD Cooler",
    case: "NZXT H510",
    price: "$800",
    likes: 189,
    comments: 32,
    description: "Best value for 1080p gaming on a tight budget",
    buildDate: "November 2025",
    purpose: "1080p gaming on a budget",
  },
  {
    id: "3",
    name: "Workstation Pro",
    owner: "Sara Ahmed",
    category: "Workstation",
    cpu: "AMD Ryzen 9 7950X",
    gpu: "NVIDIA RTX 4080",
    ram: "128GB DDR5",
    storage: "4TB NVMe SSD",
    psu: "850W 80+ Gold",
    motherboard: "ASUS ProArt X670E-CREATOR WIFI",
    cpuCooler: "Noctua NH-D15",
    case: "Fractal Design Define 7",
    price: "$4,200",
    likes: 156,
    comments: 28,
    description: "Professional workstation for video editing and 3D rendering",
    buildDate: "October 2025",
    purpose: "Professional content creation",
  },
  {
    id: "4",
    name: "RGB Paradise",
    owner: "Omar Hassan",
    category: "Gaming",
    cpu: "Intel Core i7-14700K",
    gpu: "NVIDIA RTX 4070 Ti",
    ram: "32GB DDR5",
    storage: "1TB NVMe SSD",
    psu: "750W 80+ Gold",
    motherboard: "MSI MPG Z790 CARBON WIFI",
    cpuCooler: "Corsair iCUE H150i RGB",
    case: "Corsair 5000X RGB",
    price: "$2,100",
    likes: 312,
    comments: 67,
    description: "Full RGB setup with stunning visual effects",
    buildDate: "January 2026",
    purpose: "Gaming with maximum RGB",
  },
  {
    id: "5",
    name: "Silent Performer",
    owner: "Layla Mahmoud",
    category: "Office",
    cpu: "Intel Core i5-14600K",
    gpu: "Integrated Graphics",
    ram: "32GB DDR5",
    storage: "1TB NVMe SSD",
    psu: "500W 80+ Gold",
    motherboard: "ASUS PRIME Z790-P WIFI",
    cpuCooler: "be quiet! Dark Rock 4",
    case: "be quiet! Pure Base 500DX",
    price: "$950",
    likes: 98,
    comments: 19,
    description: "Quiet and efficient build for office work and productivity",
    buildDate: "September 2025",
    purpose: "Office productivity and programming",
  },
  {
    id: "6",
    name: "Compact Powerhouse",
    owner: "Yusuf Ali",
    category: "Mini-ITX",
    cpu: "AMD Ryzen 7 7800X3D",
    gpu: "NVIDIA RTX 4070",
    ram: "32GB DDR5",
    storage: "2TB NVMe SSD",
    psu: "650W 80+ Gold SFX",
    motherboard: "ASUS ROG STRIX B650E-I",
    cpuCooler: "Noctua NH-L12S",
    case: "NZXT H1 V2",
    price: "$2,400",
    likes: 267,
    comments: 54,
    description: "Small form factor without compromising performance",
    buildDate: "August 2025",
    purpose: "Compact gaming and portability",
  },
  {
    id: "7",
    name: "White Snow Elegance",
    owner: "Rana Saleh",
    category: "Gaming",
    cpu: "Intel Core i5-14600K",
    gpu: "NVIDIA RTX 4060 Ti",
    ram: "32GB DDR5",
    storage: "1TB NVMe SSD",
    psu: "700W 80+ Gold",
    motherboard: "ASUS TUF GAMING Z790-PLUS WIFI",
    cpuCooler: "Corsair iCUE H100i Elite",
    case: "Lian Li O11 Dynamic Mini White",
    price: "$1,650",
    likes: 421,
    comments: 89,
    description: "All-white themed build with clean aesthetics and great 1440p performance",
    buildDate: "July 2025",
    purpose: "1440p gaming with clean aesthetics",
  },
  {
    id: "8",
    name: "Creator Studio",
    owner: "Tariq Mansour",
    category: "Workstation",
    cpu: "AMD Ryzen 9 7900X",
    gpu: "NVIDIA RTX 4070 Ti",
    ram: "64GB DDR5",
    storage: "2TB NVMe + 4TB HDD",
    psu: "850W 80+ Platinum",
    motherboard: "ASUS ProArt X670E-CREATOR",
    cpuCooler: "Arctic Liquid Freezer II 360",
    case: "Fractal Design Meshify 2",
    price: "$3,100",
    likes: 187,
    comments: 42,
    description: "Perfect for content creation, streaming, and video production",
    buildDate: "June 2025",
    purpose: "Content creation and streaming",
  },
  {
    id: "9",
    name: "First Build Ever",
    owner: "Noor Ibrahim",
    category: "Budget",
    cpu: "AMD Ryzen 5 5600",
    gpu: "NVIDIA GTX 1660 Super",
    ram: "16GB DDR4",
    storage: "500GB NVMe SSD",
    psu: "500W 80+ Bronze",
    motherboard: "MSI B450 TOMAHAWK MAX II",
    cpuCooler: "Cooler Master Hyper 212",
    case: "Cooler Master MasterBox Q300L",
    price: "$650",
    likes: 278,
    comments: 96,
    description: "My first PC build! Great entry-level gaming performance on a student budget",
    buildDate: "May 2025",
    purpose: "Entry-level gaming on student budget",
  },
];


export default function CompletedBuildsScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const buildsPerPage = 3;

  const categories = ["All", "Gaming", "Workstation", "Budget", "Office", "Mini-ITX"];

  // Filter and search logic
  const filteredBuilds = MOCK_BUILDS.filter((build) => {
    const matchesCategory =
      selectedCategory === "All" || build.category === selectedCategory;
    const matchesSearch =
      searchTerm === "" ||
      build.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      build.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      build.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      build.cpu.toLowerCase().includes(searchTerm.toLowerCase()) ||
      build.gpu.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredBuilds.length / buildsPerPage);
  const indexOfLastBuild = currentPage * buildsPerPage;
  const indexOfFirstBuild = indexOfLastBuild - buildsPerPage;
  const currentBuilds = filteredBuilds.slice(indexOfFirstBuild, indexOfLastBuild);

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleLike = (buildId) => {
    console.log("Liked build:", buildId);
    // TODO: Implement like functionality
  };

  const handleShare = (buildId) => {
    console.log("Share build:", buildId);
    // TODO: Implement share functionality
  };

  const renderBuild = ({ item }) => (
    <TouchableOpacity
      style={styles.buildCard}
      onPress={() => navigation.navigate("BuildDetails", { build: item })}
    >
      {/* Build Image with Category Badge */}
      <View style={styles.buildImageContainer}>
        <MaterialCommunityIcons
          name="desktop-tower"
          size={80}
          color={colors.mainYellow}
        />
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{item.category}</Text>
        </View>
        <View style={styles.priceBadge}>
          <Text style={styles.priceBadgeText}>{item.price}</Text>
        </View>
      </View>

      {/* Build Info */}
      <View style={styles.buildInfo}>
        <Text style={styles.buildTitle}>{item.name}</Text>
        <View style={styles.ownerRow}>
          <Feather name="user" size={14} color={colors.mainYellow} />
          <Text style={styles.buildOwner}>Built by {item.owner}</Text>
        </View>

        <Text style={styles.buildDescription} numberOfLines={2}>
          {item.description}
        </Text>

        {/* Specs */}
        <View style={styles.specsContainer}>
          <View style={styles.specRow}>
            <MaterialCommunityIcons name="cpu-64-bit" size={14} color={colors.mainYellow} />
            <Text style={styles.specLabel}>CPU:</Text>
            <Text style={styles.specValue} numberOfLines={1}>{item.cpu}</Text>
          </View>
          <View style={styles.specRow}>
            <MaterialCommunityIcons name="expansion-card" size={14} color={colors.mainYellow} />
            <Text style={styles.specLabel}>GPU:</Text>
            <Text style={styles.specValue} numberOfLines={1}>{item.gpu}</Text>
          </View>
          <View style={styles.specRow}>
            <MaterialCommunityIcons name="memory" size={14} color={colors.mainYellow} />
            <Text style={styles.specLabel}>RAM:</Text>
            <Text style={styles.specValue} numberOfLines={1}>{item.ram}</Text>
          </View>
          <View style={styles.specRow}>
            <Feather name="hard-drive" size={14} color={colors.mainYellow} />
            <Text style={styles.specLabel}>Storage:</Text>
            <Text style={styles.specValue} numberOfLines={1}>{item.storage}</Text>
          </View>
          <View style={styles.specRow}>
            <Feather name="zap" size={14} color={colors.mainYellow} />
            <Text style={styles.specLabel}>PSU:</Text>
            <Text style={styles.specValue} numberOfLines={1}>{item.psu}</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <View style={styles.socialStats}>
            <TouchableOpacity
              style={styles.likeButton}
              onPress={(e) => {
                e.stopPropagation();
                handleLike(item.id);
              }}
            >
              <Feather name="thumbs-up" size={16} color={colors.mainYellow} />
              <Text style={styles.likeText}>{item.likes}</Text>
            </TouchableOpacity>

            <View style={styles.commentStat}>
              <Feather name="message-square" size={16} color={colors.text} />
              <Text style={styles.commentText}>{item.comments}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.shareButton}
            onPress={(e) => {
              e.stopPropagation();
              handleShare(item.id);
            }}
          >
            <Feather name="share-2" size={16} color={colors.mainYellow} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenLayout navigation={navigation} scrollable={false} showFooter={false}>
      <View style={styles.container}>
        <FlatList
          data={currentBuilds}
          renderItem={renderBuild}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <>
              {/* Header */}
              <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Feather name="arrow-left" size={24} color={colors.mainBlack} />
                </TouchableOpacity>
                <Text style={styles.title}>Completed Builds</Text>
                <View style={{ width: 24 }} />
              </View>
              <Text style={styles.subtitle}>
                Explore amazing PC builds from our community
              </Text>

              {/* Search Bar */}
              <View style={styles.searchContainer}>
                <Feather
                  name="search"
                  size={20}
                  color={colors.platinum}
                  style={styles.searchIcon}
                />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search builds..."
                  placeholderTextColor={colors.platinum}
                  value={searchTerm}
                  onChangeText={(text) => {
                    setSearchTerm(text);
                    setCurrentPage(1);
                  }}
                />
                {searchTerm !== "" && (
                  <TouchableOpacity onPress={() => setSearchTerm("")}>
                    <Feather name="x" size={20} color={colors.platinum} />
                  </TouchableOpacity>
                )}
              </View>

              {/* Category Filter */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesScrollView}
                contentContainerStyle={styles.categoriesContainer}
              >
                <Feather
                  name="filter"
                  size={20}
                  color={colors.mainYellow}
                  style={styles.filterIcon}
                />
                {categories.map((category) => {
                  const count = MOCK_BUILDS.filter((b) => b.category === category).length;
                  return (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryChip,
                        selectedCategory === category && styles.categoryChipActive,
                      ]}
                      onPress={() => handleCategoryFilter(category)}
                    >
                      <Text
                        style={[
                          styles.categoryChipText,
                          selectedCategory === category && styles.categoryChipTextActive,
                        ]}
                      >
                        {category}
                      </Text>
                      {category !== "All" && (
                        <View
                          style={[
                            styles.categoryCount,
                            selectedCategory === category && styles.categoryCountActive,
                          ]}
                        >
                          <Text
                            style={[
                              styles.categoryCountText,
                              selectedCategory === category &&
                                styles.categoryCountTextActive,
                            ]}
                          >
                            {count}
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </>
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="desktop-tower-off"
                size={64}
                color={colors.platinum}
              />
              <Text style={styles.emptyTitle}>No builds found</Text>
              <Text style={styles.emptyText}>
                Try selecting a different category or searching for something else
              </Text>
            </View>
          }
          ListFooterComponent={
            <>
              {filteredBuilds.length > buildsPerPage && (
                <View style={styles.paginationContainer}>
                  <TouchableOpacity
                    style={[styles.pageButton, currentPage === 1 && styles.pageButtonDisabled]}
                    onPress={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <Feather name="chevron-left" size={20} color={colors.mainYellow} />
                  </TouchableOpacity>

                  <View style={styles.pageNumbers}>
                    {[...Array(totalPages)].map((_, index) => (
                      <TouchableOpacity
                        key={index + 1}
                        style={[
                          styles.pageNumberButton,
                          currentPage === index + 1 && styles.pageNumberButtonActive,
                        ]}
                        onPress={() => handlePageChange(index + 1)}
                      >
                        <Text
                          style={[
                            styles.pageNumberText,
                            currentPage === index + 1 && styles.pageNumberTextActive,
                          ]}
                        >
                          {index + 1}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.pageButton,
                      currentPage === totalPages && styles.pageButtonDisabled,
                    ]}
                    onPress={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <Feather name="chevron-right" size={20} color={colors.mainYellow} />
                  </TouchableOpacity>
                </View>
              )}

              {/* Call to Action */}
              <View style={styles.ctaContainer}>
                <Text style={styles.ctaTitle}>Ready to Build Your Dream?</Text>
                <Text style={styles.ctaDescription}>
                  Start building your custom PC with our interactive builder or share your completed build with the community!
                </Text>
                <View style={styles.ctaButtons}>
                  <TouchableOpacity
                    style={styles.startBuildButton}
                    onPress={() => {
                      navigation.navigate("Builder");
                    }}
                  >
                    <MaterialCommunityIcons name="hammer-wrench" size={20} color={colors.mainBlack} />
                    <Text style={styles.startBuildButtonText}>Start Your Build</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.submitBuildButton}
                    onPress={() => {
                      navigation.navigate("SubmitBuild");
                    }}
                  >
                    <Feather name="upload" size={20} color={colors.mainYellow} />
                    <Text style={styles.submitBuildButtonText}>Submit Your Build</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          }
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </ScreenLayout>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.mainBeige,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 40,
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
    color: colors.text,
    marginBottom: 20,
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.platinum,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.mainBlack,
  },
  categoriesScrollView: {
    marginBottom: 20,
  },
  categoriesContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingRight: 20,
  },
  filterIcon: {
    marginRight: 4,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.platinum,
    gap: 8,
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
  categoryCount: {
    backgroundColor: colors.mainYellow + "20",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  categoryCountActive: {
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  categoryCountText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.mainYellow,
  },
  categoryCountTextActive: {
    color: "white",
  },
  buildCard: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: colors.platinum,
  },
  buildImageContainer: {
    height: 180,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  categoryBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: colors.mainYellow,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
  },
  priceBadge: {
    position: "absolute",
    bottom: 12,
    left: 12,
    backgroundColor: "rgba(36, 36, 35, 0.8)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  priceBadgeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.mainYellow,
  },
  buildInfo: {
    padding: 16,
  },
  buildTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.mainBlack,
    marginBottom: 8,
  },
  ownerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  buildOwner: {
    fontSize: 14,
    color: colors.jet,
  },
  buildDescription: {
    fontSize: 14,
    color: colors.jet,
    marginBottom: 12,
    lineHeight: 20,
  },
  specsContainer: {
    gap: 8,
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.platinum,
  },
  specRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  specLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.mainBlack,
    width: 60,
  },
  specValue: {
    fontSize: 12,
    color: colors.jet,
    flex: 1,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.platinum,
  },
  socialStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  likeText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.mainBlack,
  },
  commentStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  commentText: {
    fontSize: 14,
    color: colors.jet,
  },
  shareButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.platinum,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 20,
  },
  pageButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: colors.platinum,
  },
  pageButtonDisabled: {
    opacity: 0.3,
  },
  pageNumbers: {
    flexDirection: "row",
    gap: 8,
  },
  pageNumberButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: colors.platinum,
  },
  pageNumberButtonActive: {
    backgroundColor: colors.mainYellow,
    borderColor: colors.mainYellow,
  },
  pageNumberText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.jet,
  },
  pageNumberTextActive: {
    color: "white",
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
  ctaContainer: {
    marginTop: 32,
    padding: 24,
    backgroundColor: "white",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.mainYellow,
    alignItems: "center",
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.mainBlack,
    textAlign: "center",
    marginBottom: 12,
  },
  ctaDescription: {
    fontSize: 16,
    color: colors.jet,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  ctaButtons: {
    width: "100%",
    gap: 12,
  },
  startBuildButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.mainYellow,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  startBuildButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.mainBlack,
  },
  submitBuildButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.mainYellow,
    gap: 10,
  },
  submitBuildButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.mainYellow,
  },
});
