import React from 'react';
import { FiCalendar, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import BounceCard from '../../../../components/animations/BounceCard/BounceCard';
import MeetingLinkGenerator from './MeetingLinkGenerator';
import colors from '../../../../config/colors';

const OverviewTab = ({ upcomingAppointments, todaySchedule }) => {
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
          
          {todaySchedule.length === 0 ? (
            <div className="text-center py-8">
              <FiCalendar size={48} style={{ color: colors.platinum }} className="mx-auto mb-4" />
              <p style={{ color: colors.jet }}>No appointments scheduled for today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todaySchedule.map((slot, index) => (
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
          
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-8">
              <FiCheckCircle size={48} style={{ color: colors.platinum }} className="mx-auto mb-4" />
              <p style={{ color: colors.jet }}>No upcoming appointments</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingAppointments.map((apt, index) => (
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
