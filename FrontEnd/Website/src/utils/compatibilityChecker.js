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
    if (cpu.socket !== motherboard.socket) {
      this.issues.push({
        type: 'socket_mismatch',
        severity: 'critical',
        message: `CPU socket ${cpu.socket} is not compatible with motherboard socket ${motherboard.socket}`,
        components: ['cpu', 'motherboard']
      });
    }
  }

  /**
   * Check CPU and GPU compatibility (bottleneck detection)
   */
  checkCPUGPUCompatibility(cpu, gpu) {
    // Check for extreme performance mismatches
    const cpuScore = cpu.performanceScore || 0;
    const gpuPrice = gpu.price || 0;
    
    // Detect bottlenecks based on performance score vs GPU tier
    // High-end GPUs ($1000+) need strong CPUs (8000+ performance score)
    if (gpuPrice >= 1000 && cpuScore < 8000) {
      this.warnings.push({
        type: 'cpu_bottleneck',
        severity: 'warning',
        message: `High-end GPU may be bottlenecked by CPU. Consider a stronger processor for optimal performance`,
        components: ['cpu', 'gpu']
      });
    }
    
    // Mid-range GPUs ($500-$999) need decent CPUs (6000+ performance score)
    if (gpuPrice >= 500 && gpuPrice < 1000 && cpuScore < 6000) {
      this.warnings.push({
        type: 'cpu_bottleneck',
        severity: 'warning',
        message: `CPU may limit GPU performance in demanding tasks. Consider a mid-range or better processor`,
        components: ['cpu', 'gpu']
      });
    }
    
    // Check for overkill CPU with weak GPU (budget imbalance)
    if (cpuScore > 10000 && gpuPrice < 300) {
      this.warnings.push({
        type: 'gpu_underpowered',
        severity: 'warning',
        message: `Powerful CPU paired with entry-level GPU. Consider balancing your budget for better overall performance`,
        components: ['cpu', 'gpu']
      });
    }
  }

  /**
   * Check Memory and Motherboard RAM type compatibility
   */
  checkMemoryMotherboardCompatibility(memory, motherboard) {
    // Check RAM type (DDR4 vs DDR5)
    if (memory.type !== motherboard.ramType) {
      this.issues.push({
        type: 'ram_type_mismatch',
        severity: 'critical',
        message: `Memory type ${memory.type} is not compatible with motherboard RAM type ${motherboard.ramType}`,
        components: ['memory', 'motherboard']
      });
    }

    // Check if total RAM capacity exceeds motherboard max
    const totalMemoryGB = memory.capacityGB;
    if (totalMemoryGB > motherboard.maxRamGB) {
      this.issues.push({
        type: 'ram_capacity_exceeded',
        severity: 'critical',
        message: `Total memory ${totalMemoryGB}GB exceeds motherboard maximum ${motherboard.maxRamGB}GB`,
        components: ['memory', 'motherboard']
      });
    }

    // Check if memory speed is very high (might need BIOS tweaking)
    if (memory.speedMHz > 6000) {
      this.warnings.push({
        type: 'high_memory_speed',
        severity: 'warning',
        message: `Memory speed ${memory.speedMHz}MHz is very high. May require manual BIOS configuration`,
        components: ['memory', 'motherboard']
      });
    }
  }

  /**
   * Check GPU and Case clearance compatibility
   */
  checkGPUCaseCompatibility(gpu, pcCase) {
    if (gpu.length > pcCase.maxGPULength) {
      this.issues.push({
        type: 'gpu_clearance',
        severity: 'critical',
        message: `GPU length ${gpu.length}mm exceeds case maximum ${pcCase.maxGPULength}mm`,
        components: ['gpu', 'case']
      });
    }

    // Warning if GPU is close to max clearance
    if (gpu.length > pcCase.maxGPULength * 0.95) {
      this.warnings.push({
        type: 'gpu_tight_fit',
        severity: 'warning',
        message: `GPU length ${gpu.length}mm is very close to case maximum ${pcCase.maxGPULength}mm. Build may be tight`,
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
    if (cpuCooler.socketCompatibility && !cpuCooler.socketCompatibility.includes(motherboard.socket)) {
      this.issues.push({
        type: 'cooler_socket_mismatch',
        severity: 'critical',
        message: `CPU Cooler does not support socket ${motherboard.socket}`,
        components: ['cpuCooler', 'motherboard']
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
