import { type CSSProperties } from 'react'
import { MapPin } from '../icons'
import { useInView } from '../../hooks/useInView'
import { ANALYZE_PERIODS, ANALYTICS_BY_PERIOD, type AnalyzePeriod } from '../../data/analyze'
import { Panel, PeriodDropdown } from './shared'
import { niceMax } from './chartUtils'

const isFigma = typeof window !== 'undefined' && window.location.search.includes('figma=1')

export default function RegionTop5Card({
  period,
  onPeriodChange,
}: {
  period: AnalyzePeriod
  onPeriodChange: (p: AnalyzePeriod) => void
}) {
  const regions = ANALYTICS_BY_PERIOD[period].regionTop5
  const max = niceMax(regions[0]?.count ?? 0)
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <Panel
      title="지역별 배송 TOP5"
      icon={<MapPin className="h-[18px] w-[18px] text-emerald-500" />}
      delay={80}
      action={<PeriodDropdown value={period} options={ANALYZE_PERIODS} onChange={onPeriodChange} />}
    >
      <div ref={ref} className="flex flex-1 flex-col justify-center gap-4">
        {regions.map((r, i) => (
          <div key={r.region} className="flex items-center gap-3">
            <span className="w-8 shrink-0 text-[13px] font-semibold text-slate-600">{r.region}</span>
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full bg-gradient-to-r from-sky-400 to-sky-600 ${inView ? 'is-visible' : ''} ${isFigma ? '!w-[var(--bar-w)] transition-none' : 'grow-bar'}`}
                style={{ '--bar-w': `${(r.count / max) * 100}%`, '--reveal-delay': `${i * 90}ms` } as CSSProperties}
              />
            </div>
            <b className="w-14 shrink-0 text-right text-[13px] font-bold tabular-nums text-slate-800">{r.count.toLocaleString()}</b>
          </div>
        ))}
      </div>
    </Panel>
  )
}
