/**
 * Feature-detects WebGL support without ever attaching a canvas to the DOM.
 * Some browsers throw instead of returning null when WebGL is disabled
 * (e.g. via flags or GPU blocklists), so this is wrapped in a try/catch
 * rather than relying solely on the return value.
 */
export function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    return !!gl
  } catch {
    return false
  }
}
