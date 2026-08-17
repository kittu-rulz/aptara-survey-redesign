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
      <div className="mx-auto max-w-4xl px-5 pt-14 text-center sm:px-7">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={onStart}
            className="rounded-lg bg-navy px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-navy-light"
          >
            Get Started
          </button>
        </div>

        <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-slate-400">
          How It Works
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-x-8 gap-y-1 text-base text-slate-500">
          {STATS.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-5 pb-16 sm:px-7 sm:pb-24">
        {/* Feature cards */}
        <FadeIn delay={0.1} className="mt-12 grid gap-5 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-xl border border-slate-200 bg-white p-6">
              <p className="text-lg font-semibold text-navy">{f.title}</p>
              <p className="mt-2 text-base leading-6 text-slate-500">{f.text}</p>
            </div>
          ))}
        </FadeIn>

        {/* What you'll discover */}
        <FadeIn delay={0.05} className="mt-20">
          <p className="text-xs font-bold uppercase tracking-[0.17em] text-slate-400">
            What you&apos;ll discover
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
            See your L&amp;D function more clearly.
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            The assessment looks beyond individual questions to give you a
            clearer picture of where your learning function is today and where
            attention may be needed next.
          </p>

          <ol className="mt-8 divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
            {DISCOVER_ITEMS.map((d, i) => {
              const accent = QUESTION_ACCENTS[d.code]
              return (
                <li key={d.code} className="flex items-start gap-5 px-6 py-5">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-bold ${accent.bg} ${accent.text}`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <p className="text-lg font-semibold text-navy">{d.name}</p>
                    <p className="mt-1 text-base leading-6 text-slate-500">{d.text}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </FadeIn>

        {/* How it works */}
        <FadeIn delay={0.05} className="mt-20">
          <p className="text-xs font-bold uppercase tracking-[0.17em] text-slate-400">
            How It Works
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
            Simple questions. Useful direction.
          </h2>

          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {HOW_IT_WORKS.map((s, i) => (
              <div key={s.step} className="rounded-xl border border-slate-200 bg-white p-6">
                <span className="text-sm font-bold text-slate-300">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="mt-1.5 text-lg font-semibold text-navy">{s.step}</p>
                <p className="mt-2 text-base leading-6 text-slate-500">{s.text}</p>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Sample snapshot */}
        <FadeIn delay={0.05} className="mt-20">
          <p className="text-xs font-bold uppercase tracking-[0.17em] text-slate-400">
            Your L&amp;D Snapshot
          </p>
          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-7">
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
              positioned for growth, but capacity and scalability may require
              greater attention.
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
        </FadeIn>

        {/* Your result */}
        <FadeIn delay={0.05} className="mt-20 text-center">
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

        {/* Final CTA */}
        <FadeIn delay={0.05} className="mt-20 rounded-xl bg-navy px-6 py-12 text-center sm:px-12">
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
            5 questions &middot; Approximately 2 minutes &middot; Personalized
            assessment
          </p>
        </FadeIn>
      </div>
    </div>
  )
}
