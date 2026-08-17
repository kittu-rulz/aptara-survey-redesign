import { useState } from 'react'
import { motion } from 'framer-motion'
import type { AnswerCode, Question, QuestionCode, SubmissionResult } from '../lib/types'
import { parseSummary } from '../lib/parseSummary'
import { AnswerChipStrip } from '../components/AnswerChipStrip'
import { ResultSectionCard } from '../components/ResultSectionCard'
import { RecommendationPanel } from '../components/RecommendationPanel'

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
  const summary = parseSummary(result.summary)

  async function handleCopy() {
    const text = [
      result.reportTitle,
      '',
      result.summary,
      '',
      `Recommendation: ${result.recommendation}`,
      `Next Step: ${result.nextStep}`,
    ].join('\n')
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-3xl px-5 py-10 sm:px-7 sm:py-14"
    >
      <p className="text-xs font-bold uppercase tracking-[0.17em] text-q5">
        Assessment Complete
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-navy sm:text-5xl">
        {result.reportTitle}
      </h1>

      <div className="mt-5">
        <AnswerChipStrip questions={questions} answers={answers} />
      </div>

      <div className="mt-10">
        <p className="text-xs font-bold uppercase tracking-[0.17em] text-slate-400">
          Current Situation
        </p>
        <p className="mt-3 max-w-2xl text-xl leading-8 text-navy">
          {summary.situation}
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        <ResultSectionCard kind="strengths" label="Strengths" text={summary.strengths} />
        <ResultSectionCard kind="gap" label="Current Gap" text={summary.gap} />
        <ResultSectionCard kind="risk" label="Business Risk" text={summary.risk} />
      </div>

      <div className="mt-12 border-t border-slate-200 pt-10">
        <RecommendationPanel
          recommendation={result.recommendation}
          nextStep={result.nextStep}
        />
      </div>

      <p className="mt-8 text-center text-base leading-7 text-slate-600">
        Thank you for sharing your L&amp;D priorities with us. Your responses
        have been captured successfully.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-4 border-t border-slate-200 pt-7">
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-base font-semibold text-navy transition-colors hover:border-navy"
        >
          {copied ? 'Copied to clipboard' : 'Copy summary'}
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="text-base font-semibold text-q5 transition-colors hover:text-navy"
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
