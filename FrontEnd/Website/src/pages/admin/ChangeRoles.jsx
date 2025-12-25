import { useState, useEffect } from 'react';
import { MdPerson, MdEmail, MdPhone, MdVerifiedUser, MdBlock, MdEdit } from 'react-icons/md';
import axios from 'axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import colors from '../../config/colors';

const ChangeRoles = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');

  const availableRoles = ['User', 'Admin', 'TechSupport'];

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role || '');
    
    if (role === 'SuperAdmin') {
      fetchAllUsers();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchAllUsers = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        toast.error('Authentication required');
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/Public/Public/GetAllUsers`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 
                           error.response.data?.title || 
                           'Failed to fetch users';
        toast.error(errorMessage);
      } else if (error.request) {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error('An unexpected error occurred');
      }
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, currentRole, newRole) => {
    if (currentRole === newRole) {
      toast.error('User already has this role');
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      html: `
        <p>You are about to change the user's role to:</p>
        <p class="text-xl font-bold mt-2" style="color: ${colors.mainYellow}">${newRole}</p>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: colors.mainYellow,
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, change role!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          toast.error('Authentication required');
          return;
        }

        const response = await axios.patch(
          `${import.meta.env.VITE_API_BASE_URL}/api/Admins/Users/changeRole/${userId}`,
          {
            newRole: newRole
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.message) {
          toast.success(response.data.message);
        } else {
          toast.success('User role updated successfully!');
        }

        // Update the user in the local state
        setUsers(users.map(user => 
          user.id === userId ? { ...user, userRole: newRole } : user
        ));

      } catch (error) {
        console.error('Error changing role:', error);
        
        if (error.response) {
          const errorMessage = error.response.data?.message || 
                             error.response.data?.title || 
                             'Failed to change user role';
          toast.error(errorMessage);
        } else if (error.request) {
          toast.error('Network error. Please check your connection.');
        } else {
          toast.error('An unexpected error occurred');
        }
      }
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'SuperAdmin':
        return '#EF4444';
      case 'Admin':
        return '#F59E0B';
      case 'TechSupport':
        return '#10B981';
      default:
        return '#6B7280';
    }
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
             style={{ borderColor: colors.mainYellow }}></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: colors.mainBlack }}>
            Change User Roles
          </h1>
          <p className="mt-1" style={{ color: colors.jet }}>
            Manage user permissions and roles
          </p>
        </div>
        
        {/* Stats Badge */}
        <div 
          className="px-6 py-3 rounded-lg"
          style={{ backgroundColor: colors.mainYellow }}
        >
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{users.length}</p>
            <p className="text-sm text-white">Total Users</p>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div 
        className="bg-white rounded-lg shadow-lg overflow-hidden"
        style={{ border: `2px solid ${colors.platinum}` }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: colors.mainBlack }}>
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-white">User</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white">Status</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white">Current Role</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white">Change Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr 
                  key={user.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                  style={{ borderColor: colors.platinum }}
                >
                  {/* User Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: colors.mainYellow + '20' }}
                      >
                        <MdPerson size={20} style={{ color: colors.mainYellow }} />
                      </div>
                      <div>
                        <p className="font-semibold" style={{ color: colors.mainBlack }}>
                          {user.fullName}
                        </p>
                        <p className="text-sm" style={{ color: colors.jet }}>
                          {user.userName}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <MdEmail size={16} style={{ color: colors.jet }} />
                        <p className="text-sm" style={{ color: colors.jet }}>{user.email}</p>
                      </div>
                      {user.phoneNumber && (
                        <div className="flex items-center gap-2">
                          <MdPhone size={16} style={{ color: colors.jet }} />
                          <p className="text-sm" style={{ color: colors.jet }}>{user.phoneNumber}</p>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Email Status */}
                  <td className="px-6 py-4">
                    {user.emailConfirmed ? (
                      <div className="flex items-center gap-2">
                        <MdVerifiedUser size={20} style={{ color: '#10B981' }} />
                        <span className="text-sm font-semibold" style={{ color: '#10B981' }}>
                          Verified
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <MdBlock size={20} style={{ color: '#EF4444' }} />
                        <span className="text-sm font-semibold" style={{ color: '#EF4444' }}>
                          Not Verified
                        </span>
                      </div>
                    )}
                  </td>

                  {/* Current Role */}
                  <td className="px-6 py-4">
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: getRoleBadgeColor(user.userRole) }}
                    >
                      {user.userRole || 'User'}
                    </span>
                  </td>

                  {/* Role Dropdown */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <select
                        value={user.userRole || 'User'}
                        onChange={(e) => handleRoleChange(user.id, user.userRole, e.target.value)}
                        className="px-3 py-2 rounded-lg font-medium cursor-pointer focus:outline-none focus:ring-2"
                        style={{ 
                          border: `2px solid ${colors.platinum}`,
                          color: colors.mainBlack,
                          backgroundColor: 'white'
                        }}
                        onFocus={(e) => e.target.style.borderColor = colors.mainYellow}
                        onBlur={(e) => e.target.style.borderColor = colors.platinum}
                      >
                        {availableRoles.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                      <MdEdit size={18} style={{ color: colors.mainYellow }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {users.length === 0 && (
        <div 
          className="text-center py-12 bg-white rounded-lg"
          style={{ border: `2px solid ${colors.platinum}` }}
        >
          <MdPerson size={64} style={{ color: colors.jet }} className="mx-auto mb-4" />
          <p className="text-xl font-semibold" style={{ color: colors.mainBlack }}>
            No Users Found
          </p>
        </div>
      )}
    </div>
  );
};

export default ChangeRoles;
