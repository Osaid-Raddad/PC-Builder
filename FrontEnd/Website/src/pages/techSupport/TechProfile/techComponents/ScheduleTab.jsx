import React, { useState } from 'react';
import { FiClock, FiPlus, FiTrash2, FiSave } from 'react-icons/fi';
import BounceCard from '../../../../components/animations/BounceCard/BounceCard';
import colors from '../../../../config/colors';
import toast from 'react-hot-toast';

const ScheduleTab = ({ schedule, onSaveSchedule }) => {
  const [editedSchedule, setEditedSchedule] = useState(schedule);
  const [isEditing, setIsEditing] = useState(false);

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const addTimeSlot = (day) => {
    setEditedSchedule({
      ...editedSchedule,
      [day]: [...editedSchedule[day], { start: '09:00', end: '17:00' }]
    });
  };

  const removeTimeSlot = (day, index) => {
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

  const handleSave = () => {
    onSaveSchedule(editedSchedule);
    setIsEditing(false);
    toast.success('Schedule updated successfully!');
  };

  const handleCancel = () => {
    setEditedSchedule(schedule);
    setIsEditing(false);
  };

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
                className="flex items-center gap-2 px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                style={{ backgroundColor: colors.mainYellow, color: 'white' }}
              >
                <FiSave size={18} />
                Save Changes
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
