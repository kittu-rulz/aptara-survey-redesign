import { useState } from 'react'
import { motion } from 'framer-motion'
import type { AnswerCode, Question, QuestionCode, SubmissionResult } from '../lib/types'
import { deriveResultView } from '../lib/deriveResultView'
import { AnswerChipStrip } from '../components/AnswerChipStrip'
import { RecommendationPanel } from '../components/RecommendationPanel'
import { useReducedMotion } from '../lib/useReducedMotion'

interface ResultsScreenProps {
  result: SubmissionResult
  questions: Question[]
  answers: Partial<Record<QuestionCode, AnswerCode>>
  onRestart: () => void
}

export function ResultsScreen({
  result,
  questions,
  answers,
  onRestart,
}: ResultsScreenProps) {
  const [copied, setCopied] = useState(false)
  const view = deriveResultView(result, questions, answers)
  const prefersReducedMotion = useReducedMotion()

  async function handleCopy() {
    const text = [
      result.reportTitle,
      '',
      `Classification: ${view.classification}`,
      view.interpretation,
      '',
      `Next 30 days: ${view.next30}`,
      `Next 90 days: ${view.next90}`,
    ].join('\n')
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
      className="mx-auto max-w-3xl px-5 py-10 sm:px-7 sm:py-14"
    >
      {/* Diagnostic content — value delivered up front, before any secondary action */}
      <p className="text-xs font-bold uppercase tracking-[0.17em] text-q5">
        Assessment Complete
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-navy sm:text-5xl">
        {result.reportTitle}
      </h1>

      <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-q5/30 bg-q5-tint px-4 py-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-q5" aria-hidden="true" />
        <span className="text-xs font-bold uppercase tracking-wide text-q5">
          Maturity: {view.classification}
        </span>
      </div>

      <p className="mt-5 max-w-2xl text-xl leading-8 text-navy">{view.interpretation}</p>

      {/* Three response-derived signals */}
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {view.signals.map((signal) => (
          <div key={signal.code} className="rounded-lg border border-slate-200 bg-white px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
              {signal.label}
            </p>
            <p className="mt-1 text-base font-semibold text-navy">{signal.value}</p>
          </div>
        ))}
      </div>

      {view.strengths && (
        <p className="mt-8 text-base leading-7 text-slate-600">
          <span className="font-semibold text-navy">A strength working in your favor: </span>
          {view.strengths}
        </p>
      )}

      {/* Top two recommended priorities */}
      <div className="mt-12">
        <p className="text-xs font-bold uppercase tracking-[0.17em] text-slate-400">
          Top Priorities
        </p>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          {view.priorities.map((priority, i) => (
            <div key={priority.heading} className="rounded-xl border border-slate-200 bg-white p-6">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                Priority {i + 1}
              </p>
              <p className="mt-1 text-lg font-semibold text-navy">{priority.heading}</p>
              <p className="mt-2 text-base leading-7 text-slate-600">{priority.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Practical next steps */}
      <div className="mt-12 border-t border-slate-200 pt-10">
        <p className="text-xs font-bold uppercase tracking-[0.17em] text-slate-400">
          What To Do Next
        </p>
        <div className="mt-4">
          <RecommendationPanel next30={view.next30} next90={view.next90} />
        </div>
      </div>

      {/* Methodology — plain-language, clearly diagnostic rather than marketing */}
      <p className="mt-10 border-t border-slate-200 pt-6 text-sm leading-6 text-slate-400">
        <span className="font-semibold text-slate-500">How this was generated: </span>
        Your five answers are matched to the closest of several real scenarios
        mapped out for L&amp;D functions like yours, based primarily on your
        maturity stage and biggest challenge. It&apos;s a diagnostic starting
        point, not a guarantee — the priorities above are worth validating
        against your own context.
      </p>

      {/* Supporting detail */}
      <div className="mt-8">
        <p className="text-xs font-bold uppercase tracking-[0.17em] text-slate-400">
          Your Responses
        </p>
        <div className="mt-3">
          <AnswerChipStrip questions={questions} answers={answers} />
        </div>
      </div>

      {/* Utility actions — visually separated from the diagnostic content above */}
      <p className="mt-10 text-center text-base leading-7 text-slate-600">
        Thank you for sharing your L&amp;D priorities with us. Your responses
        have been captured successfully.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-4 border-t border-slate-200 pt-7">
        <button type="button" onClick={handleCopy} className="btn-secondary px-5 py-2.5">
          {copied && (
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-q4" aria-hidden="true">
              <path
                d="m5 12 4 4L19 6"
                stroke="currentColor"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {copied ? 'Copied to clipboard' : 'Copy summary'}
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="btn border border-q5/30 px-5 py-2.5 text-q5 hover:-translate-y-0.5 hover:border-q5 hover:bg-q5-tint hover:shadow-sm"
        >
          &larr; Restart Assessment
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-2 border-t border-slate-200 pt-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <span>L&amp;D Assessment</span>
        <span>Response received</span>
      </div>
    </motion.div>
  )
}
