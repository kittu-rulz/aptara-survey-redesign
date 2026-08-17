import type { QuestionCode } from '../lib/types'

interface AccentTokens {
  accent: string
  tint: string
  text: string
  bg: string
  border: string
  ring: string
}

/**
 * Per-question accent system, matching the color coding already used by the
 * current site's result summary cards (extracted from its rendered output).
 * Ties the wizard's answer options and the results screen chips together.
 */
export const QUESTION_ACCENTS: Record<QuestionCode, AccentTokens> = {
  Q1: {
    accent: '#12859B',
    tint: '#EAF6F8',
    text: 'text-q1',
    bg: 'bg-q1-tint',
    border: 'border-q1',
    ring: 'ring-q1',
  },
  Q2: {
    accent: '#D98B16',
    tint: '#FFF6E7',
    text: 'text-q2',
    bg: 'bg-q2-tint',
    border: 'border-q2',
    ring: 'ring-q2',
  },
  Q3: {
    accent: '#C83252',
    tint: '#FFF0F3',
    text: 'text-q3',
    bg: 'bg-q3-tint',
    border: 'border-q3',
    ring: 'ring-q3',
  },
  Q4: {
    accent: '#168666',
    tint: '#EDF8F4',
    text: 'text-q4',
    bg: 'bg-q4-tint',
    border: 'border-q4',
    ring: 'ring-q4',
  },
  Q5: {
    accent: '#205A9E',
    tint: '#EEF3FA',
    text: 'text-q5',
    bg: 'bg-q5-tint',
    border: 'border-q5',
    ring: 'ring-q5',
  },
}
