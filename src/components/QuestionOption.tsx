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
      className={`flex w-full items-start gap-4 rounded-xl border px-5 py-4 text-left transition-colors ${
        selected
          ? `${accent.border} ${accent.bg}`
          : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
      style={selected ? { borderColor: accent.accent } : undefined}
    >
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold"
        style={{
          borderColor: selected ? accent.accent : '#cbd5e1',
          color: selected ? accent.accent : '#94a3b8',
          backgroundColor: selected ? 'white' : 'transparent',
        }}
      >
        {answer.code}
      </span>
      <span className="min-w-0">
        <span
          className="block text-xs font-bold uppercase tracking-wide"
          style={{ color: selected ? accent.accent : '#94a3b8' }}
        >
          {answer.category}
        </span>
        <span className="mt-1 block text-base text-navy sm:text-lg">
          {answer.text}
        </span>
      </span>
    </button>
  )
}
