import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/user/navbar/Navbar.jsx';
import Footer from '../../../components/user/footer/Footer.jsx';
import colors from '../../../config/colors';
import { FiArrowLeft, FiCpu, FiMonitor, FiZap, FiTool, FiCheckCircle } from 'react-icons/fi';
import { BsMotherboard, BsGpuCard } from 'react-icons/bs';

const BuildingGuides = () => {
  const navigate = useNavigate();

  const guides = [
    {
      title: 'First-Time Builder Guide',
      icon: <FiTool size={40} />,
      difficulty: 'Beginner',
      duration: '3-4 hours',
      description: 'Complete step-by-step guide for building your first PC from scratch.',
      steps: [
        'Prepare your workspace and tools',
        'Install the power supply in the case',
        'Install the motherboard standoffs and I/O shield',
        'Install the CPU and CPU cooler on the motherboard',
        'Install RAM modules',
        'Mount the motherboard in the case',
        'Install storage drives (SSD/HDD)',
        'Install the graphics card',
        'Connect all power cables',
        'Connect front panel connectors',
        'Cable management',
        'First boot and BIOS setup'
      ]
    },
    {
      title: 'Gaming PC Build Guide',
      icon: <BsGpuCard size={40} />,
      difficulty: 'Intermediate',
      duration: '4-5 hours',
      description: 'Build a high-performance gaming PC with optimal component selection.',
      steps: [
        'Choose the right GPU for your target resolution and FPS',
        'Select a CPU that won\'t bottleneck your GPU',
        'Pick fast RAM (DDR4 3200MHz+ or DDR5)',
        'Choose an NVMe SSD for fast load times',
        'Select adequate cooling (air or liquid)',
        'Ensure PSU has enough wattage with headroom',
        'Install components following first-time guide',
        'Configure XMP/DOCP for RAM in BIOS',
        'Install latest GPU drivers',
        'Run stress tests and benchmarks',
        'Optimize Windows settings for gaming'
      ]
    },
    {
      title: 'Budget Build Guide',
      icon: <FiZap size={40} />,
      difficulty: 'Beginner',
      duration: '3 hours',
      description: 'Build a capable PC on a tight budget without sacrificing quality.',
      steps: [
        'Prioritize CPU and GPU in your budget',
        'Consider previous generation components',
        'Start with 16GB RAM (upgradeable later)',
        'Use a single SSD instead of SSD+HDD combo',
        'Choose a reliable but affordable power supply',
        'Pick a case with good airflow, not flashy features',
        'Skip RGB and premium cooling initially',
        'Buy from sales and bundle deals',
        'Consider buying used components (carefully)',
        'Plan upgrade path for future improvements'
      ]
    },
    {
      title: 'Workstation Build Guide',
      icon: <FiCpu size={40} />,
      difficulty: 'Advanced',
      duration: '5-6 hours',
      description: 'Build a professional workstation for content creation and productivity.',
      steps: [
        'Choose a multi-core CPU (12+ cores)',
        'Select professional GPU (NVIDIA RTX or AMD Radeon Pro)',
        'Install maximum RAM your workload requires (32GB+)',
        'Use multiple fast NVMe drives for projects and cache',
        'Choose motherboard with multiple M.2 slots',
        'Implement robust cooling solution',
        'Select quiet case with sound dampening',
        'Ensure reliable, high-wattage power supply',
        'Install OS on separate drive from work files',
        'Configure RAID if needed',
        'Set up regular backup solution'
      ]
    },
    {
      title: 'Cable Management Guide',
      icon: <FiCheckCircle size={40} />,
      difficulty: 'All Levels',
      duration: '1-2 hours',
      description: 'Master cable management for improved airflow and aesthetics.',
      steps: [
        'Plan cable routes before connecting anything',
        'Use the case\'s cable management features',
        'Route cables behind the motherboard tray',
        'Group similar cables together',
        'Use velcro straps (avoid zip ties initially)',
        'Keep cables tight against case edges',
        'Leave front panel cables until last',
        'Hide excess cable length in PSU shroud',
        'Ensure no cables block fans or airflow',
        'Make final adjustments after testing',
        'Take photos for future reference'
      ]
    },
    {
      title: 'Troubleshooting Guide',
      icon: <FiTool size={40} />,
      difficulty: 'All Levels',
      duration: 'Variable',
      description: 'Common problems and solutions when building or upgrading your PC.',
      steps: [
        'PC won\'t turn on: Check power connections and PSU switch',
        'No display: Verify GPU is seated properly and connected to PSU',
        'No POST: Remove all RAM, try one stick at a time',
        'PC turns on then off: Check CPU power connector',
        'Random crashes: Check RAM with MemTest86',
        'Overheating: Verify cooler is mounted with proper thermal paste',
        'Fans running at 100%: Check fan headers in BIOS',
        'BSOD errors: Update or rollback drivers',
        'No boot device: Check SATA/NVMe connections',
        'USB devices not working: Update chipset drivers'
      ]
    }
  ];

  const tips = [
    {
      icon: <FiCheckCircle size={24} />,
      title: 'Work on a non-static surface',
      description: 'Use a wooden table or anti-static mat to prevent static damage to components.'
    },
    {
      icon: <FiCheckCircle size={24} />,
      title: 'Read all manuals first',
      description: 'Motherboard and case manuals contain crucial information specific to your build.'
    },
    {
      icon: <FiCheckCircle size={24} />,
      title: 'Don\'t force anything',
      description: 'If a component doesn\'t fit easily, you\'re likely doing something wrong. Check alignment.'
    },
    {
      icon: <FiCheckCircle size={24} />,
      title: 'Test outside the case first',
      description: 'Connect key components on the motherboard box to test POST before case installation.'
    },
    {
      icon: <FiCheckCircle size={24} />,
      title: 'Take your time',
      description: 'Building a PC is not a race. Careful assembly prevents costly mistakes.'
    },
    {
      icon: <FiCheckCircle size={24} />,
      title: 'Keep boxes and receipts',
      description: 'Save all packaging and receipts until you confirm everything works perfectly.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.mainBeige }}>
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-80 transition-opacity cursor-pointer"
            style={{ backgroundColor: colors.mainYellow, color: 'white' }}
          >
            <FiArrowLeft size={20} />
            Back
          </button>
          
          <h1 className="text-4xl font-bold" style={{ color: colors.mainBlack }}>
            PC Building Guides
          </h1>
          <div style={{ width: '100px' }}></div>
        </div>

        {/* Intro */}
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <p className="text-lg text-gray-700">
            Master the art of PC building with our comprehensive guides. Whether you're a first-timer or an experienced builder, 
            we've got you covered with step-by-step instructions and expert tips.
          </p>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {guides.map((guide, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <div className="flex items-center justify-center mb-4" style={{ color: colors.mainYellow }}>
                {guide.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-center" style={{ color: colors.mainBlack }}>
                {guide.title}
              </h3>
              <div className="flex items-center justify-center gap-4 mb-4 text-sm text-gray-600">
                <span className="px-3 py-1 rounded-full" style={{ backgroundColor: colors.mainBeige }}>
                  {guide.difficulty}
                </span>
                <span>{guide.duration}</span>
              </div>
              <p className="text-gray-700 mb-4 text-center">
                {guide.description}
              </p>
              <div className="space-y-2">
                {guide.steps.slice(0, 5).map((step, stepIndex) => (
                  <div key={stepIndex} className="flex items-start gap-2">
                    <FiCheckCircle size={16} style={{ color: colors.mainYellow, marginTop: '4px' }} />
                    <span className="text-sm text-gray-600">{step}</span>
                  </div>
                ))}
                {guide.steps.length > 5 && (
                  <p className="text-sm text-gray-500 italic ml-6">
                    +{guide.steps.length - 5} more steps...
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pro Tips Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: colors.mainYellow }}>
            Pro Tips for Success
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tips.map((tip, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-start gap-4">
                  <div style={{ color: colors.mainYellow }}>
                    {tip.icon}
                  </div>
                  <div>
                    <h4 className="font-bold mb-2" style={{ color: colors.mainBlack }}>
                      {tip.title}
                    </h4>
                    <p className="text-gray-700 text-sm">
                      {tip.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto mt-12 bg-white rounded-2xl p-8 shadow-lg text-center">
          <h3 className="text-2xl font-bold mb-4" style={{ color: colors.mainYellow }}>
            Ready to Start Building?
          </h3>
          <p className="text-gray-700 mb-6">
            Use our PC Builder tool to select compatible components and create your dream PC configuration.
          </p>
          <button
            onClick={() => navigate('/builder')}
            className="px-8 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
            style={{ backgroundColor: colors.mainYellow, color: 'white' }}
          >
            Launch PC Builder
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BuildingGuides;
