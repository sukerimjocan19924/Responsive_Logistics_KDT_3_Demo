import { TrendingUp } from '../icons'
import { ANALYZE_PERIODS, ANALYTICS_BY_PERIOD, type AnalyzePeriod, type TrendPoint } from '../../data/analyze'
import { Panel, PeriodDropdown } from './shared'
import { niceMax, buildTicks, formatTick } from './chartUtils'

const LEFT = 40
const RIGHT = 780
const TOP = 20
const BASE = 210

function toXY(i: number, value: number, count: number, max: number) {
  const step = (RIGHT - LEFT) / Math.max(1, count - 1)
  const x = LEFT + step * i
  const y = BASE - (value / max) * (BASE - TOP)
  return { x, y }
}

function DeliveryTrendChart({ data }: { data: TrendPoint[] }) {
  const max = niceMax(Math.max(...data.map((d) => d.value)))
  const ticks = buildTicks(max)
  const points = data.map((d, i) => ({ ...d, ...toXY(i, d.value, data.length, max) }))
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${BASE} L ${points[0].x} ${BASE} Z`

  return (
    <svg viewBox="0 0 820 250" className="h-auto w-full" role="img" aria-label="배송 추이">
      <defs>
        <linearGradient id="deliveryTrendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
        </linearGradient>
      </defs>

      {ticks.map((g, i) => {
        const y = BASE - (g / max) * (BASE - TOP)
        return (
          <g key={g}>
            <line x1={LEFT} y1={y} x2={RIGHT} y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray={i === 0 ? '0' : '3 4'} />
            <text x={LEFT - 8} y={y} textAnchor="end" dominantBaseline="central" fontSize="10" fill="#94a3b8">
              {formatTick(g)}
            </text>
          </g>
        )
      })}

      <path d={areaPath} fill="url(#deliveryTrendFill)" />
      <path d={linePath} fill="none" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {points.map((p) => (
        <g key={p.label}>
          <circle cx={p.x} cy={p.y} r="4" fill="#fff" stroke="#0ea5e9" strokeWidth="2.5" />
          <text x={p.x} y={p.y - 14} textAnchor="middle" fontSize="11" fontWeight="700" fill="#334155">
            {p.value.toLocaleString()}
          </text>
          <text x={p.x} y={BASE + 22} textAnchor="middle" fontSize="10.5" fill="#94a3b8">
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  )
}

export default function DeliveryTrendCard({
  period,
  onPeriodChange,
}: {
  period: AnalyzePeriod
  onPeriodChange: (p: AnalyzePeriod) => void
}) {
  const data = ANALYTICS_BY_PERIOD[period].deliveryTrend

  return (
    <Panel
      title="배송 추이"
      icon={<TrendingUp className="h-[18px] w-[18px] text-sky-500" />}
      delay={0}
      action={<PeriodDropdown value={period} options={ANALYZE_PERIODS} onChange={onPeriodChange} />}
    >
      <div className="mt-1">
        <DeliveryTrendChart data={data} />
      </div>
    </Panel>
  )
}
