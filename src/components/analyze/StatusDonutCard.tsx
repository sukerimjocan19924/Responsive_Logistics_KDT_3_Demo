import { PieChart } from '../icons'
import { ANALYTICS_BY_PERIOD, type AnalyzePeriod } from '../../data/analyze'
import { Panel } from './shared'

const SIZE = 176
const STROKE = 26
const R = (SIZE - STROKE) / 2
const CIRC = 2 * Math.PI * R

function StatusDonutChart({ total, slices }: { total: number; slices: { label: string; ratio: number; color: string }[] }) {
  let offset = 0
  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-44 w-44" role="img" aria-label="배송 상태 분석">
      <g transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}>
        {slices.map((s) => {
          const len = (s.ratio / 100) * CIRC
          const dasharray = `${len} ${CIRC - len}`
          const el = (
            <circle
              key={s.label}
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={R}
              fill="none"
              stroke={s.color}
              strokeWidth={STROKE}
              strokeDasharray={dasharray}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          )
          offset += len
          return el
        })}
      </g>
      <text x={SIZE / 2} y={SIZE / 2 - 8} textAnchor="middle" fontSize="11" fill="#94a3b8">
        전체
      </text>
      <text x={SIZE / 2} y={SIZE / 2 + 14} textAnchor="middle" fontSize="19" fontWeight="800" fill="#0f172a">
        {total.toLocaleString()}건
      </text>
    </svg>
  )
}

export default function StatusDonutCard({ period }: { period: AnalyzePeriod }) {
  const { donutTotal, donut } = ANALYTICS_BY_PERIOD[period]

  return (
    <Panel title="배송 상태 분석" icon={<PieChart className="h-[18px] w-[18px] text-sky-500" />} delay={160}>
      <div className="flex flex-1 flex-wrap items-center justify-center gap-6">
        <StatusDonutChart total={donutTotal} slices={donut} />
        <ul className="flex flex-col gap-2.5">
          {donut.map((s) => (
            <li key={s.label} className="flex items-center gap-2.5 text-[13px]">
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${s.dot}`} />
              <span className="w-12 shrink-0 text-slate-500">{s.label}</span>
              <b className="tabular-nums font-bold text-slate-800">{s.ratio.toFixed(1)}%</b>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  )
}
