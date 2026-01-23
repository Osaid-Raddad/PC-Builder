/**
 * Compatibility Checker Module
 * Validates component compatibility for PC builds
 */

export class CompatibilityChecker {
  constructor() {
    this.issues = [];
    this.warnings = [];
  }

  /**
   * Check compatibility between all selected components
   * @param {Object} build - Object containing selected components
   * @returns {Object} - Compatibility results with issues and warnings
   */
  checkBuild(build) {
    this.issues = [];
    this.warnings = [];

    const { cpu, motherboard, gpu, memory, storage, psu, case: pcCase, cpuCooler } = build;

    // Check CPU and Motherboard socket compatibility
    if (cpu && motherboard) {
      this.checkCPUMotherboardCompatibility(cpu, motherboard);
    }

    // Check CPU and GPU bottleneck compatibility
    if (cpu && gpu) {
      this.checkCPUGPUCompatibility(cpu, gpu);
    }

    // Check RAM and Motherboard compatibility
    if (memory && motherboard) {
      this.checkMemoryMotherboardCompatibility(memory, motherboard);
    }

    // Check GPU and Case clearance
    if (gpu && pcCase) {
      this.checkGPUCaseCompatibility(gpu, pcCase);
    }

    // Check CPU Cooler and Case clearance
    if (cpuCooler && pcCase) {
      this.checkCoolerCaseCompatibility(cpuCooler, pcCase);
    }

    // Check CPU Cooler and Motherboard socket
    if (cpuCooler && motherboard) {
      this.checkCoolerMotherboardCompatibility(cpuCooler, motherboard);
    }

    // Check CPU Cooler and CPU TDP compatibility
    if (cpuCooler && cpu) {
      this.checkCoolerCPUCompatibility(cpuCooler, cpu);
    }

    // Check GPU and Motherboard PCIe slot compatibility
    if (gpu && motherboard) {
      this.checkGPUMotherboardCompatibility(gpu, motherboard);
    }

    // Check Storage and Motherboard compatibility
    if (storage && motherboard) {
      this.checkStorageMotherboardCompatibility(storage, motherboard);
    }

    // Check RAM count with motherboard slots
    if (memory && motherboard) {
      this.checkMemorySlotCompatibility(memory, motherboard);
    }

    // Check PSU wattage
    if (psu && cpu && gpu) {
      this.checkPowerSupplyWattage(psu, cpu, gpu, build);
    }

    // Check motherboard form factor and case compatibility
    if (motherboard && pcCase) {
      this.checkMotherboardCaseCompatibility(motherboard, pcCase);
    }

    // Check PSU form factor and case compatibility
    if (psu && pcCase) {
      this.checkPSUCaseCompatibility(psu, pcCase);
    }

    return {
      isCompatible: this.issues.length === 0,
      issues: this.issues,
      warnings: this.warnings
    };
  }

  /**
   * Check CPU and Motherboard socket compatibility
   */
  checkCPUMotherboardCompatibility(cpu, motherboard) {
    const cpuName = `${cpu.brand} ${cpu.model}`;
    const moboName = `${motherboard.brand} ${motherboard.model}`;

    if (cpu.socket !== motherboard.socket) {
      this.issues.push({
        type: 'socket_mismatch',
        severity: 'critical',
        message: `CPU socket mismatch: ${cpuName} uses ${cpu.socket} socket but ${moboName} has ${motherboard.socket} socket. These are physically incompatible - the CPU will not fit.`,
        details: {
          reason: 'CPU and Motherboard socket incompatibility',
          cpuSocket: cpu.socket,
          motherboardSocket: motherboard.socket,
          impact: 'CPU cannot be installed - physical incompatibility',
          recommendation: `Choose a motherboard with ${cpu.socket} socket or a CPU with ${motherboard.socket} socket`
        },
        components: ['cpu', 'motherboard']
      });
    }

    // Check chipset compatibility warnings (Intel/AMD specific)
    if (cpu.brand === 'Intel' && motherboard.chipset) {
      // Intel 12th/13th/14th gen (LGA1700) chipset recommendations
      if (cpu.socket === 'LGA1700') {
        if (cpu.series?.includes('i9') || cpu.series?.includes('i7')) {
          if (!motherboard.chipset.includes('Z') && !motherboard.chipset.includes('H670') && !motherboard.chipset.includes('B760')) {
            this.warnings.push({
              type: 'chipset_limitation',
              severity: 'warning',
              message: `High-performance ${cpuName} on ${motherboard.chipset} chipset. Consider Z690/Z790 chipset for full overclocking support and features.`,
              details: {
                reason: 'Chipset may limit CPU features',
                recommendation: 'Z-series chipsets offer better VRMs, overclocking, and PCIe lanes for high-end CPUs'
              },
              components: ['cpu', 'motherboard']
            });
          }
        }
      }
    }

    // AMD Ryzen chipset recommendations
    if (cpu.brand === 'AMD' && motherboard.chipset) {
      if (cpu.socket === 'AM5') {
        if (cpu.series?.includes('Ryzen 9') || cpu.series?.includes('Ryzen 7')) {
          if (!motherboard.chipset.includes('X') && !motherboard.chipset.includes('B650')) {
            this.warnings.push({
              type: 'chipset_limitation',
              severity: 'warning',
              message: `High-performance ${cpuName} on ${motherboard.chipset} chipset. Consider X670/B650 for better VRM and features.`,
              details: {
                reason: 'Entry-level chipset may limit high-end CPU performance',
                recommendation: 'X670 or B650 chipsets provide better power delivery and PCIe Gen 5 support'
              },
              components: ['cpu', 'motherboard']
            });
          }
        }
      }
    }
  }

