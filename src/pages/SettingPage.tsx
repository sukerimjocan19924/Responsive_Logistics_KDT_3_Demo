import { useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Settings, CheckCircle } from "../components/icons";
import SettingsCardList from "../components/setting/SettingsCardList";
import NotificationRules from "../components/setting/NotificationRules";
import SystemHealthAside from "../components/setting/SystemHealthAside";

export default function SettingsPage() {
  const [notificationRules, setNotificationRules] = useState([
    { label: "온도 이탈", channel: "앱 푸시 · SMS", enabled: true },
    { label: "배송 지연", channel: "앱 푸시", enabled: true },
    { label: "재고 부족", channel: "이메일 · 앱 푸시", enabled: true },
    { label: "야간 점검", channel: "이메일", enabled: false },
  ]);

  const toggleNotificationRule = (label: string) => {
    setNotificationRules((rules) =>
      rules.map((rule) =>
        rule.label === label ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {/* 설정 메인 섹션 */}
      <section className="mt-4 overflow-hidden rounded-[34px] border border-slate-200 bg-white shadow-sm shadow-slate-200/70">
        <div className="relative isolate bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 px-6 py-8 text-white sm:px-8 lg:px-10">
          <div className="absolute right-0 top-0 -z-10 h-56 w-56 rounded-full bg-sky-400/20 blur-3xl" />
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[12px] font-bold text-sky-100 ring-1 ring-white/15">
            <Settings className="h-3.5 w-3.5" />
            System Settings
          </span>
          <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-[30px] font-black tracking-tight sm:text-4xl">시스템 설정</h1>
              <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-300">
                콜드체인 물류 운영에 필요한 온도 기준, 알림 채널, 보안 정책을 한 화면에서 점검하고 조정하는 관리자 설정 페이지입니다.
              </p>
            </div>
            <button type="button" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 text-sm font-extrabold text-white shadow-lg shadow-sky-900/25 transition-colors hover:bg-sky-400">
              <CheckCircle className="h-4 w-4" />
              변경사항 저장
            </button>
          </div>
        </div>

        {/* 핵심 설정 카드 리스트 */}
        <SettingsCardList />
      </section>

      {/* 하단 상세 설정 및 헬스 체크 */}
      <section className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <NotificationRules 
          rules={notificationRules} 
          onToggle={toggleNotificationRule} 
        />
        <SystemHealthAside />
      </section>
    </div>
  );
}