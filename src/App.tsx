import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import DemoLayout from './layouts/DemoLayout'
import DashboardPage from './pages/DashboardPage'
import OperatePage from './pages/OperatePage'
import AnalyzePage from './pages/AnalyzePage'
import PlaceholderPage from './pages/PlaceholderPage'
import LoginPage from './pages/LoginPage'

// [수정] 각각 개별 페이지 대신, 스크롤 기반 통합 환경인 SystemPage를 임포트합니다.
import SystemPage from "./pages/SystemPage"; 

import { useAuth } from './contexts/AuthContext'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth()
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <DemoLayout />,
    children: [
      { path: '/', element: <DashboardPage /> },
      
      // 운영 도메인: 한 페이지(OperatePage) 내에서 섹션 스크롤 연동
      { path: '/orders', element: <ProtectedRoute><OperatePage /></ProtectedRoute> },
      { path: '/delivery', element: <ProtectedRoute><OperatePage /></ProtectedRoute> },
      { path: '/routes', element: <ProtectedRoute><OperatePage /></ProtectedRoute> },
      
      // 분석 리포트
      { path: '/reports', element: <ProtectedRoute><AnalyzePage /></ProtectedRoute> },
      
      // [수정] 시스템 관리 도메인: /messages와 /settings 모두 SystemPage를 바라보게 합니다.
      // 이렇게 해야 스크롤 스파이가 URL을 바꿀 때나 사이드바를 클릭할 때 페이지가 새로고침되지 않고 
      // 하나의 내부 컨테이너 안에서 부드럽게 스크롤로 이동합니다.
      { path: '/messages', element: <ProtectedRoute><SystemPage /></ProtectedRoute> },
      { path: '/settings', element: <ProtectedRoute><SystemPage /></ProtectedRoute> },
      
      // 나머지 메뉴 슬롯
      { path: '/:section', element: <ProtectedRoute><PlaceholderPage /></ProtectedRoute> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}