  /**
   * Check CPU and GPU compatibility (bottleneck detection)
   */
  checkCPUGPUCompatibility(cpu, gpu) {
    // Check for extreme performance mismatches
    const cpuScore = cpu.performanceScore || 0;
    const gpuPrice = gpu.price || 0;
    const cpuName = `${cpu.brand} ${cpu.model}`;
    const gpuName = `${gpu.manufacturer} ${gpu.model}`;
    
    // Calculate the performance gap ratio
    // Using GPU price as proxy for GPU tier (rough estimate)
    const gpuTierScore = gpuPrice / 100; // e.g., $1500 GPU = 15 tier score
    const cpuTierScore = cpuScore / 1000; // e.g., 10000 score = 10 tier score
    const imbalanceRatio = Math.abs(gpuTierScore - cpuTierScore);
    
    // Detect bottlenecks based on performance score vs GPU tier
    // Ultra High-end GPUs ($1500+) need very strong CPUs (10000+ performance score)
    if (gpuPrice >= 1500 && cpuScore < 10000) {
      const perfDeficit = ((10000 - cpuScore) / 10000 * 100).toFixed(0);
      this.issues.push({
        type: 'severe_cpu_bottleneck',
        severity: 'critical',
        message: `SEVERE BOTTLENECK: Your ${cpuName} (Performance Score: ${cpuScore}) will significantly bottleneck the ${gpuName} ($${gpuPrice}). This ultra high-end GPU requires a CPU with 10,000+ performance score. Current CPU is ${perfDeficit}% below recommended performance. You will lose 30-50% of GPU potential in CPU-intensive games and applications.`,
        details: {
          reason: 'Extreme CPU-GPU performance mismatch',
          cpuPerformance: cpuScore,
          requiredCPUPerformance: 10000,
          gpuTier: 'Ultra High-End',
          expectedBottleneck: '30-50%',
          recommendation: 'Upgrade to Intel Core i9-14900K, AMD Ryzen 9 7950X3D, or equivalent'
        },
        components: ['cpu', 'gpu']
      });
    }
    // High-end GPUs ($1000-$1499) need strong CPUs (8000+ performance score)
    else if (gpuPrice >= 1000 && cpuScore < 8000) {
      const perfDeficit = ((8000 - cpuScore) / 8000 * 100).toFixed(0);
      this.issues.push({
        type: 'major_cpu_bottleneck',
        severity: 'critical',
        message: `MAJOR BOTTLENECK: Your ${cpuName} (Performance Score: ${cpuScore}) will bottleneck the ${gpuName} ($${gpuPrice}). This high-end GPU requires a CPU with 8,000+ performance score. Current CPU is ${perfDeficit}% below recommended performance. Expect 20-40% performance loss in demanding games at 1080p/1440p resolutions.`,
        details: {
          reason: 'Significant CPU-GPU performance mismatch',
          cpuPerformance: cpuScore,
          requiredCPUPerformance: 8000,
          gpuTier: 'High-End',
          expectedBottleneck: '20-40%',
          recommendation: 'Upgrade to Intel Core i7-14700K, AMD Ryzen 7 7800X3D, or better'
        },
        components: ['cpu', 'gpu']
      });
    }
    // Mid-High GPUs ($700-$999) need decent CPUs (6500+ performance score)
    else if (gpuPrice >= 700 && cpuScore < 6500) {
      const perfDeficit = ((6500 - cpuScore) / 6500 * 100).toFixed(0);
      this.warnings.push({
        type: 'moderate_cpu_bottleneck',
        severity: 'warning',
        message: `MODERATE BOTTLENECK: Your ${cpuName} (Performance Score: ${cpuScore}) may bottleneck the ${gpuName} ($${gpuPrice}) in CPU-intensive scenarios. Recommended CPU performance: 6,500+. Current CPU is ${perfDeficit}% below optimal. You may see 10-25% performance reduction in CPU-heavy games (strategy, simulation, competitive shooters at high FPS).`,
        details: {
          reason: 'CPU-GPU performance imbalance',
          cpuPerformance: cpuScore,
          recommendedCPUPerformance: 6500,
          gpuTier: 'Mid-High Range',
          expectedBottleneck: '10-25%',
          recommendation: 'Consider Intel Core i5-14600K or AMD Ryzen 5 7600X'
        },
        components: ['cpu', 'gpu']
      });
    }
    // Mid-range GPUs ($500-$699) need decent CPUs (6000+ performance score)
    else if (gpuPrice >= 500 && cpuScore < 6000) {
      this.warnings.push({
        type: 'mild_cpu_bottleneck',
        severity: 'warning',
        message: `MILD BOTTLENECK: Your ${cpuName} (Performance Score: ${cpuScore}) may limit ${gpuName} performance in demanding CPU-bound scenarios. Recommended minimum: 6,000 performance score. Bottleneck expected: 5-15% in CPU-intensive titles and high refresh rate gaming (144Hz+).`,
        details: {
          reason: 'Slight CPU performance concern',
          cpuPerformance: cpuScore,
          recommendedCPUPerformance: 6000,
          gpuTier: 'Mid-Range',
          expectedBottleneck: '5-15%',
          recommendation: 'Acceptable for 1080p/1440p gaming, but consider CPU upgrade for competitive gaming'
        },
        components: ['cpu', 'gpu']
      });
    }
    
    // Check for overkill CPU with weak GPU (budget imbalance) - CRITICAL for severe cases
    if (cpuScore > 12000 && gpuPrice < 250) {
      this.issues.push({
        type: 'severe_gpu_underpowered',
        severity: 'critical',
        message: `SEVERE IMBALANCE: Premium ${cpuName} (Performance Score: ${cpuScore}) paired with budget ${gpuName} ($${gpuPrice}). This is a massive budget imbalance - you're spending premium money on CPU while severely limiting graphics performance. For gaming/graphics work, this build will perform similar to a system 1/3 the price. The GPU will be the primary bottleneck in all graphics applications.`,
        details: {
          reason: 'Extreme budget allocation problem - overspending on CPU',
          cpuTier: 'Premium/Enthusiast',
          gpuTier: 'Entry-Level',
          performanceImpact: 'GPU bottleneck in 100% of graphics workloads',
          recommendation: 'Reallocate budget: downgrade to $300-400 CPU and upgrade to $600-800 GPU for vastly better gaming/graphics performance'
        },
        components: ['cpu', 'gpu']
      });
    }
    else if (cpuScore > 10000 && gpuPrice < 400) {
      this.warnings.push({
        type: 'gpu_underpowered',
        severity: 'warning',
        message: `BUDGET IMBALANCE: High-end ${cpuName} (Performance Score: ${cpuScore}) paired with entry-mid level ${gpuName} ($${gpuPrice}). For gaming/graphics workloads, consider reallocating budget toward a stronger GPU. This CPU can handle GPUs up to $1000+. Current GPU will limit performance in all modern games and 3D applications.`,
        details: {
          reason: 'Suboptimal budget allocation',
          cpuTier: 'High-End',
          gpuTier: 'Entry-Mid Level',
          recommendation: 'Balance budget: consider $500-700 GPU with this CPU tier for optimal gaming performance'
        },
        components: ['cpu', 'gpu']
      });
    }
    
    // Check for very weak CPU with mid-range GPU
    if (cpuScore < 5000 && gpuPrice >= 400) {
      this.issues.push({
        type: 'weak_cpu_critical',
        severity: 'critical',
        message: `CRITICAL: Your ${cpuName} (Performance Score: ${cpuScore}) is too weak for general modern gaming and will severely bottleneck the ${gpuName}. Minimum recommended CPU performance for this GPU: 5,000+. This CPU will struggle to maintain stable frame times and may cause stuttering even with a capable GPU. Not recommended for gaming or demanding applications.`,
        details: {
          reason: 'CPU below minimum modern gaming requirements',
          cpuPerformance: cpuScore,
          minimumRequired: 5000,
          impact: 'Severe stuttering, unstable frame times, poor 1% lows',
          recommendation: 'CPU upgrade is essential - consider at least a mid-range modern processor'
        },
        components: ['cpu', 'gpu']
      });
    }
  }

