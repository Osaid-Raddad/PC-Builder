import { useState, useEffect } from 'react';
import { MdCheckCircle, MdCancel, MdVisibility } from 'react-icons/md';
import axios from 'axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import colors from '../../config/colors';

const ShopRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      // Replace with your API endpoint
      // const response = await axios.get('/api/admin/shop-requests');
      // setRequests(response.data);
      
      // Mock data for demonstration
      setRequests([
        {
          id: 1,
          shopName: 'TechStore Pro',
          ownerName: 'John Doe',
          email: 'john@techstore.com',
          phone: '+1234567890',
          address: '123 Tech Street, City',
          status: 'pending',
          submittedAt: '2024-01-15',
          documents: ['license.pdf', 'tax_id.pdf']
        },
        {
          id: 2,
          shopName: 'PC Components Hub',
          ownerName: 'Jane Smith',
          email: 'jane@pchub.com',
          phone: '+0987654321',
          address: '456 Hardware Ave, Town',
          status: 'pending',
          submittedAt: '2024-01-14',
          documents: ['registration.pdf']
        }
      ]);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch shop requests');
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
        // await axios.post(`/api/admin/shop-requests/${requestId}/approve`);
        setRequests(requests.map(req => 
          req.id === requestId ? { ...req, status: 'approved' } : req
        ));
        toast.success('Shop request approved successfully!');
      } catch (error) {
        toast.error('Failed to approve request');
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
        // await axios.post(`/api/admin/shop-requests/${requestId}/reject`, { reason: result.value });
        setRequests(requests.map(req => 
          req.id === requestId ? { ...req, status: 'rejected' } : req
        ));
        toast.success('Shop request rejected');
      } catch (error) {
        toast.error('Failed to reject request');
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
              className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
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
              <span className="text-sm text-gray-500">{request.submittedAt}</span>
            </div>

            {/* Shop Info */}
            <h3 className="text-xl font-bold mb-2" style={{ color: colors.text }}>
              {request.shopName}
            </h3>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <p><span className="font-semibold">Owner:</span> {request.ownerName}</p>
              <p><span className="font-semibold">Email:</span> {request.email}</p>
              <p><span className="font-semibold">Phone:</span> {request.phone}</p>
              <p><span className="font-semibold">Address:</span> {request.address}</p>
            </div>

            {/* Documents */}
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Documents:</p>
              <div className="flex flex-wrap gap-2">
                {request.documents.map((doc, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 rounded-lg text-xs">
                    {doc}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            {request.status === 'pending' && (
              <div className="flex gap-3">
                <button
                  onClick={() => handleApprove(request.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: colors.success }}
                >
                  <MdCheckCircle className="text-xl" />
                  Approve
                </button>
                <button
                  onClick={() => handleReject(request.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: colors.error }}
                >
                  <MdCancel className="text-xl" />
                  Reject
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
