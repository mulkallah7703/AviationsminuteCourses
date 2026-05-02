import { Outlet, useLocation } from 'react-router-dom'
import { CourseProgressProvider } from '../../context/CourseProgressContext'
import { CourseHeader } from './CourseHeader'

export function CoursePageLayout() {
  const location = useLocation()
  const isLanding = location.pathname === '/course'

  return (
    <CourseProgressProvider>
      <div className={`course-page-layout ${isLanding ? 'course-page-layout--landing' : ''}`.trim()}>
        <CourseHeader isLanding={isLanding} />
        <main className="course-page-layout__content">
          <Outlet />
        </main>
      </div>
    </CourseProgressProvider>
  )
}
