import React, { useState } from 'react';
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

const TechSupportProfile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Mock user data - Replace with actual data from context/API
  const [userData, setUserData] = useState({
    id: 1,
    name: 'Khaled Ibrahim',
    email: 'khaled.tech@pcbuilder.ps',
    phone: '+970 59 987 6543',
    location: 'Ramallah, Palestine',
    joinDate: 'June 2023',
    avatar: 'https://ui-avatars.com/api/?name=Khaled+Ibrahim&background=F9B233&color=fff&size=200',
    bio: 'Experienced tech support specialist helping users build and maintain their dream PCs.',
    specialization: 'Gaming PCs & Hardware',
    experience: '5 years',
    isOnline: true,
    stats: {
      totalAppointments: 127,
      rating: 4.8,
      reviews: 89,
      responseTime: '< 2hrs'
    }
  });

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
            text="Tech Support Profile"
            className="text-5xl font-bold mb-3"
            delay={100}
            animateBy="words"
            direction="top"
          />
        </div>

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

export default TechSupportProfile;
