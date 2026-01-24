import React, { useState, useRef, useEffect } from 'react';
import { FaComments, FaTimes, FaPaperPlane, FaSearch } from 'react-icons/fa';
import { BsRobot } from 'react-icons/bs';
import colors from '../../../config/colors.js';
import toast from 'react-hot-toast';
import { generateAIResponseWithBetterModel, needsInternetSearch } from '../../../services/huggingFaceService';
import { searchInternet, formatSearchResults } from '../../../services/webSearchService';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your PC Builder AI assistant powered by Hugging Face. I can answer questions about PC hardware, building tips, and search the internet for latest information. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    try {
      let botResponseText = '';
      
      // Check if question needs internet search
      if (needsInternetSearch(currentMessage)) {
        setIsSearching(true);
        
        // Search the internet
        const searchResults = await searchInternet(currentMessage);
        
        if (searchResults) {
          // Format search results
          const searchInfo = formatSearchResults(searchResults);
          
          // Get AI response enhanced with search results
          const aiContext = `Based on this information: ${searchInfo}\n\nAnswer the question: ${currentMessage}`;
          botResponseText = await generateAIResponseWithBetterModel(aiContext, messages);
          
          // If AI response is too short, use the search results directly
          if (botResponseText.length < 50) {
            botResponseText = searchInfo;
          }
        } else {
          // If search fails, use AI without search context
          botResponseText = await generateAIResponseWithBetterModel(currentMessage, messages);
        }
        
        setIsSearching(false);
      } else {
        // Regular AI response without search
        botResponseText = await generateAIResponseWithBetterModel(currentMessage, messages);
      }

      const botResponse = {
        id: Date.now() + 1,
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast.error('Failed to get response. Please try again.');
      
      // Fallback response
      const fallbackResponse = {
        id: Date.now() + 1,
        text: getAIResponse(currentMessage),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsTyping(false);
      setIsSearching(false);
    }
  };

  const getAIResponse = (message) => {
    // Mock AI responses - replace with actual AI API integration
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('build') || lowerMessage.includes('pc')) {
      return "I can help you build a custom PC! What's your budget and primary use case (gaming, work, content creation)?";
    } else if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return "PC builds typically range from $500 for budget builds to $3000+ for high-end gaming rigs. What's your target budget?";
    } else if (lowerMessage.includes('gaming')) {
      return "For gaming, I'd recommend focusing on a good GPU and CPU combo. What resolution and frame rate are you targeting?";
    } else if (lowerMessage.includes('help')) {
      return "I can assist you with: PC build recommendations, component compatibility, pricing information, and answering questions about our completed builds. What would you like to know?";
    } else {
      return "That's a great question! I'm here to help you with PC building advice, component selection, and product recommendations. Could you provide more details?";
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-24 left-6 w-96 h-[500px] rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          style={{ backgroundColor: 'white', border: `2px solid ${colors.mainYellow}` }}
        >
          {/* Header */}
          <div
            className="p-4 flex items-center justify-between"
            style={{ backgroundColor: colors.mainYellow }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'white' }}
              >
                <BsRobot size={24} style={{ color: colors.mainYellow }} />
              </div>
              <div>
                <h3 className="font-bold text-white">PC Builder AI</h3>
                <p className="text-xs text-white opacity-90">Always here to help</p>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all cursor-pointer"
            >
              <FaTimes size={20} color="white" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ backgroundColor: colors.mainBeige }}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] p-3 rounded-2xl ${
                    message.sender === 'user' ? 'rounded-br-none' : 'rounded-bl-none'
                  }`}
                  style={{
                    backgroundColor: message.sender === 'user' ? colors.mainYellow : 'white',
                    color: message.sender === 'user' ? 'white' : colors.mainBlack,
                    border: message.sender === 'bot' ? `1px solid ${colors.platinum}` : 'none'
                  }}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p
                    className="text-xs mt-1 opacity-70"
                    style={{ color: message.sender === 'user' ? 'white' : colors.jet }}
                  >
                    {message.timestamp.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div
                  className="p-3 rounded-2xl rounded-bl-none"
                  style={{ backgroundColor: 'white', border: `1px solid ${colors.platinum}` }}
                >
                  {isSearching ? (
                    <div className="flex items-center gap-2">
                      <FaSearch className="animate-pulse" style={{ color: colors.mainYellow }} />
                      <span className="text-sm" style={{ color: colors.jet }}>Searching the web...</span>
                    </div>
                  ) : (
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: colors.mainYellow, animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: colors.mainYellow, animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: colors.mainYellow, animationDelay: '300ms' }}></span>
                    </div>
                  )}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-4 border-t" style={{ borderColor: colors.platinum }}>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 rounded-full border-2 focus:outline-none transition-all"
                style={{
                  borderColor: colors.platinum,
                  color: colors.mainBlack
                }}
                onFocus={(e) => e.target.style.borderColor = colors.mainYellow}
                onBlur={(e) => e.target.style.borderColor = colors.platinum}
              />
              <button
                type="submit"
                className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer"
                style={{ backgroundColor: colors.mainYellow }}
                disabled={!inputMessage.trim()}
              >
                <FaPaperPlane size={18} color="white" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Circular Chat Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 left-6 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center z-50 hover:scale-110 transition-transform cursor-pointer"
        style={{ backgroundColor: colors.mainYellow }}
      >
        {isOpen ? (
          <FaTimes size={24} color="white" />
        ) : (
          <FaComments size={24} color="white" />
        )}
      </button>
    </>
  );
};

export default ChatBot;
