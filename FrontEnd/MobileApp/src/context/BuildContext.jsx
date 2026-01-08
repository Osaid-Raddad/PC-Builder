import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BuildContext = createContext();

export const useBuild = () => {
  const context = useContext(BuildContext);
  if (!context) {
    throw new Error('useBuild must be used within a BuildProvider');
  }
  return context;
};

export const BuildProvider = ({ children }) => {
  const [selectedComponents, setSelectedComponents] = useState({
    cpu: null,
    cooler: null,
    motherboard: null,
    memory: null,
    storage: null,
    gpu: null,
    case: null,
    psu: null,
    monitor: null,
    expansion: null,
    peripherals: null,
    accessories: null
  });

  const [isLoading, setIsLoading] = useState(true);

  // Load saved build from AsyncStorage on mount
  useEffect(() => {
    const loadBuild = async () => {
      try {
        const savedBuild = await AsyncStorage.getItem('pcBuild');
        if (savedBuild) {
          setSelectedComponents(JSON.parse(savedBuild));
        }
      } catch (error) {
        console.error('Error loading build:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBuild();
  }, []);

  // Save build to AsyncStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      const saveBuild = async () => {
        try {
          await AsyncStorage.setItem('pcBuild', JSON.stringify(selectedComponents));
        } catch (error) {
          console.error('Error saving build:', error);
        }
      };

      saveBuild();
    }
  }, [selectedComponents, isLoading]);

  const addComponent = (componentType, component) => {
    setSelectedComponents(prev => ({
      ...prev,
      [componentType]: component
    }));
  };

  const removeComponent = (componentType) => {
    setSelectedComponents(prev => ({
      ...prev,
      [componentType]: null
    }));
  };

  const clearBuild = async () => {
    const emptyBuild = {
      cpu: null,
      cooler: null,
      motherboard: null,
      memory: null,
      storage: null,
      gpu: null,
      case: null,
      psu: null,
      monitor: null,
      expansion: null,
      peripherals: null,
      accessories: null
    };
    setSelectedComponents(emptyBuild);
    try {
      await AsyncStorage.removeItem('pcBuild');
    } catch (error) {
      console.error('Error clearing build:', error);
    }
  };

  const calculateTotalPrice = () => {
    let total = 0;
    Object.values(selectedComponents).forEach(component => {
      if (component) {
        // Handle different price property names
        const price = component.price || component.priceUsd || component.priceValue || 0;
        total += typeof price === 'number' ? price : parseFloat(price) || 0;
      }
    });
    return total;
  };

  const calculateTotalPower = () => {
    let totalPower = 0;
    
    // CPU TDP
    if (selectedComponents.cpu) {
      totalPower += selectedComponents.cpu.tdpWatts || selectedComponents.cpu.tdp || 65;
    }
    
    // GPU TDP
    if (selectedComponents.gpu) {
      totalPower += selectedComponents.gpu.tdpWatts || selectedComponents.gpu.tdp || 150;
    }
    
    // Motherboard (estimated)
    if (selectedComponents.motherboard) {
      totalPower += 50;
    }
    
    // Memory (estimated ~3W per module)
    if (selectedComponents.memory) {
      const modules = selectedComponents.memory.modules || 2;
      const moduleCount = typeof modules === 'number' ? modules : 
                         typeof modules === 'string' ? parseInt(modules.split('x')[0]) : 2;
      totalPower += moduleCount * 3;
    }
    
    // Storage (estimated ~5W per drive)
    if (selectedComponents.storage) {
      totalPower += 5;
    }
    
    // CPU Cooler
    if (selectedComponents.cooler) {
      totalPower += selectedComponents.cooler.fanRPM ? 10 : 5;
    }
    
    // Case fans (estimated ~30W total)
    if (selectedComponents.case) {
      totalPower += 30;
    }
    
    return totalPower;
  };

  const checkCompatibility = () => {
    const issues = [];
    const warnings = [];
    
    const cpu = selectedComponents.cpu;
    const motherboard = selectedComponents.motherboard;
    const memory = selectedComponents.memory;
    const gpu = selectedComponents.gpu;
    const psu = selectedComponents.psu;
    const caseComponent = selectedComponents.case;
    const cooler = selectedComponents.cooler;
    
    // CPU and Motherboard Socket Compatibility
    if (cpu && motherboard) {
      if (cpu.socket !== motherboard.socket) {
        issues.push({
          type: 'critical',
          message: `CPU socket (${cpu.socket}) doesn't match motherboard socket (${motherboard.socket})`,
          components: ['cpu', 'motherboard']
        });
      }
    }
    
    // Memory and Motherboard Compatibility
    if (memory && motherboard) {
      // Check memory type (DDR4/DDR5)
      if (memory.type && motherboard.memoryType && memory.type !== motherboard.memoryType) {
        issues.push({
          type: 'critical',
          message: `Memory type (${memory.type}) not supported by motherboard (${motherboard.memoryType})`,
          components: ['memory', 'motherboard']
        });
      }
      
      // Check memory speed
      if (memory.speed && motherboard.memoryMax) {
        const memorySpeed = parseInt(memory.speed.replace(/\D/g, ''));
        const motherboardMaxSpeed = parseInt(motherboard.memoryMax.replace(/\D/g, ''));
        
        if (memorySpeed > motherboardMaxSpeed) {
          warnings.push({
            type: 'warning',
            message: `Memory speed (${memory.speed}) exceeds motherboard max (${motherboard.memoryMax}). Will run at reduced speed.`,
            components: ['memory', 'motherboard']
          });
        }
      }
    }
    
    // Motherboard Form Factor and Case Compatibility
    if (motherboard && caseComponent) {
      const moboFormFactor = motherboard.formFactor;
      const caseFormFactors = caseComponent.motherboardFormFactor || [];
      
      if (moboFormFactor && caseFormFactors.length > 0 && !caseFormFactors.includes(moboFormFactor)) {
        issues.push({
          type: 'critical',
          message: `Motherboard form factor (${moboFormFactor}) not supported by case`,
          components: ['motherboard', 'case']
        });
      }
    }
    
    // GPU Length and Case Compatibility
    if (gpu && caseComponent) {
      const gpuLength = gpu.length || gpu.maximumLength;
      const caseMaxGpuLength = caseComponent.maximumVideoCardLength;
      
      if (gpuLength && caseMaxGpuLength && gpuLength > caseMaxGpuLength) {
        issues.push({
          type: 'critical',
          message: `GPU length (${gpuLength}mm) exceeds case maximum (${caseMaxGpuLength}mm)`,
          components: ['gpu', 'case']
        });
      }
    }
    
    // Power Supply Wattage Check
    if (psu) {
      const totalPower = calculateTotalPower();
      const psuWattage = psu.wattage || psu.wattageW || 0;
      const recommendedWattage = totalPower * 1.3; // 30% headroom recommended
      
      if (psuWattage < totalPower) {
        issues.push({
          type: 'critical',
          message: `PSU wattage (${psuWattage}W) insufficient for system (needs ${totalPower}W minimum)`,
          components: ['psu']
        });
      } else if (psuWattage < recommendedWattage) {
        warnings.push({
          type: 'warning',
          message: `PSU wattage (${psuWattage}W) may be tight. Recommended: ${Math.round(recommendedWattage)}W for 30% headroom`,
          components: ['psu']
        });
      }
    }
    
    // CPU Cooler Clearance
    if (cooler && caseComponent) {
      const coolerHeight = cooler.height;
      const caseMaxCoolerHeight = caseComponent.maximumCpuCoolerHeight;
      
      if (coolerHeight && caseMaxCoolerHeight && coolerHeight > caseMaxCoolerHeight) {
        issues.push({
          type: 'critical',
          message: `CPU cooler height (${coolerHeight}mm) exceeds case maximum (${caseMaxCoolerHeight}mm)`,
          components: ['cooler', 'case']
        });
      }
    }
    
    // CPU Cooler and CPU TDP Compatibility
    if (cooler && cpu) {
      const cpuTdp = cpu.tdpWatts || cpu.tdp || 0;
      const coolerTdp = cooler.tdpRating || cooler.tdp || 0;
      
      if (cpuTdp && coolerTdp && cpuTdp > coolerTdp) {
        warnings.push({
          type: 'warning',
          message: `CPU TDP (${cpuTdp}W) may exceed cooler capacity (${coolerTdp}W). Consider a more powerful cooler.`,
          components: ['cpu', 'cooler']
        });
      }
    }
    
    return {
      issues,
      warnings,
      isCompatible: issues.length === 0,
      hasWarnings: warnings.length > 0
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
    getPerformanceScore,
    isLoading
  };

  return (
    <BuildContext.Provider value={value}>
      {children}
    </BuildContext.Provider>
  );
};

export default BuildContext;
