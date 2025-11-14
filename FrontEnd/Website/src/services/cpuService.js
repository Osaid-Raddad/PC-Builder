/**
 * CPU Data Service
 * Loads CPU data from BuildCores OpenDB
 */

// Import CPU JSON files (lazy loading)
// Path explanation: ../../../ goes up to FrontEnd/, then ../../ goes to PC-Builder root
const cpuModules = import.meta.glob(
  "../../../../buildcores-open-db/open-db/CPU/*.json"
);

console.log("CPU modules found:", Object.keys(cpuModules).length);

let cachedCPUs = null;

/**
 * Load all CPUs from BuildCores
 */
export const loadAllCPUs = async () => {
  // Return cached data if available
  if (cachedCPUs) {
    console.log("Returning cached CPUs:", cachedCPUs.length);
    return cachedCPUs;
  }

  try {
    const cpuPaths = Object.keys(cpuModules);
    console.log("Loading CPUs from paths:", cpuPaths.length);
    const cpus = [];

    // Load CPUs in batches of 100 for better performance
    const batchSize = 100;
    for (let i = 0; i < cpuPaths.length; i += batchSize) {
      const batch = cpuPaths.slice(i, i + batchSize);
      console.log(
        `Loading batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
          cpuPaths.length / batchSize
        )}`
      );
      const batchData = await Promise.all(
        batch.map(async (path) => {
          const module = await cpuModules[path]();
          return module.default || module;
        })
      );
      cpus.push(...batchData);
    }

    console.log("Raw CPUs loaded:", cpus.length);

    // Format CPUs for display
    const formattedCPUs = cpus.map((cpu) => formatCPU(cpu));

    console.log("Formatted CPUs:", formattedCPUs.length);

    // Cache the data
    cachedCPUs = formattedCPUs;

    return formattedCPUs;
  } catch (error) {
    console.error("Error loading CPUs:", error);
    return [];
  }
};

/**
 * Format CPU data from BuildCores to our display format
 */
const formatCPU = (cpu) => {
  return {
    id: cpu.opendb_id,
    name: cpu.metadata?.name || "Unknown CPU",
    brand: cpu.metadata?.manufacturer || "Unknown",
    cores: cpu.cores?.total || 0,
    threads: cpu.cores?.threads || 0,
    baseClock: cpu.clocks?.performance?.base || 0,
    boostClock: cpu.clocks?.performance?.boost || 0,
    socket: cpu.socket || "Unknown",
    tdp: cpu.specifications?.tdp || 0,
    l2Cache: cpu.cache?.l2 || 0,
    l3Cache: cpu.cache?.l3 || 0,
    integratedGraphics:
      cpu.specifications?.integratedGraphics?.model !== "None",
    series: cpu.series || "",
    microarchitecture: cpu.microarchitecture || "",
    price: 0, // BuildCores doesn't include prices - will need to be fetched from shop APIs
  };
};

/**
 * Get unique brands from CPU list
 */
export const getUniqueBrands = (cpus) => {
  const brands = new Set();
  cpus.forEach((cpu) => {
    if (cpu.brand && cpu.brand !== "Unknown") {
      brands.add(cpu.brand);
    }
  });
  return ["All", ...Array.from(brands).sort()];
};

/**
 * Get unique sockets from CPU list
 */
export const getUniqueSockets = (cpus) => {
  const sockets = new Set();
  cpus.forEach((cpu) => {
    if (cpu.socket && cpu.socket !== "Unknown") {
      sockets.add(cpu.socket);
    }
  });
  return ["All", ...Array.from(sockets).sort()];
};

/**
 * Search and filter CPUs
 */
export const filterCPUs = (cpus, filters) => {
  return cpus.filter((cpu) => {
    // Search filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      const matchesSearch =
        cpu.name.toLowerCase().includes(term) ||
        cpu.brand.toLowerCase().includes(term) ||
        cpu.series.toLowerCase().includes(term);
      if (!matchesSearch) return false;
    }

    // Brand filter
    if (filters.brand && filters.brand !== "All") {
      if (cpu.brand !== filters.brand) return false;
    }

    // Socket filter
    if (filters.socket && filters.socket !== "All") {
      if (cpu.socket !== filters.socket) return false;
    }

    return true;
  });
};
