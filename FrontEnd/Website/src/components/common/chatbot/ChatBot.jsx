import React, { useState, useRef, useEffect } from 'react';
import { FaComments, FaTimes, FaPaperPlane, FaSearch, FaLightbulb } from 'react-icons/fa';
import { BsRobot } from 'react-icons/bs';
import colors from '../../../config/colors.js';
import toast from 'react-hot-toast';
import { generateAIResponseWithBetterModel, needsInternetSearch } from '../../../services/huggingFaceService';
import { searchInternet, formatSearchResults } from '../../../services/webSearchService';
import pcKnowledgeBase from '../../../data/pcKnowledgeBase.json';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your PC Builder expert assistant. I can recommend complete PC builds, help you choose components, answer hardware questions, and provide building advice. Just tell me your use case and budget!\n\n💬 Try asking:\n• 'PC for gaming under $1000'\n• 'Best CPU for video editing'\n• 'Complete build for studying'\n• 'What GPU should I buy?'",
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

  // Check if question is PC-related
  const isPCRelated = (message) => {
    const pcKeywords = [
      'pc', 'computer', 'build', 'gaming', 'cpu', 'gpu', 'processor', 'graphics card',
      'ram', 'memory', 'storage', 'ssd', 'hdd', 'motherboard', 'psu', 'power supply',
      'case', 'cooler', 'monitor', 'keyboard', 'mouse', 'headset', 'peripheral',
      'intel', 'amd', 'nvidia', 'rtx', 'radeon', 'ryzen', 'core i5', 'core i7',
      'studying', 'office', 'work', 'video editing', 'programming', 'streaming',
      'content creation', '3d rendering', 'machine learning', 'compatibility',
      'upgrade', 'bottleneck', 'fps', '1080p', '1440p', '4k', 'benchmark',
      'overclocking', 'thermal', 'wattage', 'ddr4', 'ddr5', 'nvme', 'sata'
    ];
    
    const lowerMessage = message.toLowerCase();
    return pcKeywords.some(keyword => lowerMessage.includes(keyword));
  };

  // Find similar question in knowledge base
  const findSimilarQuestion = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check Q&A database
    for (const qa of pcKnowledgeBase.qaDatabase) {
      for (const question of qa.questions) {
        const lowerQuestion = question.toLowerCase();
        // Check if user message contains key words from stored questions
        const questionWords = lowerQuestion.split(' ').filter(w => w.length > 3);
        const matchCount = questionWords.filter(word => lowerMessage.includes(word)).length;
        
        if (matchCount >= 2 || lowerMessage.includes(lowerQuestion) || lowerQuestion.includes(lowerMessage)) {
          return qa.answer;
        }
      }
    }
    return null;
  };

  // Get PC build recommendation based on use case
  const getRecommendedBuild = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Detect use case category
    let category = null;
    let tier = 'midRange';
    
    if (lowerMessage.includes('stud') || lowerMessage.includes('college') || lowerMessage.includes('homework') || lowerMessage.includes('school')) {
      category = 'studying';
    } else if (lowerMessage.includes('gam')) {
      category = 'gaming';
      if (lowerMessage.includes('4k') || lowerMessage.includes('high end') || lowerMessage.includes('ultra')) {
        tier = 'highEnd';
      } else if (lowerMessage.includes('budget') || lowerMessage.includes('cheap') || lowerMessage.includes('1080')) {
        tier = 'budget';
      }
    } else if (lowerMessage.includes('video edit') || lowerMessage.includes('content') || lowerMessage.includes('stream') || lowerMessage.includes('3d') || lowerMessage.includes('render') || lowerMessage.includes('blender')) {
      category = 'contentCreation';
      if (lowerMessage.includes('3d') || lowerMessage.includes('render') || lowerMessage.includes('blender')) {
        tier = '3dRendering';
      } else if (lowerMessage.includes('stream')) {
        tier = 'streaming';
      } else {
        tier = 'videoEditing';
      }
    } else if (lowerMessage.includes('program') || lowerMessage.includes('cod') || lowerMessage.includes('develop') || lowerMessage.includes('machine learning') || lowerMessage.includes('ai') || lowerMessage.includes('data science')) {
      category = 'programming';
      if (lowerMessage.includes('machine learning') || lowerMessage.includes('ai') || lowerMessage.includes('data science') || lowerMessage.includes('tensorflow')) {
        tier = 'machineLearning';
      } else {
        tier = 'webDevelopment';
      }
    } else if (lowerMessage.includes('office') || lowerMessage.includes('work') || lowerMessage.includes('business') || lowerMessage.includes('productivity')) {
      category = 'office';
      if (lowerMessage.includes('basic') || lowerMessage.includes('simple') || lowerMessage.includes('cheap')) {
        tier = 'basic';
      } else {
        tier = 'professional';
      }
    }
    
    // Get the build from knowledge base
    if (category && pcKnowledgeBase.pcBuilds[category]) {
      const builds = pcKnowledgeBase.pcBuilds[category];
      const build = builds[tier] || builds[Object.keys(builds)[0]];
      
      if (build) {
        let response = `🖥️ **${build.name}**\n\n`;
        response += `💰 **Total Cost:** ${build.totalPrice}\n\n`;
        response += `📝 **Description:** ${build.description}\n\n`;
        response += `**Components:**\n`;
        response += `• **CPU:** ${build.components.cpu}\n`;
        if (build.components.gpu !== "Integrated Graphics" && build.components.gpu !== "Integrated Graphics (iGPU)") {
          response += `• **GPU:** ${build.components.gpu}\n`;
        }
        response += `• **Motherboard:** ${build.components.motherboard}\n`;
        response += `• **RAM:** ${build.components.ram}\n`;
        response += `• **Storage:** ${build.components.storage}\n`;
        response += `• **PSU:** ${build.components.psu}\n`;
        response += `• **Case:** ${build.components.case}\n`;
        response += `• **CPU Cooler:** ${build.components.cpuCooler}\n\n`;
        
        if (build.performance) {
          response += `⚡ **Performance:** ${build.performance}\n\n`;
        }
        if (build.games) {
          response += `🎮 **Gaming:** ${build.games}\n\n`;
        }
        if (build.software) {
          response += `💻 **Software:** ${build.software}\n\n`;
        }
        
        response += `Need help with any specific component or have a different budget? Just ask!`;
        return response;
      }
    }
    
    return null;
  };

  // Get component recommendation
  const getComponentAdvice = (message) => {
    const lowerMessage = message.toLowerCase();
    
    for (const [componentType, info] of Object.entries(pcKnowledgeBase.componentGuides)) {
      const componentNames = {
        'cpu': ['cpu', 'processor', 'intel', 'amd', 'ryzen', 'core i'],
        'gpu': ['gpu', 'graphics card', 'video card', 'nvidia', 'rtx', 'radeon', 'rx'],
        'ram': ['ram', 'memory', 'ddr4', 'ddr5'],
        'storage': ['storage', 'ssd', 'hdd', 'nvme', 'hard drive'],
        'motherboard': ['motherboard', 'mobo', 'board'],
        'psu': ['psu', 'power supply', 'watt'],
        'case': ['case', 'chassis', 'tower'],
        'cpuCooler': ['cooler', 'cooling', 'aio', 'fan']
      };
      
      const keywords = componentNames[componentType] || [componentType];
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        let response = `**${componentType.toUpperCase()} Guide**\n\n`;
        response += `${info.description}\n\n`;
        response += `**How to Choose:**\n`;
        info.howToChoose.forEach((tip, index) => {
          response += `${index + 1}. ${tip}\n`;
        });
        response += `\n**Recommendations by Budget:**\n`;
        if (info.budget) response += `• **Budget:** ${info.budget}\n`;
        if (info.midRange) response += `• **Mid-Range:** ${info.midRange}\n`;
        if (info.highEnd) response += `• **High-End:** ${info.highEnd}\n`;
        if (info.gaming) response += `• **Gaming:** ${info.gaming}\n`;
        if (info.productivity) response += `• **Productivity:** ${info.productivity}\n`;
        if (info.contentCreation) response += `• **Content Creation:** ${info.contentCreation}\n`;
        
        return response;
      }
    }
    
    return null;
  };

  const getAIResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Check if PC-related first
    if (!isPCRelated(message)) {
      const randomResponse = pcKnowledgeBase.outOfScopeResponses[
        Math.floor(Math.random() * pcKnowledgeBase.outOfScopeResponses.length)
      ].replace('[TOPIC]', 'that topic');
      return randomResponse;
    }
    
    // Greetings
    if (lowerMessage.match(/^(hi|hello|hey|greetings|good morning|good afternoon)/)) {
      return pcKnowledgeBase.greetings[Math.floor(Math.random() * pcKnowledgeBase.greetings.length)];
    }
    
    // Try to find exact match in Q&A database
    const similarAnswer = findSimilarQuestion(message);
    if (similarAnswer) {
      return similarAnswer;
    }
    
    // Try to recommend a complete build
    const buildRecommendation = getRecommendedBuild(message);
    if (buildRecommendation) {
      return buildRecommendation;
    }
    
    // Try to give component advice
    const componentAdvice = getComponentAdvice(message);
    if (componentAdvice) {
      return componentAdvice;
    }
    
    // Fallback with quick tip
    const quickTip = pcKnowledgeBase.quickTips[Math.floor(Math.random() * pcKnowledgeBase.quickTips.length)];
    return `I can help you with PC building! Here are some things you can ask me:\n\n• "PC build for [use case]" (gaming, studying, video editing, etc.)\n• "What [component] should I buy?" (CPU, GPU, RAM, etc.)\n• "How much RAM do I need?"\n• "Best GPU for 1440p gaming?"\n• "Budget build under $1000"\n\n${quickTip}\n\nWhat would you like to know?`;
  };

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
      
      // First, try to answer from knowledge base (fast and accurate)
      if (isPCRelated(currentMessage)) {
        botResponseText = getAIResponse(currentMessage);
        
        // If knowledge base didn't provide a detailed answer and question needs search
        if (botResponseText.length < 200 && needsInternetSearch(currentMessage)) {
          setIsSearching(true);
          
          // Search the internet for latest information
          const searchResults = await searchInternet(currentMessage);
          
          if (searchResults) {
            const searchInfo = formatSearchResults(searchResults);
            
            // Enhance with AI if available
            try {
              const aiContext = `Based on this information: ${searchInfo}\n\nAnswer: ${currentMessage}`;
              const aiResponse = await generateAIResponseWithBetterModel(aiContext, messages);
              if (aiResponse && aiResponse.length > 50) {
                botResponseText = aiResponse;
              }
            } catch {
              // If AI fails, use search results
              botResponseText = searchInfo;
            }
          }
          
          setIsSearching(false);
        }
      } else {
        // Not PC-related - respond accordingly
        botResponseText = getAIResponse(currentMessage);
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

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Handle quick suggestion click
  const handleQuickSuggestion = (suggestion) => {
    setInputMessage(suggestion);
    // Auto-send after a short delay
    setTimeout(() => {
      const event = { preventDefault: () => {} };
      setInputMessage(suggestion);
      handleSendMessage(event);
    }, 100);
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-24 left-6 w-96 h-[550px] rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
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
                  <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
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

          {/* Quick Suggestions (shown only on first message) */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              <button
                onClick={() => handleQuickSuggestion('PC for gaming under $1000')}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:opacity-80"
                style={{ backgroundColor: colors.mainYellow, color: 'white' }}
              >
                💻 Gaming Build
              </button>
              <button
                onClick={() => handleQuickSuggestion('PC for studying')}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:opacity-80"
                style={{ backgroundColor: colors.mainYellow, color: 'white' }}
              >
                📚 Study PC
              </button>
              <button
                onClick={() => handleQuickSuggestion('What GPU should I buy?')}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:opacity-80"
                style={{ backgroundColor: colors.mainYellow, color: 'white' }}
              >
                🎮 GPU Guide
              </button>
              <button
                onClick={() => handleQuickSuggestion('Video editing build')}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:opacity-80"
                style={{ backgroundColor: colors.mainYellow, color: 'white' }}
              >
                🎬 Content Creation
              </button>
            </div>
          )}

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
