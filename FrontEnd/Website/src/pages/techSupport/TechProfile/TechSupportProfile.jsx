import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/user/navbar/Navbar';
import Footer from '../../../components/user/footer/Footer';
import BlurText from '../../../components/animations/BlurText/BlurText';
import TechSupportHeader from './techComponents/TechSupportHeader';
import TechSupportTabs from './techComponents/TechSupportTabs';
import OverviewTab from './techComponents/OverviewTab';
import AppointmentsTab from './techComponents/AppointmentsTab';
import ScheduleTab from './techComponents/ScheduleTab.jsx';
import StatsTab from './techComponents/StatsTab';
import EditProfileModal from './techComponents/EditProfileModal';
import SettingsModal from './techComponents/SettingsModal';
import colors from '../../../config/colors';
import toast from 'react-hot-toast';
import apiClient from '../../../services/apiService';

const TechSupportProfile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // User data from API
  const [userData, setUserData] = useState(null);

  // Fetch tech support profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/Profile/TechProfile/profile');
        const profileData = response.data;
        
        // Transform API data to match component structure
        const transformedData = {
          id: profileData.id,
          name: profileData.fullName || '-',
          email: profileData.email || '-',
          phone: profileData.phone || '-',
          city: profileData.city || '-',
          street: profileData.street || '-',
          location: profileData.city && profileData.street 
            ? `${profileData.street}, ${profileData.city}` 
            : profileData.city || profileData.street || '-',
          bio: profileData.bio || '-',
          specialization: profileData.specialization || '-',
          experience: profileData.yearsOfExperience ? `${profileData.yearsOfExperience} years` : '-',
          yearsOfExperience: profileData.yearsOfExperience || '',
          rate: profileData.rate || '-',
          role: profileData.role || '-',
          joinDate: profileData.createdAt 
            ? new Date(profileData.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long' 
              })
            : '-',
          avatar: profileData.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.fullName || 'User')}&background=F9B233&color=fff&size=200`,
          isOnline: true, // Default
          stats: {
            totalAppointments: profileData.completedSessionsCount || 0,
            rating: 0, // Will be handled later
            reviews: 0, // Will be handled later
            responseTime: '-' // Will be handled later
          }
        };
        
        setUserData(transformedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tech profile data:', error);
        toast.error('Failed to load profile data');
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Mock appointments data
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      userName: 'Ahmad Hassan',
      userEmail: 'ahmad@example.com',
      date: 'December 28, 2024',
      time: '10:00 AM',
      duration: '1 hour',
      status: 'pending',
      message: 'I need help choosing components for a gaming PC build. Budget is around $1500.',
      meetingLink: null
    },
    {
      id: 2,
      userName: 'Sara Mohammed',
      userEmail: 'sara@example.com',
      date: 'December 28, 2024',
      time: '2:00 PM',
      duration: '45 minutes',
      status: 'accepted',
      message: 'My PC is running slow and I think I need to upgrade my RAM. Can you help?',
      meetingLink: 'https://meet.jit.si/TechSupport-2-1234567890'
    },
    {
      id: 3,
      userName: 'Omar Khalil',
      userEmail: 'omar@example.com',
      date: 'December 29, 2024',
      time: '11:00 AM',
      duration: '30 minutes',
      status: 'pending',
      message: 'Need advice on cooling solutions for my new build.',
      meetingLink: null
    },
    {
      id: 4,
      userName: 'Layla Mansour',
      userEmail: 'layla@example.com',
      date: 'December 27, 2024',
      time: '3:00 PM',
      duration: '1 hour',
      status: 'completed',
      message: 'Troubleshooting boot issues with my new PC.',
      meetingLink: null
    },
    {
      id: 5,
      userName: 'Yusuf Ali',
      userEmail: 'yusuf@example.com',
      date: 'December 26, 2024',
      time: '1:00 PM',
      duration: '45 minutes',
      status: 'rejected',
      message: 'Need help with BIOS settings.',
      meetingLink: null
    }
  ]);

  // Mock schedule data
  const [schedule, setSchedule] = useState({
    monday: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '18:00' }],
    tuesday: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '18:00' }],
    wednesday: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '18:00' }],
    thursday: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '18:00' }],
    friday: [{ start: '09:00', end: '13:00' }],
    saturday: [{ start: '10:00', end: '14:00' }],
    sunday: []
  });

  // Mock stats data
  const stats = {
    totalSessions: 127,
    thisMonth: 23,
    averageRating: 4.8,
    totalReviews: 89,
    avgResponseTime: '< 2hrs',
    successRate: 95,
    monthlyData: [
      { month: 'July', sessions: 18 },
      { month: 'August', sessions: 25 },
      { month: 'September', sessions: 22 },
      { month: 'October', sessions: 28 },
      { month: 'November', sessions: 21 },
      { month: 'December', sessions: 23 }
    ],
    recentReviews: [
      {
        id: 1,
        userName: 'Ahmad Hassan',
        rating: 5,
        comment: 'Very knowledgeable and patient! Helped me build my first gaming PC.',
        date: '3 days ago'
      },
      {
        id: 2,
        userName: 'Sara Mohammed',
        rating: 5,
        comment: 'Excellent service! Solved my PC issues quickly and professionally.',
        date: '1 week ago'
      },
      {
        id: 3,
        userName: 'Omar Khalil',
        rating: 4,
        comment: 'Great advice on component selection. Very responsive!',
        date: '2 weeks ago'
      }
    ]
  };

  // Today's schedule (mock)
  const todaySchedule = [
    {
      id: 2,
      time: '10:00 AM',
      userName: 'Ahmad Hassan',
      status: 'pending'
    },
    {
      id: 3,
      time: '2:00 PM',
      userName: 'Sara Mohammed',
      status: 'confirmed'
    }
  ];

  // Upcoming appointments (mock)
  const upcomingAppointments = [
    {
      date: 'Tomorrow',
      time: '11:00 AM',
      userName: 'Omar Khalil',
      daysUntil: 1
    },
    {
      date: 'Dec 30',
      time: '3:00 PM',
      userName: 'Layla Mansour',
      daysUntil: 2
    },
    {
      date: 'Dec 31',
      time: '10:00 AM',
      userName: 'Yusuf Ali',
      daysUntil: 3
    }
  ];

  const [settings, setSettings] = useState({
    emailNotifications: true,
    appointmentReminders: true,
    newRequestAlerts: true,
    reviewNotifications: true,
    profileVisibility: 'public',
    showContactInfo: true
  });

  // Handlers
  const handleUpdateAppointmentStatus = (appointmentId, newStatus) => {
    setAppointments(appointments.map(apt => 
      apt.id === appointmentId ? { ...apt, status: newStatus } : apt
    ));
    
    const statusMessages = {
      accepted: 'Appointment accepted! You can now generate a meeting link.',
      rejected: 'Appointment rejected.',
      completed: 'Appointment marked as completed!'
    };
    
    toast.success(statusMessages[newStatus] || 'Appointment status updated');
  };

  const handleGenerateMeeting = (appointmentId) => {
    const roomName = `TechSupport-${appointmentId}-${Date.now()}`;
    const meetingLink = `https://meet.jit.si/${roomName}`;
    
    setAppointments(appointments.map(apt => 
      apt.id === appointmentId ? { ...apt, meetingLink } : apt
    ));
    
    toast.success('Meeting link generated! Share it with the user.');
  };

  const handleSaveSchedule = (newSchedule) => {
    setSchedule(newSchedule);
    toast.success('Schedule updated successfully!');
  };

  const handleEditProfile = async (updatedData, avatarFile) => {
    try {
      // Create FormData for the API request
      const formData = new FormData();
      
      // Add text fields (only if they are not '-' or empty)
      formData.append('FullName', updatedData.name && updatedData.name !== '-' ? updatedData.name : '');
      formData.append('Email', updatedData.email && updatedData.email !== '-' ? updatedData.email : '');
      formData.append('Phone', updatedData.phone && updatedData.phone !== '-' ? updatedData.phone : '');
      formData.append('City', updatedData.city && updatedData.city !== '-' ? updatedData.city : '');
      formData.append('Street', updatedData.street && updatedData.street !== '-' ? updatedData.street : '');
      formData.append('Bio', updatedData.bio && updatedData.bio !== '-' ? updatedData.bio : '');
      formData.append('Specialization', updatedData.specialization || '');
      formData.append('YearsOfExperience', updatedData.yearsOfExperience ? updatedData.yearsOfExperience.toString() : '0');
      
      // Add profile image if a new one was selected
      if (avatarFile) {
        formData.append('ProfileImage', avatarFile);
      }
      
      // Call the API
      await apiClient.put('/Profile/TechProfile/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Refresh profile data after successful update
      const response = await apiClient.get('/Profile/TechProfile/profile');
      const profileData = response.data;
      
      // Transform updated data
      const transformedData = {
        id: profileData.id,
        name: profileData.fullName || '-',
        email: profileData.email || '-',
        phone: profileData.phone || '-',
        city: profileData.city || '-',
        street: profileData.street || '-',
        location: profileData.city && profileData.street 
          ? `${profileData.street}, ${profileData.city}` 
          : profileData.city || profileData.street || '-',
        bio: profileData.bio || '-',
        specialization: profileData.specialization || '-',
        experience: profileData.yearsOfExperience ? `${profileData.yearsOfExperience} years` : '-',
        yearsOfExperience: profileData.yearsOfExperience || '',
        rate: profileData.rate || '-',
        role: profileData.role || '-',
        joinDate: profileData.createdAt 
          ? new Date(profileData.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long' 
            })
          : '-',
        avatar: profileData.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.fullName || 'User')}&background=F9B233&color=fff&size=200`,
        isOnline: true,
        stats: {
          totalAppointments: profileData.completedSessionsCount || 0,
          rating: 0,
          reviews: 0,
          responseTime: '-'
        }
      };
      
      setUserData(transformedData);
      setShowEditModal(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
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
            text="Tech Support Profile"
            className="text-5xl font-bold mb-3"
            delay={100}
            animateBy="words"
            direction="top"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2" 
                 style={{ borderColor: colors.mainYellow }}></div>
          </div>
        ) : userData ? (
          <>
            {/* Profile Header */}
            <TechSupportHeader
              userData={userData}
              onEditClick={() => setShowEditModal(true)}
              onSettingsClick={() => setShowSettingsModal(true)}
            />

            {/* Tabs */}
            <TechSupportTabs 
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <OverviewTab 
                upcomingAppointments={upcomingAppointments}
                todaySchedule={todaySchedule}
              />
            )}
            
            {activeTab === 'appointments' && (
              <AppointmentsTab 
                appointments={appointments}
                onUpdateStatus={handleUpdateAppointmentStatus}
                onGenerateMeeting={handleGenerateMeeting}
              />
            )}
            
            {activeTab === 'schedule' && (
              <ScheduleTab 
                schedule={schedule}
                onSaveSchedule={handleSaveSchedule}
              />
            )}
            
            {activeTab === 'stats' && (
              <StatsTab stats={stats} />
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Failed to load profile data</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showEditModal && userData && (
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

export default TechSupportProfile;
