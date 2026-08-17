import { lazy, Suspense, useMemo, useState } from 'react'
import { isWebGLAvailable } from '../../lib/webgl'
import { shouldSkip3D } from '../../lib/deviceCapability'
import { useReducedMotion } from '../../lib/useReducedMotion'
import { HeroErrorBoundary } from './HeroErrorBoundary'
import { HeroFallback } from './HeroFallback'

const Hero3D = lazy(() =>
  import('./horizon-hero-section').then((m) => ({ default: m.Component })),
)

interface HeroProps {
  onStart: () => void
}

/**
 * Decides between the 3D hero and the static fallback. Three checks happen
 * before the WebGL/Three.js bundle is even requested (device-capability
 * heuristic, prefers-reduced-motion, WebGL feature detection), so
 * constrained devices and reduced-motion users never pay for the ~1MB
 * three.js/gsap chunk at all. A runtime failure inside the 3D component
 * (via its onError callback) or an unexpected render error (via
 * HeroErrorBoundary) both fall back to the same static hero.
 */
export function Hero({ onStart }: HeroProps) {
  const prefersReducedMotion = useReducedMotion()
  const [runtimeError, setRuntimeError] = useState(false)

  const canUse3D = useMemo(
    () => isWebGLAvailable() && !shouldSkip3D(),
    [],
  )

  if (prefersReducedMotion || !canUse3D || runtimeError) {
    return <HeroFallback onStart={onStart} />
  }

  return (
    <HeroErrorBoundary fallback={<HeroFallback onStart={onStart} />}>
      <Suspense fallback={<HeroFallback onStart={onStart} />}>
        <Hero3D onStart={onStart} onError={() => setRuntimeError(true)} />
      </Suspense>
    </HeroErrorBoundary>
  )
}
