import React, { useState, useEffect } from 'react';
import { FiMessageSquare, FiHeart, FiMessageCircle, FiTrash2, FiImage } from 'react-icons/fi';
import BounceCard from '../../../../components/animations/BounceCard/BounceCard';
import colors from '../../../../config/colors';
import toast from 'react-hot-toast';
import apiClient from '../../../../services/apiService';
import Swal from 'sweetalert2';

const PostsTab = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/User/Posts/myPosts');
      setPosts(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    const result = await Swal.fire({
      title: 'Delete Post?',
      text: 'Are you sure you want to delete this post? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    try {
      await apiClient.delete(`/User/Posts/${postId}`);
      toast.success('Post deleted successfully');
      fetchMyPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      1: { label: 'Published', color: '#10b981', bgColor: '#d1fae5' },
      2: { label: 'Pending', color: '#f59e0b', bgColor: '#fef3c7' },
      0: { label: 'Draft', color: '#6b7280', bgColor: '#f3f4f6' }
    };
    
    const config = statusConfig[status] || statusConfig[0];
    
    return (
      <span 
        className="px-3 py-1 rounded-full text-xs font-semibold"
        style={{ 
          color: config.color,
          backgroundColor: config.bgColor
        }}
      >
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" 
             style={{ borderColor: colors.mainYellow }}></div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <BounceCard>
        <div 
          className="bg-white rounded-lg shadow-lg p-12 text-center"
          style={{ border: `2px solid ${colors.platinum}` }}
        >
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: colors.mainYellow + '20' }}
          >
            <FiMessageSquare size={40} style={{ color: colors.mainYellow }} />
          </div>
          <h3 className="text-2xl font-bold mb-2" style={{ color: colors.mainBlack }}>
            No Posts Yet
          </h3>
          <p className="text-lg" style={{ color: colors.jet }}>
            You haven't created any posts. Share your thoughts with the community!
          </p>
        </div>
      </BounceCard>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {posts.map((post, index) => (
          <BounceCard key={post.id} index={index}>
            <div 
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all"
              style={{ border: `2px solid ${colors.platinum}` }}
            >
              {/* Post Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(post.userFullName || 'User')}&background=F9B233&color=fff&size=100`}
                      alt={post.userFullName}
                      className="w-14 h-14 rounded-full border-3 shadow-md"
                      style={{ borderColor: colors.mainYellow }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-lg" style={{ color: colors.mainBlack }}>
                          {post.userFullName || 'Unknown User'}
                        </h4>
                        {getStatusBadge(post.status)}
                      </div>
                      <p className="text-sm flex items-center gap-2" style={{ color: colors.jet }}>
                        {formatDate(post.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="p-2 rounded-lg hover:bg-red-50 transition-all cursor-pointer group"
                    title="Delete post"
                  >
                    <FiTrash2 size={20} className="transition-transform group-hover:scale-110" style={{ color: '#dc2626' }} />
                  </button>
                </div>

                {/* Post Content */}
                <div className="mb-4">
                  <p className="text-base leading-relaxed whitespace-pre-wrap" style={{ color: colors.mainBlack }}>
                    {post.description}
                  </p>
                </div>
              </div>

              {/* Post Images */}
              {post.imageUrls && post.imageUrls.length > 0 && (
                <div className={`mb-4 ${post.imageUrls.length === 1 ? '' : 'grid grid-cols-2 gap-1'}`}>
                  {post.imageUrls.map((imageUrl, idx) => (
                    <img 
                      key={idx}
                      src={imageUrl} 
                      alt={`Post image ${idx + 1}`}
                      className="w-full h-64 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                      onClick={() => setSelectedImage(imageUrl)}
                    />
                  ))}
                </div>
              )}

              {/* Post Stats */}
              <div className="px-6 py-4 bg-gray-50 border-t" style={{ borderColor: colors.platinum }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 group cursor-pointer">
                      <div 
                        className="p-2 rounded-full transition-colors group-hover:bg-red-100"
                        style={{ backgroundColor: `${colors.mainYellow}15` }}
                      >
                        <FiHeart size={18} style={{ color: colors.mainYellow }} />
                      </div>
                      <span className="text-sm font-semibold" style={{ color: colors.jet }}>
                        {post.likesCount || 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 group cursor-pointer">
                      <div 
                        className="p-2 rounded-full transition-colors group-hover:bg-blue-100"
                        style={{ backgroundColor: `${colors.mainYellow}15` }}
                      >
                        <FiMessageCircle size={18} style={{ color: colors.mainYellow }} />
                      </div>
                      <span className="text-sm font-semibold" style={{ color: colors.jet }}>
                        {post.commentsCount || 0}
                      </span>
                    </div>
                  </div>
                  
                  {post.imageUrls && post.imageUrls.length > 0 && (
                    <div className="flex items-center gap-2">
                      <FiImage size={16} style={{ color: colors.jet }} />
                      <span className="text-sm font-semibold" style={{ color: colors.jet }}>
                        {post.imageUrls.length} {post.imageUrls.length === 1 ? 'Image' : 'Images'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </BounceCard>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            ×
          </button>
          <img
            src={selectedImage}
            alt="Full size"
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default PostsTab;
