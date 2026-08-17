import type { AnswerCode, QuestionAnswer, QuestionCode } from '../lib/types'
import { QUESTION_ACCENTS } from '../theme/tokens'

interface QuestionOptionProps {
  questionCode: QuestionCode
  answer: QuestionAnswer
  selected: boolean
  onSelect: (code: AnswerCode) => void
}

export function QuestionOption({
  questionCode,
  answer,
  selected,
  onSelect,
}: QuestionOptionProps) {
  const accent = QUESTION_ACCENTS[questionCode]

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={() => onSelect(answer.code)}
      className={`group relative flex w-full items-start gap-5 overflow-hidden rounded-xl border bg-white py-5 pl-6 pr-5 text-left transition-all duration-150 ${
        selected
          ? 'border-slate-200 shadow-md shadow-slate-200/60'
          : 'border-slate-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      <span
        className="absolute inset-y-0 left-0 w-1 transition-colors duration-150"
        style={{ backgroundColor: selected ? accent.accent : 'transparent' }}
      />

      <span
        className="select-none text-2xl font-bold tabular-nums transition-colors duration-150"
        style={{ color: selected ? accent.accent : '#cbd5e1' }}
        aria-hidden="true"
      >
        {answer.code}
      </span>

      <span className="min-w-0 flex-1 pt-0.5">
        <span
          className="block text-xs font-bold uppercase tracking-wide transition-colors duration-150"
          style={{ color: selected ? accent.accent : '#94a3b8' }}
        >
          {answer.category}
        </span>
        <span className="mt-1 block text-base text-navy sm:text-lg">
          {answer.text}
        </span>
      </span>

      <span
        className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-150"
        style={{
          borderColor: selected ? accent.accent : '#e2e8f0',
          backgroundColor: selected ? accent.accent : 'transparent',
        }}
        aria-hidden="true"
      >
        {selected && (
          <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3 text-white">
            <path
              d="m5 12 4 4L19 6"
              stroke="currentColor"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
    </button>
  )
}
