import { useState, useEffect } from 'react';
import { MdCheckCircle, MdClose, MdBlock, MdPerson, MdEmail, MdPhone, MdWork, MdAccessTime } from 'react-icons/md';
import axios from 'axios';
import toast from 'react-hot-toast';
import colors from '../../config/colors';

const TechSupportRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role || '');
    
    if (role === 'SuperAdmin') {
      fetchPendingRequests();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        toast.error('Authentication required');
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/Admin/TechSupport/pending`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setRequests(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 
                           error.response.data?.title || 
                           'Failed to fetch pending requests';
        toast.error(errorMessage);
      } else if (error.request) {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error('An unexpected error occurred');
      }
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    // TODO: Implement accept API call
    console.log('Accept request:', requestId);
    toast.success('Accept functionality will be implemented next');
  };

  const handleReject = async (requestId) => {
    // TODO: Implement reject API call
    console.log('Reject request:', requestId);
    toast.error('Reject functionality will be implemented next');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Access denied for non-SuperAdmin
  if (userRole !== 'SuperAdmin') {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <div 
          className="p-12 rounded-lg text-center max-w-md"
          style={{ 
            backgroundColor: 'white',
            border: `2px solid ${colors.error}`
          }}
        >
          <MdBlock size={80} style={{ color: colors.error }} className="mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4" style={{ color: colors.mainBlack }}>
            Access Denied
          </h2>
          <p className="text-lg" style={{ color: colors.jet }}>
            This page is only accessible to SuperAdmin users.
          </p>
          <p className="text-sm mt-4" style={{ color: colors.jet }}>
            Current role: <span className="font-semibold">{userRole || 'Unknown'}</span>
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2" 
             style={{ borderColor: colors.primary }}></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: colors.mainBlack }}>
            Tech Support Applications
          </h1>
          <p className="mt-1" style={{ color: colors.jet }}>
            Review and manage pending tech support applications
          </p>
        </div>
        
        {/* Stats Badge */}
        <div 
          className="px-6 py-3 rounded-lg"
          style={{ backgroundColor: colors.mainYellow }}
        >
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{requests.length}</p>
            <p className="text-sm text-white">Pending Requests</p>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="grid grid-cols-1 gap-6">
        {requests.length === 0 ? (
          <div 
            className="text-center py-12 bg-white rounded-lg"
            style={{ border: `2px solid ${colors.platinum}` }}
          >
            <MdCheckCircle size={64} style={{ color: colors.mainYellow }} className="mx-auto mb-4" />
            <p className="text-xl font-semibold" style={{ color: colors.mainBlack }}>
              No Pending Requests
            </p>
            <p className="mt-2" style={{ color: colors.jet }}>
              All tech support applications have been reviewed
            </p>
          </div>
        ) : (
          requests.map((request) => (
            <div 
              key={request.id} 
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
              style={{ border: `2px solid ${colors.platinum}` }}
            >
              {/* Header Section */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: colors.mainYellow + '20' }}
                  >
                    <MdPerson size={32} style={{ color: colors.mainYellow }} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold" style={{ color: colors.mainBlack }}>
                      {request.fullName}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span 
                        className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{ 
                          backgroundColor: colors.mainYellow + '30',
                          color: colors.mainBlack
                        }}
                      >
                        {request.areaOfSpecialization}
                      </span>
                      <span 
                        className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{ 
                          backgroundColor: colors.platinum,
                          color: colors.jet
                        }}
                      >
                        {request.yearsOfExperience} {request.yearsOfExperience === 1 ? 'Year' : 'Years'} Experience
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm" style={{ color: colors.jet }}>
                    Applied on
                  </p>
                  <p className="text-sm font-semibold" style={{ color: colors.mainBlack }}>
                    {formatDate(request.createdAt)}
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: colors.mainBeige }}>
                  <MdEmail size={20} style={{ color: colors.mainYellow }} />
                  <div>
                    <p className="text-xs" style={{ color: colors.jet }}>Email</p>
                    <p className="font-semibold" style={{ color: colors.mainBlack }}>{request.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: colors.mainBeige }}>
                  <MdPhone size={20} style={{ color: colors.mainYellow }} />
                  <div>
                    <p className="text-xs" style={{ color: colors.jet }}>Phone</p>
                    <p className="font-semibold" style={{ color: colors.mainBlack }}>{request.phoneNumber}</p>
                  </div>
                </div>
              </div>

              {/* Reason Section */}
              <div 
                className="p-4 rounded-lg mb-6"
                style={{ backgroundColor: colors.mainBeige }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <MdWork size={20} style={{ color: colors.mainYellow }} />
                  <h4 className="font-semibold" style={{ color: colors.mainBlack }}>
                    Reason for Application
                  </h4>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: colors.jet }}>
                  {request.reason}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => handleAccept(request.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-white hover:opacity-90 transition-opacity cursor-pointer"
                  style={{ backgroundColor: '#10B981' }}
                >
                  <MdCheckCircle size={20} />
                  Accept Application
                </button>
                
                <button
                  onClick={() => handleReject(request.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-white hover:opacity-90 transition-opacity cursor-pointer"
                  style={{ backgroundColor: '#EF4444' }}
                >
                  <MdClose size={20} />
                  Reject Application
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TechSupportRequests;
