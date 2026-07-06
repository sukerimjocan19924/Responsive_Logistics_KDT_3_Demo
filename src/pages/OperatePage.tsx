import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import OrderManagementSection from '../components/operate/OrderManagementSection'
import DeliveryManagementSection from '../components/operate/DeliveryManagementSection'
import RouteOptimizationSection from '../components/operate/RouteOptimizationSection'

/** 사이드바 경로 → 이 페이지 안의 스크롤 대상 섹션 매핑 (스크롤-스파이에서는 반대 방향으로도 사용) */
const PATH_TO_SECTION: Record<string, string> = {
  '/orders': 'order-management',
  '/delivery': 'delivery-management',
  '/routes': 'route-optimization',
}

/** 스크롤 위치 → 경로. 문서 순서(주문 → 배송 → 경로)와 일치해야 스크롤-스파이가 올바르게 동작한다. */
const SECTION_ORDER: { id: string; path: string }[] = [
  { id: 'order-management', path: '/orders' },
  { id: 'delivery-management', path: '/delivery' },
  { id: 'route-optimization', path: '/routes' },
]

const SCROLL_OFFSET = 24
/** 스크롤-스파이 기준선: 컨테이너 상단에서 이만큼 내려온 지점을 지나야 "현재 보고 있는 섹션"으로 인정한다. */
const SPY_LINE_OFFSET = 96

/**
 * 운영 페이지: 주문 관리 · 배송 관리 · 경로 최적화 세 도메인을 한 화면에 구성한다.
 * 사이드바의 운영 메뉴(주문 관리 / 배송 관리 / 경로 최적화)는 각각 /orders, /delivery, /routes로
 * 이동하며, 이 페이지는 그 경로에 대응하는 섹션으로 자동 스크롤한다. 반대로 사용자가 페이지
 * 안에서 직접 스크롤하면, 지금 보고 있는 섹션에 맞춰 URL(및 사이드바 활성 표시)도 따라간다.
 *
 * DemoLayout은 라우트가 바뀔 때마다 window.scrollTo(top:0)으로 문서 스크롤을 초기화한다
 * (사이드바/레이아웃 쪽 코드라 건드리지 않는다). 그 리셋과 "여기서는 특정 섹션으로
 * 스크롤해야 한다"는 요구가 같은 window 스크롤을 두고 충돌하면, effect 실행 순서나
 * 브라우저 프레임 타이밍에 따라 계속 어긋나기 쉽다. 그래서 이 페이지의 스크롤은
 * window가 아니라, 이 페이지 자신이 소유한 내부 스크롤 컨테이너(아래 <div>)에서
 * 일어나게 만든다. 문서(window) 자체는 뷰포트 높이만큼만 차지해서 스크롤할 일이
 * 없어지므로, DemoLayout이 window를 리셋해도 실제로 보이는 화면에는 아무 영향이
 * 없고, 우리는 내부 컨테이너의 scrollTop만 우리 마음대로 다루면 된다.
 */
