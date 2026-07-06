import { useState } from 'react'
import { RefreshCw } from '../components/icons'
import { ANALYZE_PERIODS, type AnalyzePeriod } from '../data/analyze'
import KpiSection from '../components/analyze/KpiSection'
import DeliveryTrendCard from '../components/analyze/DeliveryTrendCard'
import OrderAnalysisCard from '../components/analyze/OrderAnalysisCard'
import RegionTop5Card from '../components/analyze/RegionTop5Card'
import HourlyVolumeCard from '../components/analyze/HourlyVolumeCard'
import StatusDonutCard from '../components/analyze/StatusDonutCard'
import AiInsightCard from '../components/analyze/AiInsightCard'

/**
 * 분석 리포트 페이지: 주문 · 배송 · 창고 데이터를 분석하여 물류 효율을 확인하는 화면.
 * 기간(period)은 이 페이지 하나에서만 관리하는 단일 상태다 — 상단 탭(오늘/이번 주/이번 달)과
 * 각 패널 우측의 드롭다운이 모두 이 값을 읽고 바꾸므로, 어느 컨트롤을 조작해도 KPI·차트·
 * AI 인사이트가 함께 같은 기간 데이터로 갱신된다.
 */
export default function AnalyzePage() {
  const [period, setPeriod] = useState<AnalyzePeriod>('오늘')
  const [refreshing, setRefreshing] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const changePeriod = (p: AnalyzePeriod) => {
    setPeriod(p)
    setRefreshKey((k) => k + 1)
  }

  const handleRefresh = () => {
    setRefreshing(true)
    setRefreshKey((k) => k + 1)
    setTimeout(() => setRefreshing(false), 600)
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {/* header */}
      <div className="mb-8 flex flex-col gap-4 border-b border-slate-200/60 pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-[36px] font-black tracking-tight text-slate-900">
            <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">분석</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[12px] font-bold tracking-[0.2em] text-slate-500 uppercase">
              Analytics
            </span>
          </h1>
          <p className="mt-2 text-[15px] font-medium text-slate-500">
            주문, 배송, 창고 데이터를 분석하여 물류 효율을 확인하세요.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1">
            {ANALYZE_PERIODS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => changePeriod(p)}
                className={`rounded-lg px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
                  period === p ? 'bg-violet-500 text-white shadow-sm shadow-violet-500/25' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            aria-label="데이터 새로고침"
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:border-violet-300 hover:text-violet-600"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* content — refreshKey로 리마운트해 등장 애니메이션을 재생 */}
      <div key={refreshKey} className="flex flex-col gap-5">
        <KpiSection period={period} />

        <DeliveryTrendCard period={period} onPeriodChange={changePeriod} />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <OrderAnalysisCard period={period} onPeriodChange={changePeriod} />
          <RegionTop5Card period={period} onPeriodChange={changePeriod} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <HourlyVolumeCard period={period} onPeriodChange={changePeriod} />
          <StatusDonutCard period={period} />
        </div>

        <AiInsightCard period={period} />
      </div>
    </div>
  )
}