  /**
   * Check Memory and Motherboard RAM type compatibility
   */
  checkMemoryMotherboardCompatibility(memory, motherboard) {
    const memoryName = `${memory.brand} ${memory.model}`;
    const moboName = `${motherboard.brand} ${motherboard.model}`;

    // Check RAM type (DDR4 vs DDR5)
    if (memory.type !== motherboard.ramType) {
      this.issues.push({
        type: 'ram_type_mismatch',
        severity: 'critical',
        message: `Memory type incompatibility: ${memoryName} is ${memory.type} but ${moboName} requires ${motherboard.ramType}. These are physically incompatible - different notch positions.`,
        details: {
          reason: 'RAM generation mismatch',
          memoryType: memory.type,
          motherboardType: motherboard.ramType,
          impact: 'RAM modules will not physically fit in motherboard slots',
          recommendation: `Use ${motherboard.ramType} memory modules with this motherboard`
        },
        components: ['memory', 'motherboard']
      });
    }

    // Check if total RAM capacity exceeds motherboard max
    const totalMemoryGB = memory.capacityGB || 0;
    if (totalMemoryGB > motherboard.maxRamGB) {
      this.issues.push({
        type: 'ram_capacity_exceeded',
        severity: 'critical',
        message: `Total memory ${totalMemoryGB}GB exceeds motherboard maximum capacity of ${motherboard.maxRamGB}GB. System may not boot or RAM will run at reduced capacity.`,
        details: {
          reason: 'Motherboard memory controller limitation',
          totalMemory: totalMemoryGB,
          motherboardMax: motherboard.maxRamGB,
          impact: 'Excess memory will not be recognized or system may fail to POST',
          recommendation: `Use maximum ${motherboard.maxRamGB}GB RAM or upgrade to a motherboard with higher capacity support`
        },
        components: ['memory', 'motherboard']
      });
    }

    // Check if memory speed is very high (might need BIOS tweaking or XMP/EXPO)
    if (memory.speedMHz > 6000) {
      this.warnings.push({
        type: 'high_memory_speed',
        severity: 'warning',
        message: `Very high memory speed: ${memory.speedMHz}MHz requires XMP/EXPO profile configuration in BIOS. May need manual tuning for stability.`,
        details: {
          reason: 'High-speed RAM requires profile activation',
          memorySpeed: memory.speedMHz,
          recommendation: 'Enable XMP (Intel) or EXPO (AMD) profile in BIOS. May require voltage adjustments for stability.'
        },
        components: ['memory', 'motherboard']
      });
    }

    // Check memory speed compatibility with CPU (DDR5 specific)
    if (memory.type === 'DDR5' && memory.speedMHz > 5600) {
      this.warnings.push({
        type: 'memory_speed_stability',
        severity: 'warning',
        message: `DDR5 speeds above 5600MHz may require CPU with strong memory controller. Test for stability.`,
        details: {
          reason: 'Very high DDR5 speeds stress CPU memory controller',
          recommendation: 'High-end CPUs (i7/i9, Ryzen 7/9) recommended for DDR5-6000+ speeds'
        },
        components: ['memory', 'cpu', 'motherboard']
      });
    }
  }

