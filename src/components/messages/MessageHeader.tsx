import { Search, CheckCheck, Filter } from 'lucide-react'
import { SEVERITY_FILTER_OPTIONS } from '../../data/messages'

interface MessageHeaderProps {
  query: string
  onQueryChange: (value: string) => void
  mounted: boolean
  onMarkAllRead: () => void
  filterOpen: boolean
  onToggleFilter: () => void
  severityFilter: Set<string>
  onToggleSeverity: (key: string) => void
  onClearSeverity: () => void
}

export default function MessageHeader({
  query,
  onQueryChange,
  mounted,
  onMarkAllRead,
  filterOpen,
  onToggleFilter,
  severityFilter,
  onToggleSeverity,
  onClearSeverity,
}: MessageHeaderProps) {
  return (
    <div
      className={`mb-8 border-b border-slate-200/60 pb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between transition-all duration-500 ${
        mounted ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
      }`}
    >
      {/* 1. 왼쪽 영역 */}
      <div className="shrink-0">
        <h1 className="flex items-center gap-3 text-[32px] font-black tracking-tight text-slate-900 sm:text-[36px]">
          <span className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
            알림
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[12px] font-bold tracking-[0.2em] text-slate-500 uppercase">
            Notifications
          </span>
        </h1>
        <p className="mt-2 text-[15px] font-medium text-slate-500">
          실시간 WMS 시스템 알림을 확인하고 신속하게 예외 상황을 관리하세요.
        </p>
      </div>

      {/* 2. 오른쪽 영역 */}
      <div className="flex flex-wrap items-center gap-2 lg:justify-end w-full lg:w-auto lg:self-end">
        
        {/* 검색 인풋 창 */}
        <div className="relative w-full sm:w-52 md:w-60">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="알림 검색..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-white/70 pl-9 pr-3 text-sm text-slate-700 outline-none backdrop-blur transition-colors placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
          />
        </div>

        {/* 모두 읽음 버튼 */}
        <button
          onClick={onMarkAllRead}
          className="flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-white/80 px-3.5 text-sm font-semibold text-slate-600 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-sky-200 hover:text-sky-600 hover:shadow-md"
        >
          <CheckCheck className="h-4 w-4" /> 모두 읽음
        </button>

        {/* 필터 설정 및 드롭다운 */}
        <div className="relative">
          <button
            onClick={onToggleFilter}
            className={`flex h-10 items-center gap-1.5 rounded-xl border px-3.5 text-sm font-semibold backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-md ${
              filterOpen
                ? 'border-sky-300 bg-sky-50 text-sky-600'
                : 'border-slate-200 bg-white/80 text-slate-600 hover:border-sky-200 hover:text-sky-600'
            }`}
          >
            <Filter className="h-4 w-4" /> 필터
          </button>

          {filterOpen && (
            <div
              /* 🛠️ 완벽한 모바일 대응 정렬 클래스로 수정 */
              className="absolute z-50 mt-2 w-56 rounded-2xl border border-slate-100 bg-white p-3 shadow-xl shadow-slate-900/10 [animation:pop_0.15s_ease-out]
                /* 📱 모바일: 버튼 왼쪽 정렬 기준 고정 (오른쪽으로 펼쳐져서 왼쪽 잘림 방지) */
                left-0 right-auto origin-top-left
                /* 🖥️ 데스크톱(lg 이상): 버튼 우측 정렬 기준으로 복귀 */
                lg:left-auto lg:right-0 lg:origin-top-right"
              style={{
                animationName: 'pop',
                animationKeyframes:
                  '@keyframes pop { from { opacity: 0; transform: scale(0.95) translateY(-4px); } to { opacity: 1; transform: scale(1) translateY(0); } }',
              } as any}
            >
              <p className="mb-2 px-1 text-xs font-bold uppercase tracking-wide text-slate-400">
                심각도
              </p>

              <div className="flex flex-col gap-0.5">
                {SEVERITY_FILTER_OPTIONS.map((s) => (
                  <label
                    key={s.key}
                    className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
                  >
                    <input
                      type="checkbox"
                      checked={severityFilter.has(s.key)}
                      onChange={() => onToggleSeverity(s.key)}
                      className="h-3.5 w-3.5 accent-sky-500"
                    />
                    <span className={`h-2 w-2 rounded-full bg-${s.tone}-500`} />
                    {s.label}
                  </label>
                ))}
              </div>

              {severityFilter.size > 0 && (
                <button
                  onClick={onClearSeverity}
                  className="mt-1 w-full rounded-lg py-1.5 text-center text-xs font-semibold text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                >
                  초기화
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}