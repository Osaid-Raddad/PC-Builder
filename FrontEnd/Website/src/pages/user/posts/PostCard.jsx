import React from 'react';
import colors from '../../../config/colors';
import { FiHeart, FiMessageCircle, FiShare2 } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';

const PostCard = ({ post, onLike, onComment }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all"
      style={{ border: `2px solid ${colors.platinum}` }}
    >
      {/* Post Header */}
      <div className="p-4 flex items-center gap-3">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
          style={{ backgroundColor: colors.mainYellow }}
        >
          {post.userFullName?.[0]?.toUpperCase() || 'U'}
        </div>
        <div className="flex-1">
          <h3 className="font-bold" style={{ color: colors.mainBlack }}>
            {post.userFullName || 'Unknown User'}
          </h3>
          <p className="text-sm" style={{ color: colors.jet }}>
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
      <div className="px-4 pb-3">
        <p style={{ color: colors.mainBlack }}>
          {post.description}
        </p>
      </div>

      {/* Post Images */}
      {post.imageUrls && post.imageUrls.length > 0 && (
        <div className={`${post.imageUrls.length === 1 ? '' : 'grid grid-cols-2 gap-1'}`}>
          {post.imageUrls.map((image, index) => (
            <img 
              key={index}
              src={image} 
              alt={`Post image ${index + 1}`}
              className="w-full h-64 object-cover cursor-pointer hover:opacity-95 transition-opacity"
              onClick={() => window.open(image, '_blank')}
            />
          ))}
        </div>
      )}

      {/* Post Stats */}
      <div 
        className="px-4 py-3 flex items-center justify-between border-t-2 border-b-2"
        style={{ borderColor: colors.platinum }}
      >
        <div className="flex items-center gap-2">
          <FaHeart size={16} style={{ color: colors.mainYellow }} />
          <span className="text-sm font-semibold" style={{ color: colors.jet }}>
            {post.likesCount || 0} {post.likesCount === 1 ? 'Like' : 'Likes'}
          </span>
        </div>
        <button 
          className="text-sm font-semibold hover:underline cursor-pointer"
          style={{ color: colors.jet }}
          onClick={() => onComment(post)}
        >
          {post.commentsCount || 0} {post.commentsCount === 1 ? 'Comment' : 'Comments'}
        </button>
      </div>

      {/* Post Actions */}
      <div className="px-4 py-2 flex items-center justify-around">
        <button
          onClick={() => onLike(post.id)}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-opacity-10 transition-all font-semibold cursor-pointer"
          style={{ 
            color: (post.liked || post.isLiked) ? colors.mainYellow : colors.jet,
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.mainYellow + '10'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          {(post.liked || post.isLiked) ? <FaHeart size={20} /> : <FiHeart size={20} />}
          <span>Like</span>
        </button>

        <button
          onClick={() => onComment(post)}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-opacity-10 transition-all font-semibold cursor-pointer"
          style={{ color: colors.jet }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.mainYellow + '10'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <FiMessageCircle size={20} />
          <span>Comment</span>
        </button>

        <button
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-opacity-10 transition-all font-semibold cursor-pointer"
          style={{ color: colors.jet }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.mainYellow + '10'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <FiShare2 size={20} />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;
