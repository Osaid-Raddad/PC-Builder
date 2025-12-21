import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FiSearch, FiMoreVertical, FiPhone, FiVideo, FiSend, 
  FiPaperclip, FiSmile, FiImage, FiCheck, FiCheckCircle, FiArrowLeft 
} from 'react-icons/fi';
import { BsThreeDotsVertical, BsRobot } from 'react-icons/bs';
import { IoArrowBack } from 'react-icons/io5';
import { toast } from 'react-toastify';
import colors from '../../../config/colors';
import { 
  createHubConnection, 
  stopHubConnection, 
  sendMessage, 
  getAllUsers, 
  getChat,
  filterUsersByRole 
} from '../../../services/chatService';

export default function Chat() {
  const navigate = useNavigate();
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [showConversations, setShowConversations] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [hubConnection, setHubConnection] = useState(null);
  const messagesEndRef = useRef(null);

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowConversations(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize: Get current user and establish SignalR connection
  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Get current user from localStorage
        const userStr = localStorage.getItem('userData');
        const token = localStorage.getItem('authToken');
        
        if (!userStr || !token) {
          toast.error('Please log in to use chat');
          navigate('/signin');
          return;
        }

        const user = JSON.parse(userStr);
        setCurrentUser(user);

        // Fetch all users
        const usersData = await getAllUsers();
        setAllUsers(usersData);

        // Filter users based on current user's role
        const filteredUsers = filterUsersByRole(usersData, user.role);
        
        // Convert users to conversations format
        const userConversations = filteredUsers
          .filter(u => u.id !== user.id) // Exclude current user
          .map(u => ({
            id: u.id,
            name: u.firstName && u.lastName ? `${u.firstName} ${u.lastName}` : u.email,
            lastMessage: 'Start a conversation',
            timestamp: '',
            unread: 0,
            avatar: u.profilePictureUrl || '/api/placeholder/40/40',
            online: false,
            role: u.role,
            email: u.email
          }));

        setConversations(userConversations);

        // Connect to SignalR Hub
        const connection = await createHubConnection(token);
        setHubConnection(connection);

        // Listen for incoming messages
        connection.on('ReceiveMessage', (senderId, message, timestamp) => {
          const newMsg = {
            id: Date.now(),
            senderId: senderId,
            text: message,
            timestamp: new Date(timestamp).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            isSent: false,
            isRead: false
          };

          setMessages(prev => [...prev, newMsg]);

          // Update conversation's last message
          setConversations(prev => prev.map(conv => 
            conv.id === senderId 
              ? { ...conv, lastMessage: message, timestamp: 'Now', unread: conv.unread + 1 }
              : conv
          ));
        });

        // Listen for user online status
        connection.on('UserOnline', (userId) => {
          setConversations(prev => prev.map(conv => 
            conv.id === userId ? { ...conv, online: true } : conv
          ));
        });

        connection.on('UserOffline', (userId) => {
          setConversations(prev => prev.map(conv => 
            conv.id === userId ? { ...conv, online: false } : conv
          ));
        });

        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing chat:', error);
        toast.error('Failed to initialize chat system');
        setIsLoading(false);
      }
    };

    initializeChat();

    // Cleanup on unmount
    return () => {
      stopHubConnection();
    };
  }, [navigate]);

  // Handle incoming tech support worker from navigation
  useEffect(() => {
    const { recipientId, recipientName, recipientAvatar, recipientType } = location.state || {};
    
    if (recipientId && recipientType === 'techSupport') {
      // Check if tech support conversation already exists
      const existingConv = conversations.find(c => c.id === recipientId);
      
      if (existingConv) {
        handleSelectChat(existingConv);
      } else {
        // Add new tech support conversation
        const newTechSupport = {
          id: recipientId,
          name: recipientName,
          lastMessage: 'Start chatting with your tech support specialist',
          timestamp: 'Now',
          unread: 0,
          avatar: recipientAvatar,
          online: true,
          isTechSupport: true,
          role: 'TechSupport'
        };
        
        setConversations(prev => [newTechSupport, ...prev]);
        handleSelectChat(newTechSupport);
      }
      
      if (isMobileView) {
        setShowConversations(false);
      }
    }
  }, [location.state, conversations, isMobileView]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !selectedChat || !hubConnection) return;

    try {
      const newMsg = {
        id: Date.now(),
        senderId: currentUser.id,
        text: newMessage,
        timestamp: new Date().toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        isSent: true,
        isRead: false
      };

      setMessages(prev => [...prev, newMsg]);
      
      // Send message through SignalR
      await sendMessage(selectedChat.id, newMessage);

      // Update conversation's last message
      setConversations(prev => prev.map(conv => 
        conv.id === selectedChat.id 
          ? { ...conv, lastMessage: newMessage, timestamp: 'Now' }
          : conv
      ));
      
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSelectChat = async (conversation) => {
    setSelectedChat(conversation);
    
    try {
      // Fetch chat history from API
      const chatHistory = await getChat(conversation.id);
      
      // Convert API response to messages format
      const formattedMessages = chatHistory.map(msg => ({
        id: msg.id,
        senderId: msg.senderId,
        text: msg.message || msg.text,
        timestamp: new Date(msg.timestamp).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        isSent: msg.senderId === currentUser.id,
        isRead: msg.isRead || false
      }));

      setMessages(formattedMessages);

      // Mark conversation as read
      setConversations(prev => prev.map(conv => 
        conv.id === conversation.id ? { ...conv, unread: 0 } : conv
      ));
    } catch (error) {
      console.error('Error loading chat:', error);
      // Start with empty messages if no chat history
      setMessages([]);
    }
    
    if (isMobileView) {
      setShowConversations(false);
    }
  };

  const handleBackToConversations = () => {
    setShowConversations(true);
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ backgroundColor: colors.mainBlack }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 mx-auto mb-4" 
               style={{ borderColor: colors.mainYellow }}></div>
          <p style={{ color: colors.alabaster }}>Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen" style={{ backgroundColor: colors.mainBlack }}>
      {/* Conversations Sidebar */}
      <div 
        className={`${
          isMobileView 
            ? showConversations ? 'w-full' : 'hidden' 
            : 'w-80 lg:w-96'
        } flex flex-col border-r`}
        style={{ 
          backgroundColor: colors.jet,
          borderColor: colors.platinum + '30'
        }}
      >
        {/* Sidebar Header */}
        <div 
          className="p-4 border-b"
          style={{ borderColor: colors.platinum + '30' }}
        >
          {/* Return to Site Button */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 mb-4 px-3 py-2 cursor-pointer rounded-lg transition-all duration-200 hover:opacity-80"
            style={{ 
              backgroundColor: colors.mainBlack,
              color: colors.mainYellow,
              border: `1px solid ${colors.mainYellow}`
            }}
          >
            <FiArrowLeft size={18} />
            <span className="font-medium">Return to Site</span>
          </button>

          <h1 className="text-2xl font-bold mb-4" style={{ color: colors.mainYellow }}>
            Chats
          </h1>
          
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full text-sm focus:outline-none focus:ring-2 transition-all"
              style={{ 
                backgroundColor: colors.mainBlack,
                border: `1px solid ${colors.platinum}40`,
                color: colors.alabaster,
              }}
              onFocus={(e) => e.target.style.borderColor = colors.mainYellow}
              onBlur={(e) => e.target.style.borderColor = colors.platinum + '40'}
            />
            <FiSearch 
              className="absolute left-3 top-1/2 transform -translate-y-1/2" 
              style={{ color: colors.mainYellow }}
              size={18}
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => handleSelectChat(conv)}
              className="flex items-center p-4 cursor-pointer transition-all duration-200 border-b"
              style={{ 
                backgroundColor: selectedChat?.id === conv.id ? colors.mainBlack : 'transparent',
                borderColor: colors.platinum + '20'
              }}
              onMouseEnter={(e) => {
                if (selectedChat?.id !== conv.id) {
                  e.currentTarget.style.backgroundColor = colors.mainBlack + '80';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedChat?.id !== conv.id) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                  style={{ 
                    backgroundColor: colors.mainYellow,
                    color: colors.mainBlack
                  }}
                >
                  {conv.name.charAt(0).toUpperCase()}
                </div>
                {conv.online && (
                  <div 
                    className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2"
                    style={{ 
                      backgroundColor: '#10b981',
                      borderColor: colors.jet
                    }}
                  />
                )}
              </div>

              {/* Conversation Info */}
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 
                    className="font-semibold text-sm truncate"
                    style={{ color: colors.alabaster }}
                  >
                    {conv.name}
                    {conv.role && (
                      <span 
                        className="ml-2 text-xs px-2 py-0.5 rounded-full"
                        style={{ 
                          backgroundColor: conv.role === 'Admin' || conv.role === 'SuperAdmin' 
                            ? '#ef4444' + '30' 
                            : conv.role === 'TechSupport' 
                              ? '#10b981' + '30' 
                              : colors.mainYellow + '30',
                          color: conv.role === 'Admin' || conv.role === 'SuperAdmin' 
                            ? '#ef4444' 
                            : conv.role === 'TechSupport' 
                              ? '#10b981' 
                              : colors.mainYellow
                        }}
                      >
                        {conv.role}
                      </span>
                    )}
                  </h3>
                  <span 
                    className="text-xs ml-2 shrink-0"
                    style={{ color: colors.platinum }}
                  >
                    {conv.timestamp}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p 
                    className="text-sm truncate"
                    style={{ color: colors.platinum }}
                  >
                    {conv.lastMessage}
                  </p>
                  {conv.unread > 0 && (
                    <span 
                      className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold shrink-0"
                      style={{ 
                        backgroundColor: colors.mainYellow,
                        color: colors.mainBlack
                      }}
                    >
                      {conv.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div 
        className={`${
          isMobileView 
            ? showConversations ? 'hidden' : 'w-full' 
            : 'flex-1'
        } flex flex-col`}
        style={{ backgroundColor: colors.mainBlack }}
      >
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div 
              className="flex items-center justify-between p-4 border-b"
              style={{ 
                backgroundColor: colors.jet,
                borderColor: colors.platinum + '30'
              }}
            >
              <div className="flex items-center">
                {isMobileView && (
                  <button
                    onClick={handleBackToConversations}
                    className="mr-3 p-2 rounded-full transition-all"
                    style={{ color: colors.mainYellow }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.mainBlack}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <IoArrowBack size={24} />
                  </button>
                )}
                <div className="relative">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                    style={{ 
                      backgroundColor: colors.mainYellow,
                      color: colors.mainBlack
                    }}
                  >
                    {selectedChat.name.charAt(0).toUpperCase()}
                  </div>
                  {selectedChat.online && (
                    <div 
                      className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
                      style={{ 
                        backgroundColor: '#10b981',
                        borderColor: colors.jet
                      }}
                    />
                  )}
                </div>
                <div className="ml-3">
                  <h2 
                    className="font-semibold flex items-center gap-2"
                    style={{ color: colors.alabaster }}
                  >
                    {selectedChat.name}
                    {selectedChat.role && (
                      <span 
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ 
                          backgroundColor: selectedChat.role === 'Admin' || selectedChat.role === 'SuperAdmin' 
                            ? '#ef4444' + '30' 
                            : selectedChat.role === 'TechSupport' 
                              ? '#10b981' + '30' 
                              : colors.mainYellow + '30',
                          color: selectedChat.role === 'Admin' || selectedChat.role === 'SuperAdmin' 
                            ? '#ef4444' 
                            : selectedChat.role === 'TechSupport' 
                              ? '#10b981' 
                              : colors.mainYellow
                        }}
                      >
                        {selectedChat.role}
                      </span>
                    )}
                  </h2>
                  <p 
                    className="text-sm"
                    style={{ color: selectedChat.online ? '#10b981' : colors.platinum }}
                  >
                    {selectedChat.online ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                  <button
                    className="p-2 rounded-full transition-all"
                    style={{ color: colors.mainYellow }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.mainBlack}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <FiPhone size={20} />
                  </button>
                  <button
                    className="p-2 rounded-full transition-all"
                    style={{ color: colors.mainYellow }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.mainBlack}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <FiVideo size={20} />
                  </button>
                  <button
                    className="p-2 rounded-full transition-all"
                    style={{ color: colors.mainYellow }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.mainBlack}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <BsThreeDotsVertical size={20} />
                  </button>
                </div>
              </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isSent ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] md:max-w-[60%] lg:max-w-[50%] rounded-2xl px-4 py-2 ${
                      message.isSent ? 'rounded-br-sm' : 'rounded-bl-sm'
                    }`}
                    style={{
                      backgroundColor: message.isSent ? colors.mainYellow : colors.jet,
                      color: message.isSent ? colors.mainBlack : colors.alabaster
                    }}
                  >
                    <p className="text-sm md:text-base wrap-break-word">{message.text}</p>
                    <div className="flex items-center justify-end mt-1 space-x-1">
                      <span 
                        className="text-xs"
                        style={{ 
                          color: message.isSent 
                            ? colors.mainBlack + '80' 
                            : colors.platinum 
                        }}
                      >
                        {message.timestamp}
                      </span>
                      {message.isSent && (
                        message.isRead ? (
                          <FiCheckCircle size={14} style={{ color: colors.mainBlack + '80' }} />
                        ) : (
                          <FiCheck size={14} style={{ color: colors.mainBlack + '80' }} />
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div 
              className="p-4 border-t"
              style={{ 
                backgroundColor: colors.jet,
                borderColor: colors.platinum + '30'
              }}
            >
              <div className="flex items-end space-x-2">
                {/* Attachment Buttons */}
                <div className="flex space-x-1">
                  <button
                    className="p-2 rounded-full transition-all"
                    style={{ color: colors.mainYellow }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.mainBlack}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <FiPaperclip size={20} />
                  </button>
                  <button
                    className="p-2 rounded-full transition-all"
                    style={{ color: colors.mainYellow }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.mainBlack}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <FiImage size={20} />
                  </button>
                </div>

                {/* Text Input */}
                <div className="flex-1 relative">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    rows={1}
                    className="w-full px-4 py-2.5 pr-12 rounded-full text-sm focus:outline-none focus:ring-2 resize-none overflow-hidden"
                    style={{ 
                      backgroundColor: colors.mainBlack,
                      border: `1px solid ${colors.platinum}40`,
                      color: colors.alabaster,
                      maxHeight: '100px'
                    }}
                    onFocus={(e) => e.target.style.borderColor = colors.mainYellow}
                    onBlur={(e) => e.target.style.borderColor = colors.platinum + '40'}
                    onInput={(e) => {
                      e.target.style.height = 'auto';
                      e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
                    }}
                  />
                  <button
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full transition-all"
                    style={{ color: colors.mainYellow }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.mainBlack}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <FiSmile size={20} />
                  </button>
                </div>

                {/* Send Button */}
                <button
                  onClick={handleSendMessage}
                  disabled={newMessage.trim() === ''}
                  className="p-3 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    backgroundColor: newMessage.trim() ? colors.mainYellow : colors.platinum + '40',
                    color: newMessage.trim() ? colors.mainBlack : colors.platinum
                  }}
                >
                  <FiSend size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          // No Chat Selected
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: colors.jet }}
              >
                <FiSend size={40} style={{ color: colors.mainYellow }} />
              </div>
              <h2 
                className="text-2xl font-bold mb-2"
                style={{ color: colors.alabaster }}
              >
                Select a conversation
              </h2>
              <p style={{ color: colors.platinum }}>
                Choose a chat from the sidebar to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
