import { useEffect, useMemo, useState } from 'react'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { LandingScreen } from './screens/LandingScreen'
import { QuestionScreen } from './screens/QuestionScreen'
import { ProcessingScreen } from './screens/ProcessingScreen'
import { ResultsScreen } from './screens/ResultsScreen'
import { getQuestions, submitAssessment } from './lib/localAssessment'
import type { AnswerCode, Question, QuestionCode, SubmissionResult } from './lib/types'
import { matrixSample } from './fixtures'

type Screen = 'landing' | 'question' | 'processing' | 'results'

const QUESTION_ORDER: QuestionCode[] = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5']

function App() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [questions, setQuestions] = useState<Question[]>([])
  const [questionsError, setQuestionsError] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Partial<Record<QuestionCode, AnswerCode>>>({})
  const [result, setResult] = useState<SubmissionResult | null>(null)
  const [submitError, setSubmitError] = useState('')

  const mockKey = useMemo(
    () => new URLSearchParams(window.location.search).get('mock'),
    [],
  )

  useEffect(() => {
    getQuestions()
      .then((res) => setQuestions(res.questions))
      .catch(() => setQuestionsError('Unable to load assessment questions.'))
  }, [])

  // Dev shortcut: ?mock=A-B-B-A-A jumps straight to the results screen using
  // a pulled fixture, for iterating on the results layout without spamming
  // the live API.
  useEffect(() => {
    if (!mockKey || questions.length === 0) return
    const fixture = matrixSample.find((r) => r.combination_key === mockKey)
    if (!fixture) return
    const codes = mockKey.split('-') as AnswerCode[]
    const mockAnswers: Partial<Record<QuestionCode, AnswerCode>> = {}
    QUESTION_ORDER.forEach((q, i) => {
      mockAnswers[q] = codes[i]
    })
    setAnswers(mockAnswers)
    setResult(fixture)
    setScreen('results')
  }, [mockKey, questions])

  function handleStart() {
    if (questions.length > 0) setScreen('question')
  }

  function handleSelect(question: QuestionCode, answer: AnswerCode) {
    setAnswers((prev) => ({ ...prev, [question]: answer }))
  }

  function handleNext() {
    setCurrentIndex((i) => Math.min(i + 1, questions.length - 1))
  }

  function handlePrevious() {
    setCurrentIndex((i) => Math.max(i - 1, 0))
  }

  async function handleSubmit() {
    setScreen('processing')
    setSubmitError('')
    const payload = QUESTION_ORDER.filter((q) => answers[q]).map((q) => ({
      question: q,
      answer: answers[q]!,
    }))

    const [res] = await Promise.all([
      submitAssessment(payload),
      new Promise((resolve) => setTimeout(resolve, 700)),
    ]).catch((err) => {
      setSubmitError('Something went wrong preparing your result. Please try again.')
      setScreen('question')
      throw err
    })

    if (res) {
      setResult(res)
      setScreen('results')
    }
  }

  function handleRestart() {
    setAnswers({})
    setCurrentIndex(0)
    setResult(null)
    setSubmitError('')
    setScreen('landing')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {questionsError && (
          <p className="mx-auto mt-10 max-w-md text-center text-sm text-q3">
            {questionsError}
          </p>
        )}

        {!questionsError && screen === 'landing' && (
          <LandingScreen onStart={handleStart} />
        )}

        {!questionsError && screen === 'question' && questions.length > 0 && (
          <>
            <QuestionScreen
              questions={questions}
              currentIndex={currentIndex}
              answers={answers}
              onSelect={handleSelect}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onSubmit={handleSubmit}
            />
            {submitError && (
              <p className="mx-auto -mt-4 max-w-2xl px-5 text-center text-sm text-q3">
                {submitError}
              </p>
            )}
          </>
        )}

        {!questionsError && screen === 'processing' && <ProcessingScreen />}

        {!questionsError && screen === 'results' && result && (
          <ResultsScreen
            result={result}
            questions={questions}
            answers={answers}
            onRestart={handleRestart}
          />
        )}
      </main>
      <Footer />
    </div>
  )
}

export default App
