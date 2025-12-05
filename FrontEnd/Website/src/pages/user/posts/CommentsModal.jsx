import React, { useState } from 'react';
import colors from '../../../config/colors';
import { FiX, FiSend, FiHeart, FiMessageCircle } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import toast from 'react-hot-toast';

const CommentsModal = ({ post, onClose }) => {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([
    {
      id: 1,
      author: {
        name: 'Mohammed Nasser',
        avatar: 'https://ui-avatars.com/api/?name=Mohammed+Nasser&background=F9B233&color=fff'
      },
      content: 'Great build! How much did it cost in total?',
      timestamp: '1 hour ago',
      likes: 5,
      liked: false,
      replies: []
    },
    {
      id: 2,
      author: {
        name: 'Laila Ibrahim',
        avatar: 'https://ui-avatars.com/api/?name=Laila+Ibrahim&background=F9B233&color=fff'
      },
      content: 'Which shop did you buy from? Looking to build something similar.',
      timestamp: '45 minutes ago',
      likes: 3,
      liked: false,
      replies: [
        {
          id: 3,
          author: {
            name: post.author.name,
            avatar: post.author.avatar
          },
          content: 'I got most parts from Watani Mall in Jerusalem!',
          timestamp: '30 minutes ago',
          likes: 2,
          liked: false
        }
      ]
    }
  ]);
  const [replyingTo, setReplyingTo] = useState(null);

  const handleSubmitComment = (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      toast.error('Please write a comment');
      return;
    }

    const comment = {
      id: Date.now(),
      author: {
        name: 'You',
        avatar: 'https://ui-avatars.com/api/?name=You&background=F9B233&color=fff'
      },
      content: newComment,
      timestamp: 'Just now',
      likes: 0,
      liked: false,
      replies: []
    };

    if (replyingTo) {
      // Add as reply
      setComments(prev => prev.map(c => 
        c.id === replyingTo 
          ? { ...c, replies: [...c.replies, comment] }
          : c
      ));
      setReplyingTo(null);
    } else {
      // Add as new comment
      setComments(prev => [comment, ...prev]);
    }

    setNewComment('');
    toast.success('Comment posted!');
  };

  const handleLikeComment = (commentId, isReply = false, parentId = null) => {
    if (isReply && parentId) {
      setComments(prev => prev.map(c => 
        c.id === parentId
          ? {
              ...c,
              replies: c.replies.map(r =>
                r.id === commentId
                  ? { ...r, liked: !r.liked, likes: r.liked ? r.likes - 1 : r.likes + 1 }
                  : r
              )
            }
          : c
      ));
    } else {
      setComments(prev => prev.map(c =>
        c.id === commentId
          ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 }
          : c
      ));
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{ border: `3px solid ${colors.mainYellow}` }}
      >
        {/* Header */}
        <div 
          className="p-4 border-b-2 flex items-center justify-between"
          style={{ borderColor: colors.platinum }}
        >
          <h2 className="text-2xl font-bold" style={{ color: colors.mainBlack }}>
            {post.author.name}'s Post
          </h2>
          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <FiX size={24} style={{ color: colors.jet }} />
          </button>
        </div>

        {/* Post Preview */}
        <div className="p-4 border-b-2" style={{ borderColor: colors.platinum }}>
          <div className="flex items-center gap-3 mb-3">
            <img 
              src={post.author.avatar} 
              alt={post.author.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="font-bold" style={{ color: colors.mainBlack }}>
                {post.author.name}
              </h3>
              <p className="text-xs" style={{ color: colors.jet }}>
                {post.timestamp}
              </p>
            </div>
          </div>
          <p style={{ color: colors.mainBlack }}>{post.content}</p>
          
          {post.images && post.images.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {post.images.slice(0, 2).map((image, index) => (
                <img 
                  key={index}
                  src={image} 
                  alt={`Post ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 mt-3 pt-3 border-t" style={{ borderColor: colors.platinum }}>
            <div className="flex items-center gap-1">
              <FaHeart size={14} style={{ color: colors.mainYellow }} />
              <span className="text-sm font-semibold" style={{ color: colors.jet }}>
                {post.likes}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <FiMessageCircle size={14} style={{ color: colors.jet }} />
              <span className="text-sm font-semibold" style={{ color: colors.jet }}>
                {comments.reduce((acc, c) => acc + 1 + c.replies.length, 0)} comments
              </span>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4">
          {comments.length === 0 ? (
            <div className="text-center py-8">
              <FiMessageCircle size={48} className="mx-auto mb-3" style={{ color: colors.platinum }} />
              <p style={{ color: colors.jet }}>No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id}>
                  {/* Main Comment */}
                  <div className="flex gap-3">
                    <img 
                      src={comment.author.avatar} 
                      alt={comment.author.name}
                      className="w-10 h-10 rounded-full shrink-0"
                    />
                    <div className="flex-1">
                      <div 
                        className="px-4 py-2 rounded-2xl inline-block"
                        style={{ backgroundColor: colors.mainBeige }}
                      >
                        <h4 className="font-bold text-sm" style={{ color: colors.mainBlack }}>
                          {comment.author.name}
                        </h4>
                        <p className="text-sm" style={{ color: colors.jet }}>
                          {comment.content}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-1 ml-4 text-xs">
                        {/* Like Comment Button */}
                        <button
                          onClick={() => handleLikeComment(comment.id)}
                          className="flex items-center gap-1 text-sm hover:opacity-70 transition-opacity cursor-pointer"
                          style={{ color: comment.liked ? colors.mainYellow : colors.jet }}
                        >
                          <FiThumbsUp size={14} fill={comment.liked ? colors.mainYellow : 'none'} />
                          <span>{comment.likes}</span>
                        </button>

                        {/* Reply Button */}
                        <button
                          onClick={() => setReplyingTo(comment.id)}
                          className="text-sm hover:opacity-70 transition-opacity cursor-pointer"
                          style={{ color: colors.jet }}
                        >
                          Reply
                        </button>
                        <span style={{ color: colors.jet }}>{comment.timestamp}</span>
                      </div>

                      {/* Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-3 space-y-3">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex gap-3">
                              <img 
                                src={reply.author.avatar} 
                                alt={reply.author.name}
                                className="w-8 h-8 rounded-full shrink-0"
                              />
                              <div className="flex-1">
                                <div 
                                  className="px-3 py-2 rounded-2xl inline-block"
                                  style={{ backgroundColor: colors.mainBeige }}
                                >
                                  <h4 className="font-bold text-xs" style={{ color: colors.mainBlack }}>
                                    {reply.author.name}
                                  </h4>
                                  <p className="text-xs" style={{ color: colors.jet }}>
                                    {reply.content}
                                  </p>
                                </div>
                                
                                <div className="flex items-center gap-3 mt-1 ml-3 text-xs">
                                  <button
                                    onClick={() => handleLikeComment(reply.id, true, comment.id)}
                                    className="font-semibold hover:underline cursor-pointer"
                                    style={{ color: reply.liked ? colors.mainYellow : colors.jet }}
                                  >
                                    Like {reply.likes > 0 && `(${reply.likes})`}
                                  </button>
                                  <span style={{ color: colors.jet }}>{reply.timestamp}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Comment Input */}
        <div 
          className="p-4 border-t-2"
          style={{ borderColor: colors.platinum }}
        >
          {replyingTo && (
            <div 
              className="mb-2 px-3 py-2 rounded-lg flex items-center justify-between"
              style={{ backgroundColor: colors.mainYellow + '15' }}
            >
              <span className="text-sm font-semibold" style={{ color: colors.mainBlack }}>
                Replying to {comments.find(c => c.id === replyingTo)?.author.name}
              </span>
              <button
                onClick={() => setReplyingTo(null)}
                className="text-sm font-semibold hover:underline cursor-pointer"
                style={{ color: colors.mainYellow }}
              >
                Cancel
              </button>
            </div>
          )}
          
          <form onSubmit={handleSubmitComment} className="flex gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0"
              style={{ backgroundColor: colors.mainYellow }}
            >
              U
            </div>
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-4 py-2 rounded-full border-2 focus:outline-none transition-colors"
                style={{ 
                  borderColor: colors.platinum,
                  color: colors.mainBlack
                }}
                onFocus={(e) => e.target.style.borderColor = colors.mainYellow}
                onBlur={(e) => e.target.style.borderColor = colors.platinum}
              />
              {/* Send Comment Button */}
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="p-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                style={{ backgroundColor: colors.mainYellow }}
              >
                <FiSend size={20} color="white" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommentsModal;
