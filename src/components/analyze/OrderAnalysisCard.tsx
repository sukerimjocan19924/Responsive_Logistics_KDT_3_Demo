import { BarChart } from '../icons'
import { ANALYZE_PERIODS, ANALYTICS_BY_PERIOD, ORDER_ANALYSIS_LEGEND, type AnalyzePeriod, type OrderAnalysisRow } from '../../data/analyze'
import { Panel, PeriodDropdown } from './shared'
import { niceMax, buildTicks, formatTick } from './chartUtils'

const LEFT = 34
const RIGHT = 380
const TOP = 14
const BASE = 190

function OrderAnalysisChart({ data }: { data: OrderAnalysisRow[] }) {
  const totals = data.map((d) => d.new + d.done + d.canceled + d.returned)
  const max = niceMax(Math.max(...totals))
  const ticks = buildTicks(max)
  const groupW = (RIGHT - LEFT) / data.length
  const barW = Math.min(26, groupW * 0.5)
  const scale = (v: number) => (v / max) * (BASE - TOP)

  return (
    <svg viewBox="0 0 400 224" className="h-auto w-full" role="img" aria-label="주문 분석">
      {ticks.map((g, i) => {
        const y = BASE - scale(g)
        return (
          <g key={g}>
            <line x1={LEFT} y1={y} x2={RIGHT} y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray={i === 0 ? '0' : '3 4'} />
            <text x={LEFT - 6} y={y} textAnchor="end" dominantBaseline="central" fontSize="9" fill="#cbd5e1">
              {formatTick(g)}
            </text>
          </g>
        )
      })}

      {data.map((d, i) => {
        const cx = LEFT + groupW * i + groupW / 2
        let cursor = BASE
        return (
          <g key={d.label}>
            {ORDER_ANALYSIS_LEGEND.map((seg) => {
              const h = scale(d[seg.key])
              const y = cursor - h
              cursor = y
              return <rect key={seg.key} x={cx - barW / 2} y={y} width={barW} height={h} fill={seg.color} />
            })}
            <text x={cx} y={BASE + 15} textAnchor="middle" fontSize="10" fill="#94a3b8">
              {d.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export default function OrderAnalysisCard({
  period,
  onPeriodChange,
}: {
  period: AnalyzePeriod
  onPeriodChange: (p: AnalyzePeriod) => void
}) {
  const data = ANALYTICS_BY_PERIOD[period].orderAnalysis

  return (
    <Panel
      title="주문 분석"
      icon={<BarChart className="h-[18px] w-[18px] text-violet-500" />}
      delay={0}
      action={<PeriodDropdown value={period} options={ANALYZE_PERIODS} onChange={onPeriodChange} />}
    >
      <OrderAnalysisChart data={data} />
      <ul className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5">
        {ORDER_ANALYSIS_LEGEND.map((seg) => (
          <li key={seg.key} className="flex items-center gap-1.5 text-[12px] text-slate-500">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: seg.color }} />
            {seg.label}
          </li>
        ))}
      </ul>
    </Panel>
  )
}
