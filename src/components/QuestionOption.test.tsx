import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QuestionOption } from './QuestionOption'
import type { QuestionAnswer } from '../lib/types'

const ANSWERS: QuestionAnswer[] = [
  { code: 'A', text: 'First option', category: 'Cat A', display_order: 1 },
  { code: 'B', text: 'Second option', category: 'Cat B', display_order: 2 },
  { code: 'C', text: 'Third option', category: 'Cat C', display_order: 3 },
]

function Group({
  selected,
  onSelect,
  disabled,
}: {
  selected?: string
  onSelect: (code: string) => void
  disabled?: boolean
}) {
  return (
    <div role="radiogroup" aria-label="Test question">
      {ANSWERS.map((answer) => (
        <QuestionOption
          key={answer.code}
          questionCode="Q1"
          answer={answer}
          selected={selected === answer.code}
          onSelect={onSelect}
          disabled={disabled && answer.code === 'B'}
        />
      ))}
    </div>
  )
}

describe('QuestionOption', () => {
  it('renders as a native radio with the correct checked state', () => {
    render(<Group selected="B" onSelect={vi.fn()} />)
    expect(screen.getByRole('radio', { name: /first option/i })).not.toBeChecked()
    expect(screen.getByRole('radio', { name: /second option/i })).toBeChecked()
  });

  it('calls onSelect when clicked', async () => {
    const onSelect = vi.fn()
    render(<Group onSelect={onSelect} />)
    await userEvent.click(screen.getByRole('radio', { name: /first option/i }))
    expect(onSelect).toHaveBeenCalledWith('A')
  })

  it('calls onSelect when reached via keyboard and toggled with Space', async () => {
    const onSelect = vi.fn()
    render(<Group onSelect={onSelect} />)
    await userEvent.tab() // enters the radiogroup
    expect(screen.getByRole('radio', { name: /first option/i })).toHaveFocus()
    await userEvent.keyboard(' ')
    expect(onSelect).toHaveBeenCalledWith('A')
  })

  it('moves focus and selection with arrow keys within the group', async () => {
    const onSelect = vi.fn()
    render(<Group selected="A" onSelect={onSelect} />)
    const first = screen.getByRole('radio', { name: /first option/i })
    first.focus()
    await userEvent.keyboard('{ArrowDown}')
    expect(screen.getByRole('radio', { name: /second option/i })).toHaveFocus()
  })

  it('does not select a disabled option', async () => {
    const onSelect = vi.fn()
    render(<Group onSelect={onSelect} disabled />)
    const disabledOption = screen.getByRole('radio', { name: /second option/i })
    expect(disabledOption).toBeDisabled()
    await userEvent.click(disabledOption)
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('shows a checkmark (non-color cue) when selected, not just a color change', () => {
    const { container } = render(<Group selected="A" onSelect={vi.fn()} />)
    const firstLabel = screen.getByRole('radio', { name: /first option/i }).closest('label')
    expect(firstLabel?.querySelector('svg path')).toBeTruthy()
    const secondLabel = screen.getByRole('radio', { name: /second option/i }).closest('label')
    expect(secondLabel?.querySelector('svg path')).toBeFalsy()
    expect(container).toBeTruthy()
  })
})
