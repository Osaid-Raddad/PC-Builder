/**
 * Performance Calculator Module
 * Calculates overall system performance and detects bottlenecks
 */

export class PerformanceCalculator {
  constructor() {
    this.performanceMetrics = {};
    this.bottlenecks = [];
  }

  /**
   * Calculate overall system performance
   * @param {Object} build - Object containing selected components
   * @returns {Object} - Performance metrics and bottleneck analysis
   */
  calculatePerformance(build) {
    this.performanceMetrics = {};
    this.bottlenecks = [];

    const { cpu, gpu, memory, storage, cpuCooler } = build;

    // Calculate individual component scores
    const cpuScore = this.calculateCPUScore(cpu);
    const gpuScore = this.calculateGPUScore(gpu);
    const memoryScore = this.calculateMemoryScore(memory);
    const storageScore = this.calculateStorageScore(storage);

    // Calculate overall system score (weighted average)
    const overallScore = this.calculateOverallScore(cpuScore, gpuScore, memoryScore, storageScore);

    // Detect bottlenecks
    this.detectBottlenecks(cpu, gpu, memory, cpuCooler);

    // Calculate use case ratings
    const useCaseRatings = this.calculateUseCaseRatings(cpu, gpu, memory);

    return {
      scores: {
        cpu: cpuScore,
        gpu: gpuScore,
        memory: memoryScore,
        storage: storageScore,
        overall: overallScore
      },
      ratings: useCaseRatings,
      bottlenecks: this.bottlenecks,
      recommendations: this.generateRecommendations(build)
    };
  }

  /**
   * Calculate CPU performance score
   */
  calculateCPUScore(cpu) {
    if (!cpu) return 0;

    // Use the performanceScore from the CPU data
    const baseScore = cpu.performanceScore || 0;

    // Normalize to 0-100 scale (assuming max performanceScore is around 15000)
    const normalizedScore = Math.min(100, (baseScore / 15000) * 100);

    return {
      raw: baseScore,
      normalized: Math.round(normalizedScore),
      rating: this.getRating(normalizedScore),
      details: {
        cores: cpu.cores,
        threads: cpu.threads,
        baseClock: cpu.clockSpeeds?.base,
        boostClock: cpu.clockSpeeds?.boost,
        tdp: cpu.tdpWatts
      }
    };
  }

  /**
   * Calculate GPU performance score
   */
  calculateGPUScore(gpu) {
    if (!gpu) return 0;

    // Use the performanceScore from the GPU data
    const baseScore = gpu.performanceScore || 0;

    // Normalize to 0-100 scale (assuming max performanceScore is around 17000)
    const normalizedScore = Math.min(100, (baseScore / 17000) * 100);

    return {
      raw: baseScore,
      normalized: Math.round(normalizedScore),
      rating: this.getRating(normalizedScore),
      details: {
        memory: gpu.memoryGB,
        memoryType: gpu.memoryType,
        tdp: gpu.tdpWatts
      }
    };
  }

  /**
   * Calculate Memory performance score
   */
  calculateMemoryScore(memory) {
    if (!memory) return 0;

    // Calculate score based on capacity, speed, and latency
    const capacityScore = Math.min(100, (memory.capacityGB / 64) * 50); // Max 50 points for capacity
    const speedScore = Math.min(100, (memory.speedMHz / 7000) * 40); // Max 40 points for speed
    const latencyScore = Math.min(100, (40 - memory.casLatency) * 2); // Lower latency = higher score, max 10 points

    const totalScore = capacityScore + speedScore + latencyScore;

    return {
      raw: Math.round(totalScore),
      normalized: Math.round(totalScore),
      rating: this.getRating(totalScore),
      details: {
        capacity: memory.capacityGB,
        speed: memory.speedMHz,
        type: memory.type,
        casLatency: memory.casLatency
      }
    };
  }

  /**
   * Calculate Storage performance score
   */
  calculateStorageScore(storage) {
    if (!storage) return 0;

    // Calculate score based on type, capacity, and speeds
    let typeMultiplier = 1;
    if (storage.type === 'NVMe SSD') typeMultiplier = 1.0;
    else if (storage.type === 'SATA SSD') typeMultiplier = 0.6;
    else if (storage.type === 'HDD') typeMultiplier = 0.3;

    const readScore = Math.min(100, (storage.readSpeedMBps / 7000) * 50) * typeMultiplier; // Max 50 points
    const writeScore = Math.min(100, (storage.writeSpeedMBps / 7000) * 50) * typeMultiplier; // Max 50 points

    const totalScore = readScore + writeScore;

    return {
      raw: Math.round(totalScore),
      normalized: Math.round(totalScore),
      rating: this.getRating(totalScore),
      details: {
        type: storage.type,
        capacity: storage.capacityGB,
        readSpeed: storage.readSpeedMBps,
        writeSpeed: storage.writeSpeedMBps
      }
    };
  }

