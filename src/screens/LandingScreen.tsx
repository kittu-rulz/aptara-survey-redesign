import { motion } from 'framer-motion'
import { QUESTION_ACCENTS } from '../theme/tokens'
import type { QuestionCode } from '../lib/types'
import { Component as HorizonHero } from '../components/ui/horizon-hero-section'

interface LandingScreenProps {
  onStart: () => void
}

const STATS = ['5 questions', 'About 2 minutes', 'Personalized result']

const FEATURES = [
  {
    title: 'Focused assessment',
    text: 'Five questions designed to surface meaningful L&D priorities.',
  },
  {
    title: 'Quick to complete',
    text: 'Complete the assessment in approximately two minutes.',
  },
  {
    title: 'Clear outcome',
    text: 'Receive a personalized snapshot based on your responses.',
  },
]

const DISCOVER_ITEMS: Array<{ code: QuestionCode; name: string; text: string }> = [
  {
    code: 'Q1',
    name: 'L&D Maturity',
    text: 'Understand where your learning and development function stands today.',
  },
  {
    code: 'Q2',
    name: 'Key Challenges',
    text: 'Identify the biggest barriers limiting learning effectiveness and growth.',
  },
  {
    code: 'Q3',
    name: 'Learning Model',
    text: 'Review how learning is currently designed, delivered, and supported.',
  },
  {
    code: 'Q4',
    name: 'Team Capacity',
    text: 'Understand whether your current team and resources can support your goals.',
  },
  {
    code: 'Q5',
    name: 'Future Ambition',
    text: 'Clarify what your L&D function should achieve over the next 12 months.',
  },
]

const HOW_IT_WORKS = [
  {
    step: 'Answer',
    text: 'Respond to five focused questions about your L&D function.',
  },
  {
    step: 'Assess',
    text: 'Your responses are evaluated against the key areas of L&D maturity.',
  },
  {
    step: 'Discover',
    text: 'Receive a personalized snapshot highlighting priorities and opportunities.',
  },
]

const SNAPSHOT_BULLETS = [
  'Established learning foundations',
  'Opportunity to improve scalability',
  'Capacity is an important next priority',
]