  /**
   * Check Memory slot compatibility
   */
  checkMemorySlotCompatibility(memory, motherboard) {
    const modules = memory.modules || 2;
    const availableSlots = motherboard.ramSlots || 4;

    if (modules > availableSlots) {
      this.issues.push({
        type: 'insufficient_ram_slots',
        severity: 'critical',
        message: `Memory configuration requires ${modules} slots but motherboard only has ${availableSlots} RAM slots available.`,
        details: {
          reason: 'Not enough physical RAM slots',
          requiredSlots: modules,
          availableSlots: availableSlots,
          impact: 'Cannot install all memory modules',
          recommendation: `Use ${availableSlots} modules or fewer, or choose a motherboard with more RAM slots`
        },
        components: ['memory', 'motherboard']
      });
    }

    // Warning for single-channel configuration
    if (modules === 1 && availableSlots >= 2) {
      this.warnings.push({
        type: 'single_channel_memory',
        severity: 'warning',
        message: `Single memory module detected. Using 2 modules in dual-channel will significantly improve performance (15-30% in many applications).`,
        details: {
          reason: 'Sub-optimal memory configuration',
          currentConfig: 'Single-channel',
          recommendation: 'Install memory in pairs (2 or 4 modules) for dual-channel operation. Significant performance benefit for gaming and productivity.'
        },
        components: ['memory', 'motherboard']
      });
    }

    // Recommendation for optimal slot population
    if (modules === 2 && availableSlots === 4) {
      this.warnings.push({
        type: 'memory_slot_config',
        severity: 'warning',
        message: `Install 2 RAM sticks in slots A2 and B2 (usually 2nd and 4th slots) for optimal dual-channel performance. Check motherboard manual.`,
        details: {
          reason: 'Slot placement affects memory performance',
          recommendation: 'Consult motherboard manual for correct dual-channel slot configuration (typically A2/B2)'
        },
        components: ['memory', 'motherboard']
      });
    }
  }

  /**
   * Check GPU and Case clearance compatibility
   */
  checkGPUCaseCompatibility(gpu, pcCase) {
    const gpuLength = gpu.lengthMM || 0;
    const caseMaxLength = pcCase.maxGPULength || 0;

    if (gpuLength > caseMaxLength) {
      this.issues.push({
        type: 'gpu_clearance',
        severity: 'critical',
        message: `GPU length ${gpuLength}mm exceeds case maximum ${caseMaxLength}mm`,
        components: ['gpu', 'case']
      });
    }

    // Warning if GPU is close to max clearance
    if (gpuLength > caseMaxLength * 0.95 && gpuLength <= caseMaxLength) {
      this.warnings.push({
        type: 'gpu_tight_fit',
        severity: 'warning',
        message: `GPU length ${gpuLength}mm is very close to case maximum ${caseMaxLength}mm. Build may be tight`,
        components: ['gpu', 'case']
      });
    }
  }

