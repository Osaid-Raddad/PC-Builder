// Test file for AI Chatbot functionality
// Run these tests manually through the chat interface

export const testScenarios = {
  basicQuestions: [
    {
      question: "What CPU should I get for gaming?",
      expectedBehavior: "Should recommend modern CPUs like Ryzen 5/7 or Intel i5/i7",
      triggersSearch: false,
    },
    {
      question: "How much RAM do I need?",
      expectedBehavior: "Should mention 16GB for gaming, 32GB for content creation",
      triggersSearch: false,
    },
    {
      question: "What's the difference between DDR4 and DDR5?",
      expectedBehavior: "Should explain speed differences and compatibility",
      triggersSearch: false,
    },
  ],

  compatibilityQuestions: [
    {
      question: "Are Intel CPUs compatible with AMD motherboards?",
      expectedBehavior: "Should explain socket compatibility (no)",
      triggersSearch: false,
    },
    {
      question: "Can I use DDR4 RAM with an AM5 motherboard?",
      expectedBehavior: "Should explain DDR5 requirement for AM5",
      triggersSearch: false,
    },
  ],

  budgetQuestions: [
    {
      question: "Best gaming PC build for $1000?",
      expectedBehavior: "Should suggest mid-range components with specific parts",
      triggersSearch: false,
    },
    {
      question: "What can I build with $1500?",
      expectedBehavior: "Should provide detailed component list for that budget",
      triggersSearch: false,
    },
  ],

  searchTriggering: [
    {
      question: "What's the latest GPU from NVIDIA?",
      expectedBehavior: "Should search internet and provide current information",
      triggersSearch: true,
    },
    {
      question: "Current price of RTX 4090",
      expectedBehavior: "Should search for real-time pricing",
      triggersSearch: true,
    },
    {
      question: "Best CPUs in 2026",
      expectedBehavior: "Should search for current recommendations",
      triggersSearch: true,
    },
    {
      question: "New AMD Ryzen announcement",
      expectedBehavior: "Should search for recent news",
      triggersSearch: true,
    },
  ],

  specificComponents: [
    {
      question: "Tell me about RTX 4070",
      expectedBehavior: "Should provide GPU specs and performance tier",
      triggersSearch: false,
    },
    {
      question: "What is Ryzen 7 7800X3D good for?",
      expectedBehavior: "Should explain 3D V-Cache and gaming performance",
      triggersSearch: false,
    },
    {
      question: "Explain PCIe 5.0",
      expectedBehavior: "Should describe PCIe 5.0 technology and benefits",
      triggersSearch: false,
    },
  ],

  performanceQuestions: [
    {
      question: "Can I run 4K gaming with RTX 4060?",
      expectedBehavior: "Should explain RTX 4060 is better for 1080p/1440p",
      triggersSearch: false,
    },
    {
      question: "What GPU for 1440p 144Hz?",
      expectedBehavior: "Should recommend RTX 4070 or similar",
      triggersSearch: false,
    },
  ],

  troubleshooting: [
    {
      question: "My PC won't turn on, what should I check?",
      expectedBehavior: "Should provide troubleshooting steps (PSU, connections, etc.)",
      triggersSearch: false,
    },
    {
      question: "How do I know if my PSU is enough?",
      expectedBehavior: "Should explain wattage calculation",
      triggersSearch: false,
    },
  ],
};

// Manual testing checklist
export const testingChecklist = {
  functionality: [
    "✓ Chat opens and closes smoothly",
    "✓ Messages send without errors",
    "✓ Typing indicator appears",
    "✓ Search indicator shows for appropriate questions",
    "✓ Responses appear within reasonable time",
    "✓ Conversation history maintained",
    "✓ Scroll to bottom works",
  ],
  
  apiIntegration: [
    "✓ Hugging Face API responds",
    "✓ Search API triggers on keywords",
    "✓ Fallback works if APIs fail",
    "✓ Error handling displays properly",
  ],
  
  uiUx: [
    "✓ Chat button visible and accessible",
    "✓ Messages display correctly",
    "✓ Timestamps show properly",
    "✓ Input field clears after sending",
    "✓ Mobile responsive",
  ],
};

// Expected response times
export const performanceTargets = {
  normalResponse: "2-5 seconds",
  firstRequest: "10-20 seconds (model cold start)",
  withSearch: "5-10 seconds",
  fallback: "< 1 second",
};

// API Error scenarios to handle
export const errorScenarios = [
  {
    scenario: "No API key configured",
    expected: "Should use fallback responses",
  },
  {
    scenario: "Invalid API key",
    expected: "Should show error toast and use fallback",
  },
  {
    scenario: "Rate limit exceeded",
    expected: "Should use fallback responses",
  },
  {
    scenario: "Network timeout",
    expected: "Should show error and use fallback",
  },
  {
    scenario: "Model loading error",
    expected: "Should retry or use fallback",
  },
];

export default {
  testScenarios,
  testingChecklist,
  performanceTargets,
  errorScenarios,
};
