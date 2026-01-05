import { useState, useEffect } from 'react';
import { MdDelete, MdEdit, MdVisibility, MdFlag } from 'react-icons/md';
import axios from 'axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import colors from '../../config/colors';

const PostManagement = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('Authentication required');
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/Admins/Posts/allPosts`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setPosts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      if (error.response?.status === 401) {
        toast.error('Unauthorized. Please login again.');
      } else {
        toast.error('Failed to fetch posts');
      }
      setLoading(false);
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
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/Admins/Posts/approvePost/${postId}`,
          {},
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        toast.success('Post approved successfully!');
        fetchPosts(); // Refresh the list
      } catch (error) {
        console.error('Error approving post:', error);
        toast.error('Failed to approve post');
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
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/Admins/Posts/rejectPost/${postId}`,
          {},
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        toast.success('Post rejected successfully!');
        fetchPosts(); // Refresh the list
      } catch (error) {
        console.error('Error rejecting post:', error);
        toast.error('Failed to reject post');
      }
    }
  };

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    if (filter === 'pending') return post.status === 'Pending';
    if (filter === 'approved') return post.status === 'Approved';
    if (filter === 'rejected') return post.status === 'Rejected';
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2" 
             style={{ borderColor: colors.primary }}></div>
      </div>
    );
  }

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

        {/* Filters */}
        <div className="flex gap-2">
          {['all', 'pending', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all capitalize cursor-pointer ${
                filter === status ? 'text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
              }`}
              style={{
                backgroundColor: filter === status ? colors.primary : 'transparent'
              }}
            >
              {status}
              {status === 'pending' && (
                <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-600 rounded-full text-xs">
                  {posts.filter(p => p.status === 'Pending').length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredPosts.map((post) => (
          <div key={post.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: 
                        post.status === 'Pending' ? '#FEF3C7' :
                        post.status === 'Approved' ? '#D1FAE5' :
                        post.status === 'Rejected' ? '#FEE2E2' : '#E5E7EB',
                      color: 
                        post.status === 'Pending' ? '#92400E' :
                        post.status === 'Approved' ? '#065F46' :
                        post.status === 'Rejected' ? '#991B1B' : '#374151'
                    }}
                  >
                    {post.status}
                  </span>
                </div>
                
                {/* Author Info */}
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: colors.primary }}
                  >
                    {post.user?.userName?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: colors.text }}>
                      {post.user?.userName || 'Unknown User'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Post Content */}
                <p className="text-gray-700 mb-3 whitespace-pre-wrap">{post.description}</p>

                {/* Post Images */}
                {post.images && post.images.length > 0 && (
                  <div className={`grid gap-2 mb-3 ${post.images.length === 1 ? 'grid-cols-1' : post.images.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                    {post.images.map((image, index) => (
                      <img 
                        key={index}
                        src={image} 
                        alt={`Post image ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(image, '_blank')}
                      />
                    ))}
                  </div>
                )}

                {/* Post Stats */}
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <span>❤️ {post.likes || 0} likes</span>
                  <span>💬 {post.comments || 0} comments</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {post.status === 'Pending' && (
                <>
                  <button
                    onClick={() => handleApprove(post.id)}
                    className="flex items-center gap-2 px-6 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity cursor-pointer"
                    style={{ backgroundColor: colors.success }}
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => handleReject(post.id)}
                    className="flex items-center gap-2 px-6 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity cursor-pointer"
                    style={{ backgroundColor: colors.error }}
                  >
                    ✗ Reject
                  </button>
                </>
              )}
              {post.status === 'Approved' && (
                <button
                  onClick={() => handleReject(post.id)}
                  className="flex items-center gap-2 px-6 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity cursor-pointer"
                  style={{ backgroundColor: colors.error }}
                >
                  ✗ Reject
                </button>
              )}
              {post.status === 'Rejected' && (
                <button
                  onClick={() => handleApprove(post.id)}
                  className="flex items-center gap-2 px-6 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity cursor-pointer"
                  style={{ backgroundColor: colors.success }}
                >
                  ✓ Approve
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No {filter} posts found</p>
        </div>
      )}
    </div>
  );
};

export default PostManagement;