  /**
   * Check CPU Cooler and Case clearance compatibility
   */
  checkCoolerCaseCompatibility(cpuCooler, pcCase) {
    // For air coolers, check height clearance
    if (cpuCooler.type === 'Air Cooler' && cpuCooler.height) {
      if (cpuCooler.height > pcCase.maxCPUCoolerHeight) {
        this.issues.push({
          type: 'cooler_clearance',
          severity: 'critical',
          message: `CPU Cooler height ${cpuCooler.height}mm exceeds case maximum ${pcCase.maxCPUCoolerHeight}mm`,
          components: ['cpuCooler', 'case']
        });
      }
    }

    // For AIO liquid coolers, check radiator support
    if (cpuCooler.type === 'AIO Liquid' && cpuCooler.radiatorSize) {
      const radiatorSize = cpuCooler.radiatorSize;
      const fanSlots = pcCase.frontFanSlots + pcCase.topFanSlots + pcCase.rearFanSlots;
      
      // Estimate if radiator will fit based on fan slots
      const requiredSlots = radiatorSize === 120 ? 1 : radiatorSize === 240 ? 2 : radiatorSize === 280 ? 2 : radiatorSize === 360 ? 3 : 3;
      
      if (fanSlots < requiredSlots) {
        this.warnings.push({
          type: 'radiator_mounting',
          severity: 'warning',
          message: `${radiatorSize}mm radiator may not fit. Verify case specifications for radiator support`,
          components: ['cpuCooler', 'case']
        });
      }
    }
  }

  /**
   * Check CPU Cooler and Motherboard socket compatibility
   */
  checkCoolerMotherboardCompatibility(cpuCooler, motherboard) {
    const coolerName = `${cpuCooler.brand} ${cpuCooler.model}`;
    
    if (cpuCooler.socketCompatibility && !cpuCooler.socketCompatibility.includes(motherboard.socket)) {
      this.issues.push({
        type: 'cooler_socket_mismatch',
        severity: 'critical',
        message: `CPU Cooler incompatibility: ${coolerName} does not support ${motherboard.socket} socket. The cooler mounting bracket will not fit.`,
        details: {
          reason: 'CPU cooler mounting bracket incompatibility',
          coolerSupports: cpuCooler.socketCompatibility.join(', '),
          motherboardSocket: motherboard.socket,
          impact: 'Cooler cannot be physically mounted to motherboard',
          recommendation: `Choose a cooler that supports ${motherboard.socket} or purchase a compatible mounting kit if available`
        },
        components: ['cpuCooler', 'motherboard']
      });
    }
  }

  /**
   * Check CPU Cooler and CPU TDP compatibility
   */
  checkCoolerCPUCompatibility(cpuCooler, cpu) {
    const coolerName = `${cpuCooler.brand} ${cpuCooler.model}`;
    const cpuName = `${cpu.brand} ${cpu.model}`;
    const cpuTDP = cpu.tdpWatts || 0;
    const coolerRating = cpuCooler.tdpRating || 0;

    // Debug logging
    console.log('🔥 TDP Check:', {
      coolerName,
      cpuName,
      cpuTDP,
      coolerRating,
      cpuCoolerData: cpuCooler,
      cpuData: cpu
    });

    // Critical if cooler TDP rating is significantly below CPU TDP
    if (coolerRating > 0 && cpuTDP > 0) {
      if (cpuTDP > coolerRating) {
        const tdpExcess = ((cpuTDP / coolerRating - 1) * 100).toFixed(0);
        this.issues.push({
          type: 'inadequate_cooling',
          severity: 'critical',
          message: `Inadequate cooling: ${coolerName} (${coolerRating}W TDP rating) cannot adequately cool ${cpuName} (${cpuTDP}W TDP). CPU is ${tdpExcess}% over cooler capacity. Risk of thermal throttling, system instability, and reduced CPU lifespan.`,
          details: {
            reason: 'CPU heat output exceeds cooler capacity',
            cpuTDP: cpuTDP,
            coolerRating: coolerRating,
            tdpDeficit: `${tdpExcess}% over capacity`,
            impact: 'CPU will thermal throttle under load, reducing performance. Potential for system crashes and hardware damage.',
            recommendation: `Use a cooler rated for ${Math.ceil(cpuTDP * 1.2)}W+ TDP. High-end air cooler (250W+) or 280mm/360mm AIO recommended for this CPU.`
          },
          components: ['cpuCooler', 'cpu']
        });
      } else if (cpuTDP > coolerRating * 0.9) {
        // Warning if close to limit
        this.warnings.push({
          type: 'marginal_cooling',
          severity: 'warning',
          message: `Marginal cooling capacity: ${coolerName} (${coolerRating}W) is operating near its limit with ${cpuName} (${cpuTDP}W). May struggle under sustained loads or overclocking.`,
          details: {
            reason: 'Cooler operating at 90%+ capacity',
            cpuTDP: cpuTDP,
            coolerRating: coolerRating,
            recommendation: `For better thermals and quieter operation, consider a cooler rated for ${Math.ceil(cpuTDP * 1.3)}W+ TDP`
          },
          components: ['cpuCooler', 'cpu']
        });
      }

      // Additional check for high-end CPUs with budget coolers
      if (cpuTDP >= 125 && coolerRating < 180) {
        this.warnings.push({
          type: 'high_tdp_budget_cooler',
          severity: 'warning',
          message: `High-performance CPU with budget cooling. ${cpuName} may run hot and loud under load. Consider upgrading cooler for better performance and acoustics.`,
          details: {
            reason: 'High TDP CPU needs robust cooling solution',
            recommendation: 'High-end air cooler (NH-D15, Dark Rock Pro 4) or 240mm+ AIO recommended for sustained workloads'
          },
          components: ['cpuCooler', 'cpu']
        });
      }
    }
  }

