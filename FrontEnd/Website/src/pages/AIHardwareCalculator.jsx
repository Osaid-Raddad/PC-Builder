import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AIHardwareCalculator.css';

const AI_MODELS = [
  {
    id: 1,
    name: "Small Language Model",
    subtitle: "7B parameters",
    category: "LLM",
    description: "Models like Llama 2 7B, Mistral 7B",
    icon: "💬",
    useCases: ["Chatbots", "Text Generation", "Code Assistance"],
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    id: 2,
    name: "Medium Language Model",
    subtitle: "13B parameters",
    category: "LLM",
    description: "Models like Llama 2 13B, Vicuna 13B",
    icon: "🧠",
    useCases: ["Advanced Chatbots", "Content Creation", "Analysis"],
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
  {
    id: 3,
    name: "Large Language Model",
    subtitle: "70B+ parameters",
    category: "LLM",
    description: "Models like Llama 2 70B, GPT-3.5 equivalent",
    icon: "🚀",
    useCases: ["Professional Applications", "Complex Reasoning"],
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  },
  {
    id: 4,
    name: "Stable Diffusion XL",
    subtitle: "Image Generation",
    category: "Image Generation",
    description: "High-quality image generation",
    icon: "🎨",
    useCases: ["Art Creation", "Product Design", "Content Generation"],
    gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  },
  {
    id: 5,
    name: "Whisper",
    subtitle: "Speech Recognition",
    category: "Audio",
    description: "Speech-to-text transcription",
    icon: "🎤",
    useCases: ["Transcription", "Subtitling", "Voice Commands"],
    gradient: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
  },
  {
    id: 6,
    name: "Custom Deep Learning",
    subtitle: "Your Project",
    category: "Custom",
    description: "Training custom models",
    icon: "⚡",
    useCases: ["Research", "Custom AI Solutions"],
    gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  },
];

const HARDWARE_RECOMMENDATIONS = {
  1: {
    inference: {
      cpu: "AMD Ryzen 7 5800X or Intel Core i7-12700K",
      cpuCores: "8+ cores",
      ram: "32 GB DDR4",
      gpu: "NVIDIA RTX 4060 Ti 16GB or RTX 3060 12GB",
      vram: "12-16 GB",
      storage: "500 GB NVMe SSD",
      powerSupply: "650W 80+ Gold",
      estimatedCost: "$1,200 - $1,500",
    },
    training: {
      cpu: "AMD Ryzen 9 5950X or Intel Core i9-12900K",
      cpuCores: "16+ cores",
      ram: "64 GB DDR4",
      gpu: "NVIDIA RTX 4090 or RTX 4080",
      vram: "24 GB minimum",
      storage: "1 TB NVMe SSD",
      powerSupply: "1000W 80+ Gold",
      estimatedCost: "$3,000 - $4,000",
    },
  },
  2: {
    inference: {
      cpu: "AMD Ryzen 9 5900X or Intel Core i9-12900K",
      cpuCores: "12+ cores",
      ram: "64 GB DDR4",
      gpu: "NVIDIA RTX 4070 Ti or RTX 4080",
      vram: "16-20 GB",
      storage: "1 TB NVMe SSD",
      powerSupply: "850W 80+ Gold",
      estimatedCost: "$2,000 - $2,500",
    },
    training: {
      cpu: "AMD Threadripper or Intel Core i9-13900K",
      cpuCores: "24+ cores",
      ram: "128 GB DDR4",
      gpu: "2x NVIDIA RTX 4090 or A6000",
      vram: "48 GB total (24GB per card)",
      storage: "2 TB NVMe SSD",
      powerSupply: "1600W 80+ Platinum",
      estimatedCost: "$6,000 - $8,000",
    },
  },
  3: {
    inference: {
      cpu: "AMD Threadripper PRO or Intel Xeon W",
      cpuCores: "32+ cores",
      ram: "128 GB DDR4 ECC",
      gpu: "2x NVIDIA RTX 4090 or A100 40GB",
      vram: "80 GB total minimum",
      storage: "2 TB NVMe SSD",
      powerSupply: "1600W 80+ Platinum",
      estimatedCost: "$8,000 - $12,000",
    },
    training: {
      cpu: "AMD EPYC or Intel Xeon Scalable",
      cpuCores: "64+ cores",
      ram: "256 GB DDR4 ECC",
      gpu: "4x NVIDIA A100 80GB or H100",
      vram: "320 GB total minimum",
      storage: "4 TB NVMe SSD RAID",
      powerSupply: "2000W+ 80+ Titanium",
      estimatedCost: "$25,000+",
    },
  },
  4: {
    inference: {
      cpu: "AMD Ryzen 7 5800X or Intel Core i7-12700K",
      cpuCores: "8+ cores",
      ram: "32 GB DDR4",
      gpu: "NVIDIA RTX 4070 or RTX 3080",
      vram: "12 GB minimum",
      storage: "500 GB NVMe SSD",
      powerSupply: "750W 80+ Gold",
      estimatedCost: "$1,500 - $2,000",
    },
    training: {
      cpu: "AMD Ryzen 9 5950X or Intel Core i9-12900K",
      cpuCores: "16+ cores",
      ram: "64 GB DDR4",
      gpu: "NVIDIA RTX 4090 or A6000",
      vram: "24 GB minimum",
      storage: "2 TB NVMe SSD",
      powerSupply: "1000W 80+ Gold",
      estimatedCost: "$3,500 - $5,000",
    },
  },
  5: {
    inference: {
      cpu: "AMD Ryzen 5 5600X or Intel Core i5-12400",
      cpuCores: "6+ cores",
      ram: "16 GB DDR4",
      gpu: "NVIDIA RTX 4060 or RTX 3060",
      vram: "8 GB",
      storage: "256 GB NVMe SSD",
      powerSupply: "550W 80+ Bronze",
      estimatedCost: "$800 - $1,000",
    },
    training: {
      cpu: "AMD Ryzen 7 5800X or Intel Core i7-12700K",
      cpuCores: "8+ cores",
      ram: "32 GB DDR4",
      gpu: "NVIDIA RTX 4070 or RTX 3080",
      vram: "12 GB",
      storage: "1 TB NVMe SSD",
      powerSupply: "750W 80+ Gold",
      estimatedCost: "$1,800 - $2,200",
    },
  },
  6: {
    inference: {
      cpu: "AMD Ryzen 9 5900X or Intel Core i9-12900K",
      cpuCores: "12+ cores",
      ram: "64 GB DDR4",
      gpu: "NVIDIA RTX 4080 or RTX 4090",
      vram: "16-24 GB",
      storage: "1 TB NVMe SSD",
      powerSupply: "850W 80+ Gold",
      estimatedCost: "$2,500 - $3,500",
    },
    training: {
      cpu: "AMD Threadripper or Intel Core i9-13900K",
      cpuCores: "24+ cores",
      ram: "128 GB DDR4",
      gpu: "2x NVIDIA RTX 4090",
      vram: "48 GB total",
      storage: "2 TB NVMe SSD",
      powerSupply: "1600W 80+ Platinum",
      estimatedCost: "$6,000 - $8,000",
    },
  },
};

export default function AIHardwareCalculator() {
  const [selectedModel, setSelectedModel] = useState(null);
  const [workloadType, setWorkloadType] = useState('inference');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customDescription, setCustomDescription] = useState('');

  const handleModelSelect = (model) => {
    if (selectedModel?.id === model.id) {
      setSelectedModel(null);
    } else {
      setSelectedModel(model);
      setShowCustomInput(false);
    }
  };

  const recommendations = selectedModel
    ? HARDWARE_RECOMMENDATIONS[selectedModel.id]?.[workloadType]
    : null;

  return (
    <div className="ai-calculator-page">
      {/* Hero Section with Animated Background */}
      <div className="ai-hero">
        <div className="animated-bg">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>
        
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="hero-icon">
            <span className="brain-emoji">🧠</span>
            <div className="icon-glow"></div>
          </div>
          <h1 className="hero-title">
            AI Hardware Calculator
          </h1>
          <p className="hero-subtitle">
            <span className="lightning">⚡</span>
            Get instant, precise hardware recommendations for your AI projects
          </p>
          <div className="hero-badges">
            <span className="badge">LLMs</span>
            <span className="badge">Image Generation</span>
            <span className="badge">Custom Models</span>
          </div>
        </motion.div>
      </div>

      <div className="ai-calculator-container">
        {/* Quick Guide */}
        <motion.div
          className="quick-guide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="guide-header">
            <span className="guide-icon">🚀</span>
            <h3>Quick Start Guide</h3>
          </div>
          <div className="guide-steps">
            <div className="guide-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Choose Workload</h4>
                <p>Select if you're running or training models</p>
              </div>
            </div>
            <div className="guide-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Pick AI Model</h4>
                <p>Select from popular AI model types</p>
              </div>
            </div>
            <div className="guide-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Get Specs</h4>
                <p>Receive detailed hardware recommendations</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Workload Type Selection */}
        <motion.div
          className="section workload-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="section-title">
            <span className="step-badge">Step 1</span>
            Choose Your Workload Type
          </h2>
          <div className="workload-cards">
            <motion.button
              className={`workload-card ${workloadType === 'inference' ? 'active' : ''}`}
              onClick={() => setWorkloadType('inference')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="workload-icon">▶️</div>
              <h3>Inference</h3>
              <p>Running pre-trained models</p>
              <div className="workload-features">
                <span>✓ Lower cost</span>
                <span>✓ Quick results</span>
                <span>✓ Production ready</span>
              </div>
              {workloadType === 'inference' && (
                <motion.div
                  className="selected-check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  ✓
                </motion.div>
              )}
            </motion.button>

            <motion.button
              className={`workload-card ${workloadType === 'training' ? 'active' : ''}`}
              onClick={() => setWorkloadType('training')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="workload-icon">🎓</div>
              <h3>Training</h3>
              <p>Fine-tuning & training models</p>
              <div className="workload-features">
                <span>✓ High performance</span>
                <span>✓ Custom models</span>
                <span>✓ Research ready</span>
              </div>
              {workloadType === 'training' && (
                <motion.div
                  className="selected-check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  ✓
                </motion.div>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Model Selection */}
        <motion.div
          className="section models-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="section-title">
            <span className="step-badge">Step 2</span>
            Select Your AI Model Type
          </h2>
          <div className="models-grid">
            {AI_MODELS.map((model, index) => (
              <motion.div
                key={model.id}
                className={`model-card ${selectedModel?.id === model.id ? 'selected' : ''}`}
                onClick={() => handleModelSelect(model)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -5 }}
                style={{ background: selectedModel?.id === model.id ? model.gradient : '#fff' }}
              >
                <div className="model-icon-large">{model.icon}</div>
                <div className="category-badge">{model.category}</div>
                <h3>{model.name}</h3>
                <p className="model-subtitle">{model.subtitle}</p>
                <p className="model-desc">{model.description}</p>
                <div className="use-cases">
                  {model.useCases.slice(0, 2).map((useCase, i) => (
                    <span key={i} className="use-case-tag">
                      ✓ {useCase}
                    </span>
                  ))}
                </div>
                {selectedModel?.id === model.id && (
                  <motion.div
                    className="selected-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="check-icon">✓</div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Custom Option */}
          <div className="custom-option">
            <div className="divider">
              <span>OR</span>
            </div>
            <motion.button
              className="custom-btn"
              onClick={() => {
                setShowCustomInput(!showCustomInput);
                setSelectedModel(null);
              }}
              whileHover={{ scale: 1.02 }}
            >
              <span>✏️</span>
              Describe Your Custom AI Project
            </motion.button>
          </div>

          <AnimatePresence>
            {showCustomInput && (
              <motion.div
                className="custom-input-container"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <h4>Describe Your AI Workload</h4>
                <textarea
                  placeholder="Example: I want to train a computer vision model for real-time object detection using a dataset of 50,000 images..."
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  rows={5}
                />
                <button className="analyze-btn">
                  <span>🤖</span>
                  Analyze My Requirements (Coming Soon!)
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Recommendations */}
        <AnimatePresence>
          {recommendations && (
            <motion.div
              className="recommendations-section"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              <div className="recommendations-header">
                <div className="header-left">
                  <div className="success-icon">✓</div>
                  <div>
                    <h2>Your Hardware Requirements</h2>
                    <p className="rec-subtitle">
                      {selectedModel.name} • {workloadType === 'inference' ? 'Running Models' : 'Training Models'}
                    </p>
                  </div>
                </div>
                <div className="workload-badge">
                  {workloadType === 'inference' ? '▶️ Inference' : '🎓 Training'}
                </div>
              </div>

              <div className="specs-grid">
                <motion.div className="spec-card" whileHover={{ scale: 1.02 }}>
                  <div className="spec-icon">💻</div>
                  <div className="spec-content">
                    <h4>CPU</h4>
                    <p className="spec-value">{recommendations.cpu}</p>
                    <span className="spec-detail">{recommendations.cpuCores}</span>
                  </div>
                </motion.div>

                <motion.div className="spec-card" whileHover={{ scale: 1.02 }}>
                  <div className="spec-icon">🧮</div>
                  <div className="spec-content">
                    <h4>RAM</h4>
                    <p className="spec-value">{recommendations.ram}</p>
                  </div>
                </motion.div>

                <motion.div className="spec-card" whileHover={{ scale: 1.02 }}>
                  <div className="spec-icon">🎮</div>
                  <div className="spec-content">
                    <h4>GPU</h4>
                    <p className="spec-value">{recommendations.gpu}</p>
                    <span className="spec-detail">VRAM: {recommendations.vram}</span>
                  </div>
                </motion.div>

                <motion.div className="spec-card" whileHover={{ scale: 1.02 }}>
                  <div className="spec-icon">💾</div>
                  <div className="spec-content">
                    <h4>Storage</h4>
                    <p className="spec-value">{recommendations.storage}</p>
                  </div>
                </motion.div>

                <motion.div className="spec-card" whileHover={{ scale: 1.02 }}>
                  <div className="spec-icon">⚡</div>
                  <div className="spec-content">
                    <h4>Power Supply</h4>
                    <p className="spec-value">{recommendations.powerSupply}</p>
                  </div>
                </motion.div>

                <motion.div className="cost-card" whileHover={{ scale: 1.02 }}>
                  <div className="cost-icon">💰</div>
                  <div className="cost-content">
                    <h4>Estimated Build Cost</h4>
                    <p className="cost-value">{recommendations.estimatedCost}</p>
                  </div>
                </motion.div>
              </div>

              <div className="action-buttons">
                <button className="btn-primary">
                  <span>🛠️</span>
                  Start Building This Configuration
                </button>
                <button className="btn-secondary">
                  <span>📊</span>
                  Compare Components
                </button>
              </div>

              <div className="performance-tip">
                <span className="tip-icon">💡</span>
                <p>
                  <strong>Performance Tip:</strong> For {workloadType === 'inference' ? 'faster inference' : 'efficient training'}, 
                  consider upgrading to higher-tier components with better cooling solutions.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Section */}
        <motion.div
          className="info-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="info-icon">ℹ️</div>
          <div className="info-content">
            <h4>About These Recommendations</h4>
            <p>
              Hardware requirements are general guidelines based on industry standards. 
              Actual performance may vary depending on:
            </p>
            <ul>
              <li>Model optimization and quantization</li>
              <li>Batch sizes and data processing</li>
              <li>Software frameworks used</li>
              <li>Specific implementation details</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
