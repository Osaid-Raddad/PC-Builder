import React, { createContext, useContext, useState, useEffect } from 'react';
import { CompatibilityChecker } from '../utils/compatibilityChecker';

const BuildContext = createContext();

export const useBuild = () => {
  const context = useContext(BuildContext);
  if (!context) {
    throw new Error('useBuild must be used within a BuildProvider');
  }
  return context;
};

export const BuildProvider = ({ children }) => {
  // Load from localStorage on init
  const [selectedComponents, setSelectedComponents] = useState(() => {
    try {
      const saved = localStorage.getItem('pcBuild');
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error('Error loading build from localStorage:', error);
      return {};
    }
  });

  // Save to localStorage whenever components change
  useEffect(() => {
    try {
      localStorage.setItem('pcBuild', JSON.stringify(selectedComponents));
    } catch (error) {
      console.error('Error saving build to localStorage:', error);
    }
  }, [selectedComponents]);

  const addComponent = (componentType, component) => {
    try {
      setSelectedComponents(prev => ({
        ...prev,
        [componentType]: component
      }));
    } catch (error) {
      console.error('Error adding component:', error);
    }
  };

  const removeComponent = (componentType) => {
    setSelectedComponents(prev => {
      const newComponents = { ...prev };
      delete newComponents[componentType];
      return newComponents;
    });
  };

  const clearBuild = () => {
    setSelectedComponents({});
    localStorage.removeItem('pcBuild');
  };

  const calculateTotalPrice = () => {
    return Object.values(selectedComponents).reduce((total, component) => {
      return total + (component.price || 0);
    }, 0);
  };

  const calculateTotalPower = () => {
    let totalPower = 0;
    
    // CPU TDP
    if (selectedComponents.cpu) {
      totalPower += selectedComponents.cpu.tdpWatts || selectedComponents.cpu.powerConsumptionWatts || 0;
    }
    
    // GPU TDP
    if (selectedComponents.gpu) {
      totalPower += selectedComponents.gpu.tdpWatts || selectedComponents.gpu.powerConsumptionWatts || 0;
    }
    
    // Motherboard
    if (selectedComponents.motherboard) {
      totalPower += selectedComponents.motherboard.powerConsumptionWatts || 50;
    }
    
    // RAM (per module)
    if (selectedComponents.memory) {
      const modules = selectedComponents.memory.modules || 2;
      const powerPerModule = selectedComponents.memory.powerConsumptionWatts || 4;
      totalPower += modules * powerPerModule;
    }
    
    // Storage
    if (selectedComponents.storage) {
      totalPower += selectedComponents.storage.powerConsumptionWatts || 5;
    }
    
    // CPU Cooler (fans)
    if (selectedComponents.cooler) {
      totalPower += selectedComponents.cooler.powerConsumptionWatts || 10;
    }
    
    // Case fans
    if (selectedComponents.case) {
      totalPower += selectedComponents.case.powerConsumptionWatts || 20;
    }
    
    // Monitor (if included in build)
    if (selectedComponents.monitor) {
      totalPower += selectedComponents.monitor.powerConsumptionWatts || 0;
    }
    
    // Expansion cards
    if (selectedComponents.expansion) {
      totalPower += selectedComponents.expansion.powerConsumptionWatts || 15;
    }
    
    // Additional overhead (USB devices, RGB controllers, etc.)
    totalPower += 20;
    
    return Math.round(totalPower);
  };

  const checkCompatibility = () => {
    // Use the comprehensive CompatibilityChecker class
    const checker = new CompatibilityChecker();
    
    // Build the component object for the checker
    const build = {
      cpu: selectedComponents.cpu,
      motherboard: selectedComponents.motherboard,
      gpu: selectedComponents.gpu,
      memory: selectedComponents.memory,
      storage: selectedComponents.storage,
      psu: selectedComponents.psu,
      case: selectedComponents.case,
      cpuCooler: selectedComponents.cooler
    };
    
    // Debug logging
    console.log('🔍 Build Context - Selected Components:', selectedComponents);
    console.log('🔍 Build object for checker:', build);
    
    // Run the comprehensive compatibility check
    const result = checker.checkBuild(build);
    
    return {
      issues: result.issues,
      warnings: result.warnings,
      isCompatible: result.isCompatible,
      hasWarnings: result.warnings.length > 0
    };
  };

  const getPerformanceScore = () => {
    let score = 0;
    let maxScore = 0;
    
    // CPU Performance (weight: 30%)
    if (selectedComponents.cpu) {
      const cpu = selectedComponents.cpu;
      const clockSpeed = cpu.boostClockGHz || cpu.performanceCoreClock || cpu.baseClockGHz || 3;
      const coreCount = cpu.cores || cpu.coreCount || 4;
      const cpuScore = clockSpeed * coreCount / 10;
      score += Math.min(cpuScore, 30);
      maxScore += 30;
    }
    
    // GPU Performance (weight: 40%)
    if (selectedComponents.gpu) {
      const gpu = selectedComponents.gpu;
      const gpuClock = gpu.boostClockMHz || gpu.coreClock || 1500;
      const gpuScore = gpuClock / 50;
      score += Math.min(gpuScore, 40);
      maxScore += 40;
    }
    
    // Memory Performance (weight: 15%)
    if (selectedComponents.memory) {
      const memory = selectedComponents.memory;
      const memSpeed = memory.speedMHz || parseInt(memory.speed?.replace?.(/\D/g, '') || '3200');
      const moduleCount = typeof memory.modules === 'number' ? memory.modules : 
                         typeof memory.modules === 'string' ? parseInt(memory.modules.split('x')[0]) : 2;
      const memScore = (memSpeed / 200) * moduleCount / 10;
      score += Math.min(memScore, 15);
      maxScore += 15;
    }
    
    // Storage Performance (weight: 10%)
    if (selectedComponents.storage) {
      const storage = selectedComponents.storage;
      const storageScore = storage.interface?.includes('NVMe') || storage.type?.includes('NVMe') ? 10 : 5;
      score += storageScore;
      maxScore += 10;
    }
    
    // Cooling (weight: 5%)
    if (selectedComponents.cooler) {
      score += 5;
      maxScore += 5;
    }
    
    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
    
    return {
      score: Math.round(percentage),
      category: percentage >= 90 ? 'Extreme' : 
                percentage >= 75 ? 'High-End' :
                percentage >= 60 ? 'Mid-Range' :
                percentage >= 40 ? 'Budget' : 'Entry-Level'
    };
  };

  const value = {
    selectedComponents,
    addComponent,
    removeComponent,
    clearBuild,
    calculateTotalPrice,
    calculateTotalPower,
    checkCompatibility,
    getPerformanceScore
  };

  return (
    <BuildContext.Provider value={value}>
      {children}
    </BuildContext.Provider>
  );
};
