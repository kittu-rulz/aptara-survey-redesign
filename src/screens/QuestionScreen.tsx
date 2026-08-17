import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { AnswerCode, Question, QuestionCode } from '../lib/types'
import { QUESTION_ACCENTS } from '../theme/tokens'
import { ProgressSteps } from '../components/ProgressSteps'
import { QuestionOption } from '../components/QuestionOption'
import { useReducedMotion } from '../lib/useReducedMotion'

interface QuestionScreenProps {
  questions: Question[]
  currentIndex: number
  answers: Partial<Record<QuestionCode, AnswerCode>>
  onSelect: (question: QuestionCode, answer: AnswerCode) => void
  onNext: () => void
  onPrevious: () => void
  onSubmit: () => void
  onStartOver: () => void
}

const START_OVER_CONFIRM_WINDOW_MS = 3000

export function QuestionScreen({
  questions,
  currentIndex,
  answers,
  onSelect,
  onNext,
  onPrevious,
  onSubmit,
  onStartOver,
}: QuestionScreenProps) {
  const question = questions[currentIndex]
  const selected = answers[question.code]
  const isFirst = currentIndex === 0
  const isLast = currentIndex === questions.length - 1
  const accent = QUESTION_ACCENTS[question.code]
  const prefersReducedMotion = useReducedMotion()
  const headingRef = useRef<HTMLHeadingElement>(null)
  const [confirmingStartOver, setConfirmingStartOver] = useState(false)
  const hintId = `${question.code}-continue-hint`

  // Move focus to the new question and reset scroll on every navigation —
  // prevents focus loss and disorienting scroll position when advancing.
  useEffect(() => {
    headingRef.current?.focus()
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' })
    setConfirmingStartOver(false)
    // Only question changes should trigger this, not motion preference changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex])

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

  function handleStartOverClick() {
    if (confirmingStartOver) {
      onStartOver()
      return
    }
    setConfirmingStartOver(true)
    setTimeout(() => setConfirmingStartOver(false), START_OVER_CONFIRM_WINDOW_MS)
  }

  return (
    <div className="mx-auto max-w-2xl px-5 pb-24 pt-10 sm:px-7 sm:pb-14 sm:pt-14">
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0 flex-1">
          <ProgressSteps
            questions={questions}
            currentCode={question.code}
            currentIndex={currentIndex}
          />
        </div>
        <button
          type="button"
          onClick={handleStartOverClick}
          className={`shrink-0 whitespace-nowrap text-xs font-semibold transition-colors ${
            confirmingStartOver ? 'text-q3' : 'text-slate-400 hover:text-navy'
          }`}
        >
          {confirmingStartOver ? 'Click again to confirm' : 'Start Over'}
        </button>
      </div>

      <motion.div
        key={question.code}
        initial={prefersReducedMotion ? false : { opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.25 }}
        className="mt-8"
      >
        <p
          className="text-xs font-bold uppercase tracking-[0.17em]"
          style={{ color: accent.accent }}
        >
          {question.name}
        </p>
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="mt-3 text-3xl font-semibold tracking-tight text-navy outline-none sm:text-4xl"
        >
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

      {/* Sticky above the safe-area on mobile; normal document flow from
          sm: up, so it never floats over answer content on larger screens. */}
      <div className="sticky bottom-0 z-20 -mx-5 mt-8 border-t border-slate-200 bg-white/95 px-5 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-4 backdrop-blur sm:static sm:z-auto sm:mx-0 sm:border-t sm:bg-white sm:px-0 sm:pb-0 sm:pt-6 sm:backdrop-blur-none">
        <div className="flex items-center justify-between">
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
            aria-describedby={hintId}
            className="rounded-lg bg-navy px-7 py-3 text-base font-semibold text-white transition-colors hover:bg-navy-light disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isLast ? 'Submit Assessment' : 'Continue'}
          </button>
        </div>
        <p id={hintId} className="mt-3 text-center text-sm text-slate-400">
          {selected ? 'Answer selected' : 'Select one answer to continue'}
        </p>
      </div>
    </div>
  )
}
