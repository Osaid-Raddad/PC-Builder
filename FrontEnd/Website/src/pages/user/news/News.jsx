import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiSearch, FiFilter, FiClock, FiExternalLink, FiTrendingUp, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { BsBookmark, BsShare } from 'react-icons/bs';

const News = () => {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 12;

  const categories = [
    'all',
    'GPU',
    'CPU',
    'Hardware',
    'Gaming',
    'Reviews',
    'Guides'
  ];

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    filterNews();
  }, [searchTerm, selectedCategory, news]);

  useEffect(() => {
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchTerm, selectedCategory]);

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
        "https://www.anandtech.com/rss/",
        "https://www.guru3d.com/rss/"
      ];

      const results = await Promise.all(
        feeds.map(feed =>
          fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed)}&count=50&api_key=purhhnfkx3uftzbtrpqlllkr9anbvtxapcqebezm`)
            .then(res => res.json())
            .then(data => {
              if (data.items) {
                return data.items.map(item => ({
                  id: item.guid || item.link,
                  title: item.title,
                  description: item.description?.replace(/<[^>]*>/g, '').substring(0, 200) || 'No description available',
                  content: item.content?.replace(/<[^>]*>/g, '').substring(0, 300) || item.description?.replace(/<[^>]*>/g, '').substring(0, 300) || '',
                  category: categorizeArticle(item.title, item.description || '', item.content || ''),
                  source: new URL(feed).hostname.replace('www.', ''),
                  author: item.author || 'Unknown',
                  publishedAt: item.pubDate,
                  url: item.link,
                  urlToImage: item.thumbnail || item.enclosure?.link || 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&auto=format&fit=crop',
                  featured: false,
                  views: `${Math.floor(Math.random() * 20) + 1}K`,
                  readTime: `${Math.floor(Math.random() * 10) + 3} min read`
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
      
      // Mark first 3 as featured on each page
      const withFeatured = sorted.map((item, index) => ({
        ...item,
        featured: index % articlesPerPage < 3 && index < sorted.length
      }));
      
      setNews(withFeatured);
      setFilteredNews(withFeatured);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error('Failed to fetch news. Please try again later.');
      setLoading(false);
    }
  };

  const filterNews = () => {
    let filtered = news;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => 
        item.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredNews(filtered);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleBookmark = (articleId) => {
    toast.success('Article bookmarked!');
  };

  const handleShare = (article) => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.description,
        url: article.url,
      });
    } else {
      navigator.clipboard.writeText(article.url);
      toast.success('Link copied to clipboard!');
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredNews.length / articlesPerPage);
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredNews.slice(indexOfFirstArticle, indexOfLastArticle);
  
  const featuredPosts = currentArticles.filter(article => article.featured);
  const regularPosts = currentArticles.filter(article => !article.featured);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 7;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="min-h-screen bg-[#333533]">
      {/* Header */}
      <div className="bg-[#242423] border-b border-[#F5CB5C]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#F5CB5C] flex items-center gap-3">
                <img 
                  src="/src/assets/Images/LogoIcon.png" 
                  alt="PC Builder Logo" 
                  style={{ height: '50px', width: 'auto', objectFit: 'contain' }}
                />
                PC Building News
              </h1>
              <p className="text-gray-400 mt-2">Stay updated with the latest hardware releases and tech news</p>
            </div>
            <Link 
              to="/builder" 
              className="hidden md:block px-6 py-3 bg-[#F5CB5C] text-[#242423] rounded-lg font-semibold hover:bg-[#E5BB4C] transition-all"
            >
              Build Your PC
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search news articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-[#242423] border border-[#F5CB5C]/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#F5CB5C] transition-all"
            />
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <FiFilter className="text-[#F5CB5C] text-xl shrink-0" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-full font-medium transition-all shrink-0 ${
                  selectedCategory === category
                    ? 'bg-[#F5CB5C] text-[#242423]'
                    : 'bg-[#242423] text-gray-400 hover:text-white border border-[#F5CB5C]/20'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <AiOutlineLoading3Quarters className="text-[#F5CB5C] text-5xl animate-spin mb-4" />
            <p className="text-gray-400 text-lg">Loading latest news...</p>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">No news articles found</p>
          </div>
        ) : (
          <>
            {/* Results Info */}
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-gray-400 text-sm">
                Showing <span className="text-white font-semibold">{indexOfFirstArticle + 1}</span> - <span className="text-white font-semibold">{Math.min(indexOfLastArticle, filteredNews.length)}</span> of <span className="text-white font-semibold">{filteredNews.length}</span> articles
              </p>
              <div className="flex items-center gap-4">
                <p className="text-gray-400 text-sm">
                  Page <span className="text-[#F5CB5C] font-semibold">{currentPage}</span> of <span className="text-white font-semibold">{totalPages}</span>
                </p>
                <select
                  value={currentPage}
                  onChange={(e) => handlePageChange(Number(e.target.value))}
                  className="px-3 py-1.5 bg-[#242423] border border-[#F5CB5C]/20 rounded-lg text-white text-sm focus:outline-none focus:border-[#F5CB5C] transition-all"
                >
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <option key={page} value={page}>
                      Page {page}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Featured Posts Section */}
            {featuredPosts.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <FiTrendingUp className="text-[#F5CB5C] text-2xl" />
                  <h2 className="text-2xl font-bold text-white">Featured Posts</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {featuredPosts.map((article, index) => (
                    <motion.article
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="bg-[#242423] rounded-xl overflow-hidden border border-[#F5CB5C]/20 hover:border-[#F5CB5C]/40 transition-all group"
                    >
                      {/* Large Image */}
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={article.urlToImage}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-[#242423] via-transparent to-transparent"></div>
                        <div className="absolute top-4 left-4 flex gap-2">
                          <span className="px-3 py-1 bg-[#F5CB5C] text-[#242423] text-xs font-bold rounded-full">
                            {article.category}
                          </span>
                          <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                            <FiTrendingUp /> Featured
                          </span>
                        </div>
                        <div className="absolute bottom-4 right-4 flex gap-2">
                          <button
                            onClick={() => handleBookmark(article.id)}
                            className="p-2 bg-[#242423]/80 backdrop-blur-sm rounded-full text-white hover:bg-[#F5CB5C] hover:text-[#242423] transition-all"
                          >
                            <BsBookmark />
                          </button>
                          <button
                            onClick={() => handleShare(article)}
                            className="p-2 bg-[#242423]/80 backdrop-blur-sm rounded-full text-white hover:bg-[#F5CB5C] hover:text-[#242423] transition-all"
                          >
                            <BsShare />
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#F5CB5C] transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-gray-400 mb-4 line-clamp-2">
                          {article.content}
                        </p>

                        {/* Author & Meta */}
                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#F5CB5C]/10">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#F5CB5C] rounded-full flex items-center justify-center text-[#242423] font-bold">
                              {article.author.charAt(0)}
                            </div>
                            <div>
                              <p className="text-white font-medium text-sm">{article.author}</p>
                              <p className="text-gray-500 text-xs">{article.source}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-400 text-xs">{article.views} views</p>
                            <p className="text-gray-500 text-xs">{article.readTime}</p>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <FiClock />
                            {formatDate(article.publishedAt)}
                          </span>
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-[#F5CB5C] font-semibold hover:gap-3 transition-all text-sm"
                          >
                            Read More
                            <FiExternalLink />
                          </a>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </div>
            )}

            {/* Regular Posts Section */}
            {regularPosts.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">Latest Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularPosts.map((article, index) => (
                    <motion.article
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="bg-[#242423] rounded-xl overflow-hidden border border-[#F5CB5C]/10 hover:border-[#F5CB5C]/30 transition-all group"
                    >
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={article.urlToImage}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1 bg-[#F5CB5C] text-[#242423] text-xs font-bold rounded-full">
                            {article.category}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3 flex gap-2">
                          <button
                            onClick={() => handleBookmark(article.id)}
                            className="p-1.5 bg-[#242423]/80 backdrop-blur-sm rounded-full text-white hover:bg-[#F5CB5C] hover:text-[#242423] transition-all text-sm"
                          >
                            <BsBookmark />
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-[#F5CB5C] transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                          {article.description}
                        </p>

                        {/* Meta Info */}
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                          <span className="flex items-center gap-1">
                            <FiClock />
                            {formatDate(article.publishedAt)}
                          </span>
                          <span>{article.readTime}</span>
                        </div>

                        {/* Read More Link */}
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-[#F5CB5C] font-semibold hover:gap-3 transition-all"
                        >
                          Read Full Article
                          <FiExternalLink />
                        </a>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 flex-wrap mt-12">
                {/* Previous Button */}
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className={`p-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                    currentPage === 1
                      ? 'bg-[#242423] text-gray-600 cursor-not-allowed'
                      : 'bg-[#242423] text-white hover:bg-[#F5CB5C] hover:text-[#242423] border border-[#F5CB5C]/20'
                  }`}
                >
                  <FiChevronLeft />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-2">
                  {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                      <span key={`ellipsis-${index}`} className="px-3 text-gray-500">
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                          currentPage === page
                            ? 'bg-[#F5CB5C] text-[#242423] scale-110'
                            : 'bg-[#242423] text-white hover:bg-[#F5CB5C]/20 border border-[#F5CB5C]/20'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`p-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                    currentPage === totalPages
                      ? 'bg-[#242423] text-gray-600 cursor-not-allowed'
                      : 'bg-[#242423] text-white hover:bg-[#F5CB5C] hover:text-[#242423] border border-[#F5CB5C]/20'
                  }`}
                >
                  <span className="hidden sm:inline">Next</span>
                  <FiChevronRight />
                </button>
              </div>
            )}

            {/* Back to Top Button */}
            {currentPage > 1 && (
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed bottom-8 right-8 p-4 bg-[#F5CB5C] text-[#242423] rounded-full shadow-lg hover:bg-[#E5BB4C] transition-all z-50 flex items-center gap-2"
              >
                <FiChevronLeft className="rotate-90" />
                <span className="hidden sm:inline font-semibold">Back to Top</span>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};


export default News;
export default News;
