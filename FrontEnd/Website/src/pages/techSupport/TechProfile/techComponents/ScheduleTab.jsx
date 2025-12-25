import React, { useState } from 'react';
import { FiClock, FiPlus, FiTrash2, FiSave } from 'react-icons/fi';
import BounceCard from '../../../../components/animations/BounceCard/BounceCard';
import colors from '../../../../config/colors';
import toast from 'react-hot-toast';
import apiClient from '../../../../services/apiService';

const ScheduleTab = ({ schedule, scheduleLoading, onSaveSchedule }) => {
  const [editedSchedule, setEditedSchedule] = useState(schedule);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Backend expects: 0=Saturday, 1=Sunday, 2=Monday, 3=Tuesday, 4=Wednesday, 5=Thursday, 6=Friday
  const daysOfWeek = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  const dayLabels = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  // Update edited schedule when schedule prop changes
  React.useEffect(() => {
    setEditedSchedule(schedule);
  }, [schedule]);

  const addTimeSlot = (day) => {
    setEditedSchedule({
      ...editedSchedule,
      [day]: [...editedSchedule[day], { start: '09:00', end: '17:00' }]
    });
  };

  const removeTimeSlot = async (day, index) => {
    const slot = editedSchedule[day][index];
    
    // If the slot has an ID, it exists in the database and needs to be deleted via API
    if (slot.id) {
      try {
        await apiClient.delete(`/TechSupport/Availability/Delete-Availabile/${slot.id}`);
        toast.success('Time slot deleted successfully!');
      } catch (error) {
        console.error('Error deleting time slot:', error);
        toast.error('Failed to delete time slot. Please try again.');
        return; // Don't update UI if API call fails
      }
    }
    
    // Update local state
    const newSlots = editedSchedule[day].filter((_, i) => i !== index);
    setEditedSchedule({
      ...editedSchedule,
      [day]: newSlots
    });
  };

  const updateTimeSlot = (day, index, field, value) => {
    const newSlots = [...editedSchedule[day]];
    newSlots[index][field] = value;
    setEditedSchedule({
      ...editedSchedule,
      [day]: newSlots
    });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Validate and prepare schedule data for API
      const newSlotsToAdd = [];
      const existingSlotsToUpdate = [];
      
      for (let dayIndex = 0; dayIndex < daysOfWeek.length; dayIndex++) {
        const day = daysOfWeek[dayIndex];
        const slots = editedSchedule[day];
        
        if (slots && slots.length > 0) {
          for (const slot of slots) {
            // Validate: endTime must be greater than startTime
            if (slot.end <= slot.start) {
              toast.error(`Invalid time slot for ${dayLabels[dayIndex]}: End time must be after start time`);
              setIsSaving(false);
              return;
            }
            
            // Format times to HH:mm:ss format
            const startTime = `${slot.start}:00`;
            const endTime = `${slot.end}:00`;
            
            // Check if slot has an ID (existing) or not (new)
            if (slot.id) {
              // Existing slot - check if it was modified
              const originalSlot = schedule[day].find(s => s.id === slot.id);
              if (originalSlot && (originalSlot.start !== slot.start || originalSlot.end !== slot.end)) {
                // Slot was modified - need to delete old and create new
                existingSlotsToUpdate.push({
                  id: slot.id,
                  day: dayIndex,
                  startTime: startTime,
                  endTime: endTime
                });
              }
              // If not modified, skip it (already in database)
            } else {
              // New slot - needs to be added
              newSlotsToAdd.push({
                day: dayIndex,
                startTime: startTime,
                endTime: endTime
              });
            }
          }
        }
      }
      
      // Delete and recreate modified slots
      for (const slot of existingSlotsToUpdate) {
        await apiClient.delete(`/TechSupport/Availability/Delete-Availabile/${slot.id}`);
        await apiClient.post('/TechSupport/Availability/Add-Availabile', {
          day: slot.day,
          startTime: slot.startTime,
          endTime: slot.endTime
        });
      }
      
      // Add only new slots to the API
      const promises = newSlotsToAdd.map(scheduleItem => 
        apiClient.post('/TechSupport/Availability/Add-Availabile', scheduleItem)
      );
      
      await Promise.all(promises);
      
      // Refresh the schedule from the API to get the latest data with IDs
      const response = await apiClient.get('/TechSupport/Availability/Schedule');
      const scheduleData = response.data;
      
      const dayNames = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
      const refreshedSchedule = {
        saturday: [],
        sunday: [],
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: []
      };
      
      scheduleData.forEach(item => {
        const dayName = dayNames[item.day];
        if (dayName) {
          const startTime = item.startTime.substring(0, 5);
          const endTime = item.endTime.substring(0, 5);
          
          refreshedSchedule[dayName].push({
            id: item.id,
            start: startTime,
            end: endTime
          });
        }
      });
      
      // Update parent component state with refreshed data
      onSaveSchedule(refreshedSchedule);
      setEditedSchedule(refreshedSchedule);
      setIsEditing(false);
      toast.success('Schedule updated successfully!');
    } catch (error) {
      console.error('Error saving schedule:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update schedule. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedSchedule(schedule);
    setIsEditing(false);
  };

  // Show loading state
  if (scheduleLoading) {
    return (
      <BounceCard>
        <div 
          className="bg-white rounded-lg shadow-lg p-6"
          style={{ border: `2px solid ${colors.platinum}` }}
        >
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2" 
                 style={{ borderColor: colors.mainYellow }}></div>
          </div>
        </div>
      </BounceCard>
    );
  }

  return (
    <BounceCard>
      <div 
        className="bg-white rounded-lg shadow-lg p-6"
        style={{ border: `2px solid ${colors.platinum}` }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold flex items-center gap-2" style={{ color: colors.mainBlack }}>
            <FiClock style={{ color: colors.mainYellow }} />
            Weekly Availability
          </h3>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity cursor-pointer"
              style={{ backgroundColor: colors.mainYellow, color: 'white' }}
            >
              Edit Schedule
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                style={{ 
                  backgroundColor: 'white',
                  color: colors.jet,
                  border: `2px solid ${colors.platinum}`
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: colors.mainYellow, color: 'white' }}
              >
                <FiSave size={18} />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {daysOfWeek.map((day, dayIndex) => (
            <div 
              key={day}
              className="p-4 rounded-lg"
              style={{ backgroundColor: colors.mainBeige }}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-bold" style={{ color: colors.mainBlack }}>
                  {dayLabels[dayIndex]}
                </h4>
                {isEditing && (
                  <button
                    onClick={() => addTimeSlot(day)}
                    className="flex items-center gap-2 px-3 py-1 rounded-lg font-semibold hover:opacity-90 transition-opacity cursor-pointer text-sm"
                    style={{ backgroundColor: colors.mainYellow, color: 'white' }}
                  >
                    <FiPlus size={16} />
                    Add Slot
                  </button>
                )}
              </div>

              {editedSchedule[day].length === 0 ? (
                <p className="text-sm" style={{ color: colors.jet }}>
                  No availability set for this day
                </p>
              ) : (
                <div className="space-y-2">
                  {editedSchedule[day].map((slot, slotIndex) => (
                    <div key={slotIndex} className="flex items-center gap-3">
                      {isEditing ? (
                        <>
                          <input
                            type="time"
                            value={slot.start}
                            onChange={(e) => updateTimeSlot(day, slotIndex, 'start', e.target.value)}
                            className="px-3 py-2 rounded-lg border-2 focus:outline-none cursor-pointer"
                            style={{ borderColor: colors.platinum }}
                          />
                          <span style={{ color: colors.jet }}>to</span>
                          <input
                            type="time"
                            value={slot.end}
                            onChange={(e) => updateTimeSlot(day, slotIndex, 'end', e.target.value)}
                            className="px-3 py-2 rounded-lg border-2 focus:outline-none cursor-pointer"
                            style={{ borderColor: colors.platinum }}
                          />
                          <button
                            onClick={() => removeTimeSlot(day, slotIndex)}
                            className="p-2 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
                            style={{ color: '#ef4444' }}
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </>
                      ) : (
                        <div 
                          className="px-4 py-2 rounded-lg font-semibold"
                          style={{ backgroundColor: colors.mainYellow, color: 'white' }}
                        >
                          {slot.start} - {slot.end}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div 
          className="mt-6 p-4 rounded-lg"
          style={{ backgroundColor: colors.mainYellow + '20' }}
        >
          <p className="text-sm" style={{ color: colors.jet }}>
            💡 <strong>Tip:</strong> Users will only be able to book appointments during your available time slots. 
            Make sure to keep your schedule updated!
          </p>
        </div>
      </div>
    </BounceCard>
  );
};

export default ScheduleTab;
