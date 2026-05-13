import { useNavigate } from 'react-router-dom'
import { getUnitPath } from '../../lib/unitNavigation'

export function HeroSection() {
  const navigate = useNavigate()

  return (
    <section className="landing-hero">
      <div className="landing-hero-overlay" />
      <img className="landing-hero-image" src="/course-hero.png" alt="" />
      <div className="landing-hero-content fade-slide-in">
        <h1>برنامج التوعية التفاعلي: التعرف على أنواع المخاطر المهنية والاستجابة الآمنة</h1>
        <button
          type="button"
          className="hero-cta"
          onClick={() => navigate(getUnitPath('chemical'))}
          aria-label="ابدأ الدورة"
        >
          ابدأ الدورة
        </button>
      </div>
      <svg
        className="hero-wave"
        viewBox="0 0 1440 140"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,96 C210,150 420,20 690,46 C930,70 1170,140 1440,92 L1440,140 L0,140 Z"
          fill="#f3f5f9"
        />
      </svg>
    </section>
  )
}
