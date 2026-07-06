import { Clock } from '../icons'
import { ANALYZE_PERIODS, ANALYTICS_BY_PERIOD, type AnalyzePeriod, type HourlyPoint } from '../../data/analyze'
import { Panel, PeriodDropdown } from './shared'
import { niceMax, buildTicks, formatTick } from './chartUtils'

const LEFT = 30
const RIGHT = 380
const TOP = 12
const BASE = 150

function HourlyVolumeChart({ data }: { data: HourlyPoint[] }) {
  const max = niceMax(Math.max(...data.map((d) => d.count)))
  const ticks = buildTicks(max, 4)
  const groupW = (RIGHT - LEFT) / data.length
  const barW = groupW * 0.6

  return (
    <svg viewBox="0 0 400 180" className="h-auto w-full" role="img" aria-label="시간대별 배송량">
      {ticks.map((g, i) => {
        const y = BASE - (g / max) * (BASE - TOP)
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
        const h = (d.count / max) * (BASE - TOP)
        return (
          <g key={d.hour}>
            <rect x={cx - barW / 2} y={BASE - h} width={barW} height={h} rx="2" fill="#8b5cf6" fillOpacity={0.85} />
            {d.hour % 4 === 0 && (
              <text x={cx} y={BASE + 14} textAnchor="middle" fontSize="9.5" fill="#94a3b8">
                {String(d.hour).padStart(2, '0')}시
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

export default function HourlyVolumeCard({
  period,
  onPeriodChange,
}: {
  period: AnalyzePeriod
  onPeriodChange: (p: AnalyzePeriod) => void
}) {
  const data = ANALYTICS_BY_PERIOD[period].hourlyVolume

  return (
    <Panel
      title="시간대별 배송량"
      icon={<Clock className="h-[18px] w-[18px] text-violet-500" />}
      delay={80}
      action={<PeriodDropdown value={period} options={ANALYZE_PERIODS} onChange={onPeriodChange} />}
    >
      <HourlyVolumeChart data={data} />
    </Panel>
  )
}
