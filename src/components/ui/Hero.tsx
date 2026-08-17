import { lazy, Suspense, useMemo } from 'react'
import { isWebGLAvailable } from '../../lib/webgl'
import { shouldSkip3D } from '../../lib/deviceCapability'
import { useReducedMotion } from '../../lib/useReducedMotion'
import { HeroErrorBoundary } from './HeroErrorBoundary'
import { HeroFallback } from './HeroFallback'

const ShaderHero = lazy(() =>
  import('./shaderHero').then((m) => ({ default: m.ShaderHero })),
)

interface HeroProps {
  onStart: () => void
}

/**
 * Decides between the shader hero and the static fallback. Three checks
 * happen before the WebGL bundle is even requested (device-capability
 * heuristic, prefers-reduced-motion, WebGL feature detection), so
 * constrained devices and reduced-motion users never pay for the shader
 * chunk at all. The shader library creates its WebGL context inside an
 * effect with no error callback exposed, so HeroErrorBoundary (catching
 * synchronous render-phase throws) is the only remaining runtime defense.
 */
export function Hero({ onStart }: HeroProps) {
  const prefersReducedMotion = useReducedMotion()

  const canUseShader = useMemo(
    () => isWebGLAvailable() && !shouldSkip3D(),
    [],
  )

  if (prefersReducedMotion || !canUseShader) {
    return <HeroFallback onStart={onStart} />
  }

  return (
    <HeroErrorBoundary fallback={<HeroFallback onStart={onStart} />}>
      <Suspense fallback={<HeroFallback onStart={onStart} />}>
        <ShaderHero onStart={onStart} />
      </Suspense>
    </HeroErrorBoundary>
  )
}
