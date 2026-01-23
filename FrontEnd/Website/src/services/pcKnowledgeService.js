/**
 * PC Hardware Knowledge Base
 * This provides context and knowledge for the AI chatbot
 */

export const pcKnowledgeBase = {
  // CPU Information
  cpus: {
    intel: {
      series: ['Core i3', 'Core i5', 'Core i7', 'Core i9'],
      generations: ['12th Gen (Alder Lake)', '13th Gen (Raptor Lake)', '14th Gen (Raptor Lake Refresh)'],
      sockets: ['LGA1700', 'LGA1851'],
      features: ['Hybrid architecture (P-cores + E-cores)', 'DDR5 support', 'PCIe 5.0'],
    },
    amd: {
      series: ['Ryzen 3', 'Ryzen 5', 'Ryzen 7', 'Ryzen 9'],
      generations: ['Ryzen 5000 (Zen 3)', 'Ryzen 7000 (Zen 4)', 'Ryzen 8000 (Zen 4)'],
      sockets: ['AM4', 'AM5'],
      features: ['3D V-Cache technology', 'Chiplet design', 'PCIe 5.0 support'],
    },
  },

  // GPU Information
  gpus: {
    nvidia: {
      series: ['RTX 4090', 'RTX 4080', 'RTX 4070 Ti', 'RTX 4070', 'RTX 4060 Ti', 'RTX 4060'],
      features: ['DLSS 3', 'Ray Tracing', 'Ada Lovelace architecture', 'AV1 encoding'],
      performance: {
        '4K gaming': ['RTX 4090', 'RTX 4080'],
        '1440p gaming': ['RTX 4070 Ti', 'RTX 4070'],
        '1080p gaming': ['RTX 4060 Ti', 'RTX 4060'],
      },
    },
    amd: {
      series: ['RX 7900 XTX', 'RX 7900 XT', 'RX 7800 XT', 'RX 7700 XT', 'RX 7600'],
      features: ['FSR 3', 'Ray Tracing', 'RDNA 3 architecture', 'Infinity Cache'],
      performance: {
        '4K gaming': ['RX 7900 XTX', 'RX 7900 XT'],
        '1440p gaming': ['RX 7800 XT', 'RX 7700 XT'],
        '1080p gaming': ['RX 7600'],
      },
    },
  },

  // Memory Information
  memory: {
    ddr4: {
      speeds: ['2666MHz', '3000MHz', '3200MHz', '3600MHz'],
      capacities: ['8GB', '16GB', '32GB', '64GB'],
      recommended: '3200MHz or higher for gaming',
    },
    ddr5: {
      speeds: ['4800MHz', '5200MHz', '5600MHz', '6000MHz', '6400MHz'],
      capacities: ['16GB', '32GB', '64GB', '128GB'],
      recommended: '5600MHz or higher for new builds',
    },
  },

  // Storage Information
  storage: {
    nvme: {
      types: ['PCIe 3.0', 'PCIe 4.0', 'PCIe 5.0'],
      speeds: {
        'PCIe 3.0': 'Up to 3,500 MB/s',
        'PCIe 4.0': 'Up to 7,000 MB/s',
        'PCIe 5.0': 'Up to 14,000 MB/s',
      },
      recommended: 'PCIe 4.0 NVMe for OS and programs',
    },
  },

  // PSU Information
  psu: {
    ratings: ['80+ Bronze', '80+ Silver', '80+ Gold', '80+ Platinum', '80+ Titanium'],
    wattage: {
      budget: '500-650W',
      midRange: '650-850W',
      highEnd: '850-1000W',
      enthusiast: '1000W+',
    },
  },

  // Build Budget Guidelines
  budgetGuides: {
    budget: {
      range: '$500-800',
      cpu: 'Ryzen 5 5600 or Intel i5-12400F',
      gpu: 'RTX 3060 or RX 6600',
      ram: '16GB DDR4 3200MHz',
      storage: '500GB NVMe SSD',
      psu: '550W 80+ Bronze',
      useCase: 'Entry-level gaming, 1080p 60fps',
    },
    midRange: {
      range: '$800-1500',
      cpu: 'Ryzen 5 7600X or Intel i5-13600K',
      gpu: 'RTX 4060 Ti or RX 7700 XT',
      ram: '16GB DDR5 5600MHz',
      storage: '1TB NVMe Gen 4',
      psu: '650W 80+ Gold',
      useCase: 'Solid gaming, 1080p/1440p high settings',
    },
    highEnd: {
      range: '$1500-2500',
      cpu: 'Ryzen 7 7800X3D or Intel i7-13700K',
      gpu: 'RTX 4070 Ti or RX 7900 XT',
      ram: '32GB DDR5 6000MHz',
      storage: '2TB NVMe Gen 4',
      psu: '850W 80+ Gold',
      useCase: 'High-performance gaming, 1440p/4K',
    },
    enthusiast: {
      range: '$2500+',
      cpu: 'Ryzen 9 7950X3D or Intel i9-13900K',
      gpu: 'RTX 4080/4090 or RX 7900 XTX',
      ram: '32GB+ DDR5 6400MHz',
      storage: '2TB+ NVMe Gen 4/5',
      psu: '1000W+ 80+ Platinum',
      useCase: '4K gaming, content creation, workstation',
    },
  },

  // Compatibility Rules
  compatibility: {
    cpuMotherboard: {
      'Intel LGA1700': ['12th Gen', '13th Gen', '14th Gen Intel'],
      'AMD AM5': ['Ryzen 7000/8000 series'],
      'AMD AM4': ['Ryzen 1000-5000 series'],
    },
    ramMotherboard: {
      DDR4: 'AM4, older LGA1700 boards',
      DDR5: 'AM5, newer LGA1700 boards',
      note: 'DDR4 and DDR5 are NOT compatible - must match motherboard',
    },
  },

  // Common Questions & Answers
  faq: {
    'How much RAM do I need?': '16GB is the sweet spot for gaming and general use. 32GB is recommended for content creation, heavy multitasking, or future-proofing.',
    
    'What GPU for 1080p gaming?': 'RTX 4060, RTX 3060, or RX 7600 will handle most games at 1080p high/ultra settings at 60+ fps.',
    
    'Intel or AMD CPU?': 'Both are excellent. AMD Ryzen offers great multi-core performance and value. Intel offers strong single-core performance. For gaming, the Ryzen 7 7800X3D is currently the best choice.',
    
    'Do I need PCIe 5.0?': 'Not essential yet. PCIe 4.0 is more than enough for current GPUs and SSDs. PCIe 5.0 is future-proofing.',
    
    'How much storage do I need?': 'Minimum 500GB NVMe SSD for OS and programs. 1TB is more comfortable. Add a secondary drive for games and large files.',
    
    'What PSU wattage?': 'Calculate your system\'s power draw and add 20-30% headroom. Typical gaming PC: 650-850W. High-end with RTX 4090: 1000W+.',
  },
};

