import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/user/navbar/Navbar';
import Footer from '../../../components/user/footer/Footer';
import colors from '../../../config/colors';
import { FiUpload, FiImage, FiUser, FiTag, FiDollarSign, FiCpu, FiMonitor, FiHardDrive, FiZap, FiAlignLeft } from 'react-icons/fi';
import { BsCpuFill } from 'react-icons/bs';
import { FaMicrochip, FaMemory } from 'react-icons/fa';
import toast from 'react-hot-toast';

const SubmitBuild = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    buildName: '',
    ownerName: '',
    category: 'Gaming',
    price: '',
    cpu: '',
    gpu: '',
    ram: '',
    storage: '',
    psu: '',
    description: '',
    image: null
  });

  const categories = ['Gaming', 'Workstation', 'Budget', 'Office', 'Mini-ITX'];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      setFormData({ ...formData, image: file });
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.image) {
      toast.error('Please upload an image of your build');
      return;
    }

    if (!formData.buildName || !formData.ownerName || !formData.cpu || !formData.gpu) {
      toast.error('Please fill in all required fields');
      return;
    }

    // TODO: Send data to backend
    console.log('Build submission:', formData);
    toast.success('Your build has been submitted successfully! It will be reviewed shortly.');
    
    // Navigate back to completed builds after 2 seconds
    setTimeout(() => {
      navigate('/completed-builds');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.mainBeige }}>
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4" style={{ color: colors.mainBlack }}>
            Submit Your Build
          </h1>
          <p className="text-xl" style={{ color: colors.jet }}>
            Share your amazing PC build with the community and inspire others!
          </p>
        </div>

        {/* Form */}
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Image Upload */}
              <div>
                <div 
                  className="bg-white rounded-lg shadow-lg p-6 mb-6"
                  style={{ border: `2px solid ${colors.platinum}` }}
                >
                  <h3 className="text-2xl font-bold mb-4" style={{ color: colors.mainBlack }}>
                    Build Image *
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Image Preview */}
                    <div 
                      className="relative h-80 rounded-lg overflow-hidden flex items-center justify-center"
                      style={{ 
                        backgroundColor: colors.platinum,
                        backgroundImage: imagePreview ? `url(${imagePreview})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      {!imagePreview && (
                        <div className="text-center">
                          <FiImage size={64} style={{ color: colors.mainYellow }} className="mx-auto mb-4" />
                          <p className="text-lg font-semibold" style={{ color: colors.jet }}>
                            No image selected
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Upload Button */}
                    <label 
                      className="flex items-center justify-center gap-3 px-6 py-4 rounded-lg font-bold cursor-pointer hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: colors.mainYellow, color: 'white' }}
                    >
                      <FiUpload size={20} />
                      Choose Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    
                    <p className="text-sm text-center" style={{ color: colors.jet }}>
                      Max file size: 5MB. Supported formats: JPG, PNG, WebP
                    </p>
                  </div>
                </div>

                {/* Basic Info */}
                <div 
                  className="bg-white rounded-lg shadow-lg p-6"
                  style={{ border: `2px solid ${colors.platinum}` }}
                >
                  <h3 className="text-2xl font-bold mb-4" style={{ color: colors.mainBlack }}>
                    Basic Information
                  </h3>

                  <div className="space-y-4">
                    {/* Build Name */}
                    <div>
                      <label className="flex items-center gap-2 mb-2 font-semibold" style={{ color: colors.mainBlack }}>
                        <FiTag size={18} style={{ color: colors.mainYellow }} />
                        Build Name *
                      </label>
                      <input
                        type="text"
                        name="buildName"
                        value={formData.buildName}
                        onChange={handleInputChange}
                        placeholder="e.g., Ultimate Gaming Beast"
                        className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                        style={{
                          border: `2px solid ${colors.platinum}`,
                          backgroundColor: 'white',
                          color: colors.jet
                        }}
                        required
                      />
                    </div>

                    {/* Owner Name */}
                    <div>
                      <label className="flex items-center gap-2 mb-2 font-semibold" style={{ color: colors.mainBlack }}>
                        <FiUser size={18} style={{ color: colors.mainYellow }} />
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleInputChange}
                        placeholder="Enter your name"
                        className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                        style={{
                          border: `2px solid ${colors.platinum}`,
                          backgroundColor: 'white',
                          color: colors.jet
                        }}
                        required
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="flex items-center gap-2 mb-2 font-semibold" style={{ color: colors.mainBlack }}>
                        <FiTag size={18} style={{ color: colors.mainYellow }} />
                        Category *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                        style={{
                          border: `2px solid ${colors.platinum}`,
                          backgroundColor: 'white',
                          color: colors.jet
                        }}
                        required
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    {/* Price */}
                    <div>
                      <label className="flex items-center gap-2 mb-2 font-semibold" style={{ color: colors.mainBlack }}>
                        <FiDollarSign size={18} style={{ color: colors.mainYellow }} />
                        Total Price
                      </label>
                      <input
                        type="text"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="e.g., $2,500"
                        className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                        style={{
                          border: `2px solid ${colors.platinum}`,
                          backgroundColor: 'white',
                          color: colors.jet
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Specs */}
              <div>
                <div 
                  className="bg-white rounded-lg shadow-lg p-6 mb-6"
                  style={{ border: `2px solid ${colors.platinum}` }}
                >
                  <h3 className="text-2xl font-bold mb-4" style={{ color: colors.mainBlack }}>
                    PC Specifications
                  </h3>

                  <div className="space-y-4">
                    {/* CPU */}
                    <div>
                      <label className="flex items-center gap-2 mb-2 font-semibold" style={{ color: colors.mainBlack }}>
                        <BsCpuFill size={18} style={{ color: colors.mainYellow }} />
                        CPU / Processor *
                      </label>
                      <input
                        type="text"
                        name="cpu"
                        value={formData.cpu}
                        onChange={handleInputChange}
                        placeholder="e.g., Intel Core i9-14900K"
                        className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                        style={{
                          border: `2px solid ${colors.platinum}`,
                          backgroundColor: 'white',
                          color: colors.jet
                        }}
                        required
                      />
                    </div>

                    {/* GPU */}
                    <div>
                      <label className="flex items-center gap-2 mb-2 font-semibold" style={{ color: colors.mainBlack }}>
                        <FaMicrochip size={18} style={{ color: colors.mainYellow }} />
                        GPU / Graphics Card *
                      </label>
                      <input
                        type="text"
                        name="gpu"
                        value={formData.gpu}
                        onChange={handleInputChange}
                        placeholder="e.g., NVIDIA RTX 4090"
                        className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                        style={{
                          border: `2px solid ${colors.platinum}`,
                          backgroundColor: 'white',
                          color: colors.jet
                        }}
                        required
                      />
                    </div>

                    {/* RAM */}
                    <div>
                      <label className="flex items-center gap-2 mb-2 font-semibold" style={{ color: colors.mainBlack }}>
                        <FaMemory size={18} style={{ color: colors.mainYellow }} />
                        RAM / Memory
                      </label>
                      <input
                        type="text"
                        name="ram"
                        value={formData.ram}
                        onChange={handleInputChange}
                        placeholder="e.g., 32GB DDR5"
                        className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                        style={{
                          border: `2px solid ${colors.platinum}`,
                          backgroundColor: 'white',
                          color: colors.jet
                        }}
                      />
                    </div>

                    {/* Storage */}
                    <div>
                      <label className="flex items-center gap-2 mb-2 font-semibold" style={{ color: colors.mainBlack }}>
                        <FiHardDrive size={18} style={{ color: colors.mainYellow }} />
                        Storage
                      </label>
                      <input
                        type="text"
                        name="storage"
                        value={formData.storage}
                        onChange={handleInputChange}
                        placeholder="e.g., 1TB NVMe SSD"
                        className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                        style={{
                          border: `2px solid ${colors.platinum}`,
                          backgroundColor: 'white',
                          color: colors.jet
                        }}
                      />
                    </div>

                    {/* PSU */}
                    <div>
                      <label className="flex items-center gap-2 mb-2 font-semibold" style={{ color: colors.mainBlack }}>
                        <FiZap size={18} style={{ color: colors.mainYellow }} />
                        Power Supply (PSU)
                      </label>
                      <input
                        type="text"
                        name="psu"
                        value={formData.psu}
                        onChange={handleInputChange}
                        placeholder="e.g., 850W 80+ Gold"
                        className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                        style={{
                          border: `2px solid ${colors.platinum}`,
                          backgroundColor: 'white',
                          color: colors.jet
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div 
                  className="bg-white rounded-lg shadow-lg p-6"
                  style={{ border: `2px solid ${colors.platinum}` }}
                >
                  <h3 className="text-2xl font-bold mb-4" style={{ color: colors.mainBlack }}>
                    Description
                  </h3>

                  <div>
                    <label className="flex items-center gap-2 mb-2 font-semibold" style={{ color: colors.mainBlack }}>
                      <FiAlignLeft size={18} style={{ color: colors.mainYellow }} />
                      Tell us about your build
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your build, its purpose, what you love about it, or any special features..."
                      rows="6"
                      className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 resize-none"
                      style={{
                        border: `2px solid ${colors.platinum}`,
                        backgroundColor: 'white',
                        color: colors.jet
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-center gap-4">
              <button
                type="button"
                onClick={() => navigate('/completed-builds')}
                className="px-8 py-4 rounded-lg font-bold transition-opacity hover:opacity-90 text-lg"
                style={{
                  backgroundColor: 'white',
                  color: colors.jet,
                  border: `2px solid ${colors.platinum}`
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-12 py-4 rounded-lg font-bold text-white hover:opacity-90 transition-opacity text-lg"
                style={{ backgroundColor: colors.mainYellow }}
              >
                Submit Build
              </button>
            </div>

            <p className="text-center mt-6 text-sm" style={{ color: colors.jet }}>
              * Required fields. Your build will be reviewed before being published.
            </p>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SubmitBuild;
