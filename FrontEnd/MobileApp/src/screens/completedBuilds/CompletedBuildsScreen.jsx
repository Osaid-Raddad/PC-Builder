import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import ScreenLayout from "../../components/ScreenLayout";
import colors from "../../config/colors";

const PCBuilds = {
  build1: require('../../../assets/Images/PCBuilds/1.jpg'),
  build2: require('../../../assets/Images/PCBuilds/2.jpg'),
  build3: require('../../../assets/Images/PCBuilds/3.jpg'),
  build4: require('../../../assets/Images/PCBuilds/4.jpg'),
  build5: require('../../../assets/Images/PCBuilds/5.jpg'),
  build6: require('../../../assets/Images/PCBuilds/6.jpg'),
  build7: require('../../../assets/Images/PCBuilds/7.jpg'),
  build8: require('../../../assets/Images/PCBuilds/8.jpg'),
  build9: require('../../../assets/Images/PCBuilds/9.jpg'),
};

const MOCK_BUILDS = [
  {
    id: "1",
    name: "Ultimate Gaming Beast",
    owner: "Ahmad Khalil",
    category: "Gaming",
    cpu: "Intel Core i7-13700K",
    gpu: "NVIDIA GeForce RTX 5090",
    ram: "Corsair Vengeance RGB 32GB (2x16GB) DDR5 6000MHz",
    storage: "Samsung 990 PRO 1TB NVMe M.2 SSD",
    psu: "Corsair RM850x 850W 80+ Gold Fully Modular",
    motherboard: "ASUS ROG STRIX Z790-E GAMING WIFI",
    cpuCooler: "Corsair iCUE H150i ELITE CAPELLIX Liquid CPU Cooler",
    case: "NZXT H7 Flow RGB Mid Tower - White",
    price: "$4,299",
    likes: 234,
    comments: 45,
    description: "Top-tier gaming PC with RTX 5090 for maximum performance at 4K",
    buildDate: "January 2026",
    purpose: "High-end 4K gaming and content creation",
    image: PCBuilds.build1,
  },
  {
    id: "2",
    name: "Budget Champion",
    owner: "Mohammed Nasser",
    category: "Budget",
    cpu: "Intel Core i5-13600K",
    gpu: "NVIDIA GeForce RTX 3050",
    ram: "Corsair Vengeance LPX 16GB (2x8GB) DDR4 3200MHz",
    storage: "Western Digital Blue 500GB SATA SSD",
    psu: "Corsair CV650 650W 80+ Bronze",
    motherboard: "MSI PRO B760M-A WIFI DDR4",
    cpuCooler: "Cooler Master Hyper 212 RGB Black Edition",
    case: "Cooler Master MasterBox Q300L Micro-ATX",
    price: "$899",
    likes: 189,
    comments: 32,
    description: "Perfect entry-level build for 1080p gaming without breaking the bank",
    buildDate: "December 2025",
    purpose: "1080p gaming on a budget",
    image: PCBuilds.build2,
  },
  {
    id: "3",
    name: "Workstation Elite",
    owner: "Sara Ahmed",
    category: "Workstation",
    cpu: "AMD Ryzen 7 7700X",
    gpu: "NVIDIA GeForce RTX 5080",
    ram: "G.Skill Ripjaws S5 32GB (2x16GB) DDR5 6000MHz",
    storage: "Samsung 990 PRO 2TB NVMe M.2 SSD",
    psu: "EVGA SuperNOVA 850 G6 850W 80+ Gold Fully Modular",
    motherboard: "MSI MAG X670E TOMAHAWK WIFI",
    cpuCooler: "be quiet! Dark Rock Pro 4",
    case: "Fractal Design Define 7 Compact - Black",
    price: "$3,499",
    likes: 156,
    comments: 28,
    description: "Professional workstation optimized for rendering and productivity tasks",
    buildDate: "November 2025",
    purpose: "Professional content creation and 3D rendering",
    image: PCBuilds.build3,
  },
  {
    id: "4",
    name: "RGB Dream Machine",
    owner: "Omar Hassan",
    category: "Gaming",
    cpu: "AMD Ryzen 5 7600X",
    gpu: "NVIDIA GeForce RTX 5070",
    ram: "Corsair Vengeance RGB 32GB (2x16GB) DDR5 5600MHz",
    storage: "Kingston NV2 1TB NVMe M.2 SSD",
    psu: "Thermaltake Toughpower GF1 750W 80+ Gold Fully Modular",
    motherboard: "ASUS TUF GAMING B650-PLUS WIFI",
    cpuCooler: "NZXT Kraken 240 RGB",
    case: "Lian Li LANCOOL 216 RGB - White",
    price: "$2,199",
    likes: 312,
    comments: 67,
    description: "Beautiful RGB setup perfect for streaming and gaming enthusiasts",
    buildDate: "January 2026",
    purpose: "Gaming and streaming with style",
    image: PCBuilds.build4,
  },
  {
    id: "5",
    name: "Silent Workhorse",
    owner: "Layla Mahmoud",
    category: "Office",
    cpu: "Intel Core i5-13600K",
    gpu: "NVIDIA GeForce RTX 4060",
    ram: "G.Skill Ripjaws S5 32GB (2x16GB) DDR5 5600MHz",
    storage: "Samsung 980 PRO 1TB NVMe M.2 SSD",
    psu: "Corsair RM750 750W 80+ Gold Fully Modular",
    motherboard: "ASUS PRIME Z790-P WIFI",
    cpuCooler: "be quiet! Dark Rock 4",
    case: "be quiet! Pure Base 500DX - Black",
    price: "$1,599",
    likes: 98,
    comments: 19,
    description: "Whisper-quiet PC ideal for office work and productivity applications",
    buildDate: "October 2025",
    purpose: "Office productivity and programming",
    image: PCBuilds.build5,
  },
  {
    id: "6",
    name: "Mini Powerhouse",
    owner: "Yusuf Ali",
    category: "Mini-ITX",
    cpu: "AMD Ryzen 5 7600X",
    gpu: "AMD Radeon RX 9070 XT",
    ram: "Corsair Vengeance 32GB (2x16GB) DDR5 5200MHz",
    storage: "Crucial P3 Plus 1TB NVMe M.2 SSD",
    psu: "Corsair SF750 750W 80+ Platinum SFX Fully Modular",
    motherboard: "ASUS ROG STRIX B650E-I GAMING WIFI",
    cpuCooler: "Noctua NH-L12S Low-Profile CPU Cooler",
    case: "NZXT H1 V2 - Black",
    price: "$2,099",
    likes: 267,
    comments: 54,
    description: "Compact form factor delivering big performance in a small package",
    buildDate: "September 2025",
    purpose: "Compact gaming and portability",
    image: PCBuilds.build6,
  },
  {
    id: "7",
    name: "White Snow Edition",
    owner: "Rana Saleh",
    category: "Gaming",
    cpu: "Intel Core i5-13600K",
    gpu: "NVIDIA GeForce RTX 4080",
    ram: "Corsair Vengeance 32GB (2x16GB) DDR5 5200MHz",
    storage: "Samsung 980 1TB NVMe M.2 SSD",
    psu: "Corsair RM850x 850W 80+ Gold Fully Modular",
    motherboard: "MSI PRO Z790-P WIFI",
    cpuCooler: "Corsair iCUE H100i RGB ELITE",
    case: "Lian Li O11 Dynamic Mini - White",
    price: "$2,799",
    likes: 421,
    comments: 89,
    description: "Stunning all-white themed build with excellent 1440p gaming performance",
    buildDate: "August 2025",
    purpose: "1440p gaming with premium aesthetics",
    image: PCBuilds.build7,
  },
  {
    id: "8",
    name: "Creator's Dream",
    owner: "Tariq Mansour",
    category: "Workstation",
    cpu: "AMD Ryzen 7 7700X",
    gpu: "NVIDIA GeForce RTX 4070",
    ram: "Corsair Vengeance 64GB (2x32GB) DDR5 5200MHz",
    storage: "Western Digital Black SN850X 2TB NVMe M.2 SSD",
    psu: "be quiet! Straight Power 11 850W 80+ Gold Fully Modular",
    motherboard: "MSI MAG B650 TOMAHAWK WIFI",
    cpuCooler: "Arctic Liquid Freezer II 280",
    case: "Fractal Design Meshify 2 Compact - Black",
    price: "$2,599",
    likes: 187,
    comments: 42,
    description: "Optimized for content creation, video editing, and streaming workflows",
    buildDate: "July 2025",
    purpose: "Content creation and streaming",
    image: PCBuilds.build8,
  },
  {
    id: "9",
    name: "First Timer Special",
    owner: "Noor Ibrahim",
    category: "Budget",
    cpu: "AMD Ryzen 5 7600X",
    gpu: "NVIDIA GeForce RTX 4070",
    ram: "Kingston FURY Beast 32GB (2x16GB) DDR5 5200MHz",
    storage: "Kingston NV2 1TB NVMe M.2 SSD",
    psu: "MSI MAG A650BN 650W 80+ Bronze",
    motherboard: "ASRock B650M PG Riptide",
    cpuCooler: "Deepcool AK400",
    case: "Montech X3 Mesh - Black",
    price: "$1,499",
    likes: 278,
    comments: 96,
    description: "Perfect first build with great value and solid 1080p gaming performance",
    buildDate: "June 2025",
    purpose: "Entry-level gaming on student budget",
    image: PCBuilds.build9,
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
        <Image
          source={item.image}
          style={styles.buildImage}
          resizeMode="cover"
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
    position: "relative",
    overflow: "hidden",
  },
  buildImage: {
    width: "100%",
    height: "100%",
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
