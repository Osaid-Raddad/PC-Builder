import { useState, useEffect } from 'react';
import { MdCheckCircle, MdClose, MdMessage } from 'react-icons/md';
import axios from 'axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import colors from '../../config/colors';

const TechSupportRequests = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, open, in-progress, resolved

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      // Mock data
      setTickets([
        {
          id: 1,
          ticketNumber: 'TS-001',
          userName: 'Alice Johnson',
          userEmail: 'alice@email.com',
          subject: 'Cannot add components to build',
          description: 'When I try to add a GPU to my build, the page freezes...',
          priority: 'high',
          status: 'open',
          createdAt: '2024-01-15 10:30',
          category: 'Technical Issue'
        },
        {
          id: 2,
          ticketNumber: 'TS-002',
          userName: 'Bob Smith',
          userEmail: 'bob@email.com',
          subject: 'Payment not processing',
          description: 'My payment failed but money was deducted...',
          priority: 'urgent',
          status: 'in-progress',
          createdAt: '2024-01-15 09:15',
          category: 'Payment'
        },
        {
          id: 3,
          ticketNumber: 'TS-003',
          userName: 'Carol White',
          userEmail: 'carol@email.com',
          subject: 'Compatibility checker showing wrong info',
          description: 'The compatibility checker says my RAM is incompatible...',
          priority: 'medium',
          status: 'open',
          createdAt: '2024-01-14 16:45',
          category: 'Feature Issue'
        }
      ]);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch support tickets');
      setLoading(false);
    }
  };

  const handleResolve = async (ticketId) => {
    const result = await Swal.fire({
      title: 'Mark as Resolved?',
      text: 'Add resolution notes:',
      input: 'textarea',
      inputPlaceholder: 'Enter resolution details...',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: colors.success,
      cancelButtonColor: colors.secondary,
      confirmButtonText: 'Resolve'
    });

    if (result.isConfirmed) {
      try {
        setTickets(tickets.map(ticket => 
          ticket.id === ticketId ? { ...ticket, status: 'resolved' } : ticket
        ));
        toast.success('Ticket resolved successfully!');
      } catch (error) {
        toast.error('Failed to resolve ticket');
      }
    }
  };

  const handleRespond = async (ticket) => {
    const result = await Swal.fire({
      title: `Respond to ${ticket.ticketNumber}`,
      html: `
        <div class="text-left mb-4">
          <p class="text-sm text-gray-600 mb-2"><strong>From:</strong> ${ticket.userName}</p>
          <p class="text-sm text-gray-600 mb-2"><strong>Subject:</strong> ${ticket.subject}</p>
        </div>
      `,
      input: 'textarea',
      inputPlaceholder: 'Type your response...',
      showCancelButton: true,
      confirmButtonColor: colors.primary,
      confirmButtonText: 'Send Response'
    });

    if (result.isConfirmed) {
      toast.success('Response sent to user!');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return colors.error;
      case 'high': return colors.warning;
      case 'medium': return colors.accent;
      default: return colors.secondary;
    }
  };

  const filteredTickets = tickets.filter(ticket => 
    filter === 'all' ? true : ticket.status === filter
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
            Tech Support Tickets
          </h1>
          <p className="text-gray-500 mt-1">Manage customer support requests</p>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {['all', 'open', 'in-progress', 'resolved'].map((status) => (
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
              {status.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.map((ticket) => (
          <div key={ticket.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold" style={{ color: colors.text }}>
                    {ticket.ticketNumber}
                  </h3>
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-semibold uppercase"
                    style={{
                      backgroundColor: `${getPriorityColor(ticket.priority)}20`,
                      color: getPriorityColor(ticket.priority)
                    }}
                  >
                    {ticket.priority}
                  </span>
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: `${colors.primary}20`,
                      color: colors.primary
                    }}
                  >
                    {ticket.status}
                  </span>
                </div>
                <p className="text-xl font-semibold text-gray-800 mb-2">{ticket.subject}</p>
                <p className="text-gray-600 mb-3">{ticket.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span><strong>User:</strong> {ticket.userName}</span>
                  <span><strong>Email:</strong> {ticket.userEmail}</span>
                  <span><strong>Created:</strong> {ticket.createdAt}</span>
                  <span className="px-2 py-1 bg-gray-100 rounded">{ticket.category}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => handleRespond(ticket)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
                style={{ backgroundColor: colors.primary }}
              >
                <MdMessage className="text-xl" />
                Respond
              </button>
              {ticket.status !== 'resolved' && (
                <button
                  onClick={() => handleResolve(ticket.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: colors.success }}
                >
                  <MdCheckCircle className="text-xl" />
                  Mark Resolved
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredTickets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No {filter} tickets found</p>
        </div>
      )}
    </div>
  );
};

export default TechSupportRequests;
