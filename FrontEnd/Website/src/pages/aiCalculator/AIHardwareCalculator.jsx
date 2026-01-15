import React, { useState } from 'react';
import Navbar from '../components/user/navbar/Navbar.jsx';
import Footer from '../components/user/footer/Footer.jsx';
import colors from '../config/colors';
import Swal from 'sweetalert2';

const AI_MODELS = [
  {
    id: 1,
    name: "Small Language Model",
    subtitle: "7B parameters",
    category: "LLM",
    description: "Perfect for chatbots, text generation, and basic NLP tasks",
    useCases: ["Chatbots", "Text Analysis", "Q&A Systems"],
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },
  {
    id: 2,
    name: "Large Language Model",
    subtitle: "70B+ parameters",
    category: "LLM",
    description: "Advanced reasoning, coding, and complex language understanding",
    useCases: ["Code Generation", "Research", "Complex Reasoning"],
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
  },
  {
    id: 3,
    name: "Image Generation",
    subtitle: "Stable Diffusion / DALL-E",
    category: "Image AI",
    description: "Create stunning images from text descriptions",
    useCases: ["Art Generation", "Design", "Creative Work"],
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
  },
  {
    id: 4,
    name: "Image Recognition",
    subtitle: "Computer Vision",
    category: "Image AI",
    description: "Object detection, classification, and image analysis",
    useCases: ["Object Detection", "Classification", "Segmentation"],
    gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
  },
  {
    id: 5,
    name: "Audio Processing",
    subtitle: "Speech & Music AI",
    category: "Audio AI",
    description: "Speech recognition, text-to-speech, and music generation",
    useCases: ["Transcription", "Voice Synthesis", "Music Creation"],
    gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
  },
  {
    id: 6,
    name: "Custom Model",
    subtitle: "Your specifications",
    category: "Custom",
    description: "Tell us about your specific AI model requirements",
    useCases: ["Custom Training", "Specialized Tasks"],
    gradient: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)"
  }
];

const HARDWARE_RECOMMENDATIONS = {
  1: {
    inference: {
      cpu: "AMD Ryzen 7 5800X or Intel Core i7-12700K",
      cpuCores: "8-12 cores",
      ram: "32GB DDR4-3600",
      gpu: "NVIDIA RTX 3060 12GB or RTX 4060 Ti 16GB",
      vram: "12-16GB",
      storage: "500GB NVMe SSD",
      psu: "650W 80+ Gold",
      estimatedCost: "$1,200 - $1,500"
    },
    training: {
      cpu: "AMD Ryzen 9 5950X or Intel Core i9-13900K",
      cpuCores: "16+ cores",
      ram: "64GB DDR4-3600 or DDR5-5600",
      gpu: "NVIDIA RTX 4070 Ti or RTX 4080",
      vram: "16-24GB",
      storage: "1TB NVMe Gen4 SSD",
      psu: "850W 80+ Gold",
      estimatedCost: "$2,500 - $3,500"
    }
  },
  2: {
    inference: {
      cpu: "AMD Ryzen 9 7950X or Intel Core i9-13900K",
      cpuCores: "16+ cores",
      ram: "64GB DDR5-5600",
      gpu: "NVIDIA RTX 4080 or RTX 4090",
      vram: "24GB minimum",
      storage: "1TB NVMe Gen4 SSD",
      psu: "1000W 80+ Platinum",
      estimatedCost: "$3,500 - $4,500"
    },
    training: {
      cpu: "AMD Threadripper PRO 5975WX or Intel Xeon W-3375",
      cpuCores: "32+ cores",
      ram: "128GB+ DDR4 ECC",
      gpu: "NVIDIA RTX 4090 (x2) or A6000",
      vram: "48GB+ (multi-GPU)",
      storage: "2TB NVMe Gen4 RAID",
      psu: "1600W 80+ Titanium",
      estimatedCost: "$8,000 - $12,000"
    }
  },
  3: {
    inference: {
      cpu: "AMD Ryzen 7 7700X or Intel Core i7-13700K",
      cpuCores: "8-12 cores",
      ram: "32GB DDR5-5600",
      gpu: "NVIDIA RTX 4070 or RTX 4070 Ti",
      vram: "12-16GB",
      storage: "1TB NVMe SSD",
      psu: "750W 80+ Gold",
      estimatedCost: "$1,800 - $2,400"
    },
    training: {
      cpu: "AMD Ryzen 9 7950X or Intel Core i9-13900K",
      cpuCores: "16+ cores",
      ram: "64GB DDR5-6000",
      gpu: "NVIDIA RTX 4080 or RTX 4090",
      vram: "24GB",
      storage: "2TB NVMe Gen4 SSD",
      psu: "1000W 80+ Platinum",
      estimatedCost: "$3,500 - $5,000"
    }
  },
  4: {
    inference: {
      cpu: "AMD Ryzen 7 5800X or Intel Core i7-12700K",
      cpuCores: "8-12 cores",
      ram: "32GB DDR4-3600",
      gpu: "NVIDIA RTX 3070 or RTX 4060 Ti",
      vram: "12GB",
      storage: "512GB NVMe SSD",
      psu: "650W 80+ Gold",
      estimatedCost: "$1,400 - $1,800"
    },
    training: {
      cpu: "AMD Ryzen 9 5950X or Intel Core i9-13900K",
      cpuCores: "16+ cores",
      ram: "64GB DDR4-3600",
      gpu: "NVIDIA RTX 4070 Ti or RTX 4080",
      vram: "16-24GB",
      storage: "1TB NVMe Gen4 SSD",
      psu: "850W 80+ Gold",
      estimatedCost: "$2,800 - $3,800"
    }
  },
  5: {
    inference: {
      cpu: "AMD Ryzen 7 7700X or Intel Core i7-13700K",
      cpuCores: "8-12 cores",
      ram: "32GB DDR5-5600",
      gpu: "NVIDIA RTX 4060 Ti or RTX 4070",
      vram: "12-16GB",
      storage: "512GB NVMe SSD",
      psu: "650W 80+ Gold",
      estimatedCost: "$1,500 - $2,000"
    },
    training: {
      cpu: "AMD Ryzen 9 7950X or Intel Core i9-13900K",
      cpuCores: "16+ cores",
      ram: "64GB DDR5-6000",
      gpu: "NVIDIA RTX 4070 Ti or RTX 4080",
      vram: "16-24GB",
      storage: "1TB NVMe Gen4 SSD",
      psu: "850W 80+ Platinum",
      estimatedCost: "$3,000 - $4,000"
    }
  }
};

