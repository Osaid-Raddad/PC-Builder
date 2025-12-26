import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiTrendingUp, FiUsers, FiClock, FiStar, FiCheck, FiX } from 'react-icons/fi';
import BounceCard from '../../../../components/animations/BounceCard/BounceCard';
import colors from '../../../../config/colors';
import toast from 'react-hot-toast';

const StatsTab = ({ stats }) => {
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    completedSessions: 0,
    averageRating: 0,
    totalRatings: 0,
    accepted: 0,
    rejected: 0,
    pending: 0
  });

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/TechSupport/Appointment/tech/schedule`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const appointments = response.data;
        setAppointmentsData(appointments);

        // Calculate statistics
        const completed = appointments.filter(apt => apt.status === 3).length;
        const accepted = appointments.filter(apt => apt.status === 1).length;
        const rejected = appointments.filter(apt => apt.status === 2).length;
        const pending = appointments.filter(apt => apt.status === 0).length;

        // Calculate average rating from completed appointments with ratings
        const ratedAppointments = appointments.filter(apt => apt.status === 3 && apt.rating != null);
        const avgRating = ratedAppointments.length > 0
          ? (ratedAppointments.reduce((sum, apt) => sum + apt.rating, 0) / ratedAppointments.length).toFixed(1)
          : 0;

        setStatistics({
          completedSessions: completed,
          averageRating: avgRating,
          totalRatings: ratedAppointments.length,
          accepted,
          rejected,
          pending
        });
      } catch (error) {
        console.error('Error fetching appointments:', error);
        if (error.response?.status !== 401) {
          toast.error('Failed to load statistics');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 mx-auto mb-4" style={{ borderColor: colors.mainYellow }}></div>
          <p className="text-xl font-semibold" style={{ color: colors.mainBlack }}>Loading statistics...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Completed Sessions',
      value: statistics.completedSessions,
      icon: <FiCheck size={32} />,
      color: '#10b981',
      subtitle: 'Total completed'
    },
    {
      title: 'Average Rating',
      value: statistics.averageRating > 0 ? `${statistics.averageRating}⭐` : 'No ratings yet',
      icon: <FiStar size={32} />,
      color: colors.mainYellow,
      subtitle: `Based on ${statistics.totalRatings} review${statistics.totalRatings !== 1 ? 's' : ''}`
    },
    {
      title: 'Accepted',
      value: statistics.accepted,
      icon: <FiTrendingUp size={32} />,
      color: '#3b82f6',
      subtitle: 'Accepted appointments'
    },
    {
      title: 'Rejected',
      value: statistics.rejected,
      icon: <FiX size={32} />,
      color: '#ef4444',
      subtitle: 'Rejected appointments'
    }
  ];

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <BounceCard key={index} index={index}>
            <div 
              className="bg-white rounded-lg shadow-lg p-6"
              style={{ border: `2px solid ${colors.platinum}` }}
            >
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: stat.color + '20', color: stat.color }}
              >
                {stat.icon}
              </div>
              <p className="text-sm mb-1" style={{ color: colors.jet }}>
                {stat.title}
              </p>
              <p className="text-3xl font-bold mb-1" style={{ color: colors.mainBlack }}>
                {stat.value}
              </p>
              <p className="text-xs" style={{ color: colors.jet }}>
                {stat.subtitle}
              </p>
            </div>
          </BounceCard>
        ))}
      </div>

      {/* Monthly Performance */}
      <BounceCard>
        <div 
          className="bg-white rounded-lg shadow-lg p-6"
          style={{ border: `2px solid ${colors.platinum}` }}
        >
          <h3 className="text-2xl font-bold mb-6" style={{ color: colors.mainBlack }}>
            Appointment Statistics
          </h3>
          
          <div className="space-y-4">
            {/* Accepted */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <FiTrendingUp size={20} style={{ color: '#3b82f6' }} />
                  <span className="font-semibold" style={{ color: colors.mainBlack }}>
                    Accepted
                  </span>
                </div>
                <span className="font-bold" style={{ color: '#3b82f6' }}>
                  {statistics.accepted}
                </span>
              </div>
              <div 
                className="w-full h-3 rounded-full overflow-hidden"
                style={{ backgroundColor: colors.platinum }}
              >
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${appointmentsData.length > 0 ? (statistics.accepted / appointmentsData.length) * 100 : 0}%`,
                    backgroundColor: '#3b82f6'
                  }}
                />
              </div>
            </div>

            {/* Completed */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <FiCheck size={20} style={{ color: '#10b981' }} />
                  <span className="font-semibold" style={{ color: colors.mainBlack }}>
                    Completed
                  </span>
                </div>
                <span className="font-bold" style={{ color: '#10b981' }}>
                  {statistics.completedSessions}
                </span>
              </div>
              <div 
                className="w-full h-3 rounded-full overflow-hidden"
                style={{ backgroundColor: colors.platinum }}
              >
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${appointmentsData.length > 0 ? (statistics.completedSessions / appointmentsData.length) * 100 : 0}%`,
                    backgroundColor: '#10b981'
                  }}
                />
              </div>
            </div>

            {/* Rejected */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <FiX size={20} style={{ color: '#ef4444' }} />
                  <span className="font-semibold" style={{ color: colors.mainBlack }}>
                    Rejected
                  </span>
                </div>
                <span className="font-bold" style={{ color: '#ef4444' }}>
                  {statistics.rejected}
                </span>
              </div>
              <div 
                className="w-full h-3 rounded-full overflow-hidden"
                style={{ backgroundColor: colors.platinum }}
              >
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${appointmentsData.length > 0 ? (statistics.rejected / appointmentsData.length) * 100 : 0}%`,
                    backgroundColor: '#ef4444'
                  }}
                />
              </div>
            </div>

            {/* Pending */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <FiClock size={20} style={{ color: colors.mainYellow }} />
                  <span className="font-semibold" style={{ color: colors.mainBlack }}>
                    Pending
                  </span>
                </div>
                <span className="font-bold" style={{ color: colors.mainYellow }}>
                  {statistics.pending}
                </span>
              </div>
              <div 
                className="w-full h-3 rounded-full overflow-hidden"
                style={{ backgroundColor: colors.platinum }}
              >
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${appointmentsData.length > 0 ? (statistics.pending / appointmentsData.length) * 100 : 0}%`,
                    backgroundColor: colors.mainYellow
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </BounceCard>
    </div>
  );
};

export default StatsTab;
