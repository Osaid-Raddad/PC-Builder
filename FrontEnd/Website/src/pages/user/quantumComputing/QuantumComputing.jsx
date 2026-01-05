import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/user/navbar/Navbar.jsx';
import Footer from '../../../components/user/footer/Footer.jsx';
import colors from '../../../config/colors';
import { 
  FiCpu, 
  FiLock, 
  FiActivity, 
  FiZap,
  FiAlertTriangle,
  FiDollarSign,
  FiServer,
  FiCode,
  FiThermometer,
  FiTrendingUp,
  FiArrowRight,
  FiCheckCircle,
  FiTarget
} from 'react-icons/fi';
import { LineChart, Line, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const QuantumComputing = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basics');
  const [comparisonSlider, setComparisonSlider] = useState(50);
  const [selectedTaskType, setSelectedTaskType] = useState('ai');
  const [isQuantumView, setIsQuantumView] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState({});

  // Performance scaling data
  const performanceData = [
    { variables: '10', classical: 1, quantum: 0.5 },
    { variables: '50', classical: 10, quantum: 2 },
    { variables: '100', classical: 60, quantum: 5 },
    { variables: '500', classical: 3600, quantum: 30 },
    { variables: '1000', classical: 259200, quantum: 120 }
  ];

  // Quantum advantage domains data
  const advantageData = [
    { domain: 'Cryptography', value: 99 },
    { domain: 'Drug Discovery', value: 95 },
    { domain: 'Financial Modeling', value: 88 },
    { domain: 'AI Training', value: 75 },
    { domain: 'Weather Prediction', value: 82 },
    { domain: 'Gaming Physics', value: 35 }
  ];

  // Qubit growth data
  const qubitGrowthData = [
    { year: '2019', qubits: 53, type: 'past' },
    { year: '2021', qubits: 127, type: 'past' },
    { year: '2023', qubits: 433, type: 'present' },
    { year: '2025', qubits: 1000, type: 'future' },
    { year: '2030', qubits: 10000, type: 'future' }
  ];

  // Task estimator data
  const taskEstimates = {
    ai: {
      name: 'Train GPT-4 Size Model',
      current: '432 days',
      hybrid2030: '18 hours',
      fullQuantum2035: '12 minutes'
    },
    encryption: {
      name: 'Break RSA-2048 Encryption',
      current: '300M years',
      hybrid2030: '2 weeks',
      fullQuantum2035: '8 hours'
    },
    simulation: {
      name: 'Molecular Simulation (100 atoms)',
      current: '45 days',
      hybrid2030: '6 hours',
      fullQuantum2035: '15 minutes'
    },
    optimization: {
      name: 'Supply Chain Optimization (1000 variables)',
      current: '12 hours',
      hybrid2030: '5 minutes',
      fullQuantum2035: '30 seconds'
    }
  };

  // Scroll animation handling
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Check which sections are visible
      const sections = document.querySelectorAll('[data-section]');
      const newVisibleSections = {};
      
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.75 && rect.bottom > 0;
        newVisibleSections[section.dataset.section] = isVisible;
      });
      
      setVisibleSections(newVisibleSections);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Floating particles animation
  const ParticleBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            background: i % 3 === 0 ? colors.mainYellow : i % 3 === 1 ? colors.jet : colors.mainYellow,
            animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.mainBlack }}>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(10px, -20px) scale(1.1); }
          50% { transform: translate(-15px, -40px) scale(0.9); }
          75% { transform: translate(20px, -30px) scale(1.05); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(243, 189, 74, 0.3); }
          50% { box-shadow: 0 0 40px rgba(243, 189, 74, 0.6); }
        }
        
        .animate-slide-up {
          animation: slideUp 0.6s ease-out forwards;
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        
        .quantum-gradient {
          background: linear-gradient(135deg, ${colors.mainBlack} 0%, ${colors.jet} 50%, ${colors.jet} 100%);
        }
        
        .card-gradient {
          background: linear-gradient(145deg, ${colors.jet} 0%, ${colors.mainYellow}22 100%);
        }
        
        .comparison-table tr:hover {
          background: rgba(243, 189, 74, 0.05);
          transform: scale(1.01);
          transition: all 0.3s ease;
        }
        
        .hover-lift {
          transition: all 0.3s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(243, 189, 74, 0.2);
        }
        
        .progress-bar-fill {
          transition: width 1.5s ease-out;
        }
      `}</style>

      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <ParticleBackground />
        
        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
          <div className={`${visibleSections.hero ? 'animate-slide-up' : 'opacity-0'}`} data-section="hero">
            <h1 
              className="text-6xl md:text-8xl font-bold mb-6"
              style={{
                color: colors.mainYellow
              }}
            >
              Beyond Silicon:<br />The Quantum Revolution
            </h1>
            
            <p className="text-xl md:text-2xl mb-12" style={{ color: colors.mainBeige }}>
              Discover how quantum computing is reshaping the future of performance, power, and possibility—<br />
              and what it means for your next PC.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => document.getElementById('what-is-quantum').scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 rounded-lg font-semibold transition-all hover:scale-105 animate-glow"
                style={{ 
                  backgroundColor: colors.mainYellow,
                  color: colors.mainBlack
                }}
              >
                Explore Quantum Future <FiArrowRight className="inline ml-2" />
              </button>
              
              <button
                onClick={() => document.getElementById('pc-builder-integration').scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 rounded-lg font-semibold transition-all hover:scale-105"
                style={{ 
                  backgroundColor: 'transparent',
                  border: `2px solid ${colors.mainYellow}`,
                  color: colors.mainYellow
                }}
              >
                Check Your PC Score
              </button>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 rounded-full flex justify-center" style={{ borderColor: colors.mainYellow }}>
            <div className="w-1 h-3 rounded-full mt-2 animate-pulse" style={{ backgroundColor: colors.mainYellow }} />
          </div>
        </div>
      </section>

      {/* What is Quantum Computing */}
      <section id="what-is-quantum" className="py-20 px-6" data-section="what-is">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-6" style={{ color: colors.mainYellow }}>
            Computing at the Speed of Nature
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
            <div className={`${visibleSections['what-is'] ? 'animate-slide-up' : 'opacity-0'}`}>
              <p className="text-lg mb-6" style={{ color: colors.mainBeige }}>
                Traditional computers process information using bits—1s and 0s. Quantum computers use <strong style={{ color: colors.mainYellow }}>qubits</strong>, which can exist in multiple states simultaneously (superposition) and influence each other across distances (entanglement).
              </p>
              
              <p className="text-lg mb-6" style={{ color: colors.mainBeige }}>
                Think of it like this: A classical computer checks every door in a maze one by one. A quantum computer checks all doors at once.
              </p>
              
              <div className="flex items-center gap-4 p-6 rounded-lg card-gradient">
                <FiZap size={40} style={{ color: colors.mainYellow }} />
                <div>
                  <h4 className="font-semibold text-xl mb-2" style={{ color: colors.mainBeige }}>
                    Quantum Advantage
                  </h4>
                  <p style={{ color: colors.platinum }}>
                    For specific tasks, quantum computers can be <strong>158 million times faster</strong> than classical systems.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Interactive Toggle */}
            <div className="relative">
              <div className="text-center mb-6">
                <button
                  onClick={() => setIsQuantumView(!isQuantumView)}
                  className="px-6 py-3 rounded-full font-semibold transition-all"
                  style={{
                    background: isQuantumView 
                      ? `colors.mainYellow`
                      : colors.warning,
                    color: 'white'
                  }}
                >
                  {isQuantumView ? 'Quantum Qubit' : 'Classical Bit'}
                </button>
              </div>
              
              <div className="relative h-80 flex items-center justify-center card-gradient rounded-lg p-8">
                {!isQuantumView ? (
                  <div className="text-center">
                    <div 
                      className="w-40 h-40 rounded-lg mx-auto mb-6 flex items-center justify-center text-6xl font-bold transition-all"
                      style={{ 
                        backgroundColor: colors.warning,
                        color: 'white'
                      }}
                    >
                      {Math.random() > 0.5 ? '1' : '0'}
                    </div>
                    <p className="text-xl font-semibold" style={{ color: colors.mainBeige }}>
                      Classical Bit: Either 0 OR 1
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div 
                      className="w-40 h-40 rounded-full mx-auto mb-6 flex items-center justify-center relative animate-pulse"
                      style={{ 
                        background: `colors.mainYellow`
                      }}
                    >
                      <div className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ backgroundColor: colors.mainYellow }} />
                      <span className="text-4xl font-bold text-white z-10">|ψ⟩</span>
                    </div>
                    <p className="text-xl font-semibold" style={{ color: colors.mainBeige }}>
                      Quantum Qubit: 0 AND 1 (Superposition)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Classical vs Quantum Comparison */}
      <section className="py-20 px-6" style={{ backgroundColor: colors.jet }} data-section="comparison">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-12" style={{ color: colors.mainYellow }}>
            Two Paradigms, Infinite Possibilities
          </h2>
          
          <div className={`${visibleSections.comparison ? 'animate-slide-up' : 'opacity-0'}`}>
            <table className="w-full comparison-table" style={{ color: colors.mainBeige, tableLayout: 'fixed' }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${colors.mainYellow}` }}>
                  <th className="text-left p-4 text-xl" style={{ width: '25%' }}>Feature</th>
                  <th className="text-left p-4 text-xl" style={{ color: colors.warning, width: '37.5%' }}>Classical Computing</th>
                  <th className="text-left p-4 text-xl" style={{ color: colors.mainYellow, width: '37.5%' }}>Quantum Computing</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Basic Unit', classical: 'Bit (0 or 1)', quantum: 'Qubit (0, 1, or both)' },
                  { feature: 'Processing', classical: 'Sequential/Parallel', quantum: 'Superposition + Entanglement' },
                  { feature: 'Best For', classical: 'Everyday tasks, gaming, general computing', quantum: 'Complex optimization, simulation, cryptography' },
                  { feature: 'Error Rate', classical: '~10⁻¹⁷', quantum: '~10⁻² (improving)' },
                  { feature: 'Temperature', classical: 'Room temperature', quantum: 'Near absolute zero (-273°C)' },
                  { feature: 'Scalability', classical: 'Billions of transistors per chip', quantum: 'Currently 50-1000 qubits' },
                  { feature: 'Speed (Specific Tasks)', classical: 'Baseline', quantum: '100M - 158M times faster' }
                ].map((row, idx) => (
                  <tr key={idx} className="border-b" style={{ borderColor: colors.platinum }}>
                    <td className="p-4 font-semibold">{row.feature}</td>
                    <td className="p-4" style={{ color: colors.platinum }}>{row.classical}</td>
                    <td className="p-4" style={{ color: colors.mainYellow }}>{row.quantum}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Performance Visualizations */}
      <section className="py-20 px-6" data-section="performance">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16" style={{ color: colors.mainYellow }}>
            The Quantum Advantage
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            {/* Line Chart: Problem Complexity */}
            <div className={`${visibleSections.performance ? 'animate-slide-up' : 'opacity-0'} card-gradient p-6 rounded-lg`}>
              <h3 className="text-2xl font-semibold mb-6" style={{ color: colors.mainBeige }}>
                Problem Complexity vs Time
              </h3>
              <ResponsiveContainer width="100%" height={480}>
                <LineChart data={performanceData} margin={{ top: 20, right: 30, left: 80, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.platinum} />
                  <XAxis 
                    dataKey="variables" 
                    stroke={colors.mainBeige}
                    tick={{ fill: colors.mainBeige }}
                    height={80}
                  />
                  <YAxis 
                    stroke={colors.mainBeige}
                    scale="log"
                    domain={[0.1, 'auto']}
                    tick={{ fill: colors.mainBeige }}
                    width={80}
                  />
                  <text 
                    x="50%" 
                    y="95%" 
                    textAnchor="middle" 
                    style={{ fill: colors.mainBeige, fontSize: 14 }}
                  >
                    Problem Size (Variables)
                  </text>
                  <text 
                    x="2%" 
                    y="50%" 
                    textAnchor="middle" 
                    transform="rotate(-90, 30, 200)"
                    style={{ fill: colors.mainBeige, fontSize: 14 }}
                  >
                    Time (seconds)
                  </text>
                  <Tooltip 
                    contentStyle={{ backgroundColor: colors.mainBlack, border: `1px solid ${colors.mainYellow}`, color: colors.mainBeige }}
                    labelStyle={{ color: colors.mainBeige }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '10px' }} />
                  <Line 
                    type="monotone" 
                    dataKey="classical" 
                    stroke={colors.error} 
                    strokeWidth={3}
                    name="Classical"
                    dot={{ fill: colors.error, r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="quantum" 
                    stroke={colors.mainYellow} 
                    strokeWidth={3}
                    name="Quantum"
                    dot={{ fill: colors.mainYellow, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {/* Radar Chart: Advantage Domains */}
            <div className={`${visibleSections.performance ? 'animate-slide-up' : 'opacity-0'} card-gradient p-6 rounded-lg`} style={{ animationDelay: '0.2s' }}>
              <h3 className="text-2xl font-semibold mb-6" style={{ color: colors.mainBeige }}>
                Quantum Advantage Domains
              </h3>
              <ResponsiveContainer width="100%" height={550}>
                <RadarChart data={advantageData} margin={{ top: 60, right: 120, bottom: 60, left: 120 }}>
                  <PolarGrid stroke={colors.platinum} />
                  <PolarAngleAxis 
                    dataKey="domain" 
                    stroke={colors.mainBeige} 
                    tick={{ fill: colors.mainBeige, fontSize: 14 }}
                    tickLine={false}
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]} 
                    stroke={colors.mainBeige} 
                    tick={{ fill: colors.mainBeige, fontSize: 11 }}
                    tickCount={6}
                    axisLine={false}
                  />
                  <Radar 
                    name="Advantage %" 
                    dataKey="value" 
                    stroke={colors.mainYellow} 
                    fill={colors.mainYellow} 
                    fillOpacity={0.3}
                    strokeWidth={3}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: colors.mainBlack, border: `1px solid ${colors.mainYellow}`, color: colors.mainBeige }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Bar Chart: Qubit Growth */}
          <div className={`${visibleSections.performance ? 'animate-slide-up' : 'opacity-0'} card-gradient p-6 rounded-lg`} style={{ animationDelay: '0.4s' }}>
            <h3 className="text-2xl font-semibold mb-6" style={{ color: colors.mainBeige }}>
              Qubit Count Growth Over Time
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={qubitGrowthData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.platinum} />
                <XAxis dataKey="year" stroke={colors.mainBeige} tick={{ fill: colors.mainBeige }} />
                <YAxis stroke={colors.mainBeige} tick={{ fill: colors.mainBeige }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: colors.mainBlack, border: `1px solid ${colors.mainYellow}`, color: colors.mainBeige }}
                  cursor={{ fill: 'rgba(243, 189, 74, 0.1)' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar 
                  dataKey="qubits" 
                  name="Qubit Count"
                  fill={colors.mainYellow}
                  radius={[10, 10, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-center mt-4" style={{ color: colors.platinum }}>
              *2025-2030 values are projections based on current growth trends
            </p>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-6" style={{ backgroundColor: colors.jet }} data-section="use-cases">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16" style={{ color: colors.mainYellow }}>
            Where Quantum Dominates
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: FiCpu,
                title: 'Artificial Intelligence',
                description: 'Train AI models 1000x faster. Quantum neural networks could revolutionize machine learning, natural language processing, and computer vision.',
                stat: 'Potential 158M times speedup',
                color: colors.mainYellow
              },
              {
                icon: FiLock,
                title: 'Cryptography',
                description: 'Break RSA encryption in hours vs millions of years. While threatening current security, quantum computing also enables unbreakable quantum encryption.',
                stat: 'Factor 2048-bit in ~8 hours',
                color: colors.jet
              },
              {
                icon: FiActivity,
                title: 'Scientific Simulation',
                description: 'Simulate molecular interactions at the quantum level. Perfect for drug discovery, materials science, and climate modeling.',
                stat: 'Model 100+ atom systems',
                color: colors.success
              },
              {
                icon: FiTarget,
                title: 'Optimization',
                description: 'Solve logistics, supply chain, and financial portfolio optimization instantly. Quantum annealers excel at finding optimal solutions.',
                stat: '1000+ variables in seconds',
                color: colors.accent
              }
            ].map((useCase, idx) => (
              <div
                key={idx}
                className={`${visibleSections['use-cases'] ? 'animate-slide-up' : 'opacity-0'} card-gradient p-6 rounded-lg hover-lift cursor-pointer`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <useCase.icon size={48} style={{ color: useCase.color }} className="mb-4" />
                <h3 className="text-2xl font-semibold mb-3" style={{ color: colors.mainBeige }}>
                  {useCase.title}
                </h3>
                <p className="mb-4" style={{ color: colors.platinum }}>
                  {useCase.description}
                </p>
                <div className="pt-4 border-t" style={{ borderColor: colors.platinum }}>
                  <p className="text-sm font-semibold" style={{ color: useCase.color }}>
                    {useCase.stat}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Future Hardware Impact */}
      <section className="py-20 px-6" data-section="hardware">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16" style={{ color: colors.mainYellow }}>
            Your PC in 2035: Quantum-Hybrid Architecture
          </h2>
          
          {/* Timeline */}
          <div className={`${visibleSections.hardware ? 'animate-slide-up' : 'opacity-0'} mb-16`}>
            <div className="space-y-8">
              {[
                {
                  period: '2025-2027',
                  title: 'Quantum Co-Processors',
                  points: [
                    'Classical CPU handles everyday tasks',
                    'Quantum Processing Unit (QPU) offloads specific workloads',
                    'First consumer "quantum accelerators" for AI and encryption'
                  ]
                },
                {
                  period: '2028-2032',
                  title: 'Hybrid Quantum-Classical Systems',
                  points: [
                    'Integrated quantum cores on high-end CPUs',
                    'Quantum-enhanced GPUs for ray tracing and physics simulations',
                    'Quantum memory (qRAM) for instant-access storage'
                  ]
                },
                {
                  period: '2033+',
                  title: 'Full Quantum Personal Computing',
                  points: [
                    'Room-temperature qubits (if breakthroughs occur)',
                    'Quantum operating systems and software ecosystems',
                    '"Quantum gaming" with real-time physics simulations'
                  ]
                }
              ].map((phase, idx) => (
                <div key={idx} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg"
                      style={{ 
                        background: `colors.mainYellow`,
                        color: 'white'
                      }}
                    >
                      {phase.period.split('-')[0]}
                    </div>
                    {idx < 2 && <div className="w-0.5 flex-1 mt-2" style={{ backgroundColor: colors.mainYellow }} />}
                  </div>
                  <div className="flex-1 pb-8">
                    <h3 className="text-2xl font-semibold mb-2" style={{ color: colors.mainBeige }}>
                      {phase.period}: {phase.title}
                    </h3>
                    <ul className="space-y-2">
                      {phase.points.map((point, pointIdx) => (
                        <li key={pointIdx} className="flex items-start gap-2" style={{ color: colors.platinum }}>
                          <FiCheckCircle className="mt-1 flex-shrink-0" style={{ color: colors.mainYellow }} />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Component Impact Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                component: 'CPU',
                subtitle: 'Quantum Co-Processors',
                current: 'AMD Ryzen 9 9950X (16 cores, 5.7 GHz)',
                future: 'Quantum-Classical Hybrid (16 classical cores + 64 qubit QPU)',
                impact: '100x faster for optimization, AI, and simulation tasks'
              },
              {
                component: 'GPU',
                subtitle: 'Quantum Ray Tracing',
                current: 'RTX 5090 (21,760 CUDA cores)',
                future: 'QRT-8000 (15,000 classical cores + 128 qubit ray tracing accelerator)',
                impact: 'Real-time global illumination with perfect accuracy'
              },
              {
                component: 'Memory',
                subtitle: 'Quantum RAM (qRAM)',
                current: 'DDR5 6400 MHz (64GB)',
                future: 'Quantum-Enhanced Memory (1TB instant access)',
                impact: 'Zero latency for AI models and large datasets'
              },
              {
                component: 'Storage',
                subtitle: 'Quantum Encryption',
                current: 'NVMe Gen 5 SSD (10 GB/s)',
                future: 'Quantum-Safe Storage with native quantum key distribution',
                impact: 'Unbreakable security for sensitive data'
              }
            ].map((comp, idx) => (
              <div
                key={idx}
                className={`${visibleSections.hardware ? 'animate-slide-up' : 'opacity-0'} card-gradient p-6 rounded-lg hover-lift`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <FiCpu size={32} style={{ color: colors.mainYellow }} />
                  <div>
                    <h3 className="text-2xl font-semibold" style={{ color: colors.mainBeige }}>
                      {comp.component}
                    </h3>
                    <p className="text-sm" style={{ color: colors.platinum }}>
                      {comp.subtitle}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-sm font-semibold mb-1" style={{ color: colors.warning }}>
                      Current (2026):
                    </p>
                    <p className="text-sm" style={{ color: colors.platinum }}>
                      {comp.current}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-semibold mb-1" style={{ color: colors.mainYellow }}>
                      Future (2030+):
                    </p>
                    <p className="text-sm" style={{ color: colors.platinum }}>
                      {comp.future}
                    </p>
                  </div>
                </div>
                
                <div className="pt-3 border-t" style={{ borderColor: colors.platinum }}>
                  <p className="text-sm flex items-center gap-2" style={{ color: colors.mainYellow }}>
                    <FiTrendingUp />
                    <strong>Impact:</strong> {comp.impact}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Limitations & Challenges */}
      <section className="py-20 px-6" style={{ backgroundColor: colors.jet }} data-section="challenges">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16" style={{ color: colors.mainYellow }}>
            Why You Can't Buy a Quantum PC... Yet
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: FiThermometer,
                title: 'Temperature Requirements',
                issue: 'Qubits require -273°C (near absolute zero)',
                status: 'Research into room-temp qubits ongoing',
                progress: 15
              },
              {
                icon: FiAlertTriangle,
                title: 'Error Rates',
                issue: 'Quantum systems are extremely fragile (decoherence)',
                status: 'Error correction improving yearly',
                progress: 35
              },
              {
                icon: FiCpu,
                title: 'Scalability',
                issue: 'Difficult to scale beyond 1000 qubits',
                status: 'IBM targeting 100,000 qubits by 2033',
                progress: 8
              },
              {
                icon: FiCode,
                title: 'Software Ecosystem',
                issue: 'Limited quantum algorithms and developer tools',
                status: 'Languages like Qiskit, Cirq gaining traction',
                progress: 45
              },
              {
                icon: FiDollarSign,
                title: 'Cost',
                issue: '$15M+ per quantum computer',
                status: 'Cloud access available, costs decreasing',
                progress: 25
              },
              {
                icon: FiServer,
                title: 'Size',
                issue: 'Requires room-sized refrigeration systems',
                status: 'Miniaturization research underway',
                progress: 12
              }
            ].map((challenge, idx) => (
              <div
                key={idx}
                className={`${visibleSections.challenges ? 'animate-slide-up' : 'opacity-0'} card-gradient p-6 rounded-lg hover-lift`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <challenge.icon size={40} style={{ color: colors.error }} className="mb-4" />
                <h3 className="text-xl font-semibold mb-3" style={{ color: colors.mainBeige }}>
                  {challenge.title}
                </h3>
                <p className="text-sm mb-2" style={{ color: colors.platinum }}>
                  <strong>Issue:</strong> {challenge.issue}
                </p>
                <p className="text-sm mb-4" style={{ color: colors.platinum }}>
                  <strong>Status:</strong> {challenge.status}
                </p>
                
                <div>
                  <div className="flex justify-between text-xs mb-1" style={{ color: colors.mainBeige }}>
                    <span>Progress to Solution</span>
                    <span>{challenge.progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full" style={{ backgroundColor: colors.mainBlack }}>
                    <div
                      className="h-full rounded-full progress-bar-fill"
                      style={{
                        width: visibleSections.challenges ? `${challenge.progress}%` : '0%',
                        background: `colors.mainYellow`
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PC Builder Integration */}
      <section id="pc-builder-integration" className="py-20 px-6" data-section="integration">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16" style={{ color: colors.mainYellow }}>
            Quantum Performance Score™
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* Task Time Estimator */}
            <div className={`${visibleSections.integration ? 'animate-slide-up' : 'opacity-0'} card-gradient p-8 rounded-lg`}>
              <h3 className="text-2xl font-semibold mb-6" style={{ color: colors.mainBeige }}>
                Classical vs Quantum Task Estimator
              </h3>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBeige }}>
                  Select Task Type:
                </label>
                <select
                  value={selectedTaskType}
                  onChange={(e) => setSelectedTaskType(e.target.value)}
                  className="w-full p-3 rounded-lg"
                  style={{
                    backgroundColor: colors.mainBlack,
                    color: colors.mainBeige,
                    border: `1px solid ${colors.mainYellow}`
                  }}
                >
                  <option value="ai">AI Model Training</option>
                  <option value="encryption">Break Encryption</option>
                  <option value="simulation">Molecular Simulation</option>
                  <option value="optimization">Supply Chain Optimization</option>
                </select>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 rounded-lg" style={{ backgroundColor: colors.mainBlack }}>
                  <p className="text-sm mb-2" style={{ color: colors.platinum }}>
                    Task: <strong style={{ color: colors.mainBeige }}>{taskEstimates[selectedTaskType].name}</strong>
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: colors.mainBlack }}>
                    <span style={{ color: colors.warning }}>Current PC (2026):</span>
                    <span className="font-bold" style={{ color: colors.warning }}>
                      {taskEstimates[selectedTaskType].current}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: colors.mainBlack }}>
                    <span style={{ color: colors.mainYellow }}>Quantum-Hybrid (2030):</span>
                    <span className="font-bold" style={{ color: colors.mainYellow }}>
                      {taskEstimates[selectedTaskType].hybrid2030}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: colors.mainBlack }}>
                    <span style={{ color: colors.mainYellow }}>Full Quantum (2035):</span>
                    <span className="font-bold" style={{ color: colors.mainYellow }}>
                      {taskEstimates[selectedTaskType].fullQuantum2035}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quantum Readiness Score */}
            <div className={`${visibleSections.integration ? 'animate-slide-up' : 'opacity-0'} card-gradient p-8 rounded-lg`} style={{ animationDelay: '0.2s' }}>
              <h3 className="text-2xl font-semibold mb-6" style={{ color: colors.mainBeige }}>
                Example Component Scores
              </h3>
              
              <div className="space-y-6">
                {[
                  { name: 'Intel Core i9-14900K', score: 72, category: 'CPU' },
                  { name: 'RTX 4090', score: 68, category: 'GPU' },
                  { name: 'Samsung 990 Pro SSD', score: 55, category: 'Storage' }
                ].map((component, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between mb-2">
                      <div>
                        <p className="font-semibold" style={{ color: colors.mainBeige }}>
                          {component.name}
                        </p>
                        <p className="text-sm" style={{ color: colors.platinum }}>
                          {component.category}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold" style={{ 
                          color: component.score > 70 ? colors.mainYellow : component.score > 50 ? colors.warning : colors.error 
                        }}>
                          {component.score}
                        </p>
                        <p className="text-xs" style={{ color: colors.platinum }}>
                          /100
                        </p>
                      </div>
                    </div>
                    
                    <div className="w-full h-3 rounded-full" style={{ backgroundColor: colors.mainBlack }}>
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: visibleSections.integration ? `${component.score}%` : '0%',
                          background: component.score > 70 
                            ? `colors.mainYellow`
                            : component.score > 50
                            ? `linear-gradient(90deg, ${colors.warning} 0%, ${colors.warning} 100%)`
                            : `linear-gradient(90deg, ${colors.error} 0%, ${colors.error} 100%)`
                        }}
                      />
                    </div>
                    
                    <p className="text-xs mt-1" style={{ color: colors.platinum }}>
                      {component.score > 70 ? 'Quantum-Ready' : component.score > 50 ? 'Transitional' : 'Legacy'}
                    </p>
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => navigate('/')}
                className="w-full mt-6 px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
                style={{
                  background: `colors.mainYellow`,
                  color: 'white'
                }}
              >
                Build Your Quantum-Ready PC
              </button>
            </div>
          </div>
          
          {/* Metrics Explanation */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Parallelization Potential',
                description: 'How well component architecture could leverage future quantum co-processors'
              },
              {
                title: 'Quantum-Safe Security',
                description: 'Encryption resistance to quantum attacks and readiness for quantum cryptography'
              },
              {
                title: 'Future Compatibility',
                description: 'Likelihood of quantum-hybrid integration based on current architecture'
              }
            ].map((metric, idx) => (
              <div
                key={idx}
                className={`${visibleSections.integration ? 'animate-slide-up' : 'opacity-0'} p-6 rounded-lg`}
                style={{ 
                  backgroundColor: colors.mainBlack,
                  animationDelay: `${idx * 0.1}s`
                }}
              >
                <h4 className="font-semibold mb-2" style={{ color: colors.mainYellow }}>
                  {metric.title}
                </h4>
                <p className="text-sm" style={{ color: colors.platinum }}>
                  {metric.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 px-6 quantum-gradient">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6" style={{ color: colors.mainYellow }}>
            Ready to Build the Future?
          </h2>
          <p className="text-xl mb-8" style={{ color: colors.mainBeige }}>
            Start building your quantum-ready PC today and be prepared for tomorrow's computing revolution.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 rounded-lg font-semibold text-white transition-all hover:scale-105"
              style={{ 
                background: `colors.mainYellow`
              }}
            >
              Start Building Now
            </button>
            
            <button
              onClick={() => navigate('/cpu')}
              className="px-8 py-4 rounded-lg font-semibold transition-all hover:scale-105"
              style={{ 
                backgroundColor: 'transparent',
                border: `2px solid ${colors.mainYellow}`,
                color: colors.mainYellow
              }}
            >
              Explore Components
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default QuantumComputing;