function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function LandingScreen({ onStart }: LandingScreenProps) {
  return (
    <div>
      {/* 3D hero */}
      <HorizonHero />

      {/* CTA band directly below the hero */}
      <div className="mx-auto max-w-4xl px-5 pt-16 text-center sm:px-7">
        <button
          type="button"
          onClick={onStart}
          className="rounded-lg bg-navy px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-navy-light"
        >
          Get Started
        </button>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.17em] text-slate-400">
          How It Works
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-x-8 gap-y-1 text-base text-slate-500">
          {STATS.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>

        {/* Feature stat row — dividers, not cards */}
        <FadeIn
          delay={0.1}
          className="mt-14 grid divide-y divide-slate-200 text-left sm:grid-cols-3 sm:divide-x sm:divide-y-0"
        >
          {FEATURES.map((f) => (
            <div key={f.title} className="py-6 first:pt-0 sm:px-8 sm:py-0 sm:first:pl-0 sm:last:pr-0">
              <p className="text-lg font-semibold text-navy">{f.title}</p>
              <p className="mt-1.5 text-base leading-6 text-slate-500">{f.text}</p>
            </div>
          ))}
        </FadeIn>
      </div>

      {/* White band: What you'll discover + How it works */}
      <div className="mt-20 bg-white py-20">
        <div className="mx-auto max-w-4xl px-5 sm:px-7">
          <FadeIn className="grid gap-10 lg:grid-cols-5 lg:gap-16">
            <div className="lg:col-span-2">
              <p className="text-xs font-bold uppercase tracking-[0.17em] text-slate-400">
                What you&apos;ll discover
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
                See your L&amp;D function more clearly.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                The assessment looks beyond individual questions to give you a
                clearer picture of where your learning function is today and
                where attention may be needed next.
              </p>
            </div>

            <ol className="divide-y divide-slate-200 lg:col-span-3">
              {DISCOVER_ITEMS.map((d, i) => {
                const accent = QUESTION_ACCENTS[d.code]
                return (
                  <li key={d.code} className="flex items-start gap-5 py-5 first:pt-0 last:pb-0">
                    <span
                      className="select-none text-4xl font-bold tabular-nums text-slate-200 sm:text-5xl"
                      aria-hidden="true"
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0 pt-1">
                      <p className="flex items-center gap-2 text-lg font-semibold text-navy">
                        <span
                          className="h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: accent.accent }}
                        />
                        {d.name}
                      </p>
                      <p className="mt-1 text-base leading-6 text-slate-500">{d.text}</p>
                    </div>
                  </li>
                )
              })}
            </ol>
          </FadeIn>

          <FadeIn className="mt-24">
            <p className="text-xs font-bold uppercase tracking-[0.17em] text-slate-400">
              How It Works
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
              Simple questions. Useful direction.
            </h2>

            <div className="mt-10 grid gap-10 sm:grid-cols-3 sm:gap-8">
              {HOW_IT_WORKS.map((s, i) => (
                <div key={s.step} className="relative">
                  <span className="text-sm font-bold tabular-nums text-slate-300">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="mt-2 text-xl font-semibold text-navy">{s.step}</p>
                  <p className="mt-2 text-base leading-6 text-slate-500">{s.text}</p>
                  {i < HOW_IT_WORKS.length - 1 && (
                    <div
                      className="absolute top-2 hidden h-px w-8 bg-slate-200 sm:block"
                      style={{ right: '-2.25rem' }}
                    />
                  )}
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-5 pb-20 sm:px-7 sm:pb-28">
        {/* Sample snapshot — framed like a product preview */}
        <FadeIn className="mt-20">
          <p className="text-xs font-bold uppercase tracking-[0.17em] text-slate-400">
            Your L&amp;D Snapshot
          </p>
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
            <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-5 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
            </div>
            <div className="p-7 sm:p-9">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Current L&amp;D maturity
                  </p>
                  <p className="mt-1.5 text-2xl font-semibold text-navy">
                    Scaling <span className="text-q1">03</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Primary Priority
                  </p>
                  <p className="mt-1.5 text-2xl font-semibold text-q2">Capacity</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Future Focus
                  </p>
                  <p className="mt-1.5 text-2xl font-semibold text-q5">Sustainable Growth</p>
                </div>
              </div>
              <p className="mt-6 text-base leading-7 text-slate-600">
                Your L&amp;D function has established foundations and is
                positioned for growth, but capacity and scalability may
                require greater attention.
              </p>
              <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm text-slate-500">
                {SNAPSHOT_BULLETS.map((b) => (
                  <li key={b} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-q4" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </FadeIn>

        {/* Your result — plain, no card, leads into the final CTA */}
        <FadeIn className="mt-20 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.17em] text-slate-400">
            Your Result
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
            Turn your responses into a clearer view of what comes next.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-600">
            At the end of the assessment, you&apos;ll receive a personalized
            snapshot that highlights your current position, key priority, and
            potential area of focus.
          </p>
          <button
            type="button"
            onClick={onStart}
            className="mt-7 rounded-lg border border-navy px-8 py-3.5 text-base font-semibold text-navy transition-colors hover:bg-navy hover:text-white"
          >
            Start Assessment
          </button>
        </FadeIn>

        {/* Final CTA — the strong visual close */}
        <FadeIn className="relative mt-14 overflow-hidden rounded-2xl bg-navy px-6 py-14 text-center sm:px-12">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 22% 15%, rgba(32,90,158,0.45), transparent 55%), radial-gradient(circle at 85% 85%, rgba(18,133,155,0.3), transparent 50%)',
            }}
          />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.17em] text-white/60">
              L&amp;D Assessment
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Ready to understand your L&amp;D function?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-white/70">
              Complete five focused questions and discover what your current
              learning environment may need next.
            </p>
            <button
              type="button"
              onClick={onStart}
              className="mt-7 rounded-lg bg-white px-8 py-3.5 text-base font-semibold text-navy transition-colors hover:bg-white/90"
            >
              Get Started
            </button>
            <p className="mt-5 text-sm text-white/50">
              5 questions &middot; Approximately 2 minutes &middot;
              Personalized assessment
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
