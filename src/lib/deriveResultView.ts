import type { AnswerCode, Question, QuestionCode, SubmissionResult } from './types'
import { parseSummary } from './parseSummary'

export interface ResultSignal {
  code: QuestionCode
  label: string
  value: string
}

export interface ResultPriority {
  heading: string
  text: string
}

export interface ResultView {
  classification: string
  interpretation: string
  signals: ResultSignal[]
  strengths: string
  priorities: ResultPriority[]
  next30: string
  next90: string
}

function stripLeadingLabel(text: string): string {
  return text.replace(/^[^:]{0,40}:\s*/, '')
}

function categoryFor(
  questions: Question[],
  answers: Partial<Record<QuestionCode, AnswerCode>>,
  code: QuestionCode,
): string {
  const question = questions.find((q) => q.code === code)
  const answer = question?.answers.find((a) => a.code === answers[code])
  return answer?.category ?? ''
}

/**
 * Builds the results-page view model entirely from real API fields — no
 * data is invented. Classification and the three signals are literally the
 * user's own answer categories; priorities are the existing Gap/Risk text
 * reframed as two priorities; the 30/90-day split reuses the existing
 * nextStep (already phrased as an immediate action) and recommendation
 * (already phrased as the strategic direction) text under a time-horizon
 * frame.
 */
export function deriveResultView(
  result: SubmissionResult,
  questions: Question[],
  answers: Partial<Record<QuestionCode, AnswerCode>>,
): ResultView {
  const summary = parseSummary(result.summary)

  const signalQuestions: QuestionCode[] = ['Q2', 'Q3', 'Q4']
  const signals: ResultSignal[] = signalQuestions.map((code) => ({
    code,
    label: questions.find((q) => q.code === code)?.name ?? code,
    value: categoryFor(questions, answers, code),
  }))

  return {
    classification: categoryFor(questions, answers, 'Q1'),
    interpretation: summary.situation,
    signals,
    strengths: summary.strengths,
    priorities: [
      { heading: 'Close the gap', text: summary.gap },
      { heading: 'Reduce the risk', text: summary.risk },
    ],
    next30: stripLeadingLabel(result.nextStep),
    next90: stripLeadingLabel(result.recommendation),
  }
}
