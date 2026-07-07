import { useEffect, useMemo, useState, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ChevronRight, Bell } from "../components/icons";

// 기존에 정의된 독립적인 페이지 컴포넌트 임포트
import SettingPage from "./SettingPage"; 
import MessagePage from "./MessagePage";

/** 사이드바 경로 → 내부 스크롤 대상 섹션 매핑 */
const PATH_TO_SECTION: Record<string, string> = {
  "/settings": "settings-section",
  "/messages": "messages-section",
};

/** 문서 순서에 맞춘 섹션 리스트 설정 (스크롤-스파이 기준) */
const SECTION_ORDER = [
  { id: "settings-section", path: "/settings" },
  { id: "messages-section", path: "/messages" },
];

const SCROLL_OFFSET = 24;
const SPY_LINE_OFFSET = 120; // 상단 구분선 및 뱃지 높이를 고려한 기준선 피드백

export default function SystemPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 스크롤 및 DOM 조작을 위한 Ref 선언
  const scrollRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLElement>(null);
  const messagesRef = useRef<HTMLElement>(null);

  const skipNextScrollRef = useRef(false);
  const isProgrammaticScrollRef = useRef(false);
  const activePathRef = useRef(location.pathname);

  const sectionRefs: Record<string, React.RefObject<HTMLElement>> = {
    "settings-section": settingsRef,
    "messages-section": messagesRef,
  };

  // 외부 및 사이드바 클릭으로 라우트 변경 시 activePathRef 동기화
  useEffect(() => {
    activePathRef.current = location.pathname;
  }, [location.pathname]);

  // 1. URL 경로 변경 감지 → 해당 섹션 위치로 스마트 내부 스크롤
  useEffect(() => {
    if (skipNextScrollRef.current) {
      skipNextScrollRef.current = false;
      return;
    }

    const container = scrollRef.current;
    const sectionId = PATH_TO_SECTION[location.pathname];
    const target = sectionId ? sectionRefs[sectionId]?.current : null;
    if (!container || !target) return;

    const targetRect = target.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    // 첫 번째 섹션(설정)이면 top을 0으로 밀어 완전히 밀착, 그 외는 오프셋 반영
    const isFirstSection = location.pathname === SECTION_ORDER[0].path;
    const targetY = isFirstSection 
      ? 0 
      : Math.max(0, container.scrollTop + (targetRect.top - containerRect.top) - SCROLL_OFFSET);

    if (Math.abs(container.scrollTop - targetY) < 1) return;

    isProgrammaticScrollRef.current = true;
    const clearFlag = () => {
      isProgrammaticScrollRef.current = false;
    };

    if ("onscrollend" in container) {
      container.addEventListener("scrollend", clearFlag, { once: true });
    } else {
      setTimeout(clearFlag, 700);
    }

    container.scrollTo({ top: targetY, behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // 2. 내부 직접 스크롤 감지 → 위치 분석 후 URL 및 사이드바 메뉴 활성화 동기화 (Scroll-Spy)
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const sections = SECTION_ORDER.map((s) => ({ path: s.path, el: sectionRefs[s.id]?.current })).filter(
      (s): s is { path: string; el: HTMLElement } => !!s.el
    );
    if (sections.length === 0) return;

    let ticking = false;

    const updateActivePath = () => {
      ticking = false;
      if (isProgrammaticScrollRef.current) return;

      const probeLine = container.getBoundingClientRect().top + SPY_LINE_OFFSET;

      let current = sections[0];
      for (const s of sections) {
        if (s.el.getBoundingClientRect().top <= probeLine) {
          current = s;
        }
      }

      if (current.path !== activePathRef.current) {
        activePathRef.current = current.path;
        skipNextScrollRef.current = true;
        navigate(current.path, { replace: true, preventScrollReset: true });
      }
    };

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateActivePath);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  return (
    // 내부 스크롤 격리를 위한 컨테이너 뷰포트 높이 설정
    <div ref={scrollRef} className="h-[calc(100vh-3.5rem)] overflow-y-auto bg-slate-50 lg:h-screen pb-16">
      
      {/* 상단 공통 브레드크럼 존 */}
      <div className="mx-auto max-w-[1400px] px-4 pt-6 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-[12px] text-slate-400">
          <Link to="/" className="transition-colors hover:text-sky-600">대시보드</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-slate-600">통합 관리 환경</span>
        </div>
      </div>

      {/* SECTION 1: 알림 및 메시지 내역 */}
      <section ref={messagesRef} id="messages-section">
        <MessagePage />
      </section>

      {/* MIDDLE SEPARATOR: 두 도메인을 이어주는 스크롤 유도 구분선 */}
      <div className="mx-auto max-w-[1400px] my-10 px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center py-5">
          <div className="flex-grow border-t border-slate-300/60"></div>
          <span className="mx-4 flex flex-shrink items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black tracking-widest text-slate-500 uppercase shadow-sm">
            <Bell className="h-3.5 w-3.5 text-slate-400 animate-pulse" />
            Scroll Down to System Messages
          </span>
          <div className="flex-grow border-t border-slate-300/60"></div>
        </div>
      </div>

      {/* SECTION 2: 시스템 설정 */}
      <section ref={settingsRef} id="settings-section">
        <SettingPage />
      </section>

    </div>
  );
}