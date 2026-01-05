import { useState, useEffect } from 'react';
import { MdDelete, MdCheck, MdClose } from 'react-icons/md';
import axios from 'axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import colors from '../../config/colors';

const PostManagement = () => {
  const [approvedPosts, setApprovedPosts] = useState([]);
  const [pendingPosts, setPendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // pending, approved

  useEffect(() => {
    fetchAllPosts();
  }, []);

  const fetchAllPosts = async () => {
    setLoading(true);
    await Promise.all([fetchApprovedPosts(), fetchPendingPosts()]);
    setLoading(false);
  };

  const fetchApprovedPosts = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/Admins/Posts/GetApprovedPosts`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setApprovedPosts(response.data);
    } catch (error) {
      console.error('Error fetching approved posts:', error);
      if (error.response?.status === 401) {
        toast.error('Unauthorized. Please login again.');
      } else {
        toast.error('Failed to fetch approved posts');
      }
    }
  };

  const fetchPendingPosts = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/Admins/Posts/GetPendingPosts`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setPendingPosts(response.data);
    } catch (error) {
      console.error('Error fetching pending posts:', error);
      if (error.response?.status === 401) {
        toast.error('Unauthorized. Please login again.');
      } else {
        toast.error('Failed to fetch pending posts');
      }
    }
  };

  const handleApprove = async (postId) => {
    const result = await Swal.fire({
      title: 'Approve Post?',
      text: 'This post will be published to the community.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: colors.success,
      cancelButtonColor: colors.secondary,
      confirmButtonText: 'Yes, approve it!'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          toast.error('Authentication token not found. Please login again.');
          return;
        }

        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/api/Admins/Posts/ApprovePost/${postId}`,
          {},
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        toast.success('Post approved successfully! 🎉');
        fetchAllPosts(); // Refresh both lists
      } catch (error) {
        console.error('Error approving post:', error);
        if (error.response?.status === 401) {
          toast.error('Unauthorized. Please login again.');
        } else if (error.response?.status === 404) {
          toast.error('Post not found.');
        } else if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Failed to approve post. Please try again.');
        }
      }
    }
  };

  const handleReject = async (postId) => {
    const result = await Swal.fire({
      title: 'Reject Post?',
      text: 'This post will be rejected and not published.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: colors.error,
      cancelButtonColor: colors.secondary,
      confirmButtonText: 'Yes, reject it!'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          toast.error('Authentication token not found. Please login again.');
          return;
        }

        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/api/Admins/Posts/RejectPost/${postId}`,
          {},
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        toast.success('Post rejected successfully! ✅');
        fetchAllPosts(); // Refresh both lists
      } catch (error) {
        console.error('Error rejecting post:', error);
        if (error.response?.status === 401) {
          toast.error('Unauthorized. Please login again.');
        } else if (error.response?.status === 404) {
          toast.error('Post not found.');
        } else if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Failed to reject post. Please try again.');
        }
      }
    }
  };

  const handleDelete = async (postId) => {
    const result = await Swal.fire({
      title: 'Delete Post?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: colors.error,
      cancelButtonColor: colors.secondary,
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          toast.error('Authentication token not found. Please login again.');
          return;
        }

        await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/api/Admins/Posts/DeletePost/${postId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        toast.success('Post deleted successfully! 🗑️');
        fetchAllPosts(); // Refresh both lists
      } catch (error) {
        console.error('Error deleting post:', error);
        if (error.response?.status === 401) {
          toast.error('Unauthorized. Please login again.');
        } else if (error.response?.status === 404) {
          toast.error('Post not found.');
        } else if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Failed to delete post. Please try again.');
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2" 
             style={{ borderColor: colors.primary }}></div>
      </div>
    );
  }

  const PostCard = ({ post, isPending }) => (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
      {/* Post ID Badge */}
      <div className="flex items-center justify-between mb-4">
        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
          Post #{post.id}
        </span>
        <span 
          className="px-3 py-1 rounded-full text-xs font-semibold"
          style={{
            backgroundColor: isPending ? '#FEF3C7' : '#D1FAE5',
            color: isPending ? '#92400E' : '#065F46'
          }}
        >
          {isPending ? 'Pending Review' : 'Published'}
        </span>
      </div>

      {/* Author Info */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md"
          style={{ backgroundColor: colors.primary }}
        >
          {post.userFullName?.[0]?.toUpperCase() || 'U'}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-lg" style={{ color: colors.text }}>
            {post.userFullName || 'Unknown User'}
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <span>📅</span>
            {new Date(post.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap">
          {post.description}
        </p>
      </div>

      {/* Post Images */}
      {post.imageUrls && post.imageUrls.length > 0 && (
        <div className={`grid gap-3 mb-4 ${
          post.imageUrls.length === 1 ? 'grid-cols-1' : 
          post.imageUrls.length === 2 ? 'grid-cols-2' : 
          'grid-cols-3'
        }`}>
          {post.imageUrls.map((image, index) => (
            <div key={index} className="relative group overflow-hidden rounded-lg shadow-md">
              <img 
                src={image} 
                alt={`Post image ${index + 1}`}
                className="w-full h-52 object-cover cursor-pointer transition-transform duration-300 group-hover:scale-110"
                onClick={() => window.open(image, '_blank')}
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                {index + 1}/{post.imageUrls.length}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post Stats */}
      <div className="flex items-center gap-6 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg">
          <span className="text-red-500 text-lg">❤️</span> 
          <span className="font-semibold text-red-600">
            {post.likesCount || 0}
          </span>
          <span className="text-gray-500">
            {post.likesCount === 1 ? 'like' : 'likes'}
          </span>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
          <span className="text-blue-500 text-lg">💬</span> 
          <span className="font-semibold text-blue-600">
            {post.commentsCount || 0}
          </span>
          <span className="text-gray-500">
            {post.commentsCount === 1 ? 'comment' : 'comments'}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {isPending ? (
          <>
            <button
              onClick={() => handleApprove(post.id)}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-medium hover:opacity-90 transition-all duration-200 transform hover:scale-105 cursor-pointer"
              style={{ backgroundColor: colors.success }}
            >
              <MdCheck className="text-xl" />
              Approve
            </button>
            <button
              onClick={() => handleReject(post.id)}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-medium hover:opacity-90 transition-all duration-200 transform hover:scale-105 cursor-pointer"
              style={{ backgroundColor: colors.error }}
            >
              <MdClose className="text-xl" />
              Reject
            </button>
          </>
        ) : (
          <button
            onClick={() => handleDelete(post.id)}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-medium hover:opacity-90 transition-all duration-200 transform hover:scale-105 cursor-pointer"
            style={{ backgroundColor: colors.error }}
          >
            <MdDelete className="text-xl" />
            Delete Post
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: colors.text }}>
            Post Management
          </h1>
          <p className="text-gray-500 mt-1">Manage and moderate community posts</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-6 py-3 font-semibold transition-all relative cursor-pointer ${
            activeTab === 'pending' ? 'text-white' : 'text-gray-600 hover:text-gray-800'
          }`}
          style={{
            backgroundColor: activeTab === 'pending' ? colors.primary : 'transparent',
            borderRadius: activeTab === 'pending' ? '8px 8px 0 0' : '0'
          }}
        >
          Pending Posts
          {pendingPosts.length > 0 && (
            <span 
              className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold"
              style={{
                backgroundColor: activeTab === 'pending' ? 'rgba(255,255,255,0.3)' : '#FEF3C7',
                color: activeTab === 'pending' ? 'white' : '#92400E'
              }}
            >
              {pendingPosts.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('approved')}
          className={`px-6 py-3 font-semibold transition-all relative cursor-pointer ${
            activeTab === 'approved' ? 'text-white' : 'text-gray-600 hover:text-gray-800'
          }`}
          style={{
            backgroundColor: activeTab === 'approved' ? colors.primary : 'transparent',
            borderRadius: activeTab === 'approved' ? '8px 8px 0 0' : '0'
          }}
        >
          Approved Posts
          {approvedPosts.length > 0 && (
            <span 
              className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold"
              style={{
                backgroundColor: activeTab === 'approved' ? 'rgba(255,255,255,0.3)' : '#D1FAE5',
                color: activeTab === 'approved' ? 'white' : '#065F46'
              }}
            >
              {approvedPosts.length}
            </span>
          )}
        </button>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {activeTab === 'pending' && pendingPosts.map((post) => (
          <PostCard key={post.id} post={post} isPending={true} />
        ))}
        {activeTab === 'approved' && approvedPosts.map((post) => (
          <PostCard key={post.id} post={post} isPending={false} />
        ))}
      </div>

      {/* Empty State */}
      {((activeTab === 'pending' && pendingPosts.length === 0) || 
        (activeTab === 'approved' && approvedPosts.length === 0)) && (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <div className="text-6xl mb-4">
            {activeTab === 'pending' ? '⏳' : '✅'}
          </div>
          <p className="text-gray-500 text-lg font-medium">
            No {activeTab} posts found
          </p>
          <p className="text-gray-400 text-sm mt-2">
            {activeTab === 'pending' 
              ? 'All posts have been reviewed!' 
              : 'Approved posts will appear here.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default PostManagement;