  /**
   * Calculate weighted overall system score
   */
  calculateOverallScore(cpuScore, gpuScore, memoryScore, storageScore) {
    // Weights: CPU 30%, GPU 35%, Memory 20%, Storage 15%
    const weights = {
      cpu: 0.30,
      gpu: 0.35,
      memory: 0.20,
      storage: 0.15
    };

    const cpu = cpuScore?.normalized || 0;
    const gpu = gpuScore?.normalized || 0;
    const memory = memoryScore?.normalized || 0;
    const storage = storageScore?.normalized || 0;

    const weighted = (cpu * weights.cpu) + 
                     (gpu * weights.gpu) + 
                     (memory * weights.memory) + 
                     (storage * weights.storage);

    return {
      score: Math.round(weighted),
      rating: this.getRating(weighted),
      breakdown: {
        cpu: Math.round(cpu * weights.cpu),
        gpu: Math.round(gpu * weights.gpu),
        memory: Math.round(memory * weights.memory),
        storage: Math.round(storage * weights.storage)
      }
    };
  }

  /**
   * Detect bottlenecks in the system
   */
  detectBottlenecks(cpu, gpu, memory, cpuCooler) {
    if (!cpu || !gpu) return;

    const cpuPerf = cpu.performanceScore || 0;
    const gpuPerf = gpu.performanceScore || 0;

    // CPU bottleneck: GPU is significantly more powerful than CPU
    if (gpuPerf > cpuPerf * 1.5) {
      this.bottlenecks.push({
        type: 'cpu_bottleneck',
        severity: 'warning',
        message: `CPU may bottleneck GPU performance. Consider upgrading to a ${this.suggestBetterCPU(cpu, gpuPerf)}`,
        affectedComponents: ['cpu', 'gpu'],
        impact: 'Gaming and GPU-intensive tasks may not reach full potential'
      });
    }

    // GPU bottleneck: CPU is significantly more powerful than GPU
    if (cpuPerf > gpuPerf * 1.5) {
      this.bottlenecks.push({
        type: 'gpu_bottleneck',
        severity: 'info',
        message: `GPU may limit gaming performance. Consider upgrading to a ${this.suggestBetterGPU(gpu, cpuPerf)}`,
        affectedComponents: ['cpu', 'gpu'],
        impact: 'Gaming at higher resolutions/settings may be limited'
      });
    }

    // Memory bottleneck: Low capacity or slow speed for high-end CPU
    if (memory && cpuPerf > 10000) {
      if (memory.capacityGB < 32) {
        this.bottlenecks.push({
          type: 'memory_capacity',
          severity: 'warning',
          message: `Only ${memory.capacityGB}GB RAM with high-end CPU. Consider 32GB+ for optimal performance`,
          affectedComponents: ['memory', 'cpu'],
          impact: 'Multitasking and productivity may be limited'
        });
      }

      if (memory.speedMHz < 3200 && memory.type === 'DDR4') {
        this.bottlenecks.push({
          type: 'memory_speed',
          severity: 'info',
          message: `Memory speed ${memory.speedMHz}MHz may limit CPU performance. Consider 3600MHz+ DDR4`,
          affectedComponents: ['memory', 'cpu'],
          impact: 'CPU performance may not reach full potential'
        });
      }

      if (memory.speedMHz < 5200 && memory.type === 'DDR5') {
        this.bottlenecks.push({
          type: 'memory_speed',
          severity: 'info',
          message: `Memory speed ${memory.speedMHz}MHz is on the slower side for DDR5. Consider 6000MHz+`,
          affectedComponents: ['memory', 'cpu'],
          impact: 'CPU performance may not reach full potential'
        });
      }
    }

    // Cooling bottleneck: CPU cooler TDP rating is lower than CPU TDP
    if (cpuCooler && cpu) {
      if (cpuCooler.tdpRating < cpu.tdpWatts) {
        this.bottlenecks.push({
          type: 'cooling_insufficient',
          severity: 'critical',
          message: `CPU cooler TDP rating (${cpuCooler.tdpRating}W) is lower than CPU TDP (${cpu.tdpWatts}W)`,
          affectedComponents: ['cpuCooler', 'cpu'],
          impact: 'CPU may throttle under load due to insufficient cooling'
        });
      } else if (cpuCooler.tdpRating < cpu.tdpWatts * 1.2) {
        this.bottlenecks.push({
          type: 'cooling_marginal',
          severity: 'warning',
          message: `CPU cooler TDP rating (${cpuCooler.tdpRating}W) provides minimal headroom for CPU TDP (${cpu.tdpWatts}W)`,
          affectedComponents: ['cpuCooler', 'cpu'],
          impact: 'CPU temperatures may be high under sustained load'
        });
      }
    }
  }

