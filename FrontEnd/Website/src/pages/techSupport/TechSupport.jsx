import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/user/navbar/Navbar';
import Footer from '../../components/user/footer/Footer';
import BlurText from '../../components/animations/BlurText/BlurText';
import BounceCard from '../../components/animations/BounceCard/BounceCard';
import colors from '../../config/colors';
import { 
  FiHeadphones, 
  FiClock, 
  FiCalendar, 
  FiMessageCircle, 
  FiCheck, 
  FiX,
  FiUser,
  FiMail,
  FiPhone,
  FiStar,
  FiUserPlus
} from 'react-icons/fi';
import { BsCheckCircleFill } from 'react-icons/bs';
import toast from 'react-hot-toast';
import ApplyTechSupportModal from './ApplyTechSupportModal';
import AppointmentModal from './AppointmentModal';

const TechSupport = () => {
  const navigate = useNavigate();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedSupport, setSelectedSupport] = useState(null);
  const [techSupporters, setTechSupporters] = useState([]);

  // Mock data - Replace with API call
  const mockTechSupport = [
    {
      id: 1,
      name: 'Ahmad Hassan',
      avatar: 'https://ui-avatars.com/api/?name=Ahmad+Hassan&background=F9B233&color=fff',
      specialization: 'Gaming PCs & Hardware',
      rating: 4.9,
      reviews: 124,
      experience: '5 years',
      availability: {
        monday: ['9:00 AM - 12:00 PM', '2:00 PM - 6:00 PM'],
        tuesday: ['9:00 AM - 12:00 PM', '2:00 PM - 6:00 PM'],
        wednesday: ['9:00 AM - 12:00 PM'],
        thursday: ['9:00 AM - 12:00 PM', '2:00 PM - 6:00 PM'],
        friday: ['9:00 AM - 12:00 PM', '2:00 PM - 6:00 PM'],
        saturday: ['10:00 AM - 2:00 PM'],
        sunday: []
      },
      status: 'available'
    },
    {
      id: 2,
      name: 'Sarah Mohammed',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Mohammed&background=F9B233&color=fff',
      specialization: 'Software & Troubleshooting',
      rating: 4.8,
      reviews: 98,
      experience: '4 years',
      availability: {
        monday: ['10:00 AM - 2:00 PM', '4:00 PM - 8:00 PM'],
        tuesday: ['10:00 AM - 2:00 PM'],
        wednesday: ['10:00 AM - 2:00 PM', '4:00 PM - 8:00 PM'],
        thursday: ['10:00 AM - 2:00 PM', '4:00 PM - 8:00 PM'],
        friday: ['10:00 AM - 2:00 PM'],
        saturday: [],
        sunday: ['12:00 PM - 4:00 PM']
      },
      status: 'busy'
    },
    {
      id: 3,
      name: 'Khaled Ali',
      avatar: 'https://ui-avatars.com/api/?name=Khaled+Ali&background=F9B233&color=fff',
      specialization: 'Network & Servers',
      rating: 4.7,
      reviews: 87,
      experience: '6 years',
      availability: {
        monday: ['9:00 AM - 5:00 PM'],
        tuesday: ['9:00 AM - 5:00 PM'],
        wednesday: ['9:00 AM - 5:00 PM'],
        thursday: ['9:00 AM - 5:00 PM'],
        friday: ['9:00 AM - 1:00 PM'],
        saturday: [],
        sunday: []
      },
      status: 'available'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTechSupporters(mockTechSupport);
  }, []);

  const handleApply = (formData) => {
    // TODO: Send to backend
    console.log('Application submitted:', formData);
    toast.success('Your application has been submitted! We will review it shortly.');
    setShowApplyModal(false);
  };

  const handleRequestAppointment = (supporter) => {
    setSelectedSupport(supporter);
    setShowAppointmentModal(true);
  };

  const handleAppointmentSubmit = (appointmentData) => {
    // TODO: Send to backend
    console.log('Appointment requested:', appointmentData);
    toast.success('Appointment request sent! You will be notified once confirmed.');
    setShowAppointmentModal(false);
    setSelectedSupport(null);
  };

  const handleChatWithSupport = (supporter) => {
    // Navigate to chat page with supporter information
    navigate('/chat', { 
      state: { 
        recipientId: supporter.id,
        recipientName: supporter.name,
        recipientAvatar: supporter.avatar,
        recipientType: 'techSupport'
      } 
    });
  };

  const getDayName = (index) => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    return days[index];
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.mainBeige }}>
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center">
            <BlurText 
              text="Tech Support" 
              className="text-6xl font-bold mb-4" 
              style={{ color: colors.mainBlack }}
            />
          </div>
          <p className="text-xl mb-6" style={{ color: colors.jet }}>
            Get expert help with your PC problems from our certified technicians
          </p>
          
          {/* Apply Button */}
          <button
            onClick={() => setShowApplyModal(true)}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-white hover:opacity-90 transition-opacity cursor-pointer"
            style={{ backgroundColor: colors.mainYellow }}
          >
            <FiUserPlus size={24} />
            Become a Tech Support
          </button>
        </div>

        {/* Benefits Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-8" style={{ color: colors.mainBlack }}>
            Why Choose Our Tech Support?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <FiHeadphones size={48} />,
                title: 'Expert Technicians',
                description: 'Certified professionals with years of experience'
              },
              {
                icon: <FiClock size={48} />,
                title: 'Flexible Scheduling',
                description: 'Book appointments that fit your schedule'
              },
              {
                icon: <FiMessageCircle size={48} />,
                title: 'Direct Communication',
                description: 'Chat directly with technicians in real-time'
              }
            ].map((benefit, index) => (
              <BounceCard key={index} index={index}>
                <div 
                  className="bg-white rounded-lg shadow-lg p-8 text-center h-full"
                  style={{ border: `2px solid ${colors.platinum}` }}
                >
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: colors.mainYellow + '20', color: colors.mainYellow }}
                  >
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: colors.mainBlack }}>
                    {benefit.title}
                  </h3>
                  <p style={{ color: colors.jet }}>{benefit.description}</p>
                </div>
              </BounceCard>
            ))}
          </div>
        </div>

        {/* Tech Support Workers */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8" style={{ color: colors.mainBlack }}>
            Our Tech Support Team
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {techSupporters.map((supporter, index) => (
              <BounceCard key={supporter.id} index={index}>
                <div 
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                  style={{ border: `2px solid ${colors.platinum}` }}
                >
                  {/* Header */}
                  <div className="p-6 border-b-2" style={{ borderColor: colors.platinum }}>
                    <div className="flex items-start gap-4">
                      <img 
                        src={supporter.avatar} 
                        alt={supporter.name}
                        className="w-20 h-20 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-2xl font-bold" style={{ color: colors.mainBlack }}>
                            {supporter.name}
                          </h3>
                          <BsCheckCircleFill size={20} style={{ color: colors.mainYellow }} />
                        </div>
                        <p className="font-semibold mb-2" style={{ color: colors.mainYellow }}>
                          {supporter.specialization}
                        </p>
                        <div className="flex items-center gap-4 text-sm" style={{ color: colors.jet }}>
                          <div className="flex items-center gap-1">
                            <FiStar style={{ color: colors.mainYellow }} fill={colors.mainYellow} />
                            <span className="font-semibold">{supporter.rating}</span>
                            <span>({supporter.reviews} reviews)</span>
                          </div>
                          <div>
                            {supporter.experience} experience
                          </div>
                        </div>
                      </div>
                      <div 
                        className={`px-3 py-1 rounded-full text-sm font-bold ${
                          supporter.status === 'available' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {supporter.status === 'available' ? 'Available' : 'Busy'}
                      </div>
                    </div>
                  </div>

                  {/* Weekly Schedule */}
                  <div className="p-6">
                    <h4 className="font-bold mb-4 flex items-center gap-2" style={{ color: colors.mainBlack }}>
                      <FiCalendar style={{ color: colors.mainYellow }} />
                      Weekly Schedule
                    </h4>
                    <div className="space-y-2">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, dayIndex) => {
                        const dayKey = getDayName(dayIndex);
                        const slots = supporter.availability[dayKey];
                        return (
                          <div 
                            key={day}
                            className="flex items-center justify-between p-3 rounded-lg"
                            style={{ backgroundColor: colors.mainBeige }}
                          >
                            <span className="font-semibold" style={{ color: colors.mainBlack }}>
                              {day}
                            </span>
                            {slots && slots.length > 0 ? (
                              <div className="flex flex-wrap gap-2 justify-end">
                                {slots.map((slot, slotIndex) => (
                                  <span 
                                    key={slotIndex}
                                    className="px-3 py-1 rounded-full text-sm font-semibold"
                                    style={{ backgroundColor: colors.mainYellow, color: 'white' }}
                                  >
                                    {slot}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-sm" style={{ color: colors.jet }}>
                                Not Available
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-6 border-t-2 flex gap-3" style={{ borderColor: colors.platinum }}>
                    <button
                      onClick={() => handleChatWithSupport(supporter)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold border-2 hover:opacity-80 transition-opacity cursor-pointer"
                      style={{ 
                        borderColor: colors.mainYellow,
                        color: colors.mainYellow,
                        backgroundColor: 'white'
                      }}
                      disabled={supporter.status === 'busy'}
                    >
                      <FiMessageCircle size={20} />
                      Chat Now
                    </button>
                    <button
                      onClick={() => handleRequestAppointment(supporter)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold text-white hover:opacity-90 transition-opacity cursor-pointer"
                      style={{ backgroundColor: colors.mainYellow }}
                    >
                      <FiCalendar size={20} />
                      Request Appointment
                    </button>
                  </div>
                </div>
              </BounceCard>
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-center mb-8" style={{ color: colors.mainBlack }}>
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Choose Support', desc: 'Select a tech support specialist' },
              { step: '2', title: 'Schedule', desc: 'Pick a convenient time slot' },
              { step: '3', title: 'Get Confirmation', desc: 'Receive appointment confirmation' },
              { step: '4', title: 'Get Help', desc: 'Chat or meet with your technician' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white"
                  style={{ backgroundColor: colors.mainYellow }}
                >
                  {item.step}
                </div>
                <h4 className="font-bold mb-2" style={{ color: colors.mainBlack }}>
                  {item.title}
                </h4>
                <p className="text-sm" style={{ color: colors.jet }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showApplyModal && (
        <ApplyTechSupportModal
          onClose={() => setShowApplyModal(false)}
          onSubmit={handleApply}
        />
      )}

      {showAppointmentModal && selectedSupport && (
        <AppointmentModal
          supporter={selectedSupport}
          onClose={() => {
            setShowAppointmentModal(false);
            setSelectedSupport(null);
          }}
          onSubmit={handleAppointmentSubmit}
        />
      )}

      <Footer />
    </div>
  );
};

export default TechSupport;
