export function CourseHeader({ isLanding = false }) {
  return (
    <header className={`course-header header ${isLanding ? 'course-header--landing' : ''}`.trim()} aria-label="Course header">
      <img src="/logo.svg" alt="NCMS Logo" className="main-logo course-header__logo" />
    </header>
  )
}
