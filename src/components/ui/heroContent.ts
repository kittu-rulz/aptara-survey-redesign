export interface HeroChapter {
  title: string
  lines: string[]
}

/**
 * Shared between the 3D hero (horizon-hero-section.tsx) and the static
 * fallback (HeroFallback.tsx) so both ever have exactly one copy of the
 * copy to keep in sync.
 */
export const HERO_CHAPTERS: HeroChapter[] = [
  {
    title: 'L&D ASSESSMENT',
    lines: [
      'Get a clearer view of your current learning environment,',
      'and discover where your L&D function can create greater impact.',
    ],
  },
  {
    title: 'CLARITY',
    lines: [
      'The assessment looks beyond individual questions',
      'to give you a clearer picture of where your learning function is today.',
    ],
  },
  {
    title: 'DIRECTION',
    lines: ['Turn your responses into a clearer view', 'of what comes next.'],
  },
]