  /**
   * Check GPU and Motherboard PCIe compatibility
   */
  checkGPUMotherboardCompatibility(gpu, motherboard) {
    const gpuName = `${gpu.manufacturer} ${gpu.model}`;
    const moboName = `${motherboard.brand} ${motherboard.model}`;

    // Check if motherboard has PCIe x16 slot
    const pciE16Slots = motherboard.pciE16Slots || 0;
    
    if (pciE16Slots === 0) {
      this.issues.push({
        type: 'no_pcie_slot',
        severity: 'critical',
        message: `No PCIe x16 slot: ${moboName} does not have a PCIe x16 slot required for ${gpuName}. GPU cannot be installed.`,
        details: {
          reason: 'Motherboard lacks required PCIe x16 slot for discrete GPU',
          impact: 'Dedicated graphics card cannot be installed',
          recommendation: 'Choose a motherboard with at least one PCIe x16 slot or use integrated graphics'
        },
        components: ['gpu', 'motherboard']
      });
    }

    // Check GPU slot width vs available slots
    const gpuSlotWidth = parseFloat(gpu.slotWidth) || 2;
    
    if (gpuSlotWidth >= 3 && pciE16Slots < 2) {
      this.warnings.push({
        type: 'gpu_blocks_slots',
        severity: 'warning',
        message: `Large GPU warning: ${gpuName} uses ${gpuSlotWidth} slots. May block adjacent PCIe/M.2 slots on motherboard. Verify physical clearance.`,
        details: {
          reason: 'Thick GPU may block nearby expansion slots',
          gpuSlotWidth: `${gpuSlotWidth} slots`,
          recommendation: 'Check motherboard layout to ensure GPU does not block needed M.2 or PCIe slots'
        },
        components: ['gpu', 'motherboard']
      });
    }

    // PCIe generation compatibility (informational)
    if (gpu.interface && motherboard.chipset) {
      const gpuPCIe = gpu.interface.toLowerCase();
      
      // Check for PCIe Gen 3 GPU on PCIe Gen 5 board (backwards compatible but informational)
      if (gpuPCIe.includes('pcie 3.0') || gpuPCIe.includes('pcie 4.0')) {
        // This is fine, PCIe is backwards compatible - no warning needed for most cases
      }

      // Info for PCIe Gen 5 GPU
      if (gpuPCIe.includes('pcie 5.0')) {
        this.warnings.push({
          type: 'pcie_gen5_gpu',
          severity: 'warning',
          message: `${gpuName} supports PCIe 5.0. Ensure motherboard supports PCIe 5.0 x16 for full bandwidth (though PCIe 4.0 x16 is sufficient for current GPUs).`,
          details: {
            reason: 'Next-gen PCIe support',
            recommendation: 'PCIe 4.0 x16 provides adequate bandwidth for all current GPUs. PCIe 5.0 is future-proofing.'
          },
          components: ['gpu', 'motherboard']
        });
      }
    }
  }

