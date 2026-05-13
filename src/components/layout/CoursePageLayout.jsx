import { Outlet, useLocation } from 'react-router-dom'
import { CourseProgressProvider } from '../../context/CourseProgressContext'
import { CourseHeader } from './CourseHeader'

export function CoursePageLayout() {
  const location = useLocation()
  const isLanding = location.pathname === '/course'
  const isProgram = /\/program\//.test(location.pathname)

  return (
    <CourseProgressProvider>
      <div
        className={`course-page-layout ${isLanding ? 'course-page-layout--landing' : ''} ${isProgram ? 'course-page-layout--program' : ''}`.trim()}
      >
        {!isProgram ? <CourseHeader isLanding={isLanding} /> : null}
        <main className="course-page-layout__content">
          <Outlet />
        </main>
      </div>
    </CourseProgressProvider>
  )
}
