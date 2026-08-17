import type { QuestionsResponse, SubmissionResult, SubmitAnswer } from './types'

/**
 * Live API client — currently unused by App.tsx in favor of
 * ./localAssessment (a static, self-contained stand-in), since the backend's
 * CORS allowlist doesn't cover wherever this gets deployed yet. Swap the
 * import back in App.tsx once that's sorted out.
 */

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'https://aptarabe-qa.tjdem.online'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}/api/assessment${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!res.ok) {
    throw new Error(`Request to ${path} failed: ${res.status}`)
  }
  return res.json() as Promise<T>
}

export function getQuestions(): Promise<QuestionsResponse> {
  return request<QuestionsResponse>('/questions')
}

export function submitAssessment(
  answers: SubmitAnswer[],
): Promise<SubmissionResult> {
  return request<SubmissionResult>('/submissions', {
    method: 'POST',
    body: JSON.stringify({ answers }),
  })
}