  /**
   * Check Storage and M`${storage.brand} ${storage.model}`;
    const moboName =
  checkStorageMotherboardCompatibility(storage, motherboard) {
    const storageName = storage.name || `${storage.brand} ${storage.model}`;
    const moboName = motherboard.name || `${motherboard.brand} ${motherboard.model}`;
    const storageType = storage.type || '';
    const storageInterface = storage.interface || '';

    // Check M.2 NVMe drives
    if (storageInterface.toLowerCase().includes('m.2')) {
      const m2Slots = motherboard.m2Slots || 0;
      
      if (m2Slots === 0) {
        this.issues.push({
          type: 'no_m2_slot',
          severity: 'critical',
          message: `No M.2 slot: ${moboName} does not have M.2 slots for ${storageName}. Drive cannot be installed.`,
          details: {
            reason: 'Motherboard lacks M.2 NVMe slots',
            storageType: storage.interface,
            impact: 'M.2 NVMe drive cannot be physically installed',
            recommendation: 'Use SATA SSD/HDD instead or choose a motherboard with M.2 slots'
          },
          components: ['storage', 'motherboard']
        });
      } else if (m2Slots === 1) {
        this.warnings.push({
          type: 'limited_m2_slots',
          severity: 'warning',
          message: `Only 1 M.2 slot available on ${moboName}. Cannot add additional M.2 drives without expansion card.`,
          details: {
            reason: 'Limited M.2 storage expansion',
            availableM2Slots: m2Slots,
            recommendation: 'Plan storage expansion using SATA drives or consider motherboard with more M.2 slots'
          },
          components: ['storage', 'motherboard']
        });
      }

      // Check PCIe generation for NVMe performance
      if (storageInterface.includes('PCIe 4.0') || storageInterface.includes('PCIe 5.0')) {
        this.warnings.push({
          type: 'nvme_pcie_gen',
          severity: 'warning',
          message: `${storageName} uses ${storageInterface}. Ensure M.2 slot supports this generation for full speeds. Check motherboard manual for M.2 slot PCIe generation support.`,
          details: {
            reason: 'NVMe speed depends on M.2 slot PCIe generation',
            recommendation: 'Consult motherboard manual - some M.2 slots may be PCIe 3.0 only, limiting drive performance'
          },
          components: ['storage', 'motherboard']
        });
      }

      // Check form factor (2280, 22110, etc.)
      if (storage.formFactor && storage.formFactor.includes('22110')) {
        this.warnings.push({
          type: 'm2_form_factor',
          severity: 'warning',
          message: `${storageName} uses ${storage.formFactor} form factor (110mm long). Verify motherboard M.2 slots support this length. Most support 2280 (80mm) only.`,
          details: {
            reason: 'Non-standard M.2 drive length',
            driveLength: storage.formFactor,
            recommendation: 'Check motherboard manual - 22110 drives may not fit in all M.2 slots. 2280 is standard.'
          },
          components: ['storage', 'motherboard']
        });
      }
    }

    // Check SATA drives
    if (storageInterface.toLowerCase().includes('sata')) {
      const sataSlots = motherboard.sataSlots || 0;
      
      if (sataSlots === 0) {
        this.issues.push({
          type: 'no_sata_ports',
          severity: 'critical',
          message: `No SATA ports: ${moboName} does not have SATA ports for ${storageName}. Drive cannot be connected.`,
          details: {
            reason: 'Motherboard lacks SATA connectivity',
            impact: 'SATA drive cannot be connected',
            recommendation: 'Use M.2 NVMe drive instead or choose a motherboard with SATA ports'
          },
          components: ['storage', 'motherboard']
        });
      } else if (sataSlots <= 2) {
        this.warnings.push({
          type: 'limited_sata_ports',
          severity: 'warning',
          message: `Limited SATA ports: ${moboName} has only ${sataSlots} SATA ports. Plan your storage configuration carefully.`,
          details: {
            reason: 'Limited SATA storage expansion',
            availableSATAPorts: sataSlots,
            recommendation: 'Consider M.2 NVMe drives for additional storage to preserve SATA ports'
          },
          components: ['storage', 'motherboard']
        });
      }
    }

    // Warning about M.2 and SATA lane sharing
    if (storageInterface.toLowerCase().includes('m.2') && motherboard.m2Slots > 0 && motherboard.sataSlots > 0) {
      this.warnings.push({
        type: 'm2_sata_shared_lanes',
        severity: 'warning',
        message: `Note: Some motherboards share bandwidth between M.2 slots and SATA ports. Installing M.2 drives may disable certain SATA ports. Check motherboard manual.`,
        details: {
          reason: 'M.2 and SATA may share chipset lanes',
          recommendation: 'Consult motherboard manual for M.2/SATA lane sharing details to plan storage configuration'
        },
        components: ['storage', 'motherboard']
      });
    }
  }

  /**
   * Check Power Supply wattage adequacy (comprehensive calculation)
   */
  checkPowerSupplyWattage(psu, cpu, gpu, build) {
    // Calculate estimated power consumption from all components
    let totalPower = 0;
    
    // CPU TDP
    totalPower += cpu.tdpWatts || cpu.powerConsumptionWatts || 0;
    
    // GPU TDP
    totalPower += gpu.tdpWatts || gpu.powerConsumptionWatts || 0;
    
    // Motherboard power consumption
    totalPower += build.motherboard?.powerConsumptionWatts || 50;
    
    // RAM power consumption (per module ~3-5W)
    if (build.memory) {
      const modules = build.memory.modules || 2;
      const ramPowerPerModule = build.memory.powerConsumptionWatts || 4;
      totalPower += modules * ramPowerPerModule;
    }
    
    // Storage power consumption
    if (build.storage) {
      totalPower += build.storage.powerConsumptionWatts || 5;
    }
    
    // CPU Cooler (fans)
    if (build.cpuCooler) {
      totalPower += build.cpuCooler.powerConsumptionWatts || 10;
    }
    
    // Case fans and RGB (estimate)
    totalPower += build.case?.powerConsumptionWatts || 30;
    
    // Other peripherals and overhead
    totalPower += 20; // USB devices, RGB controllers, etc.
    
    const estimatedWattage = Math.ceil(totalPower);
    const recommendedWattage = Math.ceil(estimatedWattage * 1.25); // 25% headroom for efficiency

    if (psu.wattage < estimatedWattage) {
      this.issues.push({
        type: 'insufficient_power',
        severity: 'critical',
        message: `PSU wattage ${psu.wattage}W is insufficient. Total system power: ${estimatedWattage}W. Recommended: ${recommendedWattage}W+`,
        components: ['psu']
      });
    } else if (psu.wattage < recommendedWattage) {
      this.warnings.push({
        type: 'low_power_headroom',
        severity: 'warning',
        message: `PSU wattage ${psu.wattage}W may be tight. Total system power: ${estimatedWattage}W. Recommended: ${recommendedWattage}W+ for optimal efficiency and headroom`,
        components: ['psu']
      });
    }
    
    // Warning for overpowered PSU (wasteful)
    if (psu.wattage > estimatedWattage * 2) {
      this.warnings.push({
        type: 'oversized_psu',
        severity: 'warning',
        message: `PSU wattage ${psu.wattage}W is much higher than needed (${estimatedWattage}W). PSUs are most efficient at 50-80% load`,
        components: ['psu']
      });
    }
  }