const AIHardwareCalculator = () => {
  const [selectedWorkload, setSelectedWorkload] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [modalRecommendations, setModalRecommendations] = useState(null);

  const handleModelSelect = async (model) => {
    if (model.id === 6) {
      // Show coming soon alert for custom model
      await Swal.fire({
        title: 'Coming Soon! 🚀',
        text: 'The Custom AI Model feature is currently under development. Stay tuned for updates!',
        icon: 'info',
        confirmButtonColor: colors.mainYellow,
        confirmButtonText: 'Got it!',
        iconColor: colors.mainYellow
      });
      return;
    } else {
      setShowCustomInput(false);
      const isSameModel = selectedModel?.id === model.id;
      
      if (isSameModel) {
        setSelectedModel(null);
      } else {
        setSelectedModel(model);
        
        // Show modal with thinking animation if workload is selected
        if (selectedWorkload) {
          setShowModal(true);
          setIsThinking(true);
          
          // Get recommendations
          const recs = HARDWARE_RECOMMENDATIONS[model.id]?.[selectedWorkload];
          
          // Show thinking animation for 2 seconds
          setTimeout(() => {
            setIsThinking(false);
            setModalRecommendations(recs);
          }, 2000);
        }
      }
    }
  };

  return (
    <div style={{ backgroundColor: colors.mainBeige, minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4" style={{ color: colors.mainBlack }}>
            🧠 AI Hardware Calculator
          </h1>
          <p className="text-xl" style={{ color: colors.jet }}>
            Find the perfect hardware configuration for your AI workload
          </p>
        </div>

        {/* Quick Guide */}
        <div className="mb-12" style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '30px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          borderLeft: `6px solid ${colors.mainYellow}`
        }}>
          <h3 className="text-2xl font-bold mb-6" style={{ color: colors.mainBlack }}>
            📋 How It Works
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex gap-4">
              <div className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold" 
                   style={{ backgroundColor: colors.mainYellow, color: colors.mainBlack }}>
                1
              </div>
              <div>
                <h4 className="font-bold mb-2" style={{ color: colors.mainBlack }}>Choose Workload</h4>
                <p className="text-sm" style={{ color: colors.jet }}>Select inference or training</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold"
                   style={{ backgroundColor: colors.mainYellow, color: colors.mainBlack }}>
                2
              </div>
              <div>
                <h4 className="font-bold mb-2" style={{ color: colors.mainBlack }}>Pick AI Model</h4>
                <p className="text-sm" style={{ color: colors.jet }}>Choose your model type</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold"
                   style={{ backgroundColor: colors.mainYellow, color: colors.mainBlack }}>
                3
              </div>
              <div>
                <h4 className="font-bold mb-2" style={{ color: colors.mainBlack }}>Get Results</h4>
                <p className="text-sm" style={{ color: colors.jet }}>View hardware recommendations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Step 1: Workload Selection */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3" style={{ color: colors.mainBlack }}>
            <span className="px-4 py-1 rounded-full text-sm" style={{ backgroundColor: colors.mainYellow, color: colors.mainBlack }}>
              STEP 1
            </span>
            Select Your Workload
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div
              onClick={() => setSelectedWorkload('inference')}
              className="cursor-pointer transition-all hover:scale-105"
              style={{
                backgroundColor: selectedWorkload === 'inference' ? colors.mainYellow : 'white',
                color: selectedWorkload === 'inference' ? colors.mainBlack : colors.jet,
                border: `3px solid ${selectedWorkload === 'inference' ? colors.mainBlack : '#e0e0e0'}`,
                borderRadius: '16px',
                padding: '30px',
                boxShadow: selectedWorkload === 'inference' ? '0 8px 30px rgba(0,0,0,0.15)' : '0 4px 20px rgba(0,0,0,0.08)'
              }}
            >
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold mb-3">Inference / Running Models</h3>
              <p className="mb-4">Using pre-trained AI models for predictions and outputs</p>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold">✓ Real-time predictions</span>
                <span className="text-sm font-semibold">✓ Lower hardware requirements</span>
                <span className="text-sm font-semibold">✓ Production deployment</span>
              </div>
              {selectedWorkload === 'inference' && (
                <div className="mt-4 text-right">
                  <span className="text-2xl">✓</span>
                </div>
              )}
            </div>

            <div
              onClick={() => setSelectedWorkload('training')}
              className="cursor-pointer transition-all hover:scale-105"
              style={{
                backgroundColor: selectedWorkload === 'training' ? colors.mainYellow : 'white',
                color: selectedWorkload === 'training' ? colors.mainBlack : colors.jet,
                border: `3px solid ${selectedWorkload === 'training' ? colors.mainBlack : '#e0e0e0'}`,
                borderRadius: '16px',
                padding: '30px',
                boxShadow: selectedWorkload === 'training' ? '0 8px 30px rgba(0,0,0,0.15)' : '0 4px 20px rgba(0,0,0,0.08)'
              }}
            >
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-2xl font-bold mb-3">Training Models</h3>
              <p className="mb-4">Building and fine-tuning AI models from scratch</p>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold">✓ High computational power</span>
                <span className="text-sm font-semibold">✓ Large memory requirements</span>
                <span className="text-sm font-semibold">✓ Development environment</span>
              </div>
              {selectedWorkload === 'training' && (
                <div className="mt-4 text-right">
                  <span className="text-2xl">✓</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Step 2: Model Selection */}
        {selectedWorkload && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3" style={{ color: colors.mainBlack }}>
              <span className="px-4 py-1 rounded-full text-sm" style={{ backgroundColor: colors.mainYellow, color: colors.mainBlack }}>
                STEP 2
              </span>
              Choose Your AI Model
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {AI_MODELS.map((model) => {
                // Extract gradient colors for colorful unselected state
                const getCardStyle = () => {
                  if (selectedModel?.id === model.id) {
                    return {
                      background: model.gradient,
                      border: `3px solid ${colors.mainBlack}`,
                      boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                      color: 'white'
                    };
                  }
                  // Colorful unselected state with light gradient backgrounds
                  const lightGradients = {
                    1: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
                    2: 'linear-gradient(135deg, rgba(240, 147, 251, 0.15) 0%, rgba(245, 87, 108, 0.15) 100%)',
                    3: 'linear-gradient(135deg, rgba(79, 172, 254, 0.15) 0%, rgba(0, 242, 254, 0.15) 100%)',
                    4: 'linear-gradient(135deg, rgba(67, 233, 123, 0.15) 0%, rgba(56, 249, 215, 0.15) 100%)',
                    5: 'linear-gradient(135deg, rgba(250, 112, 154, 0.15) 0%, rgba(254, 225, 64, 0.15) 100%)',
                    6: 'linear-gradient(135deg, rgba(48, 207, 208, 0.15) 0%, rgba(51, 8, 103, 0.15) 100%)'
                  };
                  const borderColors = {
                    1: '#667eea',
                    2: '#f093fb',
                    3: '#4facfe',
                    4: '#43e97b',
                    5: '#fa709a',
                    6: '#30cfd0'
                  };
                  return {
                    background: lightGradients[model.id],
                    border: `3px solid ${borderColors[model.id]}`,
                    boxShadow: `0 4px 20px ${borderColors[model.id]}33`,
                    color: colors.mainBlack
                  };
                };
                
                const cardStyle = getCardStyle();
                const isSelected = selectedModel?.id === model.id;
                
                return (
                  <div
                    key={model.id}
                    onClick={() => handleModelSelect(model)}
                    className="cursor-pointer transition-all hover:scale-105 relative"
                    style={{
                      ...cardStyle,
                      borderRadius: '16px',
                      padding: '25px',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Animated gradient overlay on hover */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: model.gradient,
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      pointerEvents: 'none',
                      zIndex: 0
                    }}
                    className="hover-gradient-overlay"></div>
                    
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3"
                           style={{
                             backgroundColor: isSelected ? 'rgba(255,255,255,0.3)' : 'rgba(243, 189, 74, 0.2)',
                             color: isSelected ? 'white' : colors.mainBlack,
                             border: `1px solid ${isSelected ? 'rgba(255,255,255,0.4)' : colors.mainYellow}`
                           }}>
                        {model.category}
                      </div>
                      <h3 className="text-xl font-bold mb-2" style={{
                        color: isSelected ? 'white' : colors.mainBlack
                      }}>{model.name}</h3>
                      <p className="text-sm font-semibold mb-3" style={{
                        color: isSelected ? 'rgba(255,255,255,0.9)' : colors.jet
                      }}>
                        {model.subtitle}
                      </p>
                      <p className="text-sm mb-4" style={{
                        color: isSelected ? 'rgba(255,255,255,0.85)' : colors.jet
                      }}>
                        {model.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {model.useCases.map((useCase, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 rounded-full"
                                style={{
                                  backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)',
                                  border: isSelected ? '1px solid rgba(255,255,255,0.4)' : '1px solid rgba(0,0,0,0.1)',
                                  color: isSelected ? 'white' : colors.mainBlack,
                                  fontWeight: '600'
                                }}>
                            {useCase}
                          </span>
                        ))}
                      </div>
                      {isSelected && (
                        <div className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-xl"
                             style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: colors.success, zIndex: 2 }}>
                          ✓
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <style jsx>{`
              .cursor-pointer:hover .hover-gradient-overlay {
                opacity: 0.1 !important;
              }
            `}</style>

            {/* Custom Input */}
            {showCustomInput && (
              <div className="mt-8" style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '30px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: `2px solid ${colors.mainYellow}`
              }}>
                <h4 className="text-xl font-bold mb-4" style={{ color: colors.mainBlack }}>
                  Describe Your Custom Model
                </h4>
                <textarea
                  placeholder="Tell us about your AI model: parameters, use case, expected workload..."
                  className="w-full p-4 rounded-lg mb-4"
                  rows="4"
                  style={{
                    border: `2px solid ${colors.alabaster}`,
                    color: colors.mainBlack,
                    fontSize: '16px'
                  }}
                />
                <button
                  className="px-6 py-3 rounded-lg font-bold transition-all hover:opacity-90"
                  style={{
                    backgroundColor: colors.mainYellow,
                    color: colors.mainBlack
                  }}
                >
                  🔍 Analyze Requirements
                </button>
                <p className="mt-4 text-sm" style={{ color: colors.jet }}>
                  💡 <strong>Coming Soon:</strong> AI-powered analysis of your custom requirements
                </p>
              </div>
            )}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12" style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '30px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <div className="flex gap-4">
            <div className="text-3xl shrink-0">ℹ️</div>
            <div>
              <h4 className="text-xl font-bold mb-3" style={{ color: colors.mainBlack }}>
                About This Calculator
              </h4>
              <p className="mb-3" style={{ color: colors.jet, lineHeight: '1.6' }}>
                Our AI Hardware Calculator helps you determine the optimal PC configuration for your artificial intelligence workloads. 
                Whether you're running inference on pre-trained models or training new ones from scratch, we provide tailored recommendations.
              </p>
              <ul className="space-y-2" style={{ color: colors.jet }}>
                <li>• <strong>Inference:</strong> Lower requirements, optimized for running AI models in production</li>
                <li>• <strong>Training:</strong> Higher specs needed for developing and fine-tuning models</li>
                <li>• <strong>Custom Models:</strong> Get personalized recommendations based on your specific needs</li>
              </ul>
            </div>
          </div>
        </div>

      </div>

      {/* Modal with Thinking Animation */}
      {showModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
            animation: 'fadeIn 0.3s ease'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '24px',
              maxWidth: '900px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative',
              animation: 'slideUp 0.3s ease'
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => {
                setShowModal(false);
                setIsThinking(false);
                setModalRecommendations(null);
              }}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: colors.alabaster,
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                zIndex: 10
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = colors.mainYellow;
                e.target.style.transform = 'rotate(90deg)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = colors.alabaster;
                e.target.style.transform = 'rotate(0deg)';
              }}
            >
              ×
            </button>

            {/* Thinking Animation */}
            {isThinking ? (
              <div style={{ padding: '80px 40px', textAlign: 'center' }}>
                <div style={{ marginBottom: '30px' }}>
                  <div className="thinking-brain" style={{
                    fontSize: '80px',
                    animation: 'brain-think 1.5s ease-in-out infinite',
                    display: 'inline-block'
                  }}>
                    🧠
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-4" style={{ color: colors.mainBlack }}>
                  Analyzing Your Requirements...
                </h3>
                <p className="text-lg mb-8" style={{ color: colors.jet }}>
                  Our AI is calculating the perfect hardware configuration for you
                </p>
                
                {/* Loading Dots */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '30px' }}>
                  <div className="loading-dot" style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: colors.mainYellow,
                    animation: 'bounce-dot 1.4s infinite ease-in-out both',
                    animationDelay: '0s'
                  }}></div>
                  <div className="loading-dot" style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: colors.mainYellow,
                    animation: 'bounce-dot 1.4s infinite ease-in-out both',
                    animationDelay: '0.16s'
                  }}></div>
                  <div className="loading-dot" style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: colors.mainYellow,
                    animation: 'bounce-dot 1.4s infinite ease-in-out both',
                    animationDelay: '0.32s'
                  }}></div>
                </div>

                {/* Progress Bar */}
                <div style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: colors.alabaster,
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    height: '100%',
                    background: `linear-gradient(90deg, ${colors.mainYellow} 0%, #ffd700 100%)`,
                    borderRadius: '4px',
                    animation: 'progress-bar 2s ease-out forwards',
                    boxShadow: `0 0 10px ${colors.mainYellow}`
                  }}></div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '12px', color: colors.jet, fontWeight: '600' }}>Analyzing CPU needs...</span>
                  <span style={{ fontSize: '12px', color: colors.jet, fontWeight: '600' }}>Calculating GPU requirements...</span>
                  <span style={{ fontSize: '12px', color: colors.jet, fontWeight: '600' }}>Optimizing memory...</span>
                </div>
              </div>
            ) : modalRecommendations && (
              <div style={{ padding: '40px' }}>
                {/* Results Header */}
                <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                         style={{ backgroundColor: colors.success, color: 'white', animation: 'scaleIn 0.5s ease' }}>
                      ✓
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold" style={{ color: colors.mainBlack }}>
                        Hardware Recommendations
                      </h2>
                      <p className="text-lg" style={{ color: colors.primary }}>
                        {selectedModel.name} • {selectedWorkload === 'inference' ? 'Inference' : 'Training'}
                      </p>
                    </div>
                  </div>
                  <div className="px-6 py-3 rounded-full font-bold text-xl"
                       style={{ backgroundColor: colors.mainYellow, color: colors.mainBlack }}>
                    {selectedWorkload === 'inference' ? '🚀 Inference Setup' : '🎓 Training Setup'}
                  </div>
                </div>

                {/* Specs Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <div className="p-6 rounded-lg" style={{ backgroundColor: colors.alabaster, borderLeft: `4px solid ${colors.primary}` }}>
                    <div className="text-3xl mb-3">🖥️</div>
                    <h4 className="text-xs font-bold mb-2 uppercase" style={{ color: colors.jet }}>Processor</h4>
                    <p className="font-bold text-lg mb-1" style={{ color: colors.mainBlack }}>{modalRecommendations.cpu}</p>
                    <p className="text-sm font-semibold" style={{ color: colors.primary }}>{modalRecommendations.cpuCores}</p>
                  </div>

                  <div className="p-6 rounded-lg" style={{ backgroundColor: colors.alabaster, borderLeft: `4px solid ${colors.secondary}` }}>
                    <div className="text-3xl mb-3">🧮</div>
                    <h4 className="text-xs font-bold mb-2 uppercase" style={{ color: colors.jet }}>Memory</h4>
                    <p className="font-bold text-lg mb-1" style={{ color: colors.mainBlack }}>{modalRecommendations.ram}</p>
                  </div>

                  <div className="p-6 rounded-lg" style={{ backgroundColor: colors.alabaster, borderLeft: `4px solid ${colors.success}` }}>
                    <div className="text-3xl mb-3">🎮</div>
                    <h4 className="text-xs font-bold mb-2 uppercase" style={{ color: colors.jet }}>Graphics Card</h4>
                    <p className="font-bold text-lg mb-1" style={{ color: colors.mainBlack }}>{modalRecommendations.gpu}</p>
                    <p className="text-sm font-semibold" style={{ color: colors.success }}>{modalRecommendations.vram} VRAM</p>
                  </div>

                  <div className="p-6 rounded-lg" style={{ backgroundColor: colors.alabaster, borderLeft: `4px solid ${colors.warning}` }}>
                    <div className="text-3xl mb-3">💾</div>
                    <h4 className="text-xs font-bold mb-2 uppercase" style={{ color: colors.jet }}>Storage</h4>
                    <p className="font-bold text-lg mb-1" style={{ color: colors.mainBlack }}>{modalRecommendations.storage}</p>
                  </div>

                  <div className="p-6 rounded-lg" style={{ backgroundColor: colors.alabaster, borderLeft: `4px solid ${colors.error}` }}>
                    <div className="text-3xl mb-3">⚡</div>
                    <h4 className="text-xs font-bold mb-2 uppercase" style={{ color: colors.jet }}>Power Supply</h4>
                    <p className="font-bold text-lg mb-1" style={{ color: colors.mainBlack }}>{modalRecommendations.psu}</p>
                  </div>

                  <div className="p-6 rounded-lg"
                       style={{ background: 'linear-gradient(135deg, #f3bd4a 0%, #ff9800 100%)', color: colors.mainBlack }}>
                    <div className="text-3xl mb-3">💰</div>
                    <h4 className="text-xs font-bold mb-2 uppercase">Estimated Budget</h4>
                    <p className="font-bold text-2xl">{modalRecommendations.estimatedCost}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 flex-wrap">
                  <button
                    onClick={async () => {
                      await Swal.fire({
                        title: 'Coming Soon! 🛠️',
                        text: 'The auto-build feature is currently under development. Soon you\'ll be able to automatically add these components to your build!',
                        icon: 'info',
                        confirmButtonColor: colors.mainYellow,
                        confirmButtonText: 'Got it!',
                        iconColor: colors.mainYellow
                      });
                    }}
                    className="px-8 py-4 rounded-lg font-bold text-lg transition-all hover:opacity-90 flex-1 cursor-pointer"
                    style={{
                      backgroundColor: colors.mainYellow,
                      color: colors.mainBlack
                    }}
                  >
                    🛠️ Build This Configuration
                  </button>
    
                </div>

                {/* Performance Tip */}
                <div className="mt-8 p-6 rounded-lg" style={{
                  background: `linear-gradient(135deg, ${colors.alabaster} 0%, ${colors.platinum} 100%)`,
                  borderLeft: `4px solid ${colors.mainYellow}`
                }}>
                  <div className="flex gap-4">
                    <div className="text-2xl shrink-0">💡</div>
                    <div>
                      <p style={{ color: colors.mainBlack, lineHeight: '1.6' }}>
                        <strong style={{ color: colors.mainYellow }}>Pro Tip:</strong> For {selectedWorkload === 'training' ? 'training workloads' : 'inference tasks'}, 
                        ensure adequate cooling and consider {selectedWorkload === 'training' ? 'multi-GPU setups for faster training' : 'GPU with sufficient VRAM for your batch size'}.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Animations CSS */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes brain-think {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.1) rotate(-5deg); }
          75% { transform: scale(1.1) rotate(5deg); }
        }
        @keyframes bounce-dot {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        @keyframes progress-bar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes scaleIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
      `}</style>

      <Footer />
    </div>
  );
};

export default AIHardwareCalculator;
