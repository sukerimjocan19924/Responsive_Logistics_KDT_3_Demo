import { forwardRef, useMemo, useState } from 'react'
import Reveal from '../Reveal'
import { Search, SlidersHorizontal, Eye, MapPin, Truck, ChevronDown, ExternalLink } from '../icons'
import {
  DELIVERY_KPIS,
  DELIVERIES,
  DELIVERY_STATUS_STYLE,
  DELIVERY_MAP_LEGEND,
  DELIVERY_STATS,
  type DeliveryStatus,
} from '../../data/operate'
import { KpiTile, Panel, PageSectionHeader, DiffStatCard } from './shared'

const KPI_ICON_TINT = ['sky', 'indigo', 'emerald', 'rose', 'amber'] as const
const STATUS_FILTERS: (DeliveryStatus | '전체 상태')[] = ['전체 상태', '배송 중', '지연 배송', '배송 완료']

/** 실시간 배송 현황 — 데모용 정적 지도 배경(핀 마커) */
function DeliveryMapPreview() {
  const pins = [
    { x: 32, y: 28, cls: 'bg-sky-500' },
    { x: 58, y: 44, cls: 'bg-sky-500' },
    { x: 44, y: 62, cls: 'bg-emerald-500' },
    { x: 74, y: 30, cls: 'bg-emerald-500' },
    { x: 66, y: 70, cls: 'bg-rose-500' },
    { x: 22, y: 58, cls: 'bg-sky-500' },
  ]
  return (
    <div className="relative h-52 w-full overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full opacity-40" preserveAspectRatio="none">
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 12.5} y1="0" x2={i * 12.5} y2="100" stroke="#cbd5e1" strokeWidth="0.4" />
        ))}
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 12.5} x2="100" y2={i * 12.5} stroke="#cbd5e1" strokeWidth="0.4" />
        ))}
      </svg>
      {pins.map((p, i) => (
        <span
          key={i}
          className={`absolute grid h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white shadow ${p.cls}`}
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
        >
          <span className="h-full w-full animate-pulse rounded-full" />
        </span>
      ))}
    </div>
  )
}

function RealTimeDeliveryCard() {
  return (
    <Panel title="실시간 배송 현황" delay={0}>
      <DeliveryMapPreview />
      <ul className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
        {DELIVERY_MAP_LEGEND.map((l) => (
          <li key={l.label} className="flex items-center gap-1.5 text-[12.5px]">
            <span className={`h-2.5 w-2.5 rounded-full ${l.dot}`} />
            <span className="text-slate-500">{l.label}</span>
            <b className="tabular-nums font-bold text-slate-800">{l.count.toLocaleString()}건</b>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2.5 text-[13px] font-semibold text-slate-600 transition-colors hover:border-sky-300 hover:text-sky-600"
      >
        <ExternalLink className="h-3.5 w-3.5" />
        전체 지도 보기
      </button>
    </Panel>
  )
}

function DeliveryListCard() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<(typeof STATUS_FILTERS)[number]>('전체 상태')

  const rows = useMemo(() => {
    return DELIVERIES.filter((d) => {
      const matchesStatus = status === '전체 상태' || d.status === status
      const q = query.trim()
      const matchesQuery = q === '' || d.id.includes(q) || d.driver.includes(q)
      return matchesStatus && matchesQuery
    })
  }, [status, query])

  return (
    <Panel
      title="배송 현황 목록"
      delay={80}
      className="lg:col-span-2"
      action={
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as (typeof STATUS_FILTERS)[number])}
              className="appearance-none rounded-lg border border-slate-200 bg-white py-1.5 pl-3 pr-7 text-[12.5px] font-semibold text-slate-600 outline-none transition-colors focus:border-sky-400"
            >
              {STATUS_FILTERS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="운송장 번호, 기사명 검색"
              className="w-48 rounded-lg border border-slate-200 bg-white py-1.5 pl-7 pr-2 text-[12.5px] text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-sky-400"
            />
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[12.5px] font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            필터
          </button>
        </div>
      }
    >
      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 py-16 text-center">
          <Truck className="h-8 w-8 text-slate-300" />
          <p className="text-[13px] text-slate-400">조건에 맞는 배송 건이 없습니다.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[12px] font-semibold text-slate-400">
                <th className="whitespace-nowrap px-3 py-2.5">운송장 번호</th>
                <th className="whitespace-nowrap px-3 py-2.5">기사명</th>
                <th className="whitespace-nowrap px-3 py-2.5">배송지</th>
                <th className="whitespace-nowrap px-3 py-2.5">상태</th>
                <th className="whitespace-nowrap px-3 py-2.5">예상 도착</th>
                <th className="whitespace-nowrap px-3 py-2.5">위치</th>
                <th className="whitespace-nowrap px-3 py-2.5 text-right">작업</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((d) => (
                <tr key={d.id} className="border-b border-slate-50 text-[13px] text-slate-600 transition-colors hover:bg-slate-50/70">
                  <td className="whitespace-nowrap px-3 py-3 font-semibold text-slate-800">{d.id}</td>
                  <td className="whitespace-nowrap px-3 py-3">{d.driver}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-slate-500">{d.address}</td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11.5px] font-bold ${DELIVERY_STATUS_STYLE[d.status]}`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-slate-500">{d.eta}</td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[12px] font-semibold text-slate-500 transition-colors hover:bg-slate-100"
                    >
                      <MapPin className="h-3.5 w-3.5" />
                      위치 보기
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-right">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[12px] font-semibold text-sky-600 transition-colors hover:bg-sky-50"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      상세 보기
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  )
}

const DeliveryManagementSection = forwardRef<HTMLElement>((_props, ref) => {
  return (
    <section ref={ref} id="delivery-management" className="mt-10 scroll-mt-20 lg:mt-14 lg:scroll-mt-8">
      <Reveal>
        <PageSectionHeader title="배송 관리" desc="배송 현황을 실시간으로 모니터링하고 관리할 수 있습니다." />
      </Reveal>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
        {DELIVERY_KPIS.map((k, i) => (
          <KpiTile
            key={k.key}
            icon={<Truck className="h-[18px] w-[18px]" />}
            label={k.label}
            value={k.value.toLocaleString()}
            unit={k.unit}
            tint={KPI_ICON_TINT[i]}
            delay={i * 60}
          />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <RealTimeDeliveryCard />
        <DeliveryListCard />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {DELIVERY_STATS.map((s, i) => (
          <DiffStatCard key={s.label} label={s.label} value={s.value} diff={s.diff} up={s.up} delay={i * 60} />
        ))}
      </div>
    </section>
  )
})

DeliveryManagementSection.displayName = 'DeliveryManagementSection'
export default DeliveryManagementSection
