import { Snowflake, Lock, RefreshCw, CheckCircle } from "../../components/icons";

type StatTone = "sky" | "violet" | "cyan" | "amber" | "emerald";

const toneClass: Record<StatTone, { box: string; text: string }> = {
  sky: { box: "bg-sky-50 ring-sky-100", text: "text-sky-600" },
  violet: { box: "bg-violet-50 ring-violet-100", text: "text-violet-600" },
  cyan: { box: "bg-cyan-50 ring-cyan-100", text: "text-cyan-600" },
  amber: { box: "bg-amber-50 ring-amber-100", text: "text-amber-600" },
  emerald: { box: "bg-emerald-50 ring-emerald-100", text: "text-emerald-600" },
};

const settingsCards = [
  {
    title: "콜드체인 운영 기준",
    desc: "배송·창고 공통 온도 정책과 이탈 알림 기준을 설정합니다.",
    icon: Snowflake,
    tone: "sky",
    rows: ["냉장 0~5℃", "냉동 -23~-18℃", "이탈 5분 지속 시 알림"],
  },
  {
    title: "권한 및 보안",
    desc: "관리자 승인, 세션 만료, 2단계 인증 정책을 관리합니다.",
    icon: Lock,
    tone: "violet",
    rows: ["관리자 승인 사용", "세션 30분 유지", "중요 작업 2FA 필요"],
  },
  {
    title: "데이터 동기화",
    desc: "WMS·TMS 연동 주기와 실패 재시도 방식을 제어합니다.",
    icon: RefreshCw,
    tone: "emerald",
    rows: ["실시간 주문 동기화", "GPS 30초 주기", "실패 시 3회 재시도"],
  },
];

export default function SettingsCardList() {
  return (
    <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-3 lg:p-8">
      {settingsCards.map(({ title, desc, icon: Icon, tone, rows }) => {
        const colors = toneClass[tone as StatTone];
        return (
          <article key={title} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ${colors.box} ${colors.text}`}>
              <Icon className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-black text-slate-950">{title}</h2>
            <p className="mt-2 min-h-12 text-sm font-medium leading-6 text-slate-500">{desc}</p>
            <div className="mt-5 space-y-2">
              {rows.map((row) => (
                <div key={row} className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-600 ring-1 ring-slate-200">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  {row}
                </div>
              ))}
            </div>
          </article>
        );
      })}
    </div>
  );
}