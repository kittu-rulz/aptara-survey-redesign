import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HeroErrorBoundary } from './HeroErrorBoundary'

function Bomb(): never {
  throw new Error('boom')
}

describe('HeroErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <HeroErrorBoundary fallback={<div>fallback</div>}>
        <div>children</div>
      </HeroErrorBoundary>,
    )
    expect(screen.getByText('children')).toBeInTheDocument()
  })

  it('renders the fallback when a child throws during render', () => {
    // React logs the error to the console by default; silence it for this test.
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <HeroErrorBoundary fallback={<div>fallback shown</div>}>
        <Bomb />
      </HeroErrorBoundary>,
    )

    expect(screen.getByText('fallback shown')).toBeInTheDocument()
    expect(screen.queryByText('children')).not.toBeInTheDocument()

    consoleError.mockRestore()
  })
})
