import { describe, expect, it } from 'vitest'
import { deriveResultView } from './deriveResultView'
import type { Question, SubmissionResult } from './types'

const QUESTIONS: Question[] = [
  {
    code: 'Q1',
    name: 'Maturity Stage',
    title: 'Q1 title',
    supporting_text: '',
    question_type: 'SINGLE',
    min_selections: 1,
    max_selections: 1,
    display_order: 1,
    answers: [{ code: 'A', text: 'Early text', category: 'Early Stage', display_order: 1 }],
  },
  {
    code: 'Q2',
    name: 'Business Pain Points',
    title: 'Q2 title',
    supporting_text: '',
    question_type: 'SINGLE',
    min_selections: 1,
    max_selections: 1,
    display_order: 2,
    answers: [{ code: 'B', text: 'Compliance text', category: 'Compliance', display_order: 2 }],
  },
  {
    code: 'Q3',
    name: 'Delivery Models',
    title: 'Q3 title',
    supporting_text: '',
    question_type: 'SINGLE',
    min_selections: 1,
    max_selections: 1,
    display_order: 3,
    answers: [{ code: 'B', text: 'VILT text', category: 'Virtual Training', display_order: 2 }],
  },
  {
    code: 'Q4',
    name: 'Team Capacity',
    title: 'Q4 title',
    supporting_text: '',
    question_type: 'SINGLE',
    min_selections: 1,
    max_selections: 1,
    display_order: 4,
    answers: [{ code: 'A', text: 'Solo text', category: 'Single Person', display_order: 1 }],
  },
  {
    code: 'Q5',
    name: 'Business Goals',
    title: 'Q5 title',
    supporting_text: '',
    question_type: 'SINGLE',
    min_selections: 1,
    max_selections: 1,
    display_order: 5,
    answers: [{ code: 'A', text: 'Speed text', category: 'Speed', display_order: 1 }],
  },
]

const RESULT: SubmissionResult = {
  success: true,
  assessment_id: 'test',
  combination_key: 'A-B-B-A-A',
  reportTitle: 'Compliance at a Crossroads',
  summary:
    'Current Situation: You are a solo practitioner.\n\nStrengths: You move fast.\n\nCurrent Gap: No backup exists.\n\nBusiness Risk: Single point of failure.',
  recommendation: 'Recommended Direction: Build a repeatable system.',
  nextStep: 'Next Step: Audit your current process this week.',
  status: 'APPROVED',
  version: 1,
  is_dummy: false,
}

const ANSWERS = { Q1: 'A', Q2: 'B', Q3: 'B', Q4: 'A', Q5: 'A' } as const

describe('deriveResultView', () => {
  it('derives the maturity classification from the Q1 answer category', () => {
    const view = deriveResultView(RESULT, QUESTIONS, ANSWERS)
    expect(view.classification).toBe('Early Stage')
  })

  it('uses the parsed situation text as the interpretation', () => {
    const view = deriveResultView(RESULT, QUESTIONS, ANSWERS)
    expect(view.interpretation).toBe('You are a solo practitioner.')
  })

  it('derives exactly three signals from Q2/Q3/Q4 answer categories', () => {
    const view = deriveResultView(RESULT, QUESTIONS, ANSWERS)
    expect(view.signals).toHaveLength(3)
    expect(view.signals.map((s) => s.value)).toEqual([
      'Compliance',
      'Virtual Training',
      'Single Person',
    ])
  })

  it('derives exactly two priorities from Gap and Risk', () => {
    const view = deriveResultView(RESULT, QUESTIONS, ANSWERS)
    expect(view.priorities).toHaveLength(2)
    expect(view.priorities[0].text).toBe('No backup exists.')
    expect(view.priorities[1].text).toBe('Single point of failure.')
  })

  it('maps nextStep to the 30-day horizon and recommendation to the 90-day horizon, with labels stripped', () => {
    const view = deriveResultView(RESULT, QUESTIONS, ANSWERS)
    expect(view.next30).toBe('Audit your current process this week.')
    expect(view.next90).toBe('Build a repeatable system.')
  })
})
