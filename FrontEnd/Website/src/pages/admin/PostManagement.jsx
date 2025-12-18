import { useState, useEffect } from 'react';
import { MdDelete, MdEdit, MdVisibility, MdFlag } from 'react-icons/md';
import axios from 'axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import colors from '../../config/colors';

const PostManagement = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, published, flagged, deleted

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      // Mock data
      setPosts([
        {
          id: 1,
          title: 'Best Budget Gaming PC Build 2024',
          author: 'TechGuru123',
          content: 'Here\'s my recommended budget gaming build...',
          category: 'Builds',
          likes: 156,
          comments: 45,
          status: 'published',
          isFlagged: false,
          createdAt: '2024-01-15',
          views: 2340
        },
        {
          id: 2,
          title: 'RTX 4090 vs RTX 4080: Which to Buy?',
          author: 'GPUExpert',
          content: 'Detailed comparison of the latest NVIDIA cards...',
          category: 'Reviews',
          likes: 289,
          comments: 78,
          status: 'published',
          isFlagged: true,
          flagReason: 'Spam reported',
          createdAt: '2024-01-14',
          views: 4521
        },
        {
          id: 3,
          title: 'How to Install RAM Correctly',
          author: 'BuildMaster',
          content: 'Step by step guide for RAM installation...',
          category: 'Tutorials',
          likes: 92,
          comments: 23,
          status: 'published',
          isFlagged: false,
          createdAt: '2024-01-13',
          views: 1890
        }
      ]);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch posts');
      setLoading(false);
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
        setPosts(posts.filter(post => post.id !== postId));
        toast.success('Post deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete post');
      }
    }
  };

  const handleReviewFlag = async (post) => {
    const result = await Swal.fire({
      title: 'Review Flagged Post',
      html: `
        <div class="text-left">
          <p class="mb-2"><strong>Post:</strong> ${post.title}</p>
          <p class="mb-2"><strong>Author:</strong> ${post.author}</p>
          <p class="mb-4"><strong>Reason:</strong> ${post.flagReason}</p>
          <p class="text-gray-600 mb-4">${post.content.substring(0, 100)}...</p>
        </div>
      `,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Keep Post',
      denyButtonText: 'Remove Post',
      confirmButtonColor: colors.success,
      denyButtonColor: colors.error,
      cancelButtonColor: colors.secondary
    });

    if (result.isConfirmed) {
      setPosts(posts.map(p => p.id === post.id ? { ...p, isFlagged: false } : p));
      toast.success('Post approved');
    } else if (result.isDenied) {
      setPosts(posts.filter(p => p.id !== post.id));
      toast.success('Post removed');
    }
  };

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    if (filter === 'flagged') return post.isFlagged;
    return post.status === filter;
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
          {['all', 'published', 'flagged'].map((status) => (
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
              {status === 'flagged' && (
                <span className="ml-2 px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs">
                  {posts.filter(p => p.isFlagged).length}
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
                  <h3 className="text-xl font-bold" style={{ color: colors.text }}>
                    {post.title}
                  </h3>
                  {post.isFlagged && (
                    <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-semibold">
                      <MdFlag />
                      FLAGGED
                    </span>
                  )}
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: `${colors.primary}20`,
                      color: colors.primary
                    }}
                  >
                    {post.category}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{post.content}</p>
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <span><strong>Author:</strong> {post.author}</span>
                  <span><strong>Posted:</strong> {post.createdAt}</span>
                  <span>👁️ {post.views} views</span>
                  <span>❤️ {post.likes} likes</span>
                  <span>💬 {post.comments} comments</span>
                </div>
                {post.isFlagged && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">
                      <strong>Flag Reason:</strong> {post.flagReason}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {post.isFlagged && (
                <button
                  onClick={() => handleReviewFlag(post)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity cursor-pointer"
                  style={{ backgroundColor: colors.warning }}
                >
                  <MdFlag className="text-xl" />
                  Review Flag
                </button>
              )}
              <button
                onClick={() => window.open(`/posts/${post.id}`, '_blank')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors cursor-pointer"
                style={{ color: colors.primary }}
              >
                <MdVisibility className="text-xl" />
                View
              </button>
              <button
                onClick={() => handleDelete(post.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity cursor-pointer"
                style={{ backgroundColor: colors.error }}
              >
                <MdDelete className="text-xl" />
                Delete
              </button>
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
