import type { ReactNode } from 'react'

export type ResultSectionKind = 'situation' | 'strengths' | 'gap' | 'risk'

interface ResultSectionCardProps {
  kind: ResultSectionKind
  label: string
  text: string
}

const KIND_STYLES: Record<
  ResultSectionKind,
  { bg: string; border: string; text: string; icon: ReactNode }
> = {
  situation: {
    bg: 'bg-q5-tint',
    border: 'border-q5/30',
    text: 'text-q5',
    icon: (
      <path d="M12 2 2 7l10 5 10-5-10-5Zm0 20 10-5V9l-10 5-10-5v8l10 5Z" />
    ),
  },
  strengths: {
    bg: 'bg-q4-tint',
    border: 'border-q4/30',
    text: 'text-q4',
    icon: <path d="m5 12 4 4L19 6" />,
  },
  gap: {
    bg: 'bg-q2-tint',
    border: 'border-q2/30',
    text: 'text-q2',
    icon: (
      <path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a1 1 0 0 0 .86 1.5h18.64a1 1 0 0 0 .86-1.5L13.71 3.86a1 1 0 0 0-1.72 0Z" />
    ),
  },
  risk: {
    bg: 'bg-q3-tint',
    border: 'border-q3/30',
    text: 'text-q3',
    icon: (
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Zm0-13v4" />
    ),
  },
}

export function ResultSectionCard({ kind, label, text }: ResultSectionCardProps) {
  if (!text) return null
  const style = KIND_STYLES[kind]

  return (
    <div className={`rounded-xl border ${style.border} ${style.bg} p-6`}>
      <div className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wide ${style.text}`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden="true"
        >
          {style.icon}
        </svg>
        {label}
      </div>
      <p className="mt-2.5 text-base leading-7 text-slate-600">{text}</p>
    </div>
  )
}
