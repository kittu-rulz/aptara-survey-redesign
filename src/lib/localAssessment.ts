import type { QuestionsResponse, SubmissionResult, SubmitAnswer } from './types'
import questionsData from '../fixtures/questions.json'
import { matrixSample } from '../fixtures'

/**
 * Static, self-contained stand-in for the live API (src/lib/api.ts).
 * Bundles real content pulled from the live backend earlier: the actual
 * question set, plus 37 real result combinations — a full Q1 x Q2 cross
 * (25, baseline Q3=B/Q4=A/Q5=A) plus Q3, Q4, and Q5 each varied
 * independently off the A-A-B-A-A baseline (12 more). Nothing here is
 * invented; it's all real backend output pulled earlier in the session.
 *
 * Every possible 5-answer combination is matched to whichever bundled
 * result shares the most answers with it, so the demo responds to changes
 * in any question, not just Q1/Q2 — it just won't always be an exact
 * backend match outside the pulled set.
 *
 * Swap the import in App.tsx back to ./api once the live backend's CORS
 * allowlist covers wherever this is deployed.
 */

export function getQuestions(): Promise<QuestionsResponse> {
  return Promise.resolve(questionsData as QuestionsResponse)
}

export function submitAssessment(
  answers: SubmitAnswer[],
): Promise<SubmissionResult> {
  const codes = answers
    .slice()
    .sort((a, b) => a.question.localeCompare(b.question))
    .map((a) => a.answer)

  const exact = matrixSample.find((r) => r.combination_key === codes.join('-'))
  if (exact) return Promise.resolve(exact)

  let best = matrixSample[0]
  let bestScore = -1
  for (const candidate of matrixSample) {
    const parts = candidate.combination_key.split('-')
    const score = parts.reduce((sum, part, i) => sum + (part === codes[i] ? 1 : 0), 0)
    if (score > bestScore) {
      bestScore = score
      best = candidate
    }
  }

  return Promise.resolve(best)
}
