import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FiSearch, FiMoreVertical, FiPhone, FiVideo, FiSend, 
  FiPaperclip, FiSmile, FiImage, FiCheck, FiCheckCircle, FiArrowLeft 
} from 'react-icons/fi';
import { BsThreeDotsVertical, BsRobot } from 'react-icons/bs';
import { IoArrowBack } from 'react-icons/io5';
import colors from '../../../config/colors';

export default function Chat() {
  const navigate = useNavigate();
  const location = useLocation();
  const [conversations, setConversations] = useState([
    {
      id: 'ai-bot',
      name: 'PC Builder AI Assistant',
      lastMessage: 'Hi! I am here to help you with PC building questions 🤖',
      timestamp: 'Now',
      unread: 0,
      avatar: '/api/placeholder/40/40',
      online: true,
      isAI: true
    },
    {
      id: 1,
      name: 'Ahmad Hassan',
      lastMessage: 'Hey! Did you check out the new RTX 4090 builds?',
      timestamp: '2m ago',
      unread: 3,
      avatar: '/api/placeholder/40/40',
      online: true
    },
    {
      id: 2,
      name: 'Sarah Al-Najjar',
      lastMessage: 'Thanks for the RAM recommendation!',
      timestamp: '15m ago',
      unread: 0,
      avatar: '/api/placeholder/40/40',
      online: true
    },
    {
      id: 3,
      name: 'Mohammed Khalil',
      lastMessage: 'Which motherboard works best with i9-13900K?',
      timestamp: '1h ago',
      unread: 1,
      avatar: '/api/placeholder/40/40',
      online: false
    },
    {
      id: 4,
      name: 'Layla Mansour',
      lastMessage: 'Your build looks amazing! 🔥',
      timestamp: '3h ago',
      unread: 0,
      avatar: '/api/placeholder/40/40',
      online: false
    },
    {
      id: 5,
      name: 'Omar Qasim',
      lastMessage: 'Can you help me with my cooling setup?',
      timestamp: '1d ago',
      unread: 0,
      avatar: '/api/placeholder/40/40',
      online: true
    }
  ]);

  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [showConversations, setShowConversations] = useState(true);
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

  // Handle incoming tech support worker from navigation
  useEffect(() => {
    const { recipientId, recipientName, recipientAvatar, recipientType } = location.state || {};
    
    if (recipientId && recipientType === 'techSupport') {
      // Check if tech support conversation already exists
      const existingConv = conversations.find(c => c.id === `tech-${recipientId}`);
      
      if (!existingConv) {
        // Add new tech support conversation
        const newTechSupport = {
          id: `tech-${recipientId}`,
          name: recipientName,
          lastMessage: 'Start chatting with your tech support specialist',
          timestamp: 'Now',
          unread: 0,
          avatar: recipientAvatar,
          online: true,
          isTechSupport: true
        };
        
        setConversations(prev => [newTechSupport, ...prev]);
        setSelectedChat(newTechSupport);
        setMessages([
          {
            id: 1,
            senderId: `tech-${recipientId}`,
            text: `Hi! I'm ${recipientName}, your tech support specialist. How can I help you today?`,
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            isSent: false
          }
        ]);
      } else {
        // Select existing tech support conversation
        setSelectedChat(existingConv);
        // Load existing messages for this tech support
        setMessages([
          {
            id: 1,
            senderId: `tech-${recipientId}`,
            text: existingConv.lastMessage,
            timestamp: '10:30 AM',
            isSent: false
          }
        ]);
      }
      
      if (isMobileView) {
        setShowConversations(false);
      }
    } else {
      // Default to AI assistant if no tech support selected
      setSelectedChat(conversations[0]);
      setMessages([
        {
          id: 1,
          senderId: 'ai-bot',
          text: 'Hi! I am your PC Builder AI Assistant. I can help you with component selection, compatibility checks, and building recommendations. How can I assist you today?',
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          isSent: false
        }
      ]);
    }
  }, [location.state, isMobileView]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const newMsg = {
      id: messages.length + 1,
      senderId: 'me',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      isSent: true,
      isRead: false
    };

    setMessages([...messages, newMsg]);
    
    // If chatting with AI, simulate AI response
    if (selectedChat?.isAI) {
      setTimeout(() => {
        const aiResponse = {
          id: messages.length + 2,
          senderId: 'ai-bot',
          text: generateAIResponse(newMessage),
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          isSent: false
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
    
    setNewMessage('');
  };

  const generateAIResponse = (userMessage) => {
    const lowerMsg = userMessage.toLowerCase();
    
    // Basic AI responses based on keywords
    if (lowerMsg.includes('cpu') || lowerMsg.includes('processor')) {
      return 'For CPUs, I recommend considering factors like core count, clock speed, and compatibility with your motherboard. Popular choices are Intel Core i5/i7/i9 or AMD Ryzen 5/7/9. What is your budget and use case?';
    } else if (lowerMsg.includes('gpu') || lowerMsg.includes('graphics')) {
      return 'GPU selection depends on your resolution and games. RTX 4070/4080 for 1440p-4K gaming, RTX 4060 for 1080p. AMD RX 7800 XT offers great value. What resolution do you play at?';
    } else if (lowerMsg.includes('ram') || lowerMsg.includes('memory')) {
      return '16GB RAM is the sweet spot for gaming, 32GB for content creation. DDR5 is newer but DDR4 still performs great. Look for 3200MHz+ speeds. What are you building for?';
    } else if (lowerMsg.includes('budget')) {
      return 'Budget builds start around $600-800, mid-range $1000-1500, high-end $2000+. What is your target budget and what will you use the PC for?';
    } else if (lowerMsg.includes('compatibility') || lowerMsg.includes('compatible')) {
      return 'I can help check compatibility! Make sure your CPU socket matches motherboard, PSU wattage is sufficient, RAM is supported, and case fits your GPU/cooler. What components are you considering?';
    } else {
      return 'That is a great question! I can help you with component selection, compatibility, performance comparisons, and building tips. Could you provide more details about what you need help with?';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSelectChat = (conversation) => {
    setSelectedChat(conversation);
    
    // Load different messages based on conversation type
    if (conversation.isAI) {
      setMessages([
        {
          id: 1,
          senderId: 'ai-bot',
          text: 'Hi! I am your PC Builder AI Assistant. I can help you with component selection, compatibility checks, and building recommendations. How can I assist you today?',
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          isSent: false
        }
      ]);
    } else if (conversation.isTechSupport) {
      // Load tech support messages
      setMessages([
        {
          id: 1,
          senderId: conversation.id,
          text: `Hi! I'm ${conversation.name}, your tech support specialist. How can I help you today?`,
          timestamp: '10:30 AM',
          isSent: false
        }
      ]);
    } else {
      // Load regular user messages
      setMessages([
        {
          id: 1,
          senderId: conversation.id,
          text: conversation.lastMessage,
          timestamp: '10:30 AM',
          isSent: false
        }
      ]);
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
              <div className="relative flex-shrink-0">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                  style={{ 
                    backgroundColor: conv.isAI ? colors.mainYellow : colors.mainYellow,
                    color: colors.mainBlack
                  }}
                >
                  {conv.isAI ? <BsRobot size={24} /> : conv.name.charAt(0)}
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
                    {conv.isAI && (
                      <span 
                        className="ml-2 text-xs px-2 py-0.5 rounded-full"
                        style={{ 
                          backgroundColor: colors.mainYellow + '30',
                          color: colors.mainYellow
                        }}
                      >
                        AI
                      </span>
                    )}
                    {conv.isTechSupport && (
                      <span 
                        className="ml-2 text-xs px-2 py-0.5 rounded-full"
                        style={{ 
                          backgroundColor: '#10b981' + '30',
                          color: '#10b981'
                        }}
                      >
                        Tech Support
                      </span>
                    )}
                  </h3>
                  <span 
                    className="text-xs ml-2 flex-shrink-0"
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
                      className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0"
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
                    {selectedChat.isAI ? <BsRobot size={24} /> : selectedChat.name.charAt(0)}
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
                    {selectedChat.isAI && (
                      <span 
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ 
                          backgroundColor: colors.mainYellow + '30',
                          color: colors.mainYellow
                        }}
                      >
                        AI Assistant
                      </span>
                    )}
                    {selectedChat.isTechSupport && (
                      <span 
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ 
                          backgroundColor: '#10b981' + '30',
                          color: '#10b981'
                        }}
                      >
                        Tech Support
                      </span>
                    )}
                  </h2>
                  <p 
                    className="text-sm"
                    style={{ color: selectedChat.online ? '#10b981' : colors.platinum }}
                  >
                    {selectedChat.isAI ? 'Always Available' : selectedChat.online ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>

              {/* Action Buttons - Hide for AI chat */}
              {!selectedChat.isAI && (
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
              )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] md:max-w-[60%] lg:max-w-[50%] rounded-2xl px-4 py-2 ${
                      message.senderId === 'me' ? 'rounded-br-sm' : 'rounded-bl-sm'
                    }`}
                    style={{
                      backgroundColor: message.senderId === 'me' ? colors.mainYellow : colors.jet,
                      color: message.senderId === 'me' ? colors.mainBlack : colors.alabaster
                    }}
                  >
                    <p className="text-sm md:text-base break-words">{message.text}</p>
                    <div className="flex items-center justify-end mt-1 space-x-1">
                      <span 
                        className="text-xs"
                        style={{ 
                          color: message.senderId === 'me' 
                            ? colors.mainBlack + '80' 
                            : colors.platinum 
                        }}
                      >
                        {message.timestamp}
                      </span>
                      {message.senderId === 'me' && (
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
                {/* Attachment Buttons - Hide for AI chat */}
                {!selectedChat.isAI && (
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
                )}

                {/* Text Input */}
                <div className="flex-1 relative">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={selectedChat.isAI ? "Ask me anything about PC building..." : "Type a message..."}
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
                  {!selectedChat.isAI && (
                    <button
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full transition-all"
                      style={{ color: colors.mainYellow }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.mainBlack}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <FiSmile size={20} />
                    </button>
                  )}
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
