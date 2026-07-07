interface Rule {
  label: string;
  channel: string;
  enabled: boolean;
}

interface NotificationRulesProps {
  rules: Rule[];
  onToggle: (label: string) => void;
}

function ToggleButton({ enabled, onClick }: { enabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={enabled}
      onClick={onClick}
      className={`inline-flex h-9 min-w-20 items-center justify-center rounded-full px-3 text-xs font-extrabold transition-colors ${
        enabled
          ? "bg-sky-500 text-white shadow-sm shadow-sky-500/25 hover:bg-sky-600"
          : "bg-slate-100 text-slate-500 ring-1 ring-slate-200 hover:bg-slate-200"
      }`}
    >
      {enabled ? "ON" : "OFF"}
    </button>
  );
}

export default function NotificationRules({ rules, onToggle }: NotificationRulesProps) {
  return (
    <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-sky-500">Notification Rules</p>
          <h2 className="mt-2 text-xl font-black text-slate-950">알림 정책</h2>
        </div>
        <button type="button" className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-extrabold text-slate-700 hover:bg-slate-50">
          새 규칙 추가
        </button>
      </div>
      <div className="mt-5 divide-y divide-slate-200 overflow-hidden rounded-3xl border border-slate-200">
        {rules.map((rule) => (
          <div key={rule.label} className="flex items-center justify-between gap-4 bg-white px-5 py-4">
            <div>
              <p className="font-extrabold text-slate-950">{rule.label}</p>
              <p className="mt-1 text-sm font-medium text-slate-500">{rule.channel}</p>
            </div>
            <ToggleButton enabled={rule.enabled} onClick={() => onToggle(rule.label)} />
          </div>
        ))}
      </div>
    </div>
  );
}