import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompare } from '../../../context/CompareContext';
import Navbar from '../../../components/user/navbar/Navbar.jsx';
import Footer from '../../../components/user/footer/Footer.jsx';
import colors from '../../../config/colors';
import { FiArrowLeft } from 'react-icons/fi';
import { MdCompareArrows } from 'react-icons/md';
import { BsCpuFill } from 'react-icons/bs';
import { FaMicrochip, FaMemory, FaHdd, FaBolt, FaBox, FaFan, FaDesktop, FaTools, FaNetworkWired, FaKeyboard, FaTrophy, FaCheckCircle } from 'react-icons/fa';
import { GiVideoCamera } from 'react-icons/gi';

const Comparator = () => {
  const navigate = useNavigate();
  const { compareList, removeFromCompare, clearCompare, getCategory } = useCompare();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const category = getCategory();
  
  // Map category names to display names
  const categoryNames = {
    'cpu': 'CPUs',
    'gpu': 'GPUs', 
    'motherboard': 'Motherboards',
    'memory': 'Memory',
    'storage': 'Storage',
    'psu': 'Power Supplies',
    'case': 'Cases',
    'cpucooler': 'CPU Coolers',
    'monitor': 'Monitors',
    'accessories': 'Accessories',
    'expansion': 'Expansion Cards',
    'peripherals': 'Peripherals'
  };

  // Get all spec keys from selected products
  const getAllSpecKeys = () => {
    const keys = new Set();
    compareList.forEach(product => {
      Object.keys(product).forEach(key => {
        if (key !== 'id' && key !== 'category' && key !== 'name' && key !== 'image') {
          keys.add(key);
        }
      });
    });
    return Array.from(keys);
  };

  const specKeys = getAllSpecKeys();

  // Function to determine the best component
  const getBestComponent = () => {
    if (compareList.length === 0) return null;

    const scores = compareList.map(product => {
      let score = 0;
      let reasons = [];

      // Category-specific scoring logic
      if (category === 'cpu') {
        // CPU scoring: cores, threads, clock speed, cache
        const cores = parseFloat(product.cores) || 0;
        const threads = parseFloat(product.threads) || 0;
        const baseClock = parseFloat(product.baseClock) || parseFloat(product.baseClockSpeed) || 0;
        const boostClock = parseFloat(product.boostClock) || parseFloat(product.boostClockSpeed) || 0;
        const cache = parseFloat(product.cache) || parseFloat(product.l3Cache) || 0;
        const tdp = parseFloat(product.tdp) || 100;

        score += cores * 10;
        score += threads * 5;
        score += baseClock * 2;
        score += boostClock * 3;
        score += cache * 1;
        score -= tdp * 0.05; // Lower TDP is better for efficiency

        if (cores >= 8) reasons.push(`High core count (${cores} cores)`);
        if (boostClock >= 5.0) reasons.push(`Excellent boost clock (${boostClock} GHz)`);
        if (cache >= 32) reasons.push(`Large cache (${cache} MB)`);

      } else if (category === 'gpu') {
        // GPU scoring: memory, core clock, memory speed, CUDA cores
        const memory = parseFloat(product.memory) || parseFloat(product.vram) || 0;
        const coreClock = parseFloat(product.coreClock) || parseFloat(product.boostClock) || 0;
        const memorySpeed = parseFloat(product.memorySpeed) || 0;
        const cudaCores = parseFloat(product.cudaCores) || parseFloat(product.streamProcessors) || 0;

        score += memory * 15;
        score += coreClock * 5;
        score += memorySpeed * 0.5;
        score += cudaCores * 0.01;

        if (memory >= 12) reasons.push(`High VRAM (${memory} GB)`);
        if (coreClock >= 2000) reasons.push(`High core clock (${coreClock} MHz)`);
        if (cudaCores >= 5000) reasons.push(`Many CUDA cores (${cudaCores})`);

      } else if (category === 'memory') {
        // Memory scoring: capacity, speed, latency
        const capacity = parseFloat(product.capacity) || parseFloat(product.size) || 0;
        const speed = parseFloat(product.speed) || parseFloat(product.frequency) || 0;
        const latency = parseFloat(product.latency) || parseFloat(product.casLatency) || 20;

        score += capacity * 10;
        score += speed * 0.05;
        score -= latency * 2; // Lower latency is better

        if (capacity >= 32) reasons.push(`High capacity (${capacity} GB)`);
        if (speed >= 3600) reasons.push(`Fast speed (${speed} MHz)`);
        if (latency <= 16) reasons.push(`Low latency (CL${latency})`);

      } else if (category === 'storage') {
        // Storage scoring: capacity, read/write speed, type
        const capacity = parseFloat(product.capacity) || 0;
        const readSpeed = parseFloat(product.readSpeed) || parseFloat(product.read) || 0;
        const writeSpeed = parseFloat(product.writeSpeed) || parseFloat(product.write) || 0;
        const type = product.type || product.interface || '';

        score += capacity * 0.5;
        score += readSpeed * 0.01;
        score += writeSpeed * 0.01;
        if (type.toLowerCase().includes('nvme') || type.toLowerCase().includes('m.2')) score += 50;
        if (type.toLowerCase().includes('pcie 4.0') || type.toLowerCase().includes('gen4')) score += 30;

        if (capacity >= 1000) reasons.push(`Large capacity (${capacity} GB)`);
        if (readSpeed >= 5000) reasons.push(`Fast read speed (${readSpeed} MB/s)`);
        if (type.toLowerCase().includes('nvme')) reasons.push(`NVMe interface`);

      } else if (category === 'psu') {
        // PSU scoring: wattage, efficiency rating
        const wattage = parseFloat(product.wattage) || parseFloat(product.power) || 0;
        const efficiency = product.efficiency || product.rating || '';

        score += wattage * 0.5;
        if (efficiency.includes('80+ Titanium')) score += 100;
        else if (efficiency.includes('80+ Platinum')) score += 80;
        else if (efficiency.includes('80+ Gold')) score += 60;
        else if (efficiency.includes('80+ Silver')) score += 40;
        else if (efficiency.includes('80+ Bronze')) score += 20;

        if (wattage >= 750) reasons.push(`High wattage (${wattage}W)`);
        if (efficiency.includes('80+ Gold') || efficiency.includes('80+ Platinum') || efficiency.includes('80+ Titanium')) {
          reasons.push(`Excellent efficiency (${efficiency})`);
        }

      } else if (category === 'motherboard') {
        // Motherboard scoring: chipset, features, RAM slots
        const ramSlots = parseFloat(product.ramSlots) || parseFloat(product.memorySlots) || 0;
        const maxMemory = parseFloat(product.maxMemory) || 0;
        const m2Slots = parseFloat(product.m2Slots) || 0;
        const formFactor = product.formFactor || '';

        score += ramSlots * 10;
        score += maxMemory * 0.1;
        score += m2Slots * 15;
        if (formFactor === 'ATX') score += 20;

        if (ramSlots >= 4) reasons.push(`${ramSlots} RAM slots`);
        if (m2Slots >= 2) reasons.push(`${m2Slots} M.2 slots`);
        if (maxMemory >= 128) reasons.push(`Supports up to ${maxMemory}GB RAM`);

      } else if (category === 'monitor') {
        // Monitor scoring: resolution, refresh rate, response time, size
        const refreshRate = parseFloat(product.refreshRate) || 0;
        const responseTime = parseFloat(product.responseTime) || 10;
        const size = parseFloat(product.size) || parseFloat(product.screenSize) || 0;
        const resolution = product.resolution || '';

        score += refreshRate * 2;
        score -= responseTime * 5; // Lower is better
        score += size * 5;
        if (resolution.includes('4K') || resolution.includes('3840')) score += 100;
        else if (resolution.includes('1440') || resolution.includes('2560')) score += 60;

        if (refreshRate >= 144) reasons.push(`High refresh rate (${refreshRate}Hz)`);
        if (responseTime <= 1) reasons.push(`Fast response time (${responseTime}ms)`);
        if (resolution.includes('4K')) reasons.push(`4K resolution`);

      } else if (category === 'cpucooler') {
        // Cooler scoring: TDP, noise level, fan count
        const tdpRating = parseFloat(product.tdpRating) || parseFloat(product.tdp) || 0;
        const noiseLevel = parseFloat(product.noiseLevel) || 40;
        const fanSize = parseFloat(product.fanSize) || 0;

        score += tdpRating * 1;
        score -= noiseLevel * 2; // Lower is better
        score += fanSize * 2;

        if (tdpRating >= 200) reasons.push(`High TDP rating (${tdpRating}W)`);
        if (noiseLevel <= 25) reasons.push(`Quiet operation (${noiseLevel}dBA)`);

      } else {
        // Generic scoring for other categories
        // Score based on price (higher features for the price)
        score += 100; // Base score
      }

      // Price consideration - value for money
      const price = parseFloat(product.price) || 1;
      const valueScore = score / Math.sqrt(price); // Performance per dollar

      return {
        product,
        score: valueScore,
        reasons
      };
    });

    // Sort by score and get the best one
    const sorted = scores.sort((a, b) => b.score - a.score);
    return sorted[0];
  };

  const bestComponent = getBestComponent();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.mainBeige }}>
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg hover:opacity-80 transition-opacity"
              style={{ backgroundColor: colors.mainYellow, color: 'white' }}
            >
              <FiArrowLeft size={20} />
              Back
            </button>
            
            {compareList.length > 0 && (
              <button
                onClick={clearCompare}
                className="px-4 py-2 rounded-lg font-semibold hover:opacity-80 transition-opacity"
                style={{ backgroundColor: '#F44336', color: 'white' }}
              >
                Clear All
              </button>
            )}
          </div>
          
          <div className="flex items-center justify-center gap-3">
            <MdCompareArrows size={40} style={{ color: colors.mainYellow }} />
            <h1 className="text-3xl font-bold" style={{ color: colors.mainBlack }}>
              Compare {category ? categoryNames[category] : 'Components'}
            </h1>
          </div>
        </div>

        {compareList.length === 0 ? (
          /* Empty State */
          <div 
            className="bg-white rounded-lg shadow-lg p-12 text-center"
            style={{ border: `2px solid ${colors.platinum}` }}
          >
            <MdCompareArrows size={80} style={{ color: colors.platinum }} className="mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2" style={{ color: colors.mainBlack }}>
              No Products Selected
            </h2>
            <p className="text-lg mb-6" style={{ color: colors.jet }}>
              Select a category below to browse products and add them for comparison
            </p>
            
            {/* Product Category Buttons - Horizontal Slide Bar */}
            <div className="relative max-w-5xl mx-auto">
              <div className="overflow-x-auto pb-4" style={{ scrollbarWidth: 'thin', scrollbarColor: `${colors.mainYellow} ${colors.platinum}` }}>
                <div className="flex gap-3 min-w-max px-2">
                  <button
                    onClick={() => navigate('/products/cpu?source=comparator')}
                    className="px-6 py-3 rounded-lg font-semibold hover:opacity-80 transition-all hover:scale-105 whitespace-nowrap flex items-center gap-2"
                    style={{ backgroundColor: colors.mainYellow, color: 'white', cursor: 'pointer' }}
                  >
                    <BsCpuFill size={20} />
                    CPUs
                  </button>
                  <button
                    onClick={() => navigate('/products/gpu?source=comparator')}
                    className="px-6 py-3 rounded-lg font-semibold hover:opacity-80 transition-all hover:scale-105 whitespace-nowrap flex items-center gap-2"
                    style={{ backgroundColor: colors.mainYellow, color: 'white', cursor: 'pointer' }}
                  >
                    <GiVideoCamera size={20} />
                    GPUs
                  </button>
                  <button
                    onClick={() => navigate('/products/motherboard?source=comparator')}
                    className="px-6 py-3 rounded-lg font-semibold hover:opacity-80 transition-all hover:scale-105 whitespace-nowrap flex items-center gap-2"
                    style={{ backgroundColor: colors.mainYellow, color: 'white', cursor: 'pointer' }}
                  >
                    <FaMicrochip size={20} />
                    Motherboards
                  </button>
                  <button
                    onClick={() => navigate('/products/memory?source=comparator')}
                    className="px-6 py-3 rounded-lg font-semibold hover:opacity-80 transition-all hover:scale-105 whitespace-nowrap flex items-center gap-2"
                    style={{ backgroundColor: colors.mainYellow, color: 'white', cursor: 'pointer' }}
                  >
                    <FaMemory size={20} />
                    Memory
                  </button>
                  <button
                    onClick={() => navigate('/products/storage?source=comparator')}
                    className="px-6 py-3 rounded-lg font-semibold hover:opacity-80 transition-all hover:scale-105 whitespace-nowrap flex items-center gap-2"
                    style={{ backgroundColor: colors.mainYellow, color: 'white', cursor: 'pointer' }}
                  >
                    <FaHdd size={20} />
                    Storage
                  </button>
                  <button
                    onClick={() => navigate('/products/power-supply?source=comparator')}
                    className="px-6 py-3 rounded-lg font-semibold hover:opacity-80 transition-all hover:scale-105 whitespace-nowrap flex items-center gap-2"
                    style={{ backgroundColor: colors.mainYellow, color: 'white', cursor: 'pointer' }}
                  >
                    <FaBolt size={20} />
                    Power Supplies
                  </button>
                  <button
                    onClick={() => navigate('/products/case?source=comparator')}
                    className="px-6 py-3 rounded-lg font-semibold hover:opacity-80 transition-all hover:scale-105 whitespace-nowrap flex items-center gap-2"
                    style={{ backgroundColor: colors.mainYellow, color: 'white', cursor: 'pointer' }}
                  >
                    <FaBox size={20} />
                    Cases
                  </button>
                  <button
                    onClick={() => navigate('/products/cooler?source=comparator')}
                    className="px-6 py-3 rounded-lg font-semibold hover:opacity-80 transition-all hover:scale-105 whitespace-nowrap flex items-center gap-2"
                    style={{ backgroundColor: colors.mainYellow, color: 'white', cursor: 'pointer' }}
                  >
                    <FaFan size={20} />
                    CPU Coolers
                  </button>
                  <button
                    onClick={() => navigate('/products/monitor?source=comparator')}
                    className="px-6 py-3 rounded-lg font-semibold hover:opacity-80 transition-all hover:scale-105 whitespace-nowrap flex items-center gap-2"
                    style={{ backgroundColor: colors.mainYellow, color: 'white', cursor: 'pointer' }}
                  >
                    <FaDesktop size={20} />
                    Monitors
                  </button>
                  <button
                    onClick={() => navigate('/products/accessories?source=comparator')}
                    className="px-6 py-3 rounded-lg font-semibold hover:opacity-80 transition-all hover:scale-105 whitespace-nowrap flex items-center gap-2"
                    style={{ backgroundColor: colors.mainYellow, color: 'white', cursor: 'pointer' }}
                  >
                    <FaTools size={20} />
                    Accessories
                  </button>
                  <button
                    onClick={() => navigate('/products/expansion?source=comparator')}
                    className="px-6 py-3 rounded-lg font-semibold hover:opacity-80 transition-all hover:scale-105 whitespace-nowrap flex items-center gap-2"
                    style={{ backgroundColor: colors.mainYellow, color: 'white', cursor: 'pointer' }}
                  >
                    <FaNetworkWired size={20} />
                    Expansion Cards
                  </button>
                  <button
                    onClick={() => navigate('/products/peripherals?source=comparator')}
                    className="px-6 py-3 rounded-lg font-semibold hover:opacity-80 transition-all hover:scale-105 whitespace-nowrap flex items-center gap-2"
                    style={{ backgroundColor: colors.mainYellow, color: 'white', cursor: 'pointer' }}
                  >
                    <FaKeyboard size={20} />
                    Peripherals
                  </button>
                </div>
              </div>
              <p className="text-sm mt-2" style={{ color: colors.jet }}>
                ← Scroll to see all categories →
              </p>
            </div>
          </div>
        ) : (
          /* Comparison Table */
          <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ border: `2px solid ${colors.platinum}` }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: colors.mainBeige }}>
                    <th className="p-4 text-left font-bold" style={{ color: colors.mainBlack, minWidth: '200px' }}>
                      Specification
                    </th>
                    {compareList.map(product => (
                      <th key={product.id} className="p-4 text-center" style={{ minWidth: '250px' }}>
                        <div className="flex flex-col items-center gap-2">
                          <div className="relative">
                            <button
                              onClick={() => removeFromCompare(product.id)}
                              className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center hover:opacity-80"
                              style={{ backgroundColor: '#F44336', color: 'white' }}
                            >
                              ×
                            </button>
                            <div 
                              className="w-20 h-20 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: colors.mainBeige }}
                            >
                              <span className="text-3xl">{category === 'cpu' ? '🖥️' : category === 'gpu' ? '🎮' : '💻'}</span>
                            </div>
                          </div>
                          <h3 className="font-bold text-sm" style={{ color: colors.mainBlack }}>
                            {product.name || `${product.brand} ${product.model}`}
                          </h3>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Price Row */}
                  <tr style={{ backgroundColor: 'white', borderBottom: `1px solid ${colors.platinum}` }}>
                    <td className="p-4 font-semibold" style={{ color: colors.mainBlack }}>
                      Price
                    </td>
                    {compareList.map(product => (
                      <td key={product.id} className="p-4 text-center">
                        <span className="text-xl font-bold" style={{ color: colors.mainYellow }}>
                          ${product.price}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Dynamic Spec Rows */}
                  {specKeys.map(key => (
                    <tr key={key} style={{ backgroundColor: 'white', borderBottom: `1px solid ${colors.platinum}` }}>
                      <td className="p-4 font-semibold capitalize" style={{ color: colors.mainBlack }}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </td>
                      {compareList.map(product => (
                        <td key={product.id} className="p-4 text-center" style={{ color: colors.jet }}>
                          {product[key] || '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Best Component Recommendation */}
            {bestComponent && compareList.length > 1 && (
              <div 
                className="p-6 border-t-2"
                style={{ 
                  backgroundColor: '#FFF9E6',
                  borderTopColor: colors.mainYellow
                }}
              >
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <FaTrophy size={32} style={{ color: colors.mainYellow }} />
                    <h3 className="text-2xl font-bold" style={{ color: colors.mainBlack }}>
                      Our Recommendation
                    </h3>
                  </div>
                  
                  <div 
                    className="bg-white rounded-lg p-6 shadow-md"
                    style={{ border: `3px solid ${colors.mainYellow}` }}
                  >
                    <div className="text-center mb-4">
                      <p className="text-lg mb-2" style={{ color: colors.jet }}>
                        Based on our analysis, the best component is:
                      </p>
                      <h4 className="text-2xl font-bold" style={{ color: colors.mainYellow }}>
                        {bestComponent.product.name || `${bestComponent.product.brand} ${bestComponent.product.model}`}
                      </h4>
                      <p className="text-3xl font-bold mt-2" style={{ color: colors.mainBlack }}>
                        ${bestComponent.product.price}
                      </p>
                    </div>

                    {bestComponent.reasons && bestComponent.reasons.length > 0 && (
                      <div className="mt-4">
                        <p className="font-semibold mb-3 text-center" style={{ color: colors.mainBlack }}>
                          Why we recommend this:
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {bestComponent.reasons.map((reason, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 px-4 py-2 rounded-full"
                              style={{ 
                                backgroundColor: colors.mainBeige,
                                border: `1px solid ${colors.platinum}`
                              }}
                            >
                              <FaCheckCircle size={16} style={{ color: colors.mainYellow }} />
                              <span style={{ color: colors.jet }}>{reason}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 text-center">
                      <p className="text-sm" style={{ color: colors.jet }}>
                        This recommendation is based on performance metrics, specifications, and value for money.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Add More Button */}
            {compareList.length < 4 && (
              <div className="p-4 text-center" style={{ backgroundColor: colors.mainBeige }}>
                <button
                  onClick={() => navigate(`/products/${category}?source=comparator`)}
                  className="px-6 py-2 rounded-lg font-semibold hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: colors.mainYellow, color: 'white' }}
                >
                  + Add More Products to Compare
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Comparator;
