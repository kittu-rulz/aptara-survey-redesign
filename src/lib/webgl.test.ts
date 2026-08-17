import { afterEach, describe, expect, it, vi } from 'vitest'
import { isWebGLAvailable } from './webgl'

describe('isWebGLAvailable', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns true when the browser returns a WebGL context', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      {} as RenderingContext,
    )
    expect(isWebGLAvailable()).toBe(true)
  })

  it('returns false when getContext returns null for all WebGL variants', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
    expect(isWebGLAvailable()).toBe(false)
  })

  it('returns false when getContext throws instead of returning null', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => {
      throw new Error('WebGL is disabled')
    })
    expect(isWebGLAvailable()).toBe(false)
  })
})
