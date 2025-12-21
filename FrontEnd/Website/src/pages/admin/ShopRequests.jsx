import { useState, useEffect } from 'react';
import { MdCheckCircle, MdCancel, MdVisibility, MdDelete } from 'react-icons/md';
import axios from 'axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import colors from '../../config/colors';
import { useNavigate } from 'react-router-dom';

const ShopRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        toast.error('Please login to access this page');
        navigate('/signin');
        return;
      }

      console.log('Token:', token ? 'Present' : 'Missing');
      console.log('Fetching from:', '/api/Public/Public/GetShops');

      const response = await axios.get('/api/Public/Public/GetShops', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response data:', response.data);
      
      // Map the API response to match our component structure
      const mappedData = response.data.map(shop => ({
        id: shop.id,
        shopName: shop.shopName,
        ownerName: shop.ownerName,
        email: shop.email,
        phone: shop.phone,
        city: shop.city,
        exactLocation: shop.exactLocation,
        webURL: shop.webURL,
        description: shop.description,
        specialities: shop.specialities,
        shopLogoUrl: shop.shopLogoUrl,
        // Map status: 0 = pending, 1 = approved, 2 = rejected
        status: shop.status === 0 ? 'pending' : shop.status === 1 ? 'approved' : 'rejected'
      }));
      
      setRequests(mappedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching shop requests:', error);
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
      
      if (error.response?.status === 401) {
        toast.error('Unauthorized access. Please ensure you are logged in as an admin.');
        // Don't redirect immediately, let the user see the error
        // localStorage.removeItem('authToken');
        // navigate('/signin');
      } else {
        toast.error('Failed to fetch shop requests');
      }
      
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    const result = await Swal.fire({
      title: 'Approve Shop Request?',
      text: 'This will grant the shop owner access to the platform.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: colors.success,
      cancelButtonColor: colors.error,
      confirmButtonText: 'Yes, approve it!'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          toast.error('Authentication required');
          return;
        }

        await axios.post(`/api/Admins/Shop/AdminShops/Approve/${requestId}`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        // Update UI immediately after successful operation
        setRequests(requests.map(req => 
          req.id === requestId ? { ...req, status: 'approved' } : req
        ));
        
        toast.success('Shop request approved successfully!');
      } catch (error) {
        console.error('Error approving shop:', error);
        
        if (error.response?.status === 401) {
          toast.error('Unauthorized. Please login as admin.');
        } else if (error.response?.status === 404) {
          toast.error('Shop request not found');
        } else {
          toast.error('Failed to approve request');
        }
      }
    }
  };

  const handleReject = async (requestId) => {
    const result = await Swal.fire({
      title: 'Reject Shop Request?',
      text: 'Please provide a reason for rejection:',
      input: 'textarea',
      inputPlaceholder: 'Enter rejection reason...',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: colors.error,
      cancelButtonColor: colors.secondary,
      confirmButtonText: 'Reject',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to provide a reason!';
        }
      }
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          toast.error('Authentication required');
          return;
        }

        await axios.post(`/api/Admins/Shop/AdminShops/Reject/${requestId}`, 
          { reason: result.value }, 
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        // Update UI immediately after successful operation
        setRequests(requests.map(req => 
          req.id === requestId ? { ...req, status: 'rejected' } : req
        ));
        
        toast.success('Shop request rejected successfully!');
      } catch (error) {
        console.error('Error rejecting shop:', error);
        
        if (error.response?.status === 401) {
          toast.error('Unauthorized. Please login as admin.');
        } else if (error.response?.status === 404) {
          toast.error('Shop request not found');
        } else {
          toast.error('Failed to reject request');
        }
      }
    }
  };

  const handleDelete = async (requestId, shopName) => {
    const result = await Swal.fire({
      title: 'Delete Shop?',
      text: `Are you sure you want to delete "${shopName}"? This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: colors.error,
      cancelButtonColor: colors.secondary,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          toast.error('Authentication required');
          return;
        }

        await axios.delete(`/api/Admins/Shop/AdminShops/DeleteShop/${requestId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        // Remove the shop from the state
        setRequests(requests.filter(req => req.id !== requestId));
        
        toast.success('Shop deleted successfully!');
      } catch (error) {
        console.error('Error deleting shop:', error);
        
        if (error.response?.status === 401) {
          toast.error('Unauthorized. Please login as admin.');
        } else if (error.response?.status === 404) {
          toast.error('Shop not found');
        } else {
          toast.error('Failed to delete shop');
        }
      }
    }
  };

  const filteredRequests = requests.filter(req => 
    filter === 'all' ? true : req.status === filter
  );

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: colors.text }}>
            Shop Requests
          </h1>
          <p className="text-gray-500 mt-1">Manage and review shop registration requests</p>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {['all', 'pending', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all capitalize cursor-pointer ${
                filter === status ? 'text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
              }`}
              style={{
                backgroundColor: filter === status ? colors.primary : 'transparent'
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRequests.map((request) => (
          <div key={request.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            {/* Status Badge */}
            <div className="flex items-center justify-between mb-4">
              <span 
                className="px-3 py-1 rounded-full text-xs font-semibold uppercase"
                style={{
                  backgroundColor: 
                    request.status === 'approved' ? `${colors.success}20` :
                    request.status === 'rejected' ? `${colors.error}20` :
                    `${colors.warning}20`,
                  color: 
                    request.status === 'approved' ? colors.success :
                    request.status === 'rejected' ? colors.error :
                    colors.warning
                }}
              >
                {request.status}
              </span>
            </div>

            {/* Shop Logo */}
            {request.shopLogoUrl && (
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <img 
                    src={request.shopLogoUrl} 
                    alt={`${request.shopName} logo`}
                    className="h-32 w-32 object-contain rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-4 shadow-md border-2 border-gray-200 hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            )}

            {/* Shop Info */}
            <h3 className="text-xl font-bold mb-2 text-center" style={{ color: colors.text }}>
              {request.shopName}
            </h3>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <p><span className="font-semibold">Owner:</span> {request.ownerName}</p>
              <p><span className="font-semibold">Email:</span> {request.email}</p>
              <p><span className="font-semibold">Phone:</span> {request.phone}</p>
              <p><span className="font-semibold">Location:</span> {request.city}, {request.exactLocation}</p>
              {request.webURL && (
                <p>
                  <span className="font-semibold">Website:</span>{' '}
                  <a 
                    href={request.webURL} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Visit Website
                  </a>
                </p>
              )}
            </div>

            {/* Description */}
            {request.description && (
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-1">Description:</p>
                <p className="text-sm text-gray-600">{request.description}</p>
              </div>
            )}

            {/* Specialities */}
            {request.specialities && (
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Specialities:</p>
                <div className="flex flex-wrap gap-2">
                  {request.specialities.split(',').map((spec, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 rounded-lg text-xs">
                      {spec.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            {request.status === 'pending' && (
              <div className="flex gap-3">
                <button
                  onClick={() => handleApprove(request.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity cursor-pointer"
                  style={{ backgroundColor: colors.success }}
                >
                  <MdCheckCircle className="text-xl" />
                  Approve
                </button>
                <button
                  onClick={() => handleReject(request.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity cursor-pointer"
                  style={{ backgroundColor: colors.error }}
                >
                  <MdCancel className="text-xl" />
                  Reject
                </button>
              </div>
            )}

            {/* Delete Button for Approved Shops */}
            {request.status === 'approved' && (
              <div className="flex gap-3">
                <button
                  onClick={() => handleDelete(request.id, request.shopName)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity cursor-pointer"
                  style={{ backgroundColor: colors.error }}
                >
                  <MdDelete className="text-xl" />
                  Delete Shop
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No {filter} requests found</p>
        </div>
      )}
    </div>
  );
};

export default ShopRequests;
