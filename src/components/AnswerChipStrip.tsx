import type { AnswerCode, Question, QuestionCode } from '../lib/types'
import { QUESTION_ACCENTS } from '../theme/tokens'

interface AnswerChipStripProps {
  questions: Question[]
  answers: Partial<Record<QuestionCode, AnswerCode>>
}

export function AnswerChipStrip({ questions, answers }: AnswerChipStripProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {questions.map((q) => {
        const answerCode = answers[q.code]
        const answer = q.answers.find((a) => a.code === answerCode)
        if (!answer) return null
        const accent = QUESTION_ACCENTS[q.code]

        return (
          <div
            key={q.code}
            className={`relative overflow-hidden rounded-lg border border-slate-200 ${accent.bg} p-4`}
          >
            <div
              className="absolute left-0 top-0 h-full w-1"
              style={{ backgroundColor: accent.accent }}
            />
            <p
              className="text-xs font-bold uppercase tracking-[0.13em]"
              style={{ color: accent.accent }}
            >
              {q.code} {q.name}
            </p>
            <p className="mt-2 text-base font-semibold text-navy">{answer.text}</p>
          </div>
        )
      })}
    </div>
  )
}
