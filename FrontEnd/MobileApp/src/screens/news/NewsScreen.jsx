import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Linking,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import ScreenLayout from "../../components/ScreenLayout";
import colors from "../../config/colors";

export default function NewsScreen({ navigation }) {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'GPU', 'CPU', 'Memory', 'Gaming', 'Reviews', 'Guides', 'Hardware'];

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    filterNews();
  }, [selectedCategory, news]);

  const categorizeArticle = (title, description, content) => {
    const text = `${title} ${description} ${content}`.toLowerCase();
    
    if (text.includes('rtx') || text.includes('radeon') || text.includes('gpu') || text.includes('graphics card') || text.includes('geforce')) {
      return 'GPU';
    } else if (text.includes('ryzen') || text.includes('intel core') || text.includes('cpu') || text.includes('processor')) {
      return 'CPU';
    } else if (text.includes('review') || text.includes('benchmark') || text.includes('test')) {
      return 'Reviews';
    } else if (text.includes('guide') || text.includes('how to') || text.includes('tutorial')) {
      return 'Guides';
    } else if (text.includes('gaming') || text.includes('game') || text.includes('fps')) {
      return 'Gaming';
    } else if (text.includes('memory') || text.includes('ram') || text.includes('ddr')) {
      return 'Memory';
    } else {
      return 'Hardware';
    }
  };

  const fetchNews = async () => {
    try {
      setLoading(true);
      
      const feeds = [
        "https://www.tomshardware.com/feeds/all",
        "https://wccftech.com/feed/",
        "https://www.kitguru.net/feed/",
        "https://www.pcgamer.com/rss/",
        "https://www.techpowerup.com/rss/news",
      ];

      const results = await Promise.all(
        feeds.map(feed =>
          fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed)}&count=20&api_key=purhhnfkx3uftzbtrpqlllkr9anbvtxapcqebezm`)
            .then(res => res.json())
            .then(data => {
              if (data.items) {
                return data.items.map(item => ({
                  id: item.guid || item.link,
                  title: item.title,
                  description: item.description?.replace(/<[^>]*>/g, '').substring(0, 150) || 'No description available',
                  content: item.content?.replace(/<[^>]*>/g, '').substring(0, 200) || item.description?.replace(/<[^>]*>/g, '').substring(0, 200) || '',
                  category: categorizeArticle(item.title, item.description || '', item.content || ''),
                  source: new URL(feed).hostname.replace('www.', ''),
                  author: item.author || 'Unknown',
                  publishedAt: item.pubDate,
                  url: item.link,
                  thumbnail: item.thumbnail || item.enclosure?.link || null,
                }));
              }
              return [];
            })
            .catch(err => {
              console.error(`Error fetching from ${feed}:`, err);
              return [];
            })
        )
      );

      const merged = results.flat();
      const sorted = merged.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
      
      setNews(sorted);
      setFilteredNews(sorted);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching news:', error);
      setLoading(false);
    }
  };

  const filterNews = () => {
    if (selectedCategory === 'All') {
      setFilteredNews(news);
    } else {
      setFilteredNews(news.filter(item => item.category === selectedCategory));
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNews();
    setRefreshing(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleArticlePress = (url) => {
    Linking.openURL(url).catch(err => console.error('Error opening URL:', err));
  };

  const getCategoryColor = (category) => {
    const categoryColors = {
      'GPU': '#10b981',
      'CPU': '#3b82f6',
      'Memory': '#f59e0b',
      'Reviews': '#8b5cf6',
      'Guides': '#ec4899',
      'Gaming': '#ef4444',
      'Hardware': '#6366f1',
    };
    return categoryColors[category] || colors.mainYellow;
  };

  const getCategoryIcon = (category) => {
    const categoryIcons = {
      'GPU': 'chip',
      'CPU': 'cpu',
      'Memory': 'memory',
      'Reviews': 'clipboard-check',
      'Guides': 'book-open-variant',
      'Gaming': 'gamepad-variant',
      'Hardware': 'tools',
    };
    return categoryIcons[category] || 'newspaper';
  };

  const renderNews = ({ item }) => (
    <TouchableOpacity 
      style={styles.newsCard}
      onPress={() => handleArticlePress(item.url)}
    >
      {item.thumbnail ? (
        <Image 
          source={{ uri: item.thumbnail }} 
          style={styles.newsImage}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.newsImage, styles.noImage]}>
          <MaterialCommunityIcons 
            name={getCategoryIcon(item.category)} 
            size={32} 
            color={getCategoryColor(item.category)} 
          />
        </View>
      )}
      <View style={styles.newsContent}>
        <View style={styles.newsHeader}>
          <View style={[
            styles.categoryBadge,
            { backgroundColor: getCategoryColor(item.category) + '20' }
          ]}>
            <Text style={[
              styles.categoryText,
              { color: getCategoryColor(item.category) }
            ]}>
              {item.category}
            </Text>
          </View>
          <Text style={styles.newsTime}>{formatDate(item.publishedAt)}</Text>
        </View>
        <Text style={styles.newsTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.newsDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.newsFooter}>
          <Text style={styles.newsSource}>{item.source}</Text>
          <Feather name="external-link" size={14} color={colors.text} />
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <ScreenLayout navigation={navigation} scrollable={false}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Latest News</Text>
            <Text style={styles.subtitle}>
              Stay updated with PC hardware news
            </Text>
          </View>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.mainYellow} />
            <Text style={styles.loadingText}>Loading latest news...</Text>
          </View>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout navigation={navigation} scrollable={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Latest News</Text>
          <Text style={styles.subtitle}>
            Stay updated with PC hardware news
          </Text>
        </View>

        {/* Category Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.filterChip,
                selectedCategory === category && styles.filterChipActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedCategory === category && styles.filterTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <FlatList
          data={filteredNews}
          renderItem={renderNews}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.mainYellow]}
              tintColor={colors.mainYellow}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons 
                name="newspaper-variant-outline" 
                size={64} 
                color={colors.text} 
              />
              <Text style={styles.emptyText}>
                {selectedCategory === 'All' 
                  ? 'No news available' 
                  : `No ${selectedCategory} news available`}
              </Text>
            </View>
          }
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
    marginBottom: 20,
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
  filtersContainer: {
    marginBottom: 10,
    minHeight: 42,
  },
  filtersContent: {
    paddingRight: 20,
    paddingVertical: 2,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "white",
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.platinum,
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterChipActive: {
    backgroundColor: colors.mainYellow,
    borderColor: colors.mainYellow,
  },
  filterText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "500",
  },
  filterTextActive: {
    color: colors.mainBlack,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text,
  },
  listContainer: {
    paddingBottom: 20,
  },
  newsCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  newsImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
  },
  noImage: {
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  newsContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  newsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "600",
  },
  newsTime: {
    fontSize: 11,
    color: colors.text,
  },
  newsTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.mainBlack,
    marginBottom: 4,
    lineHeight: 20,
  },
  newsDescription: {
    fontSize: 13,
    color: colors.text,
    marginBottom: 6,
    lineHeight: 18,
  },
  newsFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  newsSource: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text,
  },
});