export default function OperatePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const scrollRef = useRef<HTMLDivElement>(null)
  const orderRef = useRef<HTMLElement>(null)
  const deliveryRef = useRef<HTMLElement>(null)
  const routeRef = useRef<HTMLElement>(null)
  // 스크롤-스파이가 URL만 바꾸고(replace) 다시 스크롤을 유발하지 않도록 표시해두는 플래그.
  const skipNextScrollRef = useRef(false)
  // 사이드바 클릭 등으로 인한 "프로그래밍적" 스크롤 애니메이션이 진행 중인 동안에는
  // 스크롤-스파이가 중간에 지나가는 섹션들 때문에 URL을 오락가락 되돌리지 않도록 막는다.
  const isProgrammaticScrollRef = useRef(false)
  // 스크롤-스파이가 "지금 활성 상태로 보고 있는 경로"를 즉시(동기적으로) 들고 있는 ref.
  // location.pathname(리액트 상태)은 navigate() 호출 후 커밋되기까지 한 프레임 이상
  // 지연될 수 있는데, 스크롤-스파이의 판정 조건(if (current.path !== ...))이 바로 그
  // location.pathname을 기준으로 삼으면, 빠르게 스크롤할 때 "판정 → navigate → 아직
  // 반영 안 된 location.pathname 기준 재판정"이 겹치면서 실제 위치보다 한 섹션 뒤처진
  // 값으로 사이드바가 표시되는 문제가 생긴다. ref는 우리가 원하는 시점에 즉시 갱신되므로
  // 이 지연이 없다.
  const activePathRef = useRef(location.pathname)

  const sectionRefs: Record<string, React.RefObject<HTMLElement>> = {
    'order-management': orderRef,
    'delivery-management': deliveryRef,
    'route-optimization': routeRef,
  }

  // 사이드바 클릭 등 외부 요인으로 경로가 바뀌었을 때도 activePathRef를 최신 상태로 맞춘다.
  useEffect(() => {
    activePathRef.current = location.pathname
  }, [location.pathname])

  // 사이드바 클릭(또는 다른 방식의 라우트 이동) → 해당 섹션으로 스크롤
  useEffect(() => {
    if (skipNextScrollRef.current) {
      // 이 라우트 변경은 아래 스크롤-스파이가 URL만 동기화하려고 만든 것이므로,
      // 이미 그 위치에 있는 상태다. 다시 스크롤을 실행하지 않는다.
      skipNextScrollRef.current = false
      return
    }

    const container = scrollRef.current
    const sectionId = PATH_TO_SECTION[location.pathname]
    const target = sectionId ? sectionRefs[sectionId]?.current : null
    if (!container || !target) return

    const targetRect = target.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()
    const targetY = Math.max(0, container.scrollTop + (targetRect.top - containerRect.top) - SCROLL_OFFSET)
    const reduceMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (Math.abs(container.scrollTop - targetY) < 1) return

    isProgrammaticScrollRef.current = true
    const clearFlag = () => {
      isProgrammaticScrollRef.current = false
    }
    // 'scrollend'가 지원되는 브라우저에서는 애니메이션이 끝나는 정확한 시점에 플래그를 내린다.
    if ('onscrollend' in container) {
      container.addEventListener('scrollend', clearFlag, { once: true })
    } else {
      // 구형 브라우저 폴백: 스무스 스크롤이 충분히 끝났을 시간 뒤에 내린다.
      setTimeout(clearFlag, 700)
    }

    container.scrollTo({ top: targetY, behavior: reduceMotion ? 'auto' : 'smooth' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  // 사용자가 페이지 안에서 직접 스크롤 → 지금 보고 있는 섹션에 맞춰 사이드바 활성 표시(URL)를 동기화
  //
  // 주의: 이 리스너는 [navigate]에만 의존하며(마운트 시 한 번만 등록) location.pathname에는
  // 의존하지 않는다. 예전에는 [location.pathname, navigate]에 의존해서, 스크롤 중 섹션이
  // 바뀔 때마다(= 이 effect 자신이 호출한 navigate 때문에) 리스너가 매번 해제→재등록됐다.
  // 그리고 판정 조건도 리액트 상태인 location.pathname을 기준으로 삼았는데, 이 상태는
  // navigate() 호출 후 커밋되기까지 지연될 수 있어서, 빠르게 스크롤하면 "판정 → navigate →
  // 아직 갱신 안 된 location.pathname으로 재판정"이 겹쳐 실제 위치보다 한 섹션 뒤처진 값이
  // 사이드바에 표시되는 문제가 있었다(사이드바 클릭 스크롤은 이 재구성 사이클과 무관해서
  // 항상 정상 동작했다). 리스너를 한 번만 등록하고, 판정 기준을 즉시 갱신되는
  // activePathRef로 바꿔서 이 지연을 없앤다.
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const sections = SECTION_ORDER.map((s) => ({ path: s.path, el: sectionRefs[s.id]?.current })).filter(
      (s): s is { path: string; el: HTMLElement } => !!s.el,
    )
    if (sections.length === 0) return

    let ticking = false

    const updateActivePath = () => {
      ticking = false
      // 클릭으로 시작된 스크롤 애니메이션이 아직 끝나지 않았다면, 지나가는 중간 섹션들 때문에
      // URL을 되돌리지 않도록 이번 스크롤 이벤트는 건너뛴다.
      if (isProgrammaticScrollRef.current) return

      const probeLine = container.getBoundingClientRect().top + SPY_LINE_OFFSET

      let current = sections[0]
      for (const s of sections) {
        if (s.el.getBoundingClientRect().top <= probeLine) current = s
      }

      if (current.path !== activePathRef.current) {
        // navigate()가 실제로 커밋되기 전에 다음 스크롤 이벤트가 들어와도 최신 값을
        // 보도록, 판정 기준값을 리액트 렌더링을 기다리지 않고 그 자리에서 바로 갱신한다.
        activePathRef.current = current.path
        skipNextScrollRef.current = true
        navigate(current.path, { replace: true, preventScrollReset: true })
      }
    }

    const handleScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(updateActivePath)
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate])

  return (
    <div ref={scrollRef} className="h-[calc(100vh-3.5rem)] overflow-y-auto lg:h-screen">
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* header */}
        <div className="mb-2">
          <h1 className="text-[30px] font-black tracking-tight text-slate-950">운영</h1>
          <p className="mt-1 text-[14px] font-medium text-slate-500">
            주문 접수부터 배송, 경로 최적화까지 운영 전 과정을 이 페이지에서 확인하고 관리하세요.
          </p>
        </div>

        <OrderManagementSection ref={orderRef} />
        <DeliveryManagementSection ref={deliveryRef} />
        <RouteOptimizationSection ref={routeRef} />
      </div>
    </div>
  )
}
