import { Outlet, useLocation } from 'react-router-dom'
import { CourseHeader } from './CourseHeader'

export function CoursePageLayout() {
  const location = useLocation()
  const isLanding = location.pathname === '/course'

  return (
    <div className={`course-page-layout ${isLanding ? 'course-page-layout--landing' : ''}`.trim()}>
      <CourseHeader isLanding={isLanding} />
      <main className="course-page-layout__content">
        <Outlet />
      </main>
    </div>
  )
}
