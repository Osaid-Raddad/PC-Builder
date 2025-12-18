import { useState, useEffect } from 'react';
import { MdBlock, MdCheckCircle, MdDelete, MdEdit } from 'react-icons/md';
import axios from 'axios';
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
      // Mock data
      setUsers([
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          role: 'user',
          status: 'active',
          joinedAt: '2024-01-10',
          lastActive: '2024-01-15',
          totalBuilds: 5,
          totalPosts: 12
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'shop_owner',
          status: 'active',
          joinedAt: '2024-01-08',
          lastActive: '2024-01-15',
          shopName: 'TechStore Pro',
          totalProducts: 156
        },
        {
          id: 3,
          name: 'Bob Wilson',
          email: 'bob@example.com',
          role: 'user',
          status: 'suspended',
          joinedAt: '2024-01-05',
          lastActive: '2024-01-12',
          totalBuilds: 2,
          totalPosts: 1,
          suspensionReason: 'Spam posting'
        }
      ]);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch users');
      setLoading(false);
    }
  };

  const handleSuspend = async (user) => {
    const result = await Swal.fire({
      title: `Suspend ${user.name}?`,
      text: 'Provide a reason for suspension:',
      input: 'textarea',
      inputPlaceholder: 'Enter suspension reason...',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: colors.error,
      cancelButtonColor: colors.secondary,
      confirmButtonText: 'Suspend User',
      inputValidator: (value) => {
        if (!value) return 'You need to provide a reason!';
      }
    });

    if (result.isConfirmed) {
      try {
        setUsers(users.map(u => 
          u.id === user.id ? { ...u, status: 'suspended', suspensionReason: result.value } : u
        ));
        toast.success('User suspended successfully');
      } catch (error) {
        toast.error('Failed to suspend user');
      }
    }
  };

  const handleActivate = async (userId) => {
    try {
      setUsers(users.map(u => 
        u.id === userId ? { ...u, status: 'active', suspensionReason: null } : u
      ));
      toast.success('User activated successfully');
    } catch (error) {
      toast.error('Failed to activate user');
    }
  };

  const handleDelete = async (user) => {
    const result = await Swal.fire({
      title: `Delete ${user.name}?`,
      text: 'This will permanently delete the user and all their data!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: colors.error,
      cancelButtonColor: colors.secondary,
      confirmButtonText: 'Yes, delete permanently!'
    });

    if (result.isConfirmed) {
      try {
        setUsers(users.filter(u => u.id !== user.id));
        toast.success('User deleted successfully');
      } catch (error) {
        toast.error('Failed to delete user');
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
                  Activity
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: colors.text }}>
                  Joined
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
                        backgroundColor: user.role === 'shop_owner' ? `${colors.secondary}20` : `${colors.primary}20`,
                        color: user.role === 'shop_owner' ? colors.secondary : colors.primary
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
                    <div className="text-sm text-gray-600">
                      {user.role === 'shop_owner' ? (
                        <p>{user.totalProducts} products</p>
                      ) : (
                        <>
                          <p>{user.totalBuilds} builds</p>
                          <p>{user.totalPosts} posts</p>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.joinedAt}
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
                          title="Activate User"
                        >
                          <MdCheckCircle className="text-xl" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(user)}
                        className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete User"
                      >
                        <MdDelete className="text-xl" />
                      </button>
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
