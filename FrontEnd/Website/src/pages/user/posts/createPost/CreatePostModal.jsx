import React, { useState } from 'react';
import colors from '../../../../config/colors';
import { FiX, FiImage, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CreatePostModal = ({ onClose, onSubmit }) => {
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate number of images
    if (images.length + files.length > 5) {
      toast.error('You can only upload up to 5 images per post');
      return;
    }

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name} is not a valid image format`);
        return false;
      }

      if (file.size > maxSize) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return false;
      }

      return true;
    });

    if (validFiles.length === 0) return;

    setImages(prev => [...prev, ...validFiles]);

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error('Please write something in your post');
      return;
    }

    const postData = {
      content,
      images,
      timestamp: new Date().toISOString()
    };

    onSubmit(postData);
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{ border: `3px solid ${colors.mainYellow}` }}
      >
        {/* Header */}
        <div 
          className="p-4 border-b-2 flex items-center justify-between"
          style={{ borderColor: colors.platinum }}
        >
          <h2 className="text-2xl font-bold" style={{ color: colors.mainBlack }}>
            Create Post
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX size={24} style={{ color: colors.jet }} />
          </button>
        </div>

        {/* Info Notice */}
        <div 
          className="mx-4 mt-4 p-4 rounded-lg"
          style={{ backgroundColor: colors.mainYellow + '15', border: `1px solid ${colors.mainYellow}` }}
        >
          <p className="text-sm font-semibold" style={{ color: colors.mainBlack }}>
            📋 Your post will be reviewed by our admin team before being published to ensure it follows our community guidelines.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-4">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: colors.mainYellow }}
            >
              U
            </div>
            <div>
              <p className="font-semibold" style={{ color: colors.mainBlack }}>You</p>
              <p className="text-xs" style={{ color: colors.jet }}>Public</p>
            </div>
          </div>

          {/* Content Textarea */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind? Share your build, ask a question, or start a discussion..."
            className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors resize-none mb-4"
            style={{ 
              borderColor: colors.platinum,
              color: colors.mainBlack,
              minHeight: '150px'
            }}
            onFocus={(e) => e.target.style.borderColor = colors.mainYellow}
            onBlur={(e) => e.target.style.borderColor = colors.platinum}
          />

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="mb-4">
              <div className={`grid gap-2 ${imagePreviews.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={preview} 
                      alt={`Preview ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: colors.mainYellow }}
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Images Button */}
          <label 
            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg border-2 cursor-pointer transition-all hover:border-solid"
            style={{ 
              borderColor: colors.platinum,
              borderStyle: 'dashed',
              color: colors.jet
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = colors.mainYellow;
              e.currentTarget.style.backgroundColor = colors.mainYellow + '08';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = colors.platinum;
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
            <FiImage size={20} style={{ color: colors.mainYellow }} />
            <span className="font-semibold">Add Photos ({images.length}/5)</span>
          </label>
        </form>

        {/* Footer */}
        <div 
          className="p-4 border-t-2 flex gap-3"
          style={{ borderColor: colors.platinum }}
        >
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-lg font-semibold transition-colors border-2"
            style={{ 
              borderColor: colors.platinum,
              color: colors.jet,
              backgroundColor: 'white'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-6 py-3 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: colors.mainYellow }}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
