import React, { useState } from 'react';
import { FiVideo, FiCopy, FiExternalLink, FiRefreshCw } from 'react-icons/fi';
import colors from '../../../../config/colors';
import toast from 'react-hot-toast';

const MeetingLinkGenerator = ({ appointmentId, userName }) => {
  const [meetingLink, setMeetingLink] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateMeetingLink = () => {
    setIsGenerating(true);
    
    // Generate unique room name using appointment ID and timestamp
    const roomName = `TechSupport-${appointmentId}-${Date.now()}`;
    const jitsiLink = `https://meet.jit.si/${roomName}`;
    
    setTimeout(() => {
      setMeetingLink(jitsiLink);
      setIsGenerating(false);
      toast.success('Meeting link generated!');
    }, 500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(meetingLink);
    toast.success('Meeting link copied to clipboard!');
  };

  const openMeeting = () => {
    window.open(meetingLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      className="p-4 rounded-lg"
      style={{ backgroundColor: colors.mainBeige }}
    >
      <div className="flex items-center gap-2 mb-3">
        <FiVideo size={20} style={{ color: colors.mainYellow }} />
        <h4 className="font-bold" style={{ color: colors.mainBlack }}>
          Video Meeting
        </h4>
      </div>

      {!meetingLink ? (
        <button
          onClick={generateMeetingLink}
          disabled={isGenerating}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
          style={{ backgroundColor: colors.mainYellow, color: 'white' }}
        >
          {isGenerating ? (
            <>
              <FiRefreshCw size={18} className="animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <FiVideo size={18} />
              Generate Meeting Link
            </>
          )}
        </button>
      ) : (
        <div className="space-y-2">
          <div 
            className="p-3 rounded-lg break-all text-sm"
            style={{ backgroundColor: 'white', border: `1px solid ${colors.platinum}` }}
          >
            <p style={{ color: colors.jet }}>{meetingLink}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={copyToClipboard}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity cursor-pointer"
              style={{ 
                backgroundColor: 'white',
                color: colors.mainYellow,
                border: `2px solid ${colors.mainYellow}`
              }}
            >
              <FiCopy size={16} />
              Copy Link
            </button>
            <button
              onClick={openMeeting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity cursor-pointer"
              style={{ backgroundColor: colors.mainYellow, color: 'white' }}
            >
              <FiExternalLink size={16} />
              Join Meeting
            </button>
          </div>
          <button
            onClick={generateMeetingLink}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity cursor-pointer text-sm"
            style={{ 
              backgroundColor: 'white',
              color: colors.jet,
              border: `1px solid ${colors.platinum}`
            }}
          >
            <FiRefreshCw size={14} />
            Generate New Link
          </button>
        </div>
      )}
    </div>
  );
};

export default MeetingLinkGenerator;
