import type { ReactNode } from 'react'
import Reveal from '../Reveal'
import { TrendingDown, TrendingUp } from '../icons'
import type { Tint } from '../../data/operate'

export const TINT: Record<Tint, string> = {
  sky: 'bg-sky-50 text-sky-600',
  indigo: 'bg-indigo-50 text-indigo-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  teal: 'bg-teal-50 text-teal-600',
  amber: 'bg-amber-50 text-amber-600',
  violet: 'bg-violet-50 text-violet-600',
  rose: 'bg-rose-50 text-rose-500',
  cyan: 'bg-cyan-50 text-cyan-600',
}

export const VALUE_TINT: Record<Tint, string> = {
  sky: 'text-sky-600',
  indigo: 'text-indigo-600',
  emerald: 'text-emerald-600',
  teal: 'text-teal-600',
  amber: 'text-amber-500',
  violet: 'text-violet-600',
  rose: 'text-rose-500',
  cyan: 'text-cyan-600',
}

/** 섹션 상단 타이틀 + 설명 */
export function PageSectionHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <div>
      <h2 className="text-[22px] font-extrabold tracking-tight text-slate-900 sm:text-[24px]">{title}</h2>
      <p className="mt-1 text-[13px] text-slate-500">{desc}</p>
    </div>
  )
}

/** 값 + 단위 + 아이콘 배지로 구성된 KPI 타일 */
export function KpiTile({
  icon,
  label,
  value,
  unit,
  tint,
  delay = 0,
}: {
  icon: ReactNode
  label: string
  value: string
  unit?: string
  tint: Tint
  delay?: number
}) {
  return (
    <Reveal
      delay={delay}
      className="rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-slate-900/5 sm:p-5"
    >
      <div className="flex items-center gap-2.5">
        <span className={`grid h-9 w-9 place-items-center rounded-xl ${TINT[tint]}`}>{icon}</span>
        <span className="text-[12.5px] font-medium text-slate-500">{label}</span>
      </div>
      <div className="mt-2.5 flex items-baseline gap-1">
        <b className={`text-[24px] font-extrabold tabular-nums tracking-tight text-slate-900`}>{value}</b>
        {unit && <span className="text-[12px] font-medium text-slate-400">{unit}</span>}
      </div>
    </Reveal>
  )
}

/** 전일 대비 증감을 보여주는 작은 통계 카드 */
export function DiffStatCard({ label, value, diff, up, delay = 0 }: { label: string; value: string; diff: string; up: boolean; delay?: number }) {
  return (
    <Reveal
      delay={delay}
      className="rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-slate-900/5 sm:p-5"
    >
      <span className="text-[12.5px] font-medium text-slate-500">{label}</span>
      <div className="mt-2 flex items-baseline gap-2">
        <b className="text-[22px] font-extrabold tabular-nums tracking-tight text-slate-900">{value}</b>
      </div>
      <span
        className={`mt-2 inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-bold ${
          up ? 'bg-emerald-50 text-emerald-600' : 'bg-sky-50 text-sky-600'
        }`}
      >
        {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        전일 대비 {diff}
      </span>
    </Reveal>
  )
}

/** 카드 컨테이너 (제목 + 우측 부가 컨트롤 슬롯) */
export function Panel({
  title,
  icon,
  action,
  delay = 0,
  className = '',
  children,
}: {
  title: string
  icon?: ReactNode
  action?: ReactNode
  delay?: number
  className?: string
  children: ReactNode
}) {
  return (
    <Reveal delay={delay} className={`flex flex-col rounded-2xl border border-slate-200 bg-white p-5 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-[15px] font-bold text-slate-900">{title}</h3>
        </div>
        {action}
      </div>
      <div className="mt-4 flex flex-1 flex-col">{children}</div>
    </Reveal>
  )
}

export function IconButton({ children, onClick, active = false }: { children: ReactNode; onClick?: () => void; active?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-[13px] font-semibold transition-colors ${
        active
          ? 'border-sky-500 bg-sky-50 text-sky-600'
          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      {children}
    </button>
  )
}
