import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiCalendar, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import BounceCard from '../../../../components/animations/BounceCard/BounceCard';
import MeetingLinkGenerator from './MeetingLinkGenerator';
import colors from '../../../../config/colors';
import toast from 'react-hot-toast';

const OverviewTab = ({ upcomingAppointments, todaySchedule }) => {
  const [appointments, setAppointments] = useState([]);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [weekAppointments, setWeekAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

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

        const allAppointments = response.data;

        // Get today's date at midnight
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Get end of today
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        // Get date 7 days from now
        const weekFromNow = new Date();
        weekFromNow.setDate(weekFromNow.getDate() + 7);
        weekFromNow.setHours(23, 59, 59, 999);

        // Filter today's appointments
        const todayApts = allAppointments.filter(apt => {
          const aptDate = new Date(apt.startDateTime);
          return aptDate >= today && aptDate <= endOfToday;
        }).map(apt => {
          const startDate = new Date(apt.startDateTime);
          const endDate = new Date(apt.endDateTime);
          const time = `${startDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          })} - ${endDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          })}`;

          const statusMap = {
            0: 'pending',
            1: 'confirmed',
            2: 'rejected',
            3: 'completed'
          };

          return {
            id: apt.id,
            time,
            userName: apt.userName,
            status: statusMap[apt.status] || 'pending',
            startDateTime: apt.startDateTime
          };
        }).sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime));

        // Filter week's appointments (excluding today)
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const weekApts = allAppointments.filter(apt => {
          const aptDate = new Date(apt.startDateTime);
          return aptDate >= tomorrow && aptDate <= weekFromNow;
        }).map(apt => {
          const startDate = new Date(apt.startDateTime);
          const endDate = new Date(apt.endDateTime);
          
          const date = startDate.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
          });

          const time = `${startDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          })} - ${endDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          })}`;

          // Calculate days until
          const daysUntil = Math.ceil((startDate - today) / (1000 * 60 * 60 * 24));

          return {
            id: apt.id,
            date,
            time,
            userName: apt.userName,
            daysUntil,
            startDateTime: apt.startDateTime
          };
        }).sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime));

        setTodayAppointments(todayApts);
        setWeekAppointments(weekApts);
        setAppointments(allAppointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        if (error.response?.status !== 401) {
          toast.error('Failed to load appointments');
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
          <p className="text-xl font-semibold" style={{ color: colors.mainBlack }}>Loading overview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Today's Schedule */}
      <BounceCard index={0}>
        <div 
          className="bg-white rounded-lg shadow-lg p-6"
          style={{ border: `2px solid ${colors.platinum}` }}
        >
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: colors.mainBlack }}>
            <FiClock style={{ color: colors.mainYellow }} />
            Today's Schedule
          </h3>
          
          {todayAppointments.length === 0 ? (
            <div className="text-center py-8">
              <FiCalendar size={48} style={{ color: colors.platinum }} className="mx-auto mb-4" />
              <p style={{ color: colors.jet }}>No appointments scheduled for today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayAppointments.map((slot, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-lg border-l-4"
                  style={{ 
                    backgroundColor: colors.mainBeige,
                    borderColor: colors.mainYellow
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold" style={{ color: colors.mainBlack }}>
                        {slot.time}
                      </p>
                      <p className="text-sm" style={{ color: colors.jet }}>
                        {slot.userName}
                      </p>
                    </div>
                    <span 
                      className="px-2 py-1 rounded text-xs font-bold"
                      style={{ 
                        backgroundColor: slot.status === 'confirmed' ? '#10b981' + '20' : colors.mainYellow + '20',
                        color: slot.status === 'confirmed' ? '#10b981' : colors.mainYellow
                      }}
                    >
                      {slot.status}
                    </span>
                  </div>
                  {slot.status === 'confirmed' && (
                    <MeetingLinkGenerator 
                      appointmentId={slot.id}
                      userName={slot.userName}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </BounceCard>

      {/* Upcoming Appointments */}
      <BounceCard index={1}>
        <div 
          className="bg-white rounded-lg shadow-lg p-6"
          style={{ border: `2px solid ${colors.platinum}` }}
        >
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: colors.mainBlack }}>
            <FiCalendar style={{ color: colors.mainYellow }} />
            Upcoming This Week
          </h3>
          
          {weekAppointments.length === 0 ? (
            <div className="text-center py-8">
              <FiCheckCircle size={48} style={{ color: colors.platinum }} className="mx-auto mb-4" />
              <p style={{ color: colors.jet }}>No upcoming appointments</p>
            </div>
          ) : (
            <div className="space-y-3">
              {weekAppointments.map((apt, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: colors.mainBeige }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold" style={{ color: colors.mainBlack }}>
                        {apt.date}
                      </p>
                      <p className="text-sm" style={{ color: colors.jet }}>
                        {apt.time} - {apt.userName}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiAlertCircle size={16} style={{ color: colors.mainYellow }} />
                      <span className="text-xs" style={{ color: colors.jet }}>
                        {apt.daysUntil} days
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </BounceCard>
    </div>
  );
};

export default OverviewTab;
