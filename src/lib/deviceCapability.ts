interface NavigatorWithDeviceMemory extends Navigator {
  deviceMemory?: number
}

const LOW_MEMORY_GB = 4
const LOW_CORE_COUNT = 2

/**
 * Heuristic for skipping the shader hero on constrained devices even when
 * WebGL itself is technically available — a low-end phone can create a
 * WebGL context and still choke rendering it. Deliberately not gated on
 * screen width: a small viewport doesn't imply a weak GPU, and phones
 * should get the animated hero too as long as memory/CPU look adequate.
 */
export function shouldSkip3D(): boolean {
  if (typeof window === 'undefined') return true

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
