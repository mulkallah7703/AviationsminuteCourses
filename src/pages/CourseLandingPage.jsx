import { CourseCards } from '../components/landing/CourseCards'
import { CourseList } from '../components/landing/CourseList'
import { HeroSection } from '../components/landing/HeroSection'

export function CourseLandingPage() {
  return (
    <div className="course-landing-page">
      <HeroSection />
      <CourseCards />
      <CourseList />
    </div>
  )
}
