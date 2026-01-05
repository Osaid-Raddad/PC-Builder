import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import Navbar from '../../../components/user/navbar/Navbar';
import Footer from '../../../components/user/footer/Footer';
import colors from '../../../config/colors';
import { FiPlus, FiImage } from 'react-icons/fi';
import CreatePostModal from './CreatePostModal';
import PostCard from './PostCard';
import CommentsModal from './CommentsModal';
import toast from 'react-hot-toast';
import BlurText from '../../../components/animations/BlurText/BlurText';
import BounceCard from '../../../components/animations/BounceCard/BounceCard';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [likedPosts, setLikedPosts] = useState(() => {
    const saved = localStorage.getItem('likedPosts');
    return saved ? JSON.parse(saved) : [];
  });
  const observerTarget = useRef(null);

  // Save liked posts to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
  }, [likedPosts]);

  // Fetch posts from API
  const fetchPosts = useCallback(async (pageNum) => {
    if (loading) return;
    
    // Only fetch on first load since API returns all posts
    if (pageNum > 1) {
      setHasMore(false);
      return;
    }
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('Please login to view posts');
        setLoading(false);
        setHasMore(false);
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/User/Posts/GetApprovedPosts`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data && response.data.length > 0) {
        // Map posts and add liked status from localStorage
        const postsWithLikedStatus = response.data.map(post => ({
          ...post,
          liked: likedPosts.includes(post.id) || post.isLiked || post.liked,
          isLiked: likedPosts.includes(post.id) || post.isLiked || post.liked
        }));
        setPosts(postsWithLikedStatus);
        // Since API returns all posts, disable infinite scroll
        setHasMore(false);
      } else {
        setPosts([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
      } else {
        toast.error('Failed to load posts. Please try again.');
      }
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  // Initial load
  useEffect(() => {
    fetchPosts(1);
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, loading]);

  // Load more when page changes
  useEffect(() => {
    if (page > 1) {
      fetchPosts(page);
    }
  }, [page]);

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem('authToken');
      
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/User/Posts/likePost/${postId}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Update the post's like status and count in local state
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          const isCurrentlyLiked = post.liked || post.isLiked;
          const newLikedState = !isCurrentlyLiked;
          
          // Update localStorage
          if (newLikedState) {
            setLikedPosts(curr => [...curr, postId]);
          } else {
            setLikedPosts(curr => curr.filter(id => id !== postId));
          }
          
          return {
            ...post,
            liked: newLikedState,
            isLiked: newLikedState,
            likesCount: isCurrentlyLiked ? post.likesCount - 1 : post.likesCount + 1
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error('Failed to like post');
    }
  };

  const handleComment = (post) => {
    setSelectedPost(post);
    setShowCommentsModal(true);
  };

  const handleCreatePost = () => {
    setShowCreateModal(false);
    // Refresh posts after creating a new one
    setPosts([]);
    setPage(1);
    setHasMore(true);
    fetchPosts(1);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.mainBeige }}>
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <BlurText 
              text="Community Posts"
              className="text-5xl font-bold mb-3"
              delay={100}
              animateBy="words"
              direction="top"
            />
          </div>
          <p className="text-lg" style={{ color: colors.jet }}>
            Share your builds, ask questions, and connect with PC builders
          </p>
        </div>

        {/* Create Post Section */}
        <div 
          className="bg-white rounded-lg shadow-md p-6 mb-6 cursor-pointer hover:shadow-lg transition-all"
          style={{ border: `2px solid ${colors.platinum}` }}
          onClick={() => setShowCreateModal(true)}
        >
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl"
              style={{ backgroundColor: colors.mainYellow }}
            >
              <FiPlus size={24} />
            </div>
            <div className="flex-1">
              <div 
                className="px-4 py-3 rounded-full text-left"
                style={{ backgroundColor: colors.mainBeige, color: colors.jet }}
              >
                What's on your mind? Share your PC build or ask a question...
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mt-4 pt-4 border-t-2" style={{ borderColor: colors.platinum }}>
            <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-opacity-10 transition-all cursor-pointer"
                    style={{ color: colors.mainYellow }}>
              <FiImage size={20} />
              <span className="font-semibold">Photo/Video</span>
            </button>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post, index) => (
            <BounceCard key={post.id} index={index}>
              <PostCard
                post={post}
                onLike={handleLike}
                onComment={handleComment}
              />
            </BounceCard>
          ))}
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="text-center py-8">
            <div 
              className="inline-block w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: colors.mainYellow, borderTopColor: 'transparent' }}
            />
            <p className="mt-4 font-semibold" style={{ color: colors.jet }}>Loading more posts...</p>
          </div>
        )}

        {/* Infinite scroll trigger */}
        <div ref={observerTarget} className="h-4" />

        {/* No more posts message */}
        {!hasMore && posts.length > 0 && (
          <div className="text-center py-8">
            <p className="font-semibold" style={{ color: colors.jet }}>
              You've reached the end! 🎉
            </p>
          </div>
        )}

        {/* Empty state */}
        {posts.length === 0 && !loading && (
          <div className="text-center py-16">
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: colors.mainYellow + '20' }}
            >
              <FiImage size={48} style={{ color: colors.mainYellow }} />
            </div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: colors.mainBlack }}>
              No posts yet
            </h3>
            <p style={{ color: colors.jet }}>Be the first to share something with the community!</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreatePostModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreatePost}
        />
      )}

      {showCommentsModal && selectedPost && (
        <CommentsModal
          post={selectedPost}
          onClose={() => setShowCommentsModal(false)}
        />
      )}

      <Footer />
    </div>
  );
};

export default Posts;
