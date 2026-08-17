import type { ReactNode } from 'react'

const NO_WRAP_PHRASE = 'L&D function'

/**
 * Keeps "L&D function" from splitting across a line wrap at narrow
 * viewport widths — used by both the 3D hero and its static fallback.
 */
export function renderHeroLine(text: string): ReactNode {
  const idx = text.indexOf(NO_WRAP_PHRASE)
  if (idx === -1) return text

  return (
    <>
      {text.slice(0, idx)}
      <span className="whitespace-nowrap">{NO_WRAP_PHRASE}</span>
      {text.slice(idx + NO_WRAP_PHRASE.length)}
    </>
  )
}
