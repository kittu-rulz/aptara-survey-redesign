interface RecommendationPanelProps {
  recommendation: string
  nextStep: string
}

export function RecommendationPanel({
  recommendation,
  nextStep,
}: RecommendationPanelProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-navy-light/20 bg-q5-tint p-6">
        <p className="text-sm font-bold uppercase tracking-[0.17em] text-q5">
          Recommendation
        </p>
        <p className="mt-2.5 text-base leading-7 text-slate-600">{recommendation}</p>
      </div>
      <div className="rounded-xl border border-q4/20 bg-q4-tint p-6">
        <p className="text-sm font-bold uppercase tracking-[0.17em] text-q4">
          Next Step
        </p>
        <p className="mt-2.5 text-base leading-7 text-slate-600">{nextStep}</p>
      </div>
    </div>
  )
}
