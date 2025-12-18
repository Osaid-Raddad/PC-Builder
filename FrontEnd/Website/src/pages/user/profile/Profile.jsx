import React, { useState } from 'react';
import Navbar from '../../../components/user/navbar/Navbar';
import Footer from '../../../components/user/footer/Footer';
import BlurText from '../../../components/animations/BlurText/BlurText';
import ProfileHeader from './profileComponents/ProfileHeader';
import ProfileTabs from './profileComponents/ProfileTabs';
import OverviewTab from './profileComponents/OverviewTab';
import BuildsTab from './profileComponents/BuildsTab';
import FavoritesTab from './profileComponents/FavoritesTab';
import ActivityTab from './profileComponents/ActivityTab';
import EditProfileModal from './profileComponents/EditProfileModal';
import SettingsModal from './profileComponents/SettingsModal';
import colors from '../../../config/colors';
import { FiHeart, FiMessageSquare } from 'react-icons/fi';
import { FaDesktop } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Mock user data
  const [userData, setUserData] = useState({
    id: 1,
    name: 'Ahmad Hassan',
    email: 'ahmad.hassan@example.com',
    phone: '+970 59 123 4567',
    location: 'Nablus, Palestine',
    joinDate: 'January 2024',
    avatar: 'https://ui-avatars.com/api/?name=Ahmad+Hassan&background=F9B233&color=fff&size=200',
    bio: 'PC enthusiast and gaming lover. Always looking for the latest hardware!',
    stats: {
      builds: 5,
      favorites: 12,
      posts: 8,
      followers: 45
    }
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    buildUpdates: true,
    priceAlerts: false,
    newsletter: true,
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false
  });

  // Mock data
  const savedBuilds = [
    {
      id: 1,
      name: 'Gaming Beast',
      category: 'Gaming',
      price: '$2,500',
      image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400',
      lastModified: '2 days ago'
    },
    {
      id: 2,
      name: 'Workstation Pro',
      category: 'Workstation',
      price: '$3,200',
      image: 'https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=400',
      lastModified: '1 week ago'
    },
    {
      id: 3,
      name: 'Budget Build',
      category: 'Budget',
      price: '$800',
      image: 'https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?w=400',
      lastModified: '2 weeks ago'
    }
  ];

  const favoriteProducts = [
    {
      id: 1,
      name: 'Intel Core i9-14900K',
      category: 'CPU',
      price: '$589.99',
      image: 'https://via.placeholder.com/150',
      inStock: true
    },
    {
      id: 2,
      name: 'NVIDIA RTX 4090',
      category: 'GPU',
      price: '$1,599.99',
      image: 'https://via.placeholder.com/150',
      inStock: true
    },
    {
      id: 3,
      name: 'Corsair Vengeance 32GB',
      category: 'RAM',
      price: '$129.99',
      image: 'https://via.placeholder.com/150',
      inStock: false
    }
  ];

  const activityHistory = [
    {
      id: 1,
      type: 'build',
      action: 'Created a new build',
      title: 'Gaming Beast',
      timestamp: '2 hours ago',
      icon: <FaDesktop />
    },
    {
      id: 2,
      type: 'favorite',
      action: 'Added to favorites',
      title: 'Intel Core i9-14900K',
      timestamp: '5 hours ago',
      icon: <FiHeart />
    },
    {
      id: 3,
      type: 'post',
      action: 'Created a post',
      title: 'My new RGB setup!',
      timestamp: '1 day ago',
      icon: <FiMessageSquare />
    },
    {
      id: 4,
      type: 'build',
      action: 'Updated build',
      title: 'Workstation Pro',
      timestamp: '3 days ago',
      icon: <FaDesktop />
    }
  ];

  const handleEditProfile = (updatedData) => {
    setUserData(updatedData);
    setShowEditModal(false);
    toast.success('Profile updated successfully!');
  };

  const handleSaveSettings = (updatedSettings) => {
    setSettings(updatedSettings);
    setShowSettingsModal(false);
    toast.success('Settings saved successfully!');
  };

  const handleDeleteAccount = () => {
    toast.error('This feature will be implemented with backend');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.mainBeige }}>
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <BlurText 
            text="My Profile"
            className="text-5xl font-bold mb-3"
            delay={100}
            animateBy="words"
            direction="top"
          />
        </div>

        {/* Profile Header */}
        <ProfileHeader
          userData={userData}
          onEditClick={() => setShowEditModal(true)}
          onSettingsClick={() => setShowSettingsModal(true)}
        />

        {/* Tabs */}
        <ProfileTabs 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Tab Content */}
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'builds' && <BuildsTab builds={savedBuilds} />}
        {activeTab === 'favorites' && <FavoritesTab products={favoriteProducts} />}
        {activeTab === 'activity' && <ActivityTab activities={activityHistory} />}
      </div>

      {/* Modals */}
      {showEditModal && (
        <EditProfileModal
          userData={userData}
          onClose={() => setShowEditModal(false)}
          onSave={handleEditProfile}
        />
      )}

      {showSettingsModal && (
        <SettingsModal
          initialSettings={settings}
          onClose={() => setShowSettingsModal(false)}
          onSave={handleSaveSettings}
          onDeleteAccount={handleDeleteAccount}
        />
      )}

      <Footer />
    </div>
  );
};

export default Profile;
