import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('../../lib/webgl', () => ({
  isWebGLAvailable: vi.fn(),
}))
vi.mock('../../lib/deviceCapability', () => ({
  shouldSkip3D: vi.fn(),
}))
vi.mock('../../lib/useReducedMotion', () => ({
  useReducedMotion: vi.fn(),
}))
vi.mock('./horizon-hero-section', () => ({
  Component: ({
    onStart,
    onError,
  }: {
    onStart: () => void
    onError?: () => void
  }) => (
    <div data-testid="hero-3d">
      <button onClick={onStart}>Get Started</button>
      <button onClick={onError}>Simulate renderer error</button>
    </div>
  ),
}))

import { isWebGLAvailable } from '../../lib/webgl'
import { shouldSkip3D } from '../../lib/deviceCapability'
import { useReducedMotion } from '../../lib/useReducedMotion'
import { Hero } from './Hero'

const mockIsWebGLAvailable = vi.mocked(isWebGLAvailable)
const mockShouldSkip3D = vi.mocked(shouldSkip3D)
const mockUseReducedMotion = vi.mocked(useReducedMotion)

describe('Hero', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the 3D hero when WebGL is supported and the device is not constrained', async () => {
    mockIsWebGLAvailable.mockReturnValue(true)
    mockShouldSkip3D.mockReturnValue(false)
    mockUseReducedMotion.mockReturnValue(false)

    render(<Hero onStart={vi.fn()} />)

    expect(await screen.findByTestId('hero-3d')).toBeInTheDocument()
  })

  it('renders the static fallback when WebGL is unavailable, and the primary CTA still works', async () => {
    mockIsWebGLAvailable.mockReturnValue(false)
    mockShouldSkip3D.mockReturnValue(false)
    mockUseReducedMotion.mockReturnValue(false)
    const onStart = vi.fn()

    render(<Hero onStart={onStart} />)

    expect(screen.queryByTestId('hero-3d')).not.toBeInTheDocument()
    const cta = await screen.findByRole('button', { name: /get started/i })
    await userEvent.click(cta)
    expect(onStart).toHaveBeenCalledOnce()
  })

  it('renders the static fallback when the device is constrained, even if WebGL is supported', async () => {
    mockIsWebGLAvailable.mockReturnValue(true)
    mockShouldSkip3D.mockReturnValue(true)
    mockUseReducedMotion.mockReturnValue(false)

    render(<Hero onStart={vi.fn()} />)

    expect(screen.queryByTestId('hero-3d')).not.toBeInTheDocument()
    expect(await screen.findByRole('button', { name: /get started/i })).toBeInTheDocument()
  })

  it('renders the static fallback when prefers-reduced-motion is set', async () => {
    mockIsWebGLAvailable.mockReturnValue(true)
    mockShouldSkip3D.mockReturnValue(false)
    mockUseReducedMotion.mockReturnValue(true)

    render(<Hero onStart={vi.fn()} />)

    expect(screen.queryByTestId('hero-3d')).not.toBeInTheDocument()
    expect(await screen.findByRole('button', { name: /get started/i })).toBeInTheDocument()
  })

  it('falls back to the static hero when the 3D component reports a runtime error, and the CTA remains usable', async () => {
    mockIsWebGLAvailable.mockReturnValue(true)
    mockShouldSkip3D.mockReturnValue(false)
    mockUseReducedMotion.mockReturnValue(false)
    const onStart = vi.fn()

    render(<Hero onStart={onStart} />)

    const errorButton = await screen.findByRole('button', {
      name: /simulate renderer error/i,
    })
    await userEvent.click(errorButton)

    await waitFor(() => {
      expect(screen.queryByTestId('hero-3d')).not.toBeInTheDocument()
    })
    const cta = screen.getByRole('button', { name: /get started/i })
    await userEvent.click(cta)
    expect(onStart).toHaveBeenCalledOnce()
  })
})
