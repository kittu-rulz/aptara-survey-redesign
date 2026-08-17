import { useEffect } from 'react'
import { motion } from 'framer-motion'
import type { AnswerCode, Question, QuestionCode } from '../lib/types'
import { QUESTION_ACCENTS } from '../theme/tokens'
import { ProgressSteps } from '../components/ProgressSteps'
import { QuestionOption } from '../components/QuestionOption'

interface QuestionScreenProps {
  questions: Question[]
  currentIndex: number
  answers: Partial<Record<QuestionCode, AnswerCode>>
  onSelect: (question: QuestionCode, answer: AnswerCode) => void
  onNext: () => void
  onPrevious: () => void
  onSubmit: () => void
}

export function QuestionScreen({
  questions,
  currentIndex,
  answers,
  onSelect,
  onNext,
  onPrevious,
  onSubmit,
}: QuestionScreenProps) {
  const question = questions[currentIndex]
  const selected = answers[question.code]
  const isFirst = currentIndex === 0
  const isLast = currentIndex === questions.length - 1
  const accent = QUESTION_ACCENTS[question.code]

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const letterIndex = 'ABCDE'.indexOf(e.key.toUpperCase())
      const numberIndex = '12345'.indexOf(e.key)
      const index = letterIndex !== -1 ? letterIndex : numberIndex
      if (index !== -1 && index < question.answers.length) {
        onSelect(question.code, question.answers[index].code)
        return
      }
      if (e.key === 'Enter' && selected) {
        if (isLast) onSubmit()
        else onNext()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [question, selected, isLast, onSelect, onNext, onSubmit])

  return (
    <div className="mx-auto max-w-2xl px-5 py-10 sm:px-7 sm:py-14">
      <ProgressSteps
        questions={questions}
        currentCode={question.code}
        currentIndex={currentIndex}
      />

      <motion.div
        key={question.code}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25 }}
        className="mt-8"
      >
        <p
          className="text-xs font-bold uppercase tracking-[0.17em]"
          style={{ color: accent.accent }}
        >
          {question.name}
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
          {question.title}
        </h2>

        <div
          role="radiogroup"
          aria-label={question.title}
          className="mt-6 flex flex-col gap-3"
        >
          {question.answers.map((answer) => (
            <QuestionOption
              key={answer.code}
              questionCode={question.code}
              answer={answer}
              selected={selected === answer.code}
              onSelect={(code) => onSelect(question.code, code)}
            />
          ))}
        </div>
      </motion.div>

      <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
        <button
          type="button"
          onClick={onPrevious}
          disabled={isFirst}
          className="text-base font-semibold text-slate-500 transition-colors hover:text-navy disabled:invisible"
        >
          &larr; Previous
        </button>
        <button
          type="button"
          onClick={isLast ? onSubmit : onNext}
          disabled={!selected}
          className="rounded-lg bg-navy px-7 py-3 text-base font-semibold text-white transition-colors hover:bg-navy-light disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isLast ? 'Submit Assessment' : 'Continue'}
        </button>
      </div>
      <p className="mt-3 text-center text-sm text-slate-400">
        {selected ? 'Answer selected' : 'Select one answer to continue'}
      </p>
    </div>
  )
}
