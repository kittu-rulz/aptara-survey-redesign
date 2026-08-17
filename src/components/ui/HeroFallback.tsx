import { HERO_CHAPTERS } from './heroContent'
import { renderHeroLine } from './heroText'

interface HeroFallbackProps {
  onStart: () => void
}

// Fixed, deterministic star positions — no Math.random() at render time, so
// the pattern doesn't shift between renders/hydration.
const STARS = Array.from({ length: 60 }, (_, i) => {
  const seed = i * 137.51 // golden-angle spacing gives an even, non-grid spread
  return {
    x: (seed * 7.3) % 100,
    y: (seed * 3.1) % 100,
    r: 0.4 + ((i * 13) % 10) / 10,
    opacity: 0.25 + ((i * 7) % 10) / 14,
  }
})

/**
 * Static, non-scroll-jacked stand-in for the 3D hero — used when WebGL is
 * unavailable, initialization fails, the device is constrained, or the user
 * has requested reduced motion. Same navy/teal palette and typography scale
 * as the 3D version's first chapter, just without the canvas or scroll
 * mechanics.
 */
export function HeroFallback({ onStart }: HeroFallbackProps) {
  const chapter = HERO_CHAPTERS[0]

  return (
    <div className="relative flex min-h-[85vh] w-full flex-col items-center justify-center overflow-hidden bg-[#030a16] px-6 py-20 text-center sm:min-h-[90vh]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 20% 20%, rgba(32,90,158,0.35), transparent 55%), radial-gradient(circle at 80% 80%, rgba(18,133,155,0.28), transparent 55%)',
        }}
        aria-hidden="true"
      />
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
        focusable="false"
      >
        {STARS.map((star, i) => (
          <circle
            key={i}
            cx={`${star.x}%`}
            cy={`${star.y}%`}
            r={star.r}
            fill="white"
            opacity={star.opacity}
          />
        ))}
      </svg>

      <div className="relative">
        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
          {chapter.title}
        </h1>
        <div className="mt-7 max-w-2xl">
          {chapter.lines.map((line) => (
            <p key={line} className="text-base leading-7 text-white/70 sm:text-lg">
              {renderHeroLine(line)}
            </p>
          ))}
        </div>
        <button
          type="button"
          onClick={onStart}
          className="mt-9 rounded-lg bg-white px-8 py-3.5 text-base font-semibold text-navy transition-colors hover:bg-white/90"
        >
          Get Started
        </button>
      </div>
    </div>
  )
}
