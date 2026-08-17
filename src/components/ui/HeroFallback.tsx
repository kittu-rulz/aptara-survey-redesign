import { HERO_CHAPTERS, HERO_STATS } from './heroContent'
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
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={onStart}
            className="rounded-lg bg-white px-8 py-3.5 text-base font-semibold text-navy transition-colors hover:bg-white/90"
          >
            Get Started
          </button>
          <a
            href="#discover"
            className="rounded-lg border border-white/25 px-8 py-3.5 text-base font-semibold text-white transition-colors hover:border-white/50 hover:bg-white/5"
          >
            See how it works
          </a>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-white/60">
          {HERO_STATS.map((stat) => (
            <span key={stat} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-white/40" aria-hidden="true" />
              {stat}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