  /**
   * Suggest a better CPU tier
   */
  suggestBetterCPU(currentCPU, targetPerf) {
    if (currentCPU.cores < 6) return 'mid-range 6-core CPU';
    if (currentCPU.cores < 8) return 'high-end 8-core CPU';
    if (currentCPU.cores < 12) return 'enthusiast 12+ core CPU';
    return 'higher-tier CPU with better single-core performance';
  }

  /**
   * Suggest a better GPU tier
   */
  suggestBetterGPU(currentGPU, targetPerf) {
    if (currentGPU.memoryGB < 8) return 'mid-range GPU with 8GB+ VRAM';
    if (currentGPU.memoryGB < 12) return 'high-end GPU with 12GB+ VRAM';
    return 'enthusiast-tier GPU (RTX 4080/4090 or AMD equivalent)';
  }

  /**
   * Calculate use case ratings
   */
  calculateUseCaseRatings(cpu, gpu, memory) {
    const cpuPerf = cpu?.performanceScore || 0;
    const gpuPerf = gpu?.performanceScore || 0;
    const memoryCapacity = memory?.capacityGB || 0;

    return {
      gaming: this.rateGaming(cpuPerf, gpuPerf),
      productivity: this.rateProductivity(cpuPerf, memoryCapacity),
      contentCreation: this.rateContentCreation(cpuPerf, gpuPerf, memoryCapacity),
      streaming: this.rateStreaming(cpuPerf, gpuPerf, memoryCapacity),
      workstation: this.rateWorkstation(cpuPerf, memoryCapacity)
    };
  }

  /**
   * Rate gaming performance
   */
  rateGaming(cpuPerf, gpuPerf) {
    const avgPerf = (cpuPerf * 0.3 + gpuPerf * 0.7) / 1.5; // GPU weighted more
    const normalized = Math.min(100, (avgPerf / 15000) * 100);
    
    return {
      score: Math.round(normalized),
      rating: this.getRating(normalized),
      description: this.getGamingDescription(normalized)
    };
  }

  /**
   * Rate productivity performance
   */
  rateProductivity(cpuPerf, memoryCapacity) {
    const cpuScore = Math.min(100, (cpuPerf / 15000) * 70);
    const memScore = Math.min(30, (memoryCapacity / 64) * 30);
    const total = cpuScore + memScore;
    
    return {
      score: Math.round(total),
      rating: this.getRating(total),
      description: this.getProductivityDescription(total)
    };
  }

  /**
   * Rate content creation performance
   */
  rateContentCreation(cpuPerf, gpuPerf, memoryCapacity) {
    const cpuScore = Math.min(40, (cpuPerf / 15000) * 40);
    const gpuScore = Math.min(40, (gpuPerf / 17000) * 40);
    const memScore = Math.min(20, (memoryCapacity / 64) * 20);
    const total = cpuScore + gpuScore + memScore;
    
    return {
      score: Math.round(total),
      rating: this.getRating(total),
      description: this.getContentCreationDescription(total)
    };
  }

  /**
   * Rate streaming performance
   */
  rateStreaming(cpuPerf, gpuPerf, memoryCapacity) {
    const cpuScore = Math.min(50, (cpuPerf / 15000) * 50); // CPU is key for encoding
    const gpuScore = Math.min(30, (gpuPerf / 17000) * 30);
    const memScore = Math.min(20, (memoryCapacity / 32) * 20);
    const total = cpuScore + gpuScore + memScore;
    
    return {
      score: Math.round(total),
      rating: this.getRating(total),
      description: this.getStreamingDescription(total)
    };
  }