  /**
   * Check Motherboard and Case form factor compatibility
   */
  checkMotherboardCaseCompatibility(motherboard, pcCase) {
    const caseFormFactor = pcCase.formFactor.toLowerCase();
    const moboFormFactor = motherboard.formFactor.toLowerCase();

    // ATX cases support ATX, Micro-ATX, Mini-ITX
    // Micro-ATX cases support Micro-ATX, Mini-ITX
    // Mini-ITX cases only support Mini-ITX

    if (caseFormFactor.includes('mini-itx') && !moboFormFactor.includes('mini-itx')) {
      this.issues.push({
        type: 'form_factor_mismatch',
        severity: 'critical',
        message: `Mini-ITX case cannot fit ${motherboard.formFactor} motherboard`,
        components: ['motherboard', 'case']
      });
    } else if (caseFormFactor.includes('micro-atx') && moboFormFactor.includes('atx') && !moboFormFactor.includes('micro')) {
      this.issues.push({
        type: 'form_factor_mismatch',
        severity: 'critical',
        message: `Micro-ATX case cannot fit ${motherboard.formFactor} motherboard`,
        components: ['motherboard', 'case']
      });
    } else if (caseFormFactor.includes('e-atx') && moboFormFactor.includes('e-atx')) {
      // E-ATX motherboards need E-ATX support
      if (!caseFormFactor.includes('e-atx') && !caseFormFactor.includes('full') && !caseFormFactor.includes('super')) {
        this.warnings.push({
          type: 'eatx_support',
          severity: 'warning',
          message: `Verify that case explicitly supports E-ATX motherboards`,
          components: ['motherboard', 'case']
        });
      }
    }
  }

  /**
   * Check PSU and Case form factor compatibility
   */
  checkPSUCaseCompatibility(psu, pcCase) {
    const psuFormFactor = psu.formFactor.toLowerCase();
    const caseFormFactor = pcCase.formFactor.toLowerCase();

    // SFX PSU in ATX case is fine with adapter
    // ATX PSU in SFX/Mini-ITX case usually won't fit
    if (psuFormFactor.includes('atx') && !psuFormFactor.includes('sfx')) {
      if (caseFormFactor.includes('mini-itx')) {
        this.warnings.push({
          type: 'psu_form_factor',
          severity: 'warning',
          message: `ATX PSU in Mini-ITX case may not fit. Check case specifications for PSU support`,
          components: ['psu', 'case']
        });
      }
    }

    // Check PSU length
    if (psu.maxPSULength && pcCase.maxPSULength) {
      // Note: We don't have PSU length in our data, but we have maxPSULength for cases
      // This is a placeholder for when we have that data
    }
  }

  /**
   * Get a summary of compatibility status
   */
  getSummary() {
    return {
      totalIssues: this.issues.length,
      totalWarnings: this.warnings.length,
      isCompatible: this.issues.length === 0,
      criticalIssues: this.issues.filter(i => i.severity === 'critical').length
    };
  }
}

export default CompatibilityChecker;
