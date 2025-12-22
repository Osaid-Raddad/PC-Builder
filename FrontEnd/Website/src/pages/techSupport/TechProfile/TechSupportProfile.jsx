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
import colors from '../../../config/colors';
import toast from 'react-hot-toast';
import apiClient from '../../../services/apiService';
import axios from 'axios';
import Swal from 'sweetalert2';

const TechSupportProfile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditModal, setShowEditModal] = useState(false);
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

  // Appointments data
  const [appointments, setAppointments] = useState([]);

  // Schedule data - Backend expects: 0=Saturday, 1=Sunday, 2=Monday, 3=Tuesday, 4=Wednesday, 5=Thursday, 6=Friday
  const [schedule, setSchedule] = useState({
    saturday: [],
    sunday: [],
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: []
  });
  const [scheduleLoading, setScheduleLoading] = useState(true);

  // Fetch schedule data from API
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setScheduleLoading(true);
        const response = await apiClient.get('/TechSupport/Availability/Schedule');
        const scheduleData = response.data;
        
        // Transform API data to component format
        const dayNames = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
        const transformedSchedule = {
          saturday: [],
          sunday: [],
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: []
        };
        
        // Group schedule items by day
        scheduleData.forEach(item => {
          const dayName = dayNames[item.day];
          if (dayName) {
            // Convert HH:mm:ss to HH:mm format
            const startTime = item.startTime.substring(0, 5);
            const endTime = item.endTime.substring(0, 5);
            
            transformedSchedule[dayName].push({
              id: item.id,
              start: startTime,
              end: endTime
            });
          }
        });
        
        setSchedule(transformedSchedule);
        setScheduleLoading(false);
      } catch (error) {
        console.error('Error fetching schedule:', error);
        toast.error('Failed to load schedule');
        setScheduleLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  // Stats data
  const stats = {
    totalSessions: 0,
    thisMonth: 0,
    averageRating: 0,
    totalReviews: 0,
    avgResponseTime: '-',
    successRate: 0,
    monthlyData: [],
    recentReviews: []
  };

  // Today's schedule
  const todaySchedule = [];

  // Upcoming appointments
  const upcomingAppointments = [];



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

  const handleDeleteAccount = async () => {
    // Ask for confirmation with SweetAlert
    const result = await Swal.fire({
      title: 'Delete Account?',
      text: 'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });
    
    if (!result.isConfirmed) {
      return;
    }
    
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem('authToken');
      
      await axios.delete(
        `${API_BASE_URL}/api/Profile/Profile/delete`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Clear local storage and show success
      localStorage.removeItem('authToken');
      
      await Swal.fire({
        title: 'Deleted!',
        text: 'Your account has been deleted successfully.',
        icon: 'success',
        confirmButtonColor: '#F9B233',
        timer: 2000,
        timerProgressBar: true
      });
      
      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting account:', error);
      
      await Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to delete account. Please try again.',
        icon: 'error',
        confirmButtonColor: '#F9B233'
      });
    }
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
              onDeleteAccountClick={handleDeleteAccount}
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
                scheduleLoading={scheduleLoading}
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

      <Footer />
    </div>
  );
};

export default TechSupportProfile;
