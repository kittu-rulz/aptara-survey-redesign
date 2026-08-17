import type { ParsedSummary } from './types'

const LABELS: Array<{ key: keyof ParsedSummary; label: string }> = [
  { key: 'situation', label: 'Current Situation' },
  { key: 'strengths', label: 'Strengths' },
  { key: 'gap', label: 'Current Gap' },
  { key: 'risk', label: 'Business Risk' },
]

/**
 * The API returns one string with four `Label: text` sections separated by
 * blank lines. Split it into a typed object so the UI can render distinct cards.
 */
export function parseSummary(summary: string): ParsedSummary {
  const pattern = LABELS.map((l) => l.label).join('|')
  const re = new RegExp(`(${pattern}):\\s*`, 'g')

  const parts: Record<string, string> = {}
  const matches = [...summary.matchAll(re)]

  matches.forEach((match, i) => {
    const label = match[1]
    const start = match.index! + match[0].length
    const end = i + 1 < matches.length ? matches[i + 1].index! : summary.length
    parts[label] = summary.slice(start, end).trim()
  })

  return {
    situation: parts['Current Situation'] ?? '',
    strengths: parts['Strengths'] ?? '',
    gap: parts['Current Gap'] ?? '',
    risk: parts['Business Risk'] ?? '',
  }
}
