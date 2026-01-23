import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { FiCalendar, FiClock, FiUser, FiMessageSquare, FiStar } from 'react-icons/fi';
import BounceCard from '../../../../components/animations/BounceCard/BounceCard';
import colors from '../../../../config/colors';
import toast from 'react-hot-toast';

const AppointmentsTab = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, accepted, completed
  const [ratingAppointment, setRatingAppointment] = useState(null);
  const [submittingRating, setSubmittingRating] = useState(false);

  // Fetch appointments from API
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/TechSupport/Appointment/myAppointment`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        // Transform backend data to component format
        const transformedData = response.data.map(apt => {
          // Convert status number to string
          const statusMap = {
            0: 'pending',
            1: 'accepted',
            2: 'rejected',
            3: 'completed'
          };

          // Format dates
          const startDate = new Date(apt.startDateTime);
          const endDate = new Date(apt.endDateTime);
          const date = startDate.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
          const startTime = startDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          });
          const endTime = endDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          });
          const time = `${startTime} - ${endTime}`;

          return {
            id: apt.id,
            userId: apt.userId,
            userName: apt.userName,
            techSupportId: apt.techSupportId,
            techSupportName: apt.techSupportName,
            date,
            time,
            status: statusMap[apt.status] || 'pending',
            rating: apt.rating,
            startDateTime: apt.startDateTime,
            endDateTime: apt.endDateTime
          };
        });

        setAppointments(transformedData);
        toast.success('Appointments loaded successfully!');
      } catch (error) {
        console.error('Error fetching appointments:', error);
        if (error.response?.status === 401) {
          toast.error('Please log in to view appointments');
        } else {
          toast.error('Failed to load appointments');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Check if appointment is expired
  const isAppointmentExpired = (endDateTime) => {
    const endDate = new Date(endDateTime);
    const currentDate = new Date();
    return currentDate > endDate;
  };

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true;
    return apt.status === filter;
  });

  const getStatusColor = (status, isExpired) => {
    if (isExpired) return '#9ca3af';
    switch(status) {
      case 'pending': return '#FF9800';
      case 'accepted': return '#10b981';
      case 'rejected': return '#ef4444';
      case 'completed': return '#6b7280';
      default: return colors.platinum;
    }
  };

  const getStatusLabel = (status, isExpired) => {
    if (isExpired) return 'Expired';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Handle Rate Appointment
  const handleRateAppointment = async (appointmentId, rating) => {
    setSubmittingRating(true);
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/TechSupport/Appointment/rate/${appointmentId}`,
        { rating: parseFloat(rating) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Update local state
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId 
            ? { ...apt, rating: parseFloat(rating) } 
            : apt
        )
      );

      setRatingAppointment(null);
      toast.success('Rating submitted successfully!');
    } catch (error) {
      console.error('Error rating appointment:', error);
      if (error.response?.status === 401) {
        toast.error('Please log in to rate this appointment');
      } else {
        toast.error(error.response?.data?.message || 'Failed to submit rating');
      }
    } finally {
      setSubmittingRating(false);
    }
  };

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 mx-auto mb-4" style={{ borderColor: colors.mainYellow }}></div>
            <p className="text-xl font-semibold" style={{ color: colors.mainBlack }}>Loading appointments...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Filter Buttons */}
          <div className="flex gap-3 mb-6 flex-wrap">
            {['all', 'pending', 'accepted', 'completed'].map(filterType => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className="px-4 py-2 rounded-lg font-semibold transition-all cursor-pointer capitalize"
                style={{
                  backgroundColor: filter === filterType ? colors.mainYellow : 'white',
                  color: filter === filterType ? 'white' : colors.jet,
                  border: `2px solid ${filter === filterType ? colors.mainYellow : colors.platinum}`
                }}
              >
                {filterType}
                <span className="ml-2">
                  ({appointments.filter(a => filterType === 'all' || a.status === filterType).length})
                </span>
              </button>
            ))}
          </div>

          {/* Appointments List */}
          <div className="space-y-4">
            {filteredAppointments.length === 0 ? (
              <div 
                className="bg-white rounded-lg shadow-lg p-8 text-center"
                style={{ border: `2px solid ${colors.platinum}` }}
              >
                <FiCalendar size={48} style={{ color: colors.platinum }} className="mx-auto mb-4" />
                <p className="text-xl font-bold" style={{ color: colors.mainBlack }}>
                  No {filter !== 'all' ? filter : ''} appointments
                </p>
                <p style={{ color: colors.jet }}>
                  {filter === 'pending' ? 'No pending appointments at the moment' : 'Your appointments will appear here'}
                </p>
              </div>
            ) : (
              filteredAppointments.map((appointment, index) => {
                const isExpired = isAppointmentExpired(appointment.endDateTime);
                return (
                <BounceCard key={appointment.id} index={index}>
                  <div 
                    className="bg-white rounded-lg shadow-lg p-6"
                    style={{ border: `2px solid ${colors.platinum}` }}
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Tech Support Info */}
                      <div className="flex items-start gap-4 flex-1">
                        <div 
                          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
                          style={{ backgroundColor: colors.mainYellow, color: 'white' }}
                        >
                          {appointment.techSupportName.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h4 className="text-xl font-bold" style={{ color: colors.mainBlack }}>
                              {appointment.techSupportName}
                            </h4>
                            <span 
                              className="px-3 py-1 rounded-full text-xs font-bold"
                              style={{ 
                                backgroundColor: getStatusColor(appointment.status, isExpired) + '20',
                                color: getStatusColor(appointment.status, isExpired)
                              }}
                            >
                              {getStatusLabel(appointment.status, isExpired)}
                            </span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <FiCalendar size={16} style={{ color: colors.mainYellow }} />
                              <span className="text-sm" style={{ color: colors.jet }}>
                                {appointment.date}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FiClock size={16} style={{ color: colors.mainYellow }} />
                              <span className="text-sm" style={{ color: colors.jet }}>
                                {appointment.time}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status Display */}
                      <div className="flex flex-col gap-2 min-w-[180px]">
                        {isExpired && appointment.status !== 'completed' && appointment.status !== 'rejected' ? (
                          <div 
                            className="px-4 py-3 rounded-lg text-center font-semibold"
                            style={{ backgroundColor: '#9ca3af' + '20', color: '#9ca3af' }}
                          >
                            ⏱ Expired
                          </div>
                        ) : (
                          <>
                            {appointment.status === 'pending' && (
                              <div 
                                className="px-4 py-3 rounded-lg text-center font-semibold"
                                style={{ backgroundColor: '#FF9800' + '20', color: '#FF9800' }}
                              >
                                ⏳ Waiting for confirmation
                              </div>
                            )}
                            {appointment.status === 'accepted' && (
                              <div 
                                className="px-4 py-3 rounded-lg text-center font-semibold"
                                style={{ backgroundColor: '#10b981' + '20', color: '#10b981' }}
                              >
                                ✓ Confirmed
                              </div>
                            )}
                            {appointment.status === 'completed' && (
                          <div className="space-y-2">
                            <div 
                              className="px-4 py-3 rounded-lg text-center font-semibold"
                              style={{ backgroundColor: '#10b981' + '20', color: '#10b981' }}
                            >
                              ✓ Completed
                            </div>
                            {appointment.rating ? (
                              <div 
                                className="px-4 py-3 rounded-lg text-center"
                                style={{ backgroundColor: colors.mainBeige }}
                              >
                                <div className="flex items-center justify-center gap-1 mb-1">
                                  {[...Array(5)].map((_, i) => (
                                    <FiStar
                                      key={i}
                                      size={16}
                                      style={{ 
                                        color: colors.mainYellow,
                                        fill: i < appointment.rating ? colors.mainYellow : 'none'
                                      }}
                                    />
                                  ))}
                                </div>
                                <p className="text-xs font-semibold" style={{ color: colors.jet }}>
                                  Your Rating: {appointment.rating}/5
                                </p>
                              </div>
                            ) : (
                              <div 
                                className="px-4 py-3 rounded-lg"
                                style={{ backgroundColor: colors.mainBeige }}
                              >
                                <p className="text-sm font-semibold mb-2 text-center" style={{ color: colors.mainBlack }}>
                                  Rate your experience
                                </p>
                                <div className="flex items-center justify-center gap-1 mb-3">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      type="button"
                                      onClick={() => setRatingAppointment({ id: appointment.id, rating: star })}
                                      className="transition-transform hover:scale-110 cursor-pointer"
                                      disabled={submittingRating}
                                    >
                                      <FiStar
                                        size={24}
                                        style={{ 
                                          color: colors.mainYellow,
                                          fill: ratingAppointment?.id === appointment.id && star <= ratingAppointment.rating ? colors.mainYellow : 'none'
                                        }}
                                      />
                                    </button>
                                  ))}
                                </div>
                                {ratingAppointment?.id === appointment.id && (
                                  <button
                                    onClick={() => handleRateAppointment(appointment.id, ratingAppointment.rating)}
                                    disabled={submittingRating}
                                    className="w-full px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
                                    style={{ backgroundColor: colors.mainYellow, color: 'white' }}
                                  >
                                    {submittingRating ? 'Submitting...' : 'Submit Rating'}
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                            {appointment.status === 'rejected' && (
                              <div 
                                className="px-4 py-3 rounded-lg text-center font-semibold"
                                style={{ backgroundColor: '#ef4444' + '20', color: '#ef4444' }}
                              >
                                ✗ Rejected
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </BounceCard>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AppointmentsTab;
