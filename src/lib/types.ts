export type QuestionCode = 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'Q5'
export type AnswerCode = 'A' | 'B' | 'C' | 'D' | 'E'

export interface QuestionAnswer {
  code: AnswerCode
  text: string
  category: string
  display_order: number
}

export interface Question {
  code: QuestionCode
  name: string
  title: string
  supporting_text: string
  question_type: 'SINGLE'
  min_selections: number
  max_selections: number
  display_order: number
  answers: QuestionAnswer[]
}

export interface QuestionsResponse {
  questions: Question[]
}

export interface SubmitAnswer {
  question: QuestionCode
  answer: AnswerCode
}

export interface SubmissionResult {
  success: boolean
  assessment_id: string
  combination_key: string
  reportTitle: string
  summary: string
  recommendation: string
  nextStep: string
  status: string
  version: number
  is_dummy: boolean
}

export interface ParsedSummary {
  situation: string
  strengths: string
  gap: string
  risk: string
}
