import { useState, useEffect } from 'react';
import { MdBlock, MdCheckCircle, MdEdit } from 'react-icons/md';
import apiClient from '../../services/apiService';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import colors from '../../config/colors';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/Public/Public/GetAllUsers');
      
      // Transform the API response and check block status for each user
      const transformedUsers = await Promise.all(
        response.data.map(async (user) => {
          let isBlocked = false;
          
          // Check if user is blocked
          try {
            const blockStatusResponse = await apiClient.patch(`/Admins/Users/IsBlocked/${user.id}`);
            // API returns { message: "Block" } for blocked users and { message: "No Blocked" } for non-blocked users
            isBlocked = blockStatusResponse.data?.message === "Block";
          } catch (error) {
            console.error(`Error checking block status for user ${user.id}:`, error);
            // If error, assume not blocked
            isBlocked = false;
          }
          
          return {
            id: user.id,
            name: user.fullName || user.userName || 'Unknown User',
            email: user.email,
            phoneNumber: user.phoneNumber || 'N/A',
            emailConfirmed: user.emailConfirmed || false,
            role: user.userRole || 'User',
            status: isBlocked ? 'suspended' : 'active',
            joinedAt: 'N/A', // API doesn't provide this field yet
            lastActive: 'N/A', // API doesn't provide this field yet
            totalBuilds: 0, // API doesn't provide this field yet
            totalPosts: 0, // API doesn't provide this field yet
            shopName: user.shopName,
            totalProducts: 0, // API doesn't provide this field yet
            suspensionReason: isBlocked ? 'User is blocked' : null
          };
        })
      );
      
      setUsers(transformedUsers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
      setLoading(false);
    }
  };

  const handleSuspend = async (user) => {
    try {
      // First, check if the user is already blocked
      const isBlockedResponse = await apiClient.patch(`/Admins/Users/IsBlocked/${user.id}`);
      const isBlocked = isBlockedResponse.data?.message === "Block";

      if (isBlocked) {
        // User is already blocked, show toast
        toast.error('User is already blocked');
        return;
      }
    } catch (error) {
      console.error('Error checking block status:', error);
      toast.error('Failed to check user block status');
      return;
    }

    const result = await Swal.fire({
      title: `Block ${user.name}?`,
      html: `
        <div style="text-align: left;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">Number of days to block:</label>
          <input id="days-input" type="number" min="1" value="1" class="swal2-input" style="width: 100%; margin: 0;">
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: colors.error,
      cancelButtonColor: colors.secondary,
      confirmButtonText: 'Block User',
      preConfirm: () => {
        const days = document.getElementById('days-input').value;
        
        if (!days || days < 1) {
          Swal.showValidationMessage('Please enter a valid number of days (minimum 1)');
          return false;
        }
        
        return parseInt(days);
      }
    });

    if (result.isConfirmed) {
      try {
        const days = result.value;
        
        // Call the block user API
        await apiClient.patch(`/Admins/Users/BlockUser/${user.id}?days=${days}`);
        
        // Update local state
        setUsers(users.map(u => 
          u.id === user.id ? { ...u, status: 'suspended' } : u
        ));
        
        toast.success(`User blocked successfully for ${days} day(s)`);
      } catch (error) {
        console.error('Error blocking user:', error);
        
        if (error.response?.status === 404) {
          toast.error('User not found');
        } else {
          toast.error('Failed to block user');
        }
      }
    }
  };

  const handleActivate = async (userId) => {
    try {
      // First, check if the user is actually blocked
      const isBlockedResponse = await apiClient.patch(`/Admins/Users/IsBlocked/${userId}`);
      const isBlocked = isBlockedResponse.data?.message === "Block";

      if (!isBlocked) {
        // User is not blocked, show alert
        toast.info('User is not currently blocked');
        return;
      }

      // User is blocked, proceed with unblocking
      const result = await Swal.fire({
        title: 'Unblock User?',
        text: 'Are you sure you want to unblock this user?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: colors.success,
        cancelButtonColor: colors.secondary,
        confirmButtonText: 'Yes, Unblock'
      });

      if (result.isConfirmed) {
        // Call the unblock API
        await apiClient.patch(`/Admins/Users/UnblockUser/${userId}`);
        
        // Update local state
        setUsers(users.map(u => 
          u.id === userId ? { ...u, status: 'active', suspensionReason: null } : u
        ));
        
        toast.success('User unblocked successfully');
      }
    } catch (error) {
      console.error('Error unblocking user:', error);
      
      if (error.response?.status === 404) {
        toast.error('User not found');
      } else {
        toast.error('Failed to unblock user');
      }
    }
  };



  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: colors.text }}>
            User Management
          </h1>
          <p className="text-gray-500 mt-1">Manage platform users and their permissions</p>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 w-64"
          style={{ borderColor: colors.border }}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-md p-4">
          <p className="text-gray-500 text-sm">Total Users</p>
          <p className="text-3xl font-bold mt-1" style={{ color: colors.primary }}>
            {users.length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <p className="text-gray-500 text-sm">Active Users</p>
          <p className="text-3xl font-bold mt-1" style={{ color: colors.success }}>
            {users.filter(u => u.status === 'active').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <p className="text-gray-500 text-sm">Suspended Users</p>
          <p className="text-3xl font-bold mt-1" style={{ color: colors.error }}>
            {users.filter(u => u.status === 'suspended').length}
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: `${colors.primary}10` }}>
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: colors.text }}>
                  User
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: colors.text }}>
                  Role
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: colors.text }}>
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: colors.text }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: (() => {
                          switch (user.role) {
                            case 'SuperAdmin': return '#EF444420';
                            case 'Admin': return '#F59E0B20';
                            case 'TechSupport': return '#10B98120';
                            default: return '#6B728020';
                          }
                        })(),
                        color: (() => {
                          switch (user.role) {
                            case 'SuperAdmin': return '#EF4444';
                            case 'Admin': return '#F59E0B';
                            case 'TechSupport': return '#10B981';
                            default: return '#6B7280';
                          }
                        })()
                      }}
                    >
                      {user.role.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: user.status === 'active' ? `${colors.success}20` : `${colors.error}20`,
                        color: user.status === 'active' ? colors.success : colors.error
                      }}
                    >
                      {user.status.toUpperCase()}
                    </span>
                    {user.suspensionReason && (
                      <p className="text-xs text-red-600 mt-1">{user.suspensionReason}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {user.status === 'active' ? (
                        <button
                          onClick={() => handleSuspend(user)}
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Suspend User"
                        >
                          <MdBlock className="text-xl" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleActivate(user.id)}
                          className="p-2 rounded-lg text-green-600 hover:bg-green-50 transition-colors cursor-pointer"
                          title="Unblock User"
                        >
                          <MdCheckCircle className="text-xl" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No users found</p>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
