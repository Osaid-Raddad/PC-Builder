import React, { useState } from 'react';
import colors from '../../config/colors';
import { FiX, FiCalendar, FiClock, FiFileText, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AppointmentModal = ({ supporter, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    date: '',
    timeSlot: '',
    problemDescription: '',
    urgency: 'normal'
  });

  const [selectedDay, setSelectedDay] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);

  const urgencyLevels = [
    { value: 'low', label: 'Low Priority', color: 'bg-blue-100 text-blue-700' },
    { value: 'normal', label: 'Normal', color: 'bg-green-100 text-green-700' },
    { value: 'high', label: 'High Priority', color: 'bg-orange-100 text-orange-700' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-700' }
  ];

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    
    setFormData({ ...formData, date: e.target.value, timeSlot: '' });
    setSelectedDay(dayName);
    
    // Get available slots for selected day
    const slots = supporter.availability[dayName] || [];
    setAvailableSlots(slots);
    
    if (slots.length === 0) {
      toast.error(`${supporter.name} is not available on ${dayName}s. Please choose another date.`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.timeSlot) {
      toast.error('Please select a time slot');
      return;
    }
    
    onSubmit({
      ...formData,
      supporterId: supporter.id,
      supporterName: supporter.name
    });
  };

  // Get min date (today)
  const today = new Date().toISOString().split('T')[0];
  // Get max date (30 days from now)
  const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{ border: `3px solid ${colors.mainYellow}` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="sticky top-0 bg-white p-6 border-b-2 z-10"
          style={{ borderColor: colors.platinum }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-3xl font-bold" style={{ color: colors.mainBlack }}>
              Request Appointment
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <FiX size={24} style={{ color: colors.jet }} />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <img 
              src={supporter.avatar} 
              alt={supporter.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-bold" style={{ color: colors.mainBlack }}>
                {supporter.name}
              </p>
              <p className="text-sm" style={{ color: colors.jet }}>
                {supporter.specialization}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Date Selection */}
          <div>
            <label className="flex items-center gap-2 mb-2 font-semibold" style={{ color: colors.mainBlack }}>
              <FiCalendar size={18} style={{ color: colors.mainYellow }} />
              Select Date *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleDateChange}
              min={today}
              max={maxDate}
              className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
              style={{
                border: `2px solid ${colors.platinum}`,
                backgroundColor: 'white',
                color: colors.jet
              }}
              required
            />
            {formData.date && (
              <p className="text-sm mt-2" style={{ color: colors.jet }}>
                Selected: {new Date(formData.date + 'T00:00:00').toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            )}
          </div>

          {/* Time Slot Selection */}
          {formData.date && (
            <div>
              <label className="flex items-center gap-2 mb-2 font-semibold" style={{ color: colors.mainBlack }}>
                <FiClock size={18} style={{ color: colors.mainYellow }} />
                Select Time Slot *
              </label>
              {availableSlots.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {availableSlots.map((slot, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setFormData({ ...formData, timeSlot: slot })}
                      className={`px-4 py-3 rounded-lg font-semibold border-2 transition-all ${
                        formData.timeSlot === slot
                          ? 'text-white'
                          : 'hover:opacity-80'
                      }`}
                      style={{
                        borderColor: colors.mainYellow,
                        backgroundColor: formData.timeSlot === slot ? colors.mainYellow : 'white',
                        color: formData.timeSlot === slot ? 'white' : colors.jet
                      }}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              ) : (
                <div 
                  className="p-4 rounded-lg flex items-center gap-3"
                  style={{ backgroundColor: colors.mainBeige }}
                >
                  <FiAlertCircle size={24} style={{ color: colors.mainYellow }} />
                  <p style={{ color: colors.jet }}>
                    No available time slots for this date. Please select another date.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Problem Description */}
          <div>
            <label className="flex items-center gap-2 mb-2 font-semibold" style={{ color: colors.mainBlack }}>
              <FiFileText size={18} style={{ color: colors.mainYellow }} />
              Describe Your Problem *
            </label>
            <textarea
              name="problemDescription"
              value={formData.problemDescription}
              onChange={handleChange}
              placeholder="Please describe the issue you're experiencing with your PC..."
              rows="5"
              className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 resize-none"
              style={{
                border: `2px solid ${colors.platinum}`,
                backgroundColor: 'white',
                color: colors.jet
              }}
              required
            />
          </div>

          {/* Urgency Level */}
          <div>
            <label className="flex items-center gap-2 mb-2 font-semibold" style={{ color: colors.mainBlack }}>
              <FiAlertCircle size={18} style={{ color: colors.mainYellow }} />
              Urgency Level *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {urgencyLevels.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, urgency: level.value })}
                  className={`px-4 py-3 rounded-lg font-semibold border-2 transition-all ${
                    formData.urgency === level.value
                      ? level.color
                      : 'bg-white hover:opacity-80'
                  }`}
                  style={{
                    borderColor: formData.urgency === level.value ? 'transparent' : colors.platinum,
                    color: formData.urgency === level.value ? undefined : colors.jet
                  }}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          {/* Info Box */}
          <div 
            className="p-4 rounded-lg"
            style={{ backgroundColor: colors.mainBeige }}
          >
            <p className="text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>
              📝 Note:
            </p>
            <p className="text-sm" style={{ color: colors.jet }}>
              Your appointment request will be sent to {supporter.name}. You will receive a notification once they accept or decline your request. If declined, you'll receive a reason and can request another time slot.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-lg font-bold border-2 hover:opacity-80 transition-opacity cursor-pointer"
              style={{
                borderColor: colors.platinum,
                color: colors.jet,
                backgroundColor: 'white'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-lg font-bold text-white hover:opacity-90 transition-opacity cursor-pointer"
              style={{ backgroundColor: colors.mainYellow }}
            >
              Send Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;
