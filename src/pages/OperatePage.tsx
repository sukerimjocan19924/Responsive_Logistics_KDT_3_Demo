import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import OrderManagementSection from '../components/operate/OrderManagementSection'
import DeliveryManagementSection from '../components/operate/DeliveryManagementSection'
import RouteOptimizationSection from '../components/operate/RouteOptimizationSection'

/** 사이드바 경로 → 이 페이지 안의 스크롤 대상 섹션 매핑 */
const PATH_TO_SECTION: Record<string, string> = {
  '/orders': 'order-management',
  '/delivery': 'delivery-management',
  '/routes': 'route-optimization',
}

/**
 * 운영 페이지: 주문 관리 · 배송 관리 · 경로 최적화 세 도메인을 한 화면에 구성한다.
 * 사이드바의 운영 메뉴(주문 관리 / 배송 관리 / 경로 최적화)는 각각 /orders, /delivery, /routes로
 * 이동하며, 이 페이지는 그 경로에 대응하는 섹션으로 자동 스크롤한다.
 */
export default function OperatePage() {
  const location = useLocation()
  const orderRef = useRef<HTMLElement>(null)
  const deliveryRef = useRef<HTMLElement>(null)
  const routeRef = useRef<HTMLElement>(null)

  const sectionRefs: Record<string, React.RefObject<HTMLElement>> = {
    'order-management': orderRef,
    'delivery-management': deliveryRef,
    'route-optimization': routeRef,
  }

  useEffect(() => {
    const sectionId = PATH_TO_SECTION[location.pathname]
    const target = sectionId ? sectionRefs[sectionId]?.current : null
    if (!target) return

    // DemoLayout이 라우트 변경 시 window.scrollTo(top)을 먼저 실행하므로,
    // 그 다음 프레임에 목표 섹션으로 스크롤해 덮어써지지 않도록 한다.
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    })
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {/* header */}
      <div className="mb-2">
        <h1 className="text-[24px] font-extrabold tracking-tight text-slate-900">운영</h1>
        <p className="mt-1 text-[13px] text-slate-500">
          주문 접수부터 배송, 경로 최적화까지 운영 전 과정을 이 페이지에서 확인하고 관리하세요.
        </p>
      </div>

      <OrderManagementSection ref={orderRef} />
      <DeliveryManagementSection ref={deliveryRef} />
      <RouteOptimizationSection ref={routeRef} />
    </div>
  )
}
