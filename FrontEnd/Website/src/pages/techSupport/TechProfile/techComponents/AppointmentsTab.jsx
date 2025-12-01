import React, { useState } from 'react';
import { FiCheck, FiX, FiClock, FiUser, FiMessageSquare, FiExternalLink, FiCalendar } from 'react-icons/fi';
import BounceCard from '../../../../components/animations/BounceCard/BounceCard';
import colors from '../../../../config/colors';
import toast from 'react-hot-toast';

const AppointmentsTab = ({ appointments, onUpdateStatus, onGenerateMeeting }) => {
  const [filter, setFilter] = useState('all'); // all, pending, accepted, completed

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true;
    return apt.status === filter;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#FF9800';
      case 'accepted': return '#10b981';
      case 'rejected': return '#ef4444';
      case 'completed': return '#6b7280';
      default: return colors.platinum;
    }
  };

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div>
      {/* Filter Buttons */}
      <div className="flex gap-3 mb-6">
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
              {filter === 'pending' ? 'No pending requests at the moment' : 'Your appointments will appear here'}
            </p>
          </div>
        ) : (
          filteredAppointments.map((appointment, index) => (
            <BounceCard key={appointment.id} index={index}>
              <div 
                className="bg-white rounded-lg shadow-lg p-6"
                style={{ border: `2px solid ${colors.platinum}` }}
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* User Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
                      style={{ backgroundColor: colors.mainYellow, color: 'white' }}
                    >
                      {appointment.userName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-xl font-bold" style={{ color: colors.mainBlack }}>
                          {appointment.userName}
                        </h4>
                        <span 
                          className="px-3 py-1 rounded-full text-xs font-bold"
                          style={{ 
                            backgroundColor: getStatusColor(appointment.status) + '20',
                            color: getStatusColor(appointment.status)
                          }}
                        >
                          {getStatusLabel(appointment.status)}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <FiCalendar size={16} style={{ color: colors.mainYellow }} />
                          <span className="text-sm" style={{ color: colors.jet }}>
                            {appointment.date} at {appointment.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiUser size={16} style={{ color: colors.mainYellow }} />
                          <span className="text-sm" style={{ color: colors.jet }}>
                            {appointment.userEmail}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiClock size={16} style={{ color: colors.mainYellow }} />
                          <span className="text-sm" style={{ color: colors.jet }}>
                            Duration: {appointment.duration}
                          </span>
                        </div>
                      </div>
                      {appointment.message && (
                        <div 
                          className="mt-3 p-3 rounded-lg"
                          style={{ backgroundColor: colors.mainBeige }}
                        >
                          <div className="flex items-start gap-2">
                            <FiMessageSquare size={16} style={{ color: colors.mainYellow }} className="mt-1" />
                            <div>
                              <p className="text-xs font-semibold mb-1" style={{ color: colors.jet }}>
                                Message:
                              </p>
                              <p className="text-sm" style={{ color: colors.jet }}>
                                {appointment.message}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 min-w-[200px]">
                    {appointment.status === 'pending' && (
                      <>
                        <button
                          onClick={() => onUpdateStatus(appointment.id, 'accepted')}
                          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                          style={{ backgroundColor: '#10b981', color: 'white' }}
                        >
                          <FiCheck size={18} />
                          Accept
                        </button>
                        <button
                          onClick={() => onUpdateStatus(appointment.id, 'rejected')}
                          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                          style={{ 
                            backgroundColor: 'white',
                            color: '#ef4444',
                            border: '2px solid #ef4444'
                          }}
                        >
                          <FiX size={18} />
                          Reject
                        </button>
                      </>
                    )}
                    {appointment.status === 'accepted' && (
                      <>
                        <button
                          onClick={() => onGenerateMeeting(appointment.id)}
                          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                          style={{ backgroundColor: colors.mainYellow, color: 'white' }}
                        >
                          <FiExternalLink size={18} />
                          Generate Meeting
                        </button>
                        {appointment.meetingLink && (
                          <a
                            href={appointment.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity cursor-pointer text-center"
                            style={{ 
                              backgroundColor: 'white',
                              color: colors.mainYellow,
                              border: `2px solid ${colors.mainYellow}`
                            }}
                          >
                            <FiExternalLink size={18} />
                            Join Meeting
                          </a>
                        )}
                        <button
                          onClick={() => onUpdateStatus(appointment.id, 'completed')}
                          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                          style={{ 
                            backgroundColor: 'white',
                            color: colors.jet,
                            border: `2px solid ${colors.platinum}`
                          }}
                        >
                          Mark Complete
                        </button>
                      </>
                    )}
                    {appointment.status === 'completed' && (
                      <div 
                        className="px-4 py-2 rounded-lg text-center font-semibold"
                        style={{ backgroundColor: '#10b981' + '20', color: '#10b981' }}
                      >
                        ✓ Completed
                      </div>
                    )}
                    {appointment.status === 'rejected' && (
                      <div 
                        className="px-4 py-2 rounded-lg text-center font-semibold"
                        style={{ backgroundColor: '#ef4444' + '20', color: '#ef4444' }}
                      >
                        ✗ Rejected
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </BounceCard>
          ))
        )}
      </div>
    </div>
  );
};

export default AppointmentsTab;
