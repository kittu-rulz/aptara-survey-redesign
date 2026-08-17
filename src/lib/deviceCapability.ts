interface NavigatorWithDeviceMemory extends Navigator {
  deviceMemory?: number
}

const MOBILE_WIDTH_THRESHOLD = 640
const LOW_MEMORY_GB = 4
const LOW_CORE_COUNT = 2

/**
 * Heuristic for skipping the 3D hero on constrained devices even when WebGL
 * itself is technically available — a low-end phone can create a WebGL
 * context and still choke rendering a starfield + postprocessing pipeline.
 */
export function shouldSkip3D(): boolean {
  if (typeof window === 'undefined') return true

  if (window.innerWidth < MOBILE_WIDTH_THRESHOLD) return true

  const nav = navigator as NavigatorWithDeviceMemory
  if (typeof nav.deviceMemory === 'number' && nav.deviceMemory < LOW_MEMORY_GB) {
    return true
  }

  if (
    typeof navigator.hardwareConcurrency === 'number' &&
    navigator.hardwareConcurrency <= LOW_CORE_COUNT
  ) {
    return true
  }

  return false
}
