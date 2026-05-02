import { memo } from 'react'
import { useCourseProgressOptional } from '../../context/CourseProgressContext'
import { formatPercentForDisplay } from '../../lib/courseProgressModel'

export const SidebarNavigation = memo(function SidebarNavigation({
  units,
  activeUnitKey,
  onSelectUnit,
  progressPercent: progressProp = 0,
  courseHeading,
}) {
  const ctx = useCourseProgressOptional()
  const progressPercent = ctx?.percent ?? progressProp
  const milestone = ctx?.milestone ?? ''
  const toast = ctx?.toast ?? ''

  return (
    <aside className="learning-sidebar">
      <div className="learning-sidebar-top">
        <h2>{courseHeading}</h2>
        <p className="learning-sidebar-percent">{`${formatPercentForDisplay(progressPercent)}% COMPLETE`}</p>
        {milestone ? <p className="learning-sidebar-milestone">{milestone}</p> : null}
        <div className="learning-sidebar-progress-track">
          <div
            className="learning-sidebar-progress-fill"
            style={{ width: `${Math.min(100, Number(progressPercent) || 0)}%` }}
          />
        </div>
        {toast ? (
          <div className="learning-sidebar-toast" role="status">
            {toast}
          </div>
        ) : null}
      </div>

      <nav className="learning-sidebar-list" aria-label="وحدات الدورة">
        {units.map((unit) => {
          const isActive = unit.key === activeUnitKey
          return (
            <button
              key={unit.key}
              type="button"
              className={`learning-unit-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelectUnit(unit.key)}
            >
              <span className="learning-unit-icon">{unit.icon}</span>
              <span className="learning-unit-title">{unit.shortTitle}</span>
              <span className={`learning-unit-indicator ${isActive ? 'active' : ''}`} />
            </button>
          )
        })}
      </nav>
    </aside>
  )
})