  /**
   * Rate workstation performance
   */
  rateWorkstation(cpuPerf, memoryCapacity) {
    const cpuScore = Math.min(60, (cpuPerf / 15000) * 60);
    const memScore = Math.min(40, (memoryCapacity / 128) * 40);
    const total = cpuScore + memScore;
    
    return {
      score: Math.round(total),
      rating: this.getRating(total),
      description: this.getWorkstationDescription(total)
    };
  }

  /**
   * Get performance rating from score
   */
  getRating(score) {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Above Average';
    if (score >= 50) return 'Average';
    if (score >= 40) return 'Below Average';
    if (score >= 30) return 'Poor';
    return 'Very Poor';
  }

  /**
   * Get gaming description
   */
  getGamingDescription(score) {
    if (score >= 90) return '4K Ultra settings at high FPS';
    if (score >= 80) return '1440p Ultra settings with excellent FPS';
    if (score >= 70) return '1440p High settings with good FPS';
    if (score >= 60) return '1080p High/Ultra settings';
    if (score >= 50) return '1080p Medium/High settings';
    return '1080p Low/Medium settings';
  }

  /**
   * Get productivity description
   */
  getProductivityDescription(score) {
    if (score >= 80) return 'Excellent for heavy multitasking and professional work';
    if (score >= 70) return 'Very good for multitasking and productivity';
    if (score >= 60) return 'Good for standard office work and multitasking';
    if (score >= 50) return 'Adequate for basic productivity tasks';
    return 'Suitable for light productivity work';
  }

  /**
   * Get content creation description
   */
  getContentCreationDescription(score) {
    if (score >= 80) return 'Excellent for 4K video editing and 3D rendering';
    if (score >= 70) return 'Very good for video editing and photo work';
    if (score >= 60) return 'Good for photo editing and light video work';
    if (score >= 50) return 'Adequate for basic content creation';
    return 'Suitable for casual content creation';
  }

  /**
   * Get streaming description
   */
  getStreamingDescription(score) {
    if (score >= 80) return 'Excellent for streaming at 1080p60 or higher';
    if (score >= 70) return 'Very good for 1080p60 streaming';
    if (score >= 60) return 'Good for 1080p30-60 streaming';
    if (score >= 50) return 'Adequate for 720p60 streaming';
    return 'Suitable for basic streaming';
  }

  /**
   * Get workstation description
   */
  getWorkstationDescription(score) {
    if (score >= 80) return 'Excellent for professional workstation tasks';
    if (score >= 70) return 'Very good for development and CAD work';
    if (score >= 60) return 'Good for software development';
    if (score >= 50) return 'Adequate for light professional work';
    return 'Suitable for basic professional tasks';
  }

  /**
   * Generate recommendations based on the build
   */
  generateRecommendations(build) {
    const recommendations = [];
    const { cpu, gpu, memory, storage, psu } = build;

    // Check for balanced build
    if (cpu && gpu) {
      const cpuPerf = cpu.performanceScore || 0;
      const gpuPerf = gpu.performanceScore || 0;
      const perfDiff = Math.abs(cpuPerf - gpuPerf);
      
      if (perfDiff < 3000) {
        recommendations.push({
          type: 'positive',
          message: 'Well-balanced CPU and GPU pairing for gaming and general use'
        });
      }
    }

    // Memory recommendations
    if (memory && cpu) {
      const cpuPerf = cpu.performanceScore || 0;
      if (cpuPerf > 10000 && memory.capacityGB >= 32) {
        recommendations.push({
          type: 'positive',
          message: 'Excellent memory capacity for high-end system'
        });
      }
    }

    // PSU headroom
    if (psu && cpu && gpu) {
      const totalTDP = (cpu.tdpWatts || 0) + (gpu.tdpWatts || 0) + 100;
      const headroom = ((psu.wattage - totalTDP) / psu.wattage) * 100;
      
      if (headroom >= 30) {
        recommendations.push({
          type: 'positive',
          message: `PSU has ${Math.round(headroom)}% power headroom for future upgrades`
        });
      }
    }

    // Storage recommendations
    if (storage && storage.type === 'NVMe SSD') {
      recommendations.push({
        type: 'positive',
        message: 'Fast NVMe storage for quick boot times and application loading'
      });
    }

    return recommendations;
  }
}

export default PerformanceCalculator;
