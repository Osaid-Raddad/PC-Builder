import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import colors from '../../config/colors';
import { FiX, FiCalendar, FiClock, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AppointmentModal = ({ supporter, onClose, onSubmit }) => {
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      date: '',
      timeSlot: ''
    }
  });

  const [selectedDay, setSelectedDay] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const watchDate = watch('date');
  const watchTimeSlot = watch('timeSlot');

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    
    setValue('date', e.target.value);
    setValue('timeSlot', ''); // Reset time slot when date changes
    setSelectedDay(dayName);
    
    // Get available slots for selected day
    const slots = supporter.availability[dayName] || [];
    setAvailableSlots(slots);
    
    if (slots.length === 0) {
      toast.error(`${supporter.name} is not available on ${dayName}s. Please choose another date.`);
    }
  };

  const onSubmitForm = async (data) => {
    if (!data.timeSlot) {
      toast.error('Please select a time slot');
      return;
    }

    try {
      // Parse the time slot (e.g., "9:00 AM - 5:00 PM")
      const [startTime, endTime] = data.timeSlot.split(' - ');
      
      // Convert time to 24-hour format
      const convertTo24Hour = (time12h) => {
        const [time, modifier] = time12h.split(' ');
        let [hours, minutes] = time.split(':');
        
        if (hours === '12') {
          hours = modifier === 'AM' ? '00' : '12';
        } else {
          hours = modifier === 'PM' ? String(parseInt(hours, 10) + 12) : hours.padStart(2, '0');
        }
        
        return `${hours}:${minutes}:00`;
      };

      const startTime24 = convertTo24Hour(startTime);
      const endTime24 = convertTo24Hour(endTime);

      // Create ISO datetime strings
      const startDateTime = `${data.date}T${startTime24}`;
      const endDateTime = `${data.date}T${endTime24}`;

      // Prepare request payload
      const requestPayload = {
        techSupportId: supporter.id,
        startDateTime,
        endDateTime
      };

      const token = localStorage.getItem('authToken');

      // Make API call
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/TechSupport/Appointment/create`,
        requestPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success('Appointment request sent successfully!');
      onClose();
      
    } catch (error) {
      console.error('Error creating appointment:', error);
      
      if (error.response?.status === 401) {
        toast.error('Please log in to request an appointment');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to send appointment request. Please try again.');
      }
    }
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
        <form onSubmit={handleSubmit(onSubmitForm)} className="p-6 space-y-6">
          {/* Date Selection */}
          <div>
            <label className="flex items-center gap-2 mb-2 font-semibold" style={{ color: colors.mainBlack }}>
              <FiCalendar size={18} style={{ color: colors.mainYellow }} />
              Select Date *
            </label>
            <input
              type="date"
              {...register('date', { 
                required: 'Date is required',
                validate: (value) => {
                  const selected = new Date(value);
                  const min = new Date(today);
                  const max = new Date(maxDate);
                  if (selected < min) return 'Date must be today or later';
                  if (selected > max) return 'Date must be within 30 days';
                  return true;
                }
              })}
              onChange={handleDateChange}
              min={today}
              max={maxDate}
              className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
              style={{
                border: `2px solid ${errors.date ? 'red' : colors.platinum}`,
                backgroundColor: 'white',
                color: colors.jet
              }}
            />
            {errors.date && (
              <p className="text-sm mt-1 text-red-600">{errors.date.message}</p>
            )}
            {watchDate && (
              <p className="text-sm mt-2" style={{ color: colors.jet }}>
                Selected: {new Date(watchDate + 'T00:00:00').toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            )}
          </div>

          {/* Time Slot Selection */}
          {watchDate && (
            <div>
              <label className="flex items-center gap-2 mb-2 font-semibold" style={{ color: colors.mainBlack }}>
                <FiClock size={18} style={{ color: colors.mainYellow }} />
                Select Time Slot *
              </label>
              <input type="hidden" {...register('timeSlot', { required: 'Time slot is required' })} />
              {availableSlots.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {availableSlots.map((slot, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setValue('timeSlot', slot)}
                      className={`px-4 py-3 rounded-lg font-semibold border-2 transition-all ${
                        watchTimeSlot === slot
                          ? 'text-white'
                          : 'hover:opacity-80'
                      }`}
                      style={{
                        borderColor: colors.mainYellow,
                        backgroundColor: watchTimeSlot === slot ? colors.mainYellow : 'white',
                        color: watchTimeSlot === slot ? 'white' : colors.jet
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
              {errors.timeSlot && (
                <p className="text-sm mt-2 text-red-600">{errors.timeSlot.message}</p>
              )}
            </div>
          )}

          {/* Info Box */}
          <div 
            className="p-4 rounded-lg"
            style={{ backgroundColor: colors.mainBeige }}
          >
            <p className="text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>
              📝 Note:
            </p>
            <p className="text-sm" style={{ color: colors.jet }}>
              Your appointment request will be sent to {supporter.name}. You will receive a notification once they accept or decline your request.
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
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 rounded-lg font-bold text-white hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: colors.mainYellow }}
            >
              {isSubmitting ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;
