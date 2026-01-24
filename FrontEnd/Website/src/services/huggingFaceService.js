import axios from 'axios';
import { enhancePromptWithContext } from './pcKnowledgeService';

// Hugging Face API configuration
const HF_API_URL = 'https://api-inference.huggingface.co/models';
const HF_API_TOKEN = import.meta.env.VITE_HUGGINGFACE_API_KEY || '';

// Using a conversational model from Hugging Face
const MODEL_NAME = 'microsoft/DialoGPT-medium'; // You can change to other models like 'facebook/blenderbot-400M-distill'

/**
 * Generate AI response using Hugging Face API
 * @param {string} userMessage - The user's message
 * @param {Array} conversationHistory - Previous messages for context
 * @returns {Promise<string>} - The AI's response
 */
export const generateAIResponse = async (userMessage, conversationHistory = []) => {
  try {
    // Build context from conversation history
    const context = conversationHistory
      .slice(-5) // Keep last 5 messages for context
      .map(msg => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
      .join('\n');
    
    const fullPrompt = context ? `${context}\nUser: ${userMessage}\nAssistant:` : userMessage;

    const response = await axios.post(
      `${HF_API_URL}/${MODEL_NAME}`,
      {
        inputs: fullPrompt,
        parameters: {
          max_length: 200,
          temperature: 0.7,
          top_p: 0.9,
          do_sample: true,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Extract the generated text
    const generatedText = response.data[0]?.generated_text || response.data.generated_text;
    
    // Remove the prompt from the response if it's included
    const aiResponse = generatedText.replace(fullPrompt, '').trim();
    
    return aiResponse || "I'm here to help you with PC building questions!";
  } catch (error) {
    console.error('Hugging Face API Error:', error);
    
    // Fallback to local responses if API fails
    return getFallbackResponse(userMessage);
  }
};

/**
 * Alternative: Use Hugging Face Inference API with better models
 */
export const generateAIResponseWithBetterModel = async (userMessage, conversationHistory = []) => {
  // Hugging Face API has CORS issues from browser - use fallback responses
  // For production, implement a backend proxy to handle API calls
  
  if (!HF_API_TOKEN || HF_API_TOKEN === '') {
    console.warn('Hugging Face API key not configured - using local knowledge');
    return getFallbackResponse(userMessage);
  }

  try {
    // Enhance prompt with PC knowledge context
    const enhancedPrompt = enhancePromptWithContext(userMessage);

    const response = await axios.post(
      `${HF_API_URL}/${MODEL}`,
      {
        inputs: enhancedPrompt,
        parameters: {
          max_new_tokens: 250,
          temperature: 0.7,
          top_p: 0.95,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      }
    );

    const aiResponse = response.data[0]?.generated_text || response.data.generated_text || response.data;
    return typeof aiResponse === 'string' ? aiResponse.trim() : getFallbackResponse(userMessage);
  } catch (error) {
    // CORS/Network errors are expected from browser - use fallback
    if (error.code === 'ERR_NETWORK' || error.message.includes('CORS') || error.message.includes('Network Error')) {
      console.log('Using local PC knowledge (Hugging Face requires backend proxy for production)');
    } else {
      console.error('Hugging Face API Error:', error.message);
    }
    return getFallbackResponse(userMessage);
  }
};

/**
 * Check if the question needs internet search (about new/recent topics)
 * @param {string} message - User's message
 * @returns {boolean}
 */
export const needsInternetSearch = (message) => {
  const searchKeywords = [
    'latest', 'new', 'recent', 'current', 'today', '2024', '2025', '2026',
    'price', 'cost', 'buy', 'where to buy', 'available',
    'best', 'top', 'recommend', 'comparison',
    'release', 'announcement', 'news', 'update'
  ];
  
  const lowerMessage = message.toLowerCase();
  return searchKeywords.some(keyword => lowerMessage.includes(keyword));
};

/**
 * Fallback responses when API is unavailable
 */
const getFallbackResponse = (message) => {
  const lowerMessage = message.toLowerCase();
  
  // PC Building responses
  if (lowerMessage.includes('build') || lowerMessage.includes('pc')) {
    return "I can help you build a custom PC! What's your budget and primary use case (gaming, work, content creation)?";
  }
  
  // Component specific
  if (lowerMessage.includes('cpu') || lowerMessage.includes('processor')) {
    return "For CPUs, popular choices include AMD Ryzen and Intel Core processors. Gaming builds typically use Ryzen 5/7 or Intel i5/i7. What's your budget and use case?";
  }
  
  if (lowerMessage.includes('gpu') || lowerMessage.includes('graphics card')) {
    return "For GPUs, NVIDIA RTX and AMD Radeon are the main options. The GPU is crucial for gaming performance. What resolution and frame rate are you targeting?";
  }
  
  if (lowerMessage.includes('motherboard')) {
    return "Motherboards must match your CPU socket (AM5 for new Ryzen, LGA1700/1851 for Intel 12-14th gen). Consider features like PCIe 5.0, DDR5 support, and connectivity options.";
  }
  
  if (lowerMessage.includes('ram') || lowerMessage.includes('memory')) {
    return "For gaming and general use, 16GB DDR4/DDR5 RAM is recommended, while 32GB is better for content creation. Speed matters: 3200MHz+ for DDR4, 5600MHz+ for DDR5.";
  }
  
  if (lowerMessage.includes('storage') || lowerMessage.includes('ssd') || lowerMessage.includes('nvme')) {
    return "I recommend NVMe SSDs for your OS and main programs (500GB-1TB), with an additional HDD or SATA SSD for extra storage. PCIe 4.0 NVMe drives offer excellent speed.";
  }
  
  if (lowerMessage.includes('power supply') || lowerMessage.includes('psu')) {
    return "PSU wattage depends on your components. A typical gaming PC needs 650-850W. Look for 80+ Gold or better efficiency ratings from reputable brands like Corsair, EVGA, or Seasonic.";
  }
  
  if (lowerMessage.includes('case')) {
    return "PC cases come in various sizes (ATX, Micro-ATX, Mini-ITX). Consider airflow, cable management, and whether you want tempered glass panels. Popular brands include NZXT, Corsair, and Fractal Design.";
  }
  
  // Compatibility
  if (lowerMessage.includes('compatible') || lowerMessage.includes('compatibility')) {
    return "I can help check compatibility! The main concerns are: CPU/Motherboard socket match, RAM type (DDR4/DDR5), PSU wattage, and case size. What components are you considering?";
  }
  
  // Budget related
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('budget')) {
    return "PC builds typically range from:\n- Budget: $500-800 (entry gaming/productivity)\n- Mid-range: $800-1500 (solid gaming)\n- High-end: $1500-2500 (high-performance gaming)\n- Enthusiast: $2500+ (4K gaming/workstation)\n\nWhat's your target budget?";
  }
  
  // Gaming specific
  if (lowerMessage.includes('gaming') || lowerMessage.includes('game')) {
    return "For gaming, prioritize GPU and CPU. Typical setups:\n- 1080p 60fps: RTX 3060/RX 6600 + Ryzen 5/i5\n- 1440p 144fps: RTX 4070/RX 7800 XT + Ryzen 7/i7\n- 4K: RTX 4080/4090 + High-end CPU\n\nWhat games and resolution do you target?";
  }
  
  // General help
  if (lowerMessage.includes('help')) {
    return "I can assist you with:\n✓ PC build recommendations\n✓ Component compatibility\n✓ Performance expectations\n✓ Budget planning\n✓ Upgrade suggestions\n✓ Troubleshooting\n\nWhat would you like to know?";
  }
  
  // Default response
  return "That's a great question! I specialize in PC building advice, component selection, compatibility checking, and hardware recommendations. Could you provide more details about what you'd like to know?";
};

export default {
  generateAIResponse,
  generateAIResponseWithBetterModel,
  needsInternetSearch,
};