/**
 * Get relevant context from knowledge base based on user query
 * @param {string} query - User's question
 * @returns {string} - Relevant context to add to AI prompt
 */
export const getRelevantContext = (query) => {
  const lowerQuery = query.toLowerCase();
  let context = '';

  // CPU context
  if (lowerQuery.includes('cpu') || lowerQuery.includes('processor')) {
    context += '\nCPU Information:\n';
    context += `Intel: ${pcKnowledgeBase.cpus.intel.series.join(', ')}\n`;
    context += `AMD: ${pcKnowledgeBase.cpus.amd.series.join(', ')}\n`;
  }

  // GPU context
  if (lowerQuery.includes('gpu') || lowerQuery.includes('graphics')) {
    context += '\nGPU Information:\n';
    context += `NVIDIA: ${pcKnowledgeBase.gpus.nvidia.series.slice(0, 3).join(', ')}\n`;
    context += `AMD: ${pcKnowledgeBase.gpus.amd.series.slice(0, 3).join(', ')}\n`;
  }

  // RAM context
  if (lowerQuery.includes('ram') || lowerQuery.includes('memory')) {
    context += '\nRAM: 16GB DDR4/DDR5 minimum for gaming, 32GB for content creation\n';
  }

  // Budget context
  if (lowerQuery.includes('budget') || lowerQuery.includes('price') || lowerQuery.includes('cost')) {
    const budgets = pcKnowledgeBase.budgetGuides;
    context += '\nBudget Guidelines:\n';
    context += `Budget (${budgets.budget.range}): ${budgets.budget.useCase}\n`;
    context += `Mid-Range (${budgets.midRange.range}): ${budgets.midRange.useCase}\n`;
    context += `High-End (${budgets.highEnd.range}): ${budgets.highEnd.useCase}\n`;
  }

  // FAQ context
  for (const [question, answer] of Object.entries(pcKnowledgeBase.faq)) {
    if (lowerQuery.includes(question.toLowerCase().slice(0, 15))) {
      context += `\nQ: ${question}\nA: ${answer}\n`;
      break;
    }
  }

  return context;
};

/**
 * Enhance user prompt with relevant PC knowledge
 * @param {string} userMessage - Original user message
 * @returns {string} - Enhanced prompt with context
 */
export const enhancePromptWithContext = (userMessage) => {
  const context = getRelevantContext(userMessage);
  
  const systemPrompt = `You are an expert PC building assistant with deep knowledge of computer hardware. 
Answer questions accurately, concisely, and helpfully. Focus on practical advice for building PCs, 
choosing components, and understanding compatibility.`;

  if (context) {
    return `${systemPrompt}\n\nRelevant Information:${context}\n\nUser Question: ${userMessage}\n\nProvide a helpful, accurate answer:`;
  }

  return `${systemPrompt}\n\nUser Question: ${userMessage}\n\nProvide a helpful, accurate answer:`;
};

export default {
  pcKnowledgeBase,
  getRelevantContext,
  enhancePromptWithContext,
};
