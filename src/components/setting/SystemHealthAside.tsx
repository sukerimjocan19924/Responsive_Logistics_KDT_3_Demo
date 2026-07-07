import { type CSSProperties } from "react";
import { useInView } from "../../hooks/useInView";

const healthItems = [
  ["보안 정책", "정상", "100%"],
  ["알림 수신", "3개 채널 연결", "86%"],
  ["연동 상태", "마지막 동기화 2분 전", "92%"],
];

export default function SystemHealthAside() {
  const { ref: healthRef, inView: healthInView } = useInView<HTMLDivElement>();

  return (
    <aside className="rounded-[30px] border border-slate-200 bg-gradient-to-br from-sky-50 to-cyan-50 p-6 shadow-sm shadow-slate-200/70">
      <p className="text-xs font-black uppercase tracking-[0.24em] text-sky-600">System Health</p>
      <h2 className="mt-2 text-xl font-black text-slate-950">설정 점검 상태</h2>
      <div ref={healthRef} className="mt-6 space-y-4">
        {healthItems.map(([label, caption, width], index) => (
          <div key={label}>
            <div className="flex justify-between text-sm font-extrabold text-slate-700">
              <span>{label}</span>
              <span>{caption}</span>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/80">
              <div
                className={`grow-bar h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 ${
                  healthInView ? "is-visible" : ""
                }`}
                style={
                  {
                    "--bar-w": width,
                    "--reveal-delay": `${120 + index * 120}ms`,
                  } as CSSProperties
                }
              />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